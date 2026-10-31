import { ParticipantRecord } from '../types';

function getNextJan29Year(): number {
  const now = new Date();
  const y = now.getFullYear();
  const target = new Date(y, 0, 29, 15, 0, 0);
  return now.getTime() > target.getTime() ? y + 1 : y;
}

export function getGoogleCalendarHarlahUrl(participant: ParticipantRecord): string {
  const year = getNextJan29Year();
  const start = `${year}0129T083000`;
  const end = `${year}0129T150000`;

  const title = `Puncak HARLAH SIMAK & Seminar Nasional Integritas (${participant.ticketCode})`;
  const location = 'Auditorium Utama Lt. 4, Kampus Pusat Institut STIAMI, Cempaka Putih, Jakarta Pusat';
  const details = [
    'BUKTI TERDAFTAR TAMU UNDANGAN HARLAH SIMAK (29 JANUARI)',
    '----------------------------------------------------',
    `Nama Tamu: ${participant.fullName}`,
    `NIM / ID: ${participant.nim}`,
    `Kategori: ${participant.semester}`,
    `Kode E-Tiket: ${participant.ticketCode}`,
    `Nomor Kursi Auditorium: ${participant.seatNumber}`,
    `Sesi Kehadiran: ${participant.division}`,
    `Meja Registrasi: ${participant.gate}`,
    '',
    'Catatan: Mohon hadir 30 menit sebelum acara (08.00 WIB) dan tunjukkan QR Code E-Tiket pada meja registrasi tamu.',
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details,
    location,
    ctz: 'Asia/Jakarta',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadHarlahIcsFile(participant: ParticipantRecord): void {
  const year = getNextJan29Year();
  // 08:30 WIB is 01:30 UTC; 15:00 WIB is 08:00 UTC
  const dtStartUtc = `${year}0129T013000Z`;
  const dtEndUtc = `${year}0129T080000Z`;
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const descriptionLines = [
    `BUKTI TERDAFTAR TAMU HARLAH SIMAK (29 JANUARI)`,
    `Nama Tamu: ${participant.fullName} (${participant.nim})`,
    `Kategori: ${participant.semester}`,
    `Kode E-Tiket: ${participant.ticketCode}`,
    `Nomor Kursi: ${participant.seatNumber}`,
    `Sesi: ${participant.division}`,
    `Meja Registrasi: ${participant.gate}`,
  ].join('\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SIMAK Institut STIAMI//Portal Integritas HARLAH//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${participant.ticketCode}-${year}@simak.stiami.ac.id`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStartUtc}`,
    `DTEND:${dtEndUtc}`,
    `SUMMARY:Puncak HARLAH SIMAK & Seminar Nasional (${participant.ticketCode})`,
    'LOCATION:Auditorium Utama Lt. 4\\, Kampus Pusat Institut STIAMI\\, Jakarta Pusat',
    `DESCRIPTION:${descriptionLines}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat H-1: Besok Puncak HARLAH SIMAK (29 Januari Pukul 08.30 WIB)',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat 1 Jam: Persiapan Registrasi Tamu HARLAH SIMAK di Auditorium Lt. 4',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Jadwal-HARLAH-SIMAK-29Jan-${participant.ticketCode}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getWhatsAppShareText(participant: ParticipantRecord): string {
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://simak-stiami.id';
  return [
    `*BUKTI TERDAFTAR TAMU HARLAH SIMAK (29 JANUARI)*`,
    `Halo! Saya *${participant.fullName}* telah terdaftar resmi sebagai *${participant.semester}* pada acara puncak *Hari Lahir (HARLAH) SIMAK & Seminar Nasional Integritas*:`,
    ``,
    `• *Kode E-Tiket:* ${participant.ticketCode}`,
    `• *Nomor Kursi:* ${participant.seatNumber}`,
    `• *Sesi Kehadiran:* ${participant.division}`,
    `• *Jadwal:* 29 Januari (08.30 – 15.00 WIB)`,
    `• *Lokasi:* Auditorium Utama Lt. 4, Institut STIAMI Pusat`,
    ``,
    `Yuk ikut daftar hadir sebagai Tamu Undangan / Peserta Seminar HARLAH SIMAK melalui portal resmi: ${originUrl}`,
  ].join('\n');
}

export function getWhatsAppShareUrl(participant: ParticipantRecord, toOwnNumber = false): string {
  const text = getWhatsAppShareText(participant);
  const encoded = encodeURIComponent(text);

  if (toOwnNumber && participant.whatsapp) {
    const digits = participant.whatsapp.replace(/\D/g, '');
    const normalizedPhone = digits.startsWith('0')
      ? `62${digits.slice(1)}`
      : digits.startsWith('62')
      ? digits
      : `62${digits}`;
    return `https://wa.me/${normalizedPhone}?text=${encoded}`;
  }

  return `https://wa.me/?text=${encoded}`;
}
