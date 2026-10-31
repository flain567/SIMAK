/**
 * participants.ts — API adapter untuk pendaftaran & pencarian peserta HARLAH
 *
 * Pola:
 * - Jika VITE_API_URL terset → kirim ke backend
 * - Jika tidak → fallback ke logika localStorage (PERSIS sama seperti sebelumnya)
 *   sehingga app tetap jalan tanpa backend.
 */

import { ParticipantRecord } from '../types';
import { apiFetch, IS_BACKEND_ENABLED } from './client';

// ─── Helpers localStorage (fallback) ────────────────────────

function loadLocalParticipants(): ParticipantRecord[] {
  try {
    const raw = localStorage.getItem('simak_participants_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalParticipants(list: ParticipantRecord[]): void {
  try {
    localStorage.setItem('simak_participants_v1', JSON.stringify(list));
  } catch { /* ignore quota */ }
}

// ─── Types ──────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  nim: string;
  whatsapp: string;
  email: string;
  programStudi?: string;
  campus?: string;
  semester?: string;
  division?: string;
  guestCategory: string;
  session?: string;
  registrationType?: string;
  motivation?: string;
  agreement: boolean;
}

export interface RegisterResult {
  participant: ParticipantRecord;
  qrPayload?: string;
}

export interface LookupResult {
  results: ParticipantRecord[];
}

// ─── API Functions ───────────────────────────────────────────

/**
 * Daftarkan peserta HARLAH baru.
 * Backend → POST /api/participants
 * Fallback → localStorage (identik dengan logika lama App.tsx)
 */
export async function registerParticipant(
  payload: RegisterPayload
): Promise<RegisterResult> {
  if (IS_BACKEND_ENABLED) {
    const data = await apiFetch<ParticipantRecord & { qrPayload?: string }>(
      '/api/participants',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    const { qrPayload, ...participant } = data;
    return { participant, qrPayload };
  }

  // ── Fallback: localStorage ──
  const existing = loadLocalParticipants();

  // Cek duplikasi NIM
  if (existing.some(p => p.nim === payload.nim.trim())) {
    throw new Error('NIM sudah terdaftar. Setiap mahasiswa hanya boleh mendaftar satu kali.');
  }

  // Generate kode client-side (hanya untuk mode offline)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ticketCode = `GUEST-HRL-${suffix}`;
  const examNumber = `KPS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const seatNumber = `TAMU-${String(existing.length + 1).padStart(2, '0')}`;

  const newRecord: ParticipantRecord = {
    id: `local-${Date.now()}`,
    ticketCode,
    examNumber,
    seatNumber,
    gate: 'Pintu Utama',
    examRoom: 'Aula Utama',
    examSession: 'Sesi 1',
    examDate: '29 Januari 2027',
    fullName: payload.fullName.trim(),
    nim: payload.nim.trim(),
    whatsapp: payload.whatsapp,
    email: payload.email.trim(),
    programStudi: payload.programStudi || 'Tidak Disebutkan',
    campus: payload.campus || 'Kampus Utama STIAMI',
    semester: payload.semester || 'Tamu Undangan',
    division: payload.division || '-',
    registrationType:
      payload.registrationType === 'Kader KOPASUS'
        ? 'Kader KOPASUS'
        : 'Open House SIMAK',
    motivation: payload.motivation || '',
    avatarUrl: '',
    registeredAt: new Date().toISOString(),
    status: 'MENUNGGU VERIFIKASI',
  };

  const updated = [newRecord, ...existing];
  saveLocalParticipants(updated);
  return { participant: newRecord };
}

/**
 * Cari peserta berdasarkan nama/NIM/kode tiket.
 * Backend → GET /api/participants/lookup?q=...
 * Fallback → filter localStorage
 */
export async function lookupParticipants(q: string): Promise<LookupResult> {
  if (IS_BACKEND_ENABLED) {
    return apiFetch<LookupResult>(`/api/participants/lookup?q=${encodeURIComponent(q)}`);
  }

  const all = loadLocalParticipants();
  const lower = q.toLowerCase();
  const results = all.filter(
    p =>
      p.fullName.toLowerCase().includes(lower) ||
      p.nim.includes(q) ||
      p.ticketCode.toUpperCase().includes(q.toUpperCase())
  );
  return { results };
}

/**
 * Ambil data tiket berdasarkan kode.
 * Backend → GET /api/participants/ticket/:code
 * Fallback → localStorage
 */
export async function getTicketByCode(
  code: string
): Promise<ParticipantRecord | null> {
  if (IS_BACKEND_ENABLED) {
    try {
      return await apiFetch<ParticipantRecord>(
        `/api/participants/ticket/${encodeURIComponent(code)}`
      );
    } catch {
      return null;
    }
  }

  const all = loadLocalParticipants();
  return all.find(p => p.ticketCode === code) || null;
}

/**
 * Load semua peserta (untuk Directory screen).
 * Backend → tidak ada endpoint publik listing penuh, gunakan localStorage.
 * Ini memang by design — listing penuh hanya untuk admin.
 */
export function getAllParticipantsLocal(): ParticipantRecord[] {
  return loadLocalParticipants();
}

/**
 * Muat daftar peserta untuk inisialisasi App.
 * Backend → GET /api/participants (admin-only, hanya jika token tersedia)
 * Fallback → localStorage
 */
export async function fetchParticipants(): Promise<ParticipantRecord[]> {
  if (IS_BACKEND_ENABLED) {
    const token = localStorage.getItem('simak_admin_token');
    if (token) {
      try {
        const data = await apiFetch<{ participants: ParticipantRecord[] }>(
          '/api/admin/participants',
          { token }
        );
        return data.participants;
      } catch {
        // fallback ke localStorage jika tidak ada akses admin
      }
    }
  }
  return loadLocalParticipants();
}
