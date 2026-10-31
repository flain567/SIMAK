/**
 * transparency.ts — API adapter untuk Transparansi Keuangan (Ledger)
 */

import { apiFetch, IS_BACKEND_ENABLED } from './client';

// ─── Types ────────────────────────────────────────────────────

export interface LedgerEntry {
  id: string;
  voucherCode: string;
  date: string;
  program: string;
  category: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  amount: number;
  auditorStatus: 'Diverifikasi' | 'Menunggu_Audit';
}

export interface LedgerSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  auditedCount: number;
  pendingCount: number;
}

export interface LedgerData {
  entries: LedgerEntry[];
  summary: LedgerSummary;
}

// ─── Fallback data statis ─────────────────────────────────────

const STATIC_LEDGER: LedgerData = {
  entries: [
    { id: '1', voucherCode: 'PKT-HRL-001', date: '2026-10-01', program: 'HARLAH SIMAK', category: 'Dana Iuran Kader', type: 'PEMASUKAN', amount: 15000000, auditorStatus: 'Diverifikasi' },
    { id: '2', voucherCode: 'PKT-HRL-002', date: '2026-10-05', program: 'HARLAH SIMAK', category: 'Sponsorship UMKM Kampus', type: 'PEMASUKAN', amount: 8500000, auditorStatus: 'Diverifikasi' },
    { id: '3', voucherCode: 'PKT-HRL-003', date: '2026-10-10', program: 'HARLAH SIMAK', category: 'Sewa Aula & Dekorasi', type: 'PENGELUARAN', amount: 7200000, auditorStatus: 'Diverifikasi' },
    { id: '4', voucherCode: 'PKT-HRL-004', date: '2026-10-15', program: 'HARLAH SIMAK', category: 'Konsumsi & Katering', type: 'PENGELUARAN', amount: 5400000, auditorStatus: 'Menunggu_Audit' },
    { id: '5', voucherCode: 'PKT-HRL-005', date: '2026-10-20', program: 'HARLAH SIMAK', category: 'Percetakan & Merchandise', type: 'PENGELUARAN', amount: 3100000, auditorStatus: 'Menunggu_Audit' },
  ],
  summary: {
    totalIncome: 23500000,
    totalExpense: 15700000,
    balance: 7800000,
    auditedCount: 3,
    pendingCount: 2,
  },
};

// ─── API Functions ─────────────────────────────────────────────

/**
 * Ambil data buku besar keuangan publik.
 * Backend → GET /api/ledger
 * Fallback → data statis
 */
export async function getLedgerData(): Promise<LedgerData> {
  if (IS_BACKEND_ENABLED) {
    return apiFetch<LedgerData>('/api/ledger');
  }
  return STATIC_LEDGER;
}
