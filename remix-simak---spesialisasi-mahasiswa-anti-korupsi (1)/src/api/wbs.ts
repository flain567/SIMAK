/**
 * wbs.ts — API adapter untuk Whistleblower System
 * Mode offline: isi laporan dienkripsi AES-256-GCM (lihat utils/wbsCrypto.ts)
 * sebelum disimpan; hanya pemegang kode lacak yang dapat membuka isinya.
 */

import { WhistleblowerReport } from '../types';
import { apiFetch, IS_BACKEND_ENABLED } from './client';
import {
  generateTrackingCode,
  encryptWbsPayload,
  decryptWbsPayload,
} from '../utils/wbsCrypto';

// ─── Helpers localStorage ────────────────────────────────────

function loadLocalReports(): WhistleblowerReport[] {
  try {
    const raw = localStorage.getItem('simak_wbs_reports_v1');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalReports(list: WhistleblowerReport[]): void {
  try {
    localStorage.setItem('simak_wbs_reports_v1', JSON.stringify(list));
  } catch { /* ignore */ }
}

// ─── Types ───────────────────────────────────────────────────

export interface SubmitReportPayload {
  category: WhistleblowerReport['category'];
  unitReported: string;
  incidentDate: string;
  summary: string;
  evidenceUrl?: string;
  isAnonymous: boolean;
  reporterIdentity?: string;
}

export interface TrackResult {
  trackingCode: string;
  category: string;
  unitReported: string;
  incidentDate: string;
  isAnonymous: boolean;
  reporterIdentity: string;
  status: string;
  progressStep: number;
  resolutionNote: string;
  submittedAt: string;
}

function formatSubmittedAt(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── API Functions ────────────────────────────────────────────

/**
 * Submit laporan WBS baru.
 * Backend → POST /api/wbs/reports (enkripsi di server)
 * Offline → enkripsi AES-256-GCM di klien, simpan ciphertext saja.
 * Mengembalikan record tersimpan (terenkripsi) + kode lacak untuk pelapor.
 */
export async function submitWbsReport(
  payload: SubmitReportPayload
): Promise<{ trackingCode: string; report: WhistleblowerReport }> {
  if (IS_BACKEND_ENABLED) {
    const { trackingCode } = await apiFetch<{ trackingCode: string }>('/api/wbs/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const report: WhistleblowerReport = {
      id: trackingCode,
      trackingCode,
      category: payload.category,
      unitReported: payload.unitReported,
      incidentDate: payload.incidentDate,
      summary: '(enkripsi server)',
      isAnonymous: payload.isAnonymous,
      reporterIdentity: payload.isAnonymous
        ? 'Anonim Penuh (Terenkripsi)'
        : 'Pelapor Terverifikasi (Dirahasiakan Dewan Etik)',
      submittedAt: formatSubmittedAt(),
      status: 'Verifikasi Bukti',
      progressStep: 2,
      resolutionNote:
        'Laporan diterima. Menunggu verifikasi oleh Dewan Etik SIMAK.',
    };
    return { trackingCode, report };
  }

  // Offline: kode lacak 48-bit dari CSPRNG, isi laporan dienkripsi sebelum disimpan
  const trackingCode = generateTrackingCode();
  const { encryptedPayload, cryptoSalt } = await encryptWbsPayload(trackingCode, {
    summary: payload.summary,
    evidenceUrl: payload.evidenceUrl,
    reporterIdentity: payload.isAnonymous ? undefined : payload.reporterIdentity,
  });

  const newReport: WhistleblowerReport = {
    id: `local-wbs-${Date.now()}`,
    trackingCode,
    category: payload.category,
    unitReported: payload.unitReported,
    incidentDate: payload.incidentDate,
    summary: '',
    isAnonymous: payload.isAnonymous,
    reporterIdentity: payload.isAnonymous
      ? 'Anonim Terenkripsi (AES-256-GCM)'
      : 'Pelapor Terverifikasi (Dirahasiakan Dewan Etik)',
    encryptedPayload,
    cryptoSalt,
    submittedAt: formatSubmittedAt(),
    status: 'Verifikasi Bukti',
    progressStep: 2,
    resolutionNote:
      'Laporan diterima. Menunggu verifikasi oleh Dewan Etik SIMAK.',
  };

  saveLocalReports([newReport, ...loadLocalReports()]);
  return { trackingCode, report: newReport };
}

/**
 * Lacak status laporan berdasarkan kode PERSIS.
 * Laporan terenkripsi hanya terbuka bila kode lacak benar (kunci dekripsi
 * diturunkan dari kode); kode salah → tidak ditemukan.
 */
export async function trackWbsReport(
  code: string
): Promise<WhistleblowerReport | null> {
  if (IS_BACKEND_ENABLED) {
    try {
      const data = await apiFetch<TrackResult>(`/api/wbs/reports/${encodeURIComponent(code)}`);
      return {
        id: data.trackingCode,
        trackingCode: data.trackingCode,
        category: data.category as WhistleblowerReport['category'],
        unitReported: data.unitReported,
        incidentDate: data.incidentDate,
        summary: '(enkripsi server)',
        isAnonymous: data.isAnonymous,
        reporterIdentity: data.reporterIdentity,
        submittedAt: data.submittedAt,
        status: data.status as WhistleblowerReport['status'],
        progressStep: data.progressStep as 1 | 2 | 3 | 4,
        resolutionNote: data.resolutionNote,
      };
    } catch {
      return null;
    }
  }

  const found = loadLocalReports().find((r) => r.trackingCode === code);
  if (!found) return null;

  if (found.encryptedPayload && found.cryptoSalt) {
    const secret = await decryptWbsPayload(code, found.encryptedPayload, found.cryptoSalt);
    if (!secret) return null;
    return {
      ...found,
      summary: secret.summary,
      evidenceUrl: secret.evidenceUrl,
      reporterIdentity: secret.reporterIdentity || found.reporterIdentity,
    };
  }
  return found;
}

/**
 * Load semua laporan tersimpan (record terenkripsi tetap terenkripsi).
 */
export function getAllReportsLocal(): WhistleblowerReport[] {
  return loadLocalReports();
}

/**
 * Update status tindak lanjut oleh Satgas/admin (mode offline).
 * Isi terenkripsi tidak disentuh; hanya metadata status yang berubah.
 */
export function updateLocalWbsReport(
  id: string,
  patch: Partial<Pick<WhistleblowerReport, 'status' | 'progressStep' | 'resolutionNote'>>
): WhistleblowerReport | null {
  const all = loadLocalReports();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  saveLocalReports(all);
  return all[idx];
}