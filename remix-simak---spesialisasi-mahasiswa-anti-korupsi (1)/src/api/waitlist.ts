/**
 * waitlist.ts — API adapter untuk antrean KOPASUS
 */

import { apiFetch, IS_BACKEND_ENABLED } from './client';

// ─── Types ────────────────────────────────────────────────────

export interface WaitlistPayload {
  fullName: string;
  nim: string;
  programStudi: string;
  semester: string;
  whatsapp: string;
  email: string;
  preferredDivision: string;
  reason: string;
}

export interface WaitlistResult {
  id: string;
  queueCode: string;
  position: number;
  fullName: string;
  nim: string;
  preferredDivision: string;
}

// ─── Helpers localStorage ─────────────────────────────────────

interface LocalWaitlist {
  id: string;
  queueCode: string;
  nim: string;
}

function loadLocalWaitlist(): LocalWaitlist[] {
  try {
    const raw = localStorage.getItem('simak_kopasus_waitlist_v1');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocalWaitlist(list: LocalWaitlist[]): void {
  try {
    localStorage.setItem('simak_kopasus_waitlist_v1', JSON.stringify(list));
  } catch { /* ignore */ }
}

// ─── API Functions ─────────────────────────────────────────────

/**
 * Daftarkan ke antrean KOPASUS.
 * Backend → POST /api/waitlist
 * Fallback → localStorage
 */
export async function submitWaitlistEntry(payload: WaitlistPayload): Promise<WaitlistResult> {
  if (IS_BACKEND_ENABLED) {
    return apiFetch<WaitlistResult>('/api/waitlist', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Fallback localStorage
  const existing = loadLocalWaitlist();

  // Cek NIM duplikat
  if (existing.some(e => e.nim === payload.nim)) {
    const dup = existing.find(e => e.nim === payload.nim)!;
    throw new Error(`NIM sudah terdaftar di antrean dengan kode ${dup.queueCode}.`);
  }

  const position = existing.length + 14; // offset dari data mock
  const queueCode = `WL-KPS-NEXT-${String(position).padStart(3, '0')}`;
  const id = `wl-local-${Date.now()}`;

  saveLocalWaitlist([...existing, { id, queueCode, nim: payload.nim }]);

  return {
    id,
    queueCode,
    position,
    fullName: payload.fullName,
    nim: payload.nim,
    preferredDivision: payload.preferredDivision,
  };
}
