/**
 * supabase.ts — Supabase REST Client untuk Sinkronisasi Cloud Antar-Perangkat
 * Menghubungkan seluruh perangkat (HP Peserta, Laptop Panitia, HP Panitia) ke database online terpusat.
 */

import { ParticipantRecord } from '../types';

export const SUPABASE_URL = 'https://onamimwiobsqguhzfvcy.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_Yx0HmToyOzh5P3_mbCctBw_lxi6G6BY';

export const SUPABASE_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Prefer': 'return=representation',
};

// Map baris tabel Supabase (snake_case) ke objek ParticipantRecord (camelCase)
export function mapRowToParticipant(row: any): ParticipantRecord {
  return {
    id: row.id,
    ticketCode: row.ticket_code,
    examNumber: row.exam_number || '',
    seatNumber: row.seat_number || 'A-01',
    fullName: row.full_name,
    nim: row.nim,
    whatsapp: row.whatsapp || '',
    email: row.email || '',
    programStudi: row.program_studi || '',
    campus: row.campus || '',
    semester: row.semester || 'Tamu Undangan',
    division: row.division || '-',
    registrationType: row.registration_type || 'Open House SIMAK',
    status: row.status || 'MENUNGGU VERIFIKASI',
    motivation: row.motivation || '',
    avatarUrl: row.avatar_url || '',
    registeredAt: row.registered_at || new Date().toISOString(),
    checkedInAt: row.checked_in_at || null,
    verifiedAt: row.verified_at || null,
    qrPayload: row.qr_payload || `${row.ticket_code}:${row.nim}`,
    gate: row.gate || 'Pintu Utama Auditorium',
    examRoom: row.exam_room || 'Auditorium Utama Institut STIAMI',
    examSession: row.exam_session || 'Puncak HARLAH SIMAK 16 (08.30 - 15.00 WIB)',
    examDate: row.exam_date || '29 Januari 2027',
  };
}

// Map objek ParticipantRecord ke format baris tabel Supabase (snake_case)
export function mapParticipantToRow(p: ParticipantRecord) {
  return {
    id: p.id,
    ticket_code: p.ticketCode,
    exam_number: p.examNumber,
    seat_number: p.seatNumber,
    full_name: p.fullName,
    nim: p.nim,
    whatsapp: p.whatsapp,
    email: p.email,
    program_studi: p.programStudi,
    campus: p.campus,
    semester: p.semester,
    division: p.division,
    registration_type: p.registrationType,
    status: p.status,
    motivation: p.motivation,
    avatar_url: p.avatarUrl,
    gate: p.gate,
    exam_room: p.examRoom,
    exam_session: p.examSession,
    exam_date: p.examDate,
    qr_payload: p.qrPayload || `${p.ticketCode}:${p.nim}`,
    checked_in_at: p.checkedInAt,
    verified_at: p.verifiedAt,
    registered_at: p.registeredAt || new Date().toISOString(),
  };
}

/**
 * Ambil seluruh peserta dari Supabase
 */
export async function supabaseFetchParticipants(): Promise<ParticipantRecord[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/participants?select=*&order=registered_at.desc`, {
    headers: SUPABASE_HEADERS,
  });

  if (!res.ok) {
    throw new Error(`Supabase error ${res.status}`);
  }

  const rows = await res.json();
  return rows.map(mapRowToParticipant);
}

/**
 * Daftarkan peserta baru ke Supabase
 */
export async function supabaseInsertParticipant(participant: ParticipantRecord): Promise<ParticipantRecord> {
  const row = mapParticipantToRow(participant);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/participants`, {
    method: 'POST',
    headers: SUPABASE_HEADERS,
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Supabase insert error: ${errBody}`);
  }

  const created = await res.json();
  return mapRowToParticipant(created[0] || row);
}

/**
 * Update status & waktu kehadiran peserta di Supabase
 */
export async function supabaseUpdateAttendance(
  ticketCode: string,
  updates: { status: string; checked_in_at?: string; verified_at?: string }
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/participants?ticket_code=eq.${encodeURIComponent(ticketCode)}`, {
    method: 'PATCH',
    headers: SUPABASE_HEADERS,
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Supabase update error: ${errBody}`);
  }
}

