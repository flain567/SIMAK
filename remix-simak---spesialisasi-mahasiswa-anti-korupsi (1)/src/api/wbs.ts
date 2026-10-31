/**
 * wbs.ts — API adapter untuk Whistleblower System
 */

import { WhistleblowerReport } from '../types';
import { apiFetch, IS_BACKEND_ENABLED } from './client';

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

// ─── API Functions ────────────────────────────────────────────

/**
 * Submit laporan WBS baru.
 * Backend → POST /api/wbs/reports
 * Fallback → localStorage
 */
export async function submitWbsReport(
  payload: SubmitReportPayload
): Promise<{ trackingCode: string }> {
  if (IS_BACKEND_ENABLED) {
    return apiFetch<{ trackingCode: string }>('/api/wbs/reports', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Fallback localStorage
  const existing = loadLocalReports();
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  const trackingCode = `WBS-${year}-${num}`;

  const newReport: WhistleblowerReport = {
    id: `local-wbs-${Date.now()}`,
    trackingCode,
    category: payload.category,
    unitReported: payload.unitReported,
    incidentDate: payload.incidentDate,
    summary: payload.summary,
    evidenceUrl: payload.evidenceUrl,
    isAnonymous: payload.isAnonymous,
    reporterIdentity: payload.isAnonymous
      ? 'Anonim Terenkripsi (SHA-256)'
      : payload.reporterIdentity || 'Pelapor Terverifikasi (Dirahasiakan Dewan Etik)',
    submittedAt: new Date().toLocaleString('id-ID'),
    status: 'Verifikasi Bukti',
    progressStep: 2,
    resolutionNote:
      'Laporan diterima. Menunggu verifikasi oleh Dewan Etik SIMAK.',
  };

  saveLocalReports([newReport, ...existing]);
  return { trackingCode };
}

/**
 * Lacak status laporan berdasarkan kode PERSIS.
 * Backend → GET /api/wbs/reports/:code
 * Fallback → localStorage (kode persis)
 */
export async function trackWbsReport(
  code: string
): Promise<WhistleblowerReport | null> {
  if (IS_BACKEND_ENABLED) {
    try {
      const data = await apiFetch<TrackResult>(`/api/wbs/reports/${encodeURIComponent(code)}`);
      // Map ke tipe WhistleblowerReport untuk kompatibilitas
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

  // Fallback localStorage — PERSIS, bukan fuzzy
  const all = loadLocalReports();
  return all.find(r => r.trackingCode === code) || null;
}

/**
 * Load semua laporan (untuk WhistleblowerScreen initial state)
 */
export function getAllReportsLocal(): WhistleblowerReport[] {
  return loadLocalReports();
}
