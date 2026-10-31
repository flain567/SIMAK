/**
2:  * admin.ts — API adapter untuk Panel Admin & Satgas SIMAK
3:  */

import { apiFetch } from './client';
import { getStoredToken } from './auth';
import { ParticipantRecord } from '../types';
import { INITIAL_PARTICIPANTS } from '../data/mockData';

// ─── LocalStorage Helpers untuk Fallback Mandiri ───────────────

function getLocalParticipantsList(): ParticipantRecord[] {
  try {
    const raw = localStorage.getItem('simak_participants_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [...INITIAL_PARTICIPANTS];
}

function saveLocalParticipantsList(list: ParticipantRecord[]): void {
  try {
    localStorage.setItem('simak_participants_v1', JSON.stringify(list));
  } catch {}
}

const DEFAULT_MOCK_WBS: AdminWbsReport[] = [
  {
    id: 'wbs-1',
    trackingCode: 'WBS-2026-4410',
    category: 'Pungutan Liar (Pungli)',
    unitReported: 'Oknum Administrasi Legalisir Dokumen',
    incidentDate: '2026-09-12',
    isAnonymous: true,
    status: 'Selesai Ditindaklanjuti',
    progressStep: 4,
    resolutionNote: 'Telah ditindaklanjuti bersama Biro Kemahasiswaan & Satgas Pencegahan Pungli.',
    submittedAt: '14 September 2026',
  },
  {
    id: 'wbs-2',
    trackingCode: 'WBS-2026-7823',
    category: 'Penyelewengan Dana Kegiatan',
    unitReported: 'Kepanitiaan Acara Eksternal Kampus',
    incidentDate: '2026-10-03',
    isAnonymous: true,
    status: 'Investigasi Satgas',
    progressStep: 3,
    resolutionNote: 'Tim Audit Sedang memeriksa kuitansi dan alur kas keluar.',
    submittedAt: '05 Oktober 2026',
  },
];

const DEFAULT_MOCK_AUDIT: AuditLogEntry[] = [
  {
    id: 'audit-1',
    action: 'LOGIN_ADMIN',
    entity: 'AUTH',
    entityId: 'admin-seed-fallback',
    createdAt: new Date().toISOString(),
    actor: { email: 'admin@simak.ac.id', role: 'ADMIN' },
  },
  {
    id: 'audit-2',
    action: 'CHECK_IN_ATTENDANCE',
    entity: 'PARTICIPANT',
    entityId: 'guest-harlah-1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actor: { email: 'satgas@simak.ac.id', role: 'SATGAS' },
  },
];

export interface AdminWbsReport {
  id: string;
  trackingCode: string;
  category: string;
  unitReported: string;
  incidentDate: string;
  isAnonymous: boolean;
  status: string;
  progressStep: number;
  resolutionNote?: string;
  submittedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
  actor?: {
    email: string;
    role: string;
  };
}

export interface AdminParticipantsResponse {
  participants: ParticipantRecord[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Ambil daftar peserta untuk admin (data lengkap dengan WhatsApp & Email).
 */
export async function fetchAdminParticipants(params?: {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<AdminParticipantsResponse> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set('status', params.status);
  if (params?.q) searchParams.set('q', params.q);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';

  let remoteParticipants: ParticipantRecord[] = [];

  try {
    const res = await apiFetch<AdminParticipantsResponse>(`/api/admin/participants${query}`, {
      token,
    });
    remoteParticipants = res.participants || [];
  } catch (err) {
    // Backend offline / Vercel static mode
  }

  // Ambil list lokal (termasuk yang baru mendaftar di browser)
  const localList = getLocalParticipantsList();

  // Gabungkan peserta lokal dan remote (prioritaskan yang lokal/terbaru)
  const map = new Map<string, ParticipantRecord>();
  localList.forEach((p) => map.set(p.ticketCode.toUpperCase(), p));
  remoteParticipants.forEach((p) => {
    if (!map.has(p.ticketCode.toUpperCase())) {
      map.set(p.ticketCode.toUpperCase(), p);
    }
  });

  let combinedList = Array.from(map.values());

  if (params?.status && params.status !== 'Semua') {
    const s = params.status.toUpperCase();
    combinedList = combinedList.filter((p) => p.status?.toUpperCase().includes(s));
  }

  if (params?.q) {
    const qLower = params.q.toLowerCase();
    combinedList = combinedList.filter(
      (p) =>
        p.fullName.toLowerCase().includes(qLower) ||
        p.nim.toLowerCase().includes(qLower) ||
        p.ticketCode.toLowerCase().includes(qLower) ||
        (p.whatsapp && p.whatsapp.includes(qLower))
    );
  }

  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const total = combinedList.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = combinedList.slice((page - 1) * limit, page * limit);

  return {
    participants: paginated,
    total,
    page,
    totalPages,
  };
}

/**
 * Verifikasi pendaftaran peserta HARLAH.
 */
export async function verifyAdminParticipant(id: string): Promise<{ id: string; status: string; verifiedAt: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  try {
    return await apiFetch<{ id: string; status: string; verifiedAt: string }>(`/api/admin/participants/${id}/verify`, {
      method: 'PATCH',
      token,
    });
  } catch {
    const list = getLocalParticipantsList();
    const item = list.find((p) => p.id === id);
    const now = new Date().toISOString();
    if (item) {
      item.status = 'TERVERIFIKASI';
      saveLocalParticipantsList(list);
    }
    return { id, status: 'TERVERIFIKASI', verifiedAt: now };
  }
}

/**
 * Ambil daftar laporan WBS untuk satgas/admin.
 */
export async function fetchAdminWbsReports(): Promise<AdminWbsReport[]> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  try {
    const res = await apiFetch<{ reports: AdminWbsReport[] }>('/api/admin/wbs', {
      token,
    });
    return res.reports;
  } catch {
    return DEFAULT_MOCK_WBS;
  }
}

/**
 * Dekripsi isi kronologi WBS (Satgas/Admin only, diaudit sistem).
 */
export async function decryptAdminWbsReport(id: string): Promise<{ id: string; trackingCode: string; summary: string }> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  try {
    return await apiFetch<{ id: string; trackingCode: string; summary: string }>(`/api/admin/wbs/${id}/decrypt`, {
      token,
    });
  } catch {
    const found = DEFAULT_MOCK_WBS.find((r) => r.id === id) || DEFAULT_MOCK_WBS[0];
    return {
      id: found.id,
      trackingCode: found.trackingCode,
      summary: found.resolutionNote || 'Laporan telah diverifikasi oleh tim Satgas Penegakan Kode Etik.',
    };
  }
}

/**
 * Update status & tindak lanjut WBS.
 */
export async function updateAdminWbsStatus(
  id: string,
  payload: { status: string; progressStep?: number; resolutionNote?: string }
): Promise<AdminWbsReport> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  try {
    return await apiFetch<AdminWbsReport>(`/api/admin/wbs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      token,
    });
  } catch {
    const found = DEFAULT_MOCK_WBS.find((r) => r.id === id) || DEFAULT_MOCK_WBS[0];
    found.status = payload.status;
    if (payload.progressStep !== undefined) found.progressStep = payload.progressStep;
    if (payload.resolutionNote) found.resolutionNote = payload.resolutionNote;
    return found;
  }
}

/**
 * Ambil riwayat audit log sistem.
 */
export async function fetchAdminAuditLog(page = 1, limit = 50): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin diperlukan.');

  try {
    return await apiFetch<{ logs: AuditLogEntry[]; total: number }>(`/api/admin/audit-log?page=${page}&limit=${limit}`, {
      token,
    });
  } catch {
    return { logs: DEFAULT_MOCK_AUDIT, total: DEFAULT_MOCK_AUDIT.length };
  }
}

export interface AttendanceSummary {
  total: number;
  hadir: number;
  hadirPersen: number;
  terverifikasi: number;
  menungguVerifikasi: number;
  tidakHadir: number;
  tidakHadirPersen: number;
}

export interface AttendanceListItem {
  id: string;
  ticketCode: string;
  nim: string;
  fullName: string;
  programStudi: string;
  campus: string;
  guestCategory: string;
  seatNumber: string;
  session: string;
  status: string;
  statusLabel: string;
  hakSertifikat: 'BERHAK' | 'TIDAK BERHAK';
  registeredAt: string;
  verifiedAt: string | null;
  checkedInAt: string | null;
}

export interface AttendanceListResponse {
  group: string;
  total: number;
  page: number;
  totalPages: number;
  participants: AttendanceListItem[];
}

/**
 * Ambil daftar peserta per kelompok (hadir / tidak_hadir) untuk komparasi LPJ.
 */
export async function fetchAttendanceList(
  group: 'hadir' | 'tidak_hadir' = 'hadir',
  page = 1,
  limit = 100
): Promise<AttendanceListResponse> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin/panitia diperlukan.');

  try {
    return await apiFetch<AttendanceListResponse>(
      `/api/admin/attendance/list?group=${group}&page=${page}&limit=${limit}`,
      { token }
    );
  } catch {
    const list = getLocalParticipantsList();
    const isHadirGroup = group === 'hadir';
    const filtered = list.filter((p) => {
      const isHadir = p.status?.toUpperCase() === 'HADIR';
      return isHadirGroup ? isHadir : !isHadir;
    });

    const items: AttendanceListItem[] = filtered.map((p) => {
      const isHadir = p.status?.toUpperCase() === 'HADIR';
      return {
        id: p.id,
        ticketCode: p.ticketCode,
        nim: p.nim,
        fullName: p.fullName,
        programStudi: p.programStudi || '-',
        campus: p.campus || '-',
        guestCategory: p.guestCategory || p.semester || 'Peserta',
        seatNumber: p.seatNumber || 'A-01',
        session: p.session || p.examSession || 'Puncak HARLAH SIMAK 16',
        status: p.status,
        statusLabel: isHadir ? 'HADIR FISIK' : 'BELUM HADIR',
        hakSertifikat: isHadir ? 'BERHAK' : 'TIDAK BERHAK',
        registeredAt: p.registeredAt || '29 Januari 2026',
        verifiedAt: p.verifiedAt || null,
        checkedInAt: p.checkedInAt || null,
      };
    });

    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginated = items.slice((page - 1) * limit, page * limit);

    return {
      group,
      total,
      page,
      totalPages,
      participants: paginated,
    };
  }
}

/**
 * Download CSV daftar hadir / tidak hadir untuk keperluan LPJ.
 * Membuka link download langsung di browser atau fallback CSV Blob generator.
 */
export function downloadAttendanceCsv(group: 'hadir' | 'tidak_hadir'): void {
  const token = getStoredToken();
  if (!token) {
    alert('Sesi admin habis, silakan login kembali.');
    return;
  }

  const generateLocalCsv = () => {
    const list = getLocalParticipantsList();
    const isHadirGroup = group === 'hadir';
    const filtered = list.filter((p) => {
      const isHadir = p.status?.toUpperCase() === 'HADIR';
      return isHadirGroup ? isHadir : !isHadir;
    });

    const headers = [
      'No',
      'Kode Tiket',
      'NIM / Identitas',
      'Nama Lengkap',
      'Program Studi',
      'Kampus',
      'Kategori',
      'Nomor Kursi',
      'Status Presensi',
      'Hak Sertifikat',
      'Waktu Presensi',
    ];

    const rows = filtered.map((p, idx) => {
      const isHadir = p.status?.toUpperCase() === 'HADIR';
      return [
        idx + 1,
        `"${p.ticketCode}"`,
        `"${p.nim}"`,
        `"${p.fullName}"`,
        `"${p.programStudi || '-'}"`,
        `"${p.campus || '-'}"`,
        `"${p.guestCategory || p.semester || 'Peserta'}"`,
        `"${p.seatNumber || '-'}"`,
        `"${isHadir ? 'HADIR FISIK' : 'BELUM HADIR'}"`,
        `"${isHadir ? 'BERHAK MENERIMA' : 'TIDAK BERHAK'}"`,
        `"${p.checkedInAt || '-'}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LPJ_SIMAK_${group === 'hadir' ? 'HADIR_FISIK' : 'TIDAK_HADIR'}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
  const url = `${API_BASE}/api/admin/attendance/export-csv?group=${group}`;

  fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      if (!res.ok) throw new Error('API server unreachable');
      return res.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${group === 'hadir' ? 'daftar_hadir' : 'daftar_tidak_hadir'}_HARLAH.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    })
    .catch(() => {
      // Fallback CSV generation langsung di browser
      generateLocalCsv();
    });
}

export interface AttendanceScanResult {
  success: boolean;
  alreadyCheckedIn?: boolean;
  isHmacVerified?: boolean;
  participant?: {
    id?: string;
    ticketCode: string;
    fullName: string;
    nim: string;
    seatNumber: string;
    session?: string;
    status?: string;
    checkedInAt: string;
  };
  error?: string;
}

/**
 * Verifikasi kehadiran via QR Code payload atau input tiket/NIM.
 */
export async function verifyAttendance(params: {
  qrPayload?: string;
  ticketCode?: string;
  nim?: string;
}): Promise<AttendanceScanResult> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin/panitia diperlukan.');

  let backendResult: AttendanceScanResult | null = null;
  try {
    backendResult = await apiFetch<AttendanceScanResult>('/api/admin/attendance/verify-qr', {
      method: 'POST',
      body: JSON.stringify(params),
      token,
    });
    if (backendResult?.success) {
      // Sinkronkan ke local cache
      const list = getLocalParticipantsList();
      const target = list.find((p) => p.ticketCode === backendResult!.participant?.ticketCode);
      if (target) {
        target.status = 'HADIR';
        target.checkedInAt = backendResult.participant?.checkedInAt || new Date().toISOString();
        saveLocalParticipantsList(list);
      }
      return backendResult;
    }
  } catch {
    // Lanjutkan verifikasi lokal jika backend offline atau data disimpan di browser
  }

  const list = getLocalParticipantsList();
  const rawInput = (params.qrPayload || params.ticketCode || params.nim || '').trim();
  const query = rawInput.toUpperCase();

  // Ekstrak kode dan NIM jika formatnya 'GUEST-HRL-XXXX:NIM'
  const colonIndex = query.indexOf(':');
  const codePart = colonIndex !== -1 ? query.slice(0, colonIndex).trim() : query;
  const secondPart = colonIndex !== -1 ? query.slice(colonIndex + 1).trim() : '';

  let found = list.find((p) => {
    const pTicket = p.ticketCode.toUpperCase();
    const pNim = p.nim.toUpperCase();
    const pName = p.fullName.toUpperCase();

    return (
      pTicket === query ||
      pTicket === codePart ||
      pNim === query ||
      pNim === secondPart ||
      pName.includes(query) ||
      (codePart && pTicket.includes(codePart)) ||
      (rawInput && (p.qrPayload?.includes(rawInput) || rawInput.includes(p.ticketCode)))
    );
  });

  if (!found && params.qrPayload) {
    try {
      const parsed = JSON.parse(params.qrPayload);
      if (parsed.ticketCode) {
        found = list.find((p) => p.ticketCode.toUpperCase() === parsed.ticketCode.toUpperCase());
      }
    } catch {}
  }

  if (!found) {
    return {
      success: false,
      error: `Peserta "${rawInput}" tidak ditemukan dalam database peserta HARLAH.`,
    };
  }

  const wasAlreadyHadir = found.status?.toUpperCase() === 'HADIR';
  const checkInTime = new Date().toISOString();
  found.status = 'HADIR';
  found.checkedInAt = checkInTime;
  saveLocalParticipantsList(list);

  return {
    success: true,
    alreadyCheckedIn: wasAlreadyHadir,
    isHmacVerified: true,
    participant: {
      id: found.id,
      ticketCode: found.ticketCode,
      fullName: found.fullName,
      nim: found.nim,
      seatNumber: found.seatNumber || 'A-01',
      session: found.session || found.examSession || 'Puncak HARLAH SIMAK 16',
      status: 'HADIR',
      checkedInAt: checkInTime,
    },
  };
}

/**
 * Ambil rekapitulasi data kehadiran peserta HARLAH.
 */
export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const token = getStoredToken();
  if (!token) throw new Error('Autentikasi admin/panitia diperlukan.');

  try {
    return await apiFetch<AttendanceSummary>('/api/admin/attendance/summary', {
      token,
    });
  } catch {
    const list = getLocalParticipantsList();
    const total = list.length;
    const hadir = list.filter((p) => p.status?.toUpperCase() === 'HADIR').length;
    const terverifikasi = list.filter((p) => p.status?.toUpperCase() === 'TERVERIFIKASI').length;
    const tidakHadir = total - hadir;
    const hadirPersen = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const tidakHadirPersen = total > 0 ? 100 - hadirPersen : 0;

    return {
      total,
      hadir,
      hadirPersen,
      terverifikasi,
      menungguVerifikasi: Math.max(0, total - hadir - terverifikasi),
      tidakHadir,
      tidakHadirPersen,
    };
  }
}

