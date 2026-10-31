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
import { INITIAL_PARTICIPANTS } from '../data/mockData';
import {
  supabaseFetchParticipants,
  supabaseInsertParticipant,
} from './supabase';

// ─── Helpers localStorage (fallback) ────────────────────────

function loadLocalParticipants(): ParticipantRecord[] {
  try {
    const raw = localStorage.getItem('simak_participants_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse error
  }
  return [...INITIAL_PARTICIPANTS];
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
 * Backend → POST /api/participants (dengan fallback otomatis ke localStorage)
 */
export async function registerParticipant(
  payload: RegisterPayload
): Promise<RegisterResult> {
  const existing = loadLocalParticipants();

  if (IS_BACKEND_ENABLED) {
    try {
      const data = await apiFetch<ParticipantRecord & { qrPayload?: string }>(
        '/api/participants',
        { method: 'POST', body: JSON.stringify(payload) }
      );
      const { qrPayload, ...participant } = data;
      // Sinkronkan juga ke cache localStorage
      const updated = [participant, ...existing.filter(p => p.nim !== participant.nim)];
      saveLocalParticipants(updated);
      return { participant, qrPayload };
    } catch (err) {
      console.warn('Backend gagal dihubungi, mendaftar via penyimpanan lokal:', err);
    }
  }

  // ── Fallback: localStorage ──
  const cleanNim = payload.nim.trim().toUpperCase();

  // Cek duplikasi NIM
  if (existing.some(p => p.nim.toUpperCase() === cleanNim)) {
    throw new Error('NIM sudah terdaftar. Setiap mahasiswa/tamu hanya boleh mendaftar satu kali.');
  }

  // Generate kode unik
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ticketCode = `GUEST-HRL-${suffix}`;
  const examNumber = `KPS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const seatNumber = `TAMU-${String(existing.length + 1).padStart(2, '0')}`;

  const newRecord: ParticipantRecord = {
    id: `local-${Date.now()}`,
    ticketCode,
    examNumber,
    seatNumber,
    gate: 'Pintu Utama Auditorium',
    examRoom: 'Auditorium Utama Institut STIAMI',
    examSession: payload.session || 'Puncak HARLAH SIMAK 16 (08.30 - 15.00 WIB)',
    examDate: '29 Januari 2027',
    fullName: payload.fullName.trim(),
    nim: cleanNim,
    whatsapp: payload.whatsapp.trim(),
    email: payload.email.trim(),
    programStudi: payload.programStudi || 'Tamu Undangan',
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
    qrPayload: `${ticketCode}:${cleanNim}`,
  };

  const updated = [newRecord, ...existing];
  saveLocalParticipants(updated);

  // Simpan ke Supabase Cloud Database agar tersinkronisasi antar-perangkat (HP <-> Komputer)
  try {
    await supabaseInsertParticipant(newRecord);
  } catch (err) {
    console.warn('Simpan ke Supabase cloud tertunda/gagal:', err);
  }

  return { participant: newRecord, qrPayload: newRecord.qrPayload };
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
  try {
    const supabaseList = await supabaseFetchParticipants();
    if (supabaseList && supabaseList.length > 0) {
      saveLocalParticipants(supabaseList);
      return supabaseList;
    }
  } catch (err) {
    // Supabase offline atau belum ada koneksi
  }

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
