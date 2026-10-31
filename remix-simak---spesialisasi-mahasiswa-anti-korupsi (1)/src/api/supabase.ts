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
  const name = row.full_name || row.name || 'Tamu Undangan';
  const phone = row.whatsapp || row.phone || '';
  const agency = row.campus || row.agency || row.program_studi || 'Umum';
  const ticketCode = row.ticket_code || `GUEST-${row.id}`;
  const nim = row.nim || ticketCode;
  const status = (row.status || 'TERDAFTAR').toUpperCase();

  return {
    id: String(row.id),
    ticketCode,
    examNumber: row.exam_number || `EXAM-${ticketCode}`,
    seatNumber: row.seat_number || 'A-01',
    fullName: name,
    nim: nim,
    whatsapp: phone,
    email: row.email || '',
    programStudi: row.program_studi || agency,
    campus: agency,
    semester: row.semester || 'Tamu Undangan',
    division: row.division || '-',
    registrationType: row.registration_type || 'Open House SIMAK',
    status: status,
    motivation: row.motivation || '',
    avatarUrl: row.avatar_url || '',
    registeredAt: row.registered_at || new Date().toISOString(),
    checkedInAt: row.checked_in_at || null,
    verifiedAt: row.verified_at || null,
    qrPayload: row.qr_payload || `${ticketCode}:${nim}`,
    gate: row.gate || 'Pintu Utama Auditorium',
    examRoom: row.exam_room || 'Auditorium Utama Institut STIAMI',
    examSession: row.exam_session || 'Puncak HARLAH SIMAK 16 (08.30 - 15.00 WIB)',
    examDate: row.exam_date || '29 Januari 2027',
  };
}

// Map objek ParticipantRecord ke format baris tabel Supabase (snake_case)
export function mapParticipantToRow(p: ParticipantRecord) {
  return {
    name: p.fullName || 'Tamu Undangan',
    email: p.email || '-',
    phone: p.whatsapp || '-',
    agency: p.campus || p.programStudi || 'Umum',
    ticket_code: p.ticketCode,
    status: p.status || 'TERDAFTAR',
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
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/participants?ticket_code=eq.${encodeURIComponent(ticketCode)}`, {
      method: 'PATCH',
      headers: SUPABASE_HEADERS,
      body: JSON.stringify({ status: updates.status }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.warn(`Supabase update error: ${errBody}`);
    }
  } catch (err) {
    console.warn('Supabase update attendance network exception:', err);
  }
}

