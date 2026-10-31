import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { generateTicketCode, generateSeatNumber, generateExamNumber } from '../services/ticketService';
import { generateQrPayload } from '../services/qrService';
import { sendTicketConfirmationEmail } from '../services/emailService';
import { registrationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Validasi WhatsApp: dimulai 08 atau 62, 10-15 digit
const WHATSAPP_REGEX = /^(08|628|62)\d{8,13}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/participants
 * Daftarkan peserta HARLAH baru
 */
router.post('/', registrationLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName, nim, whatsapp, email,
      programStudi, campus, semester, division,
      guestCategory, session, registrationType,
      motivation, agreement,
    } = req.body;

    // --- Validasi wajib ---
    if (!fullName?.trim()) { res.status(400).json({ error: 'Nama lengkap wajib diisi' }); return; }
    if (!nim?.trim()) { res.status(400).json({ error: 'NIM wajib diisi' }); return; }
    if (!whatsapp?.trim() || !WHATSAPP_REGEX.test(whatsapp.replace(/[\s-]/g, ''))) {
      res.status(400).json({ error: 'Nomor WhatsApp tidak valid (format: 08xx atau 628xx)' }); return;
    }
    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Format email tidak valid' }); return;
    }
    if (!guestCategory?.trim()) { res.status(400).json({ error: 'Kategori tamu wajib diisi' }); return; }
    if (!agreement) { res.status(400).json({ error: 'Persetujuan syarat wajib dicentang' }); return; }

    // --- Cek duplikasi NIM (constraint DB) ---
    const existingNim = await prisma.participant.findFirst({ where: { nim: nim.trim() } });
    if (existingNim) {
      res.status(409).json({ error: 'NIM sudah terdaftar. Setiap mahasiswa hanya boleh mendaftar satu kali.' });
      return;
    }

    // --- Generate kode dari server ---
    const [ticketCode, seatNumber] = await Promise.all([
      generateTicketCode(),
      generateSeatNumber(),
    ]);
    const examNumber = generateExamNumber();

    // --- Simpan ke database ---
    const participant = await prisma.participant.create({
      data: {
        ticketCode,
        examNumber,
        seatNumber,
        fullName: fullName.trim(),
        nim: nim.trim(),
        whatsapp: whatsapp.replace(/[\s-]/g, ''),
        email: email.trim().toLowerCase(),
        programStudi: programStudi?.trim() || 'Tidak Disebutkan',
        campus: campus?.trim() || 'Kampus Utama STIAMI',
        semester: semester?.trim() || 'Tamu Undangan',
        division: division?.trim() || '-',
        guestCategory: guestCategory.trim(),
        session: session?.trim() || 'Pagi',
        registrationType: registrationType === 'Kader KOPASUS' ? 'Kader_KOPASUS' : 'Open_House_SIMAK',
        motivation: motivation?.trim() || '',
        status: 'MENUNGGU_VERIFIKASI',
      },
    });

    // --- Generate QR payload (HMAC) ---
    const qrPayload = generateQrPayload(ticketCode, nim.trim());

    // Kirim email konfirmasi tiket (asinkron / non-blocking)
    sendTicketConfirmationEmail({
      toEmail: participant.email,
      fullName: participant.fullName,
      ticketCode: participant.ticketCode,
      seatNumber: participant.seatNumber,
      session: participant.session,
      guestCategory: participant.guestCategory,
      examRoom: participant.examRoom,
      gate: participant.gate,
      examDate: participant.examDate,
    }).catch((err) => console.warn('[Email non-blocking error]:', err));

    res.status(201).json({
      id: participant.id,
      ticketCode: participant.ticketCode,
      examNumber: participant.examNumber,
      seatNumber: participant.seatNumber,
      gate: participant.gate,
      examRoom: participant.examRoom,
      examSession: participant.examSession,
      examDate: participant.examDate,
      fullName: participant.fullName,
      nim: participant.nim,
      programStudi: participant.programStudi,
      campus: participant.campus,
      semester: participant.semester,
      division: participant.division,
      registrationType: participant.registrationType === 'Kader_KOPASUS' ? 'Kader KOPASUS' : 'Open House SIMAK',
      guestCategory: participant.guestCategory,
      session: participant.session,
      status: 'MENUNGGU VERIFIKASI',
      motivation: participant.motivation,
      avatarUrl: participant.avatarUrl,
      registeredAt: participant.registeredAt.toISOString(),
      qrPayload,
      // Email/WhatsApp TIDAK dikembalikan ke response publik
    });
  } catch (err) {
    console.error('[POST /api/participants]', err);
    res.status(500).json({ error: 'Gagal mendaftarkan peserta. Silakan coba lagi.' });
  }
});

/**
 * GET /api/participants/lookup?q=...
 * Cari peserta berdasarkan nama/NIM/kode tiket (tanpa data kontak)
 */
router.get('/lookup', async (req: Request, res: Response): Promise<void> => {
  const q = String(req.query.q || '').trim();
  if (q.length < 3) {
    res.status(400).json({ error: 'Masukkan minimal 3 karakter untuk pencarian' });
    return;
  }

  try {
    const results = await prisma.participant.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { nim: { contains: q } },
          { ticketCode: { contains: q.toUpperCase() } },
        ],
      },
      take: 20,
      select: {
        // TIDAK menyertakan whatsapp dan email (NFR-SEC-06)
        id: true,
        ticketCode: true,
        examNumber: true,
        seatNumber: true,
        gate: true,
        examRoom: true,
        examSession: true,
        examDate: true,
        fullName: true,
        nim: true,
        programStudi: true,
        campus: true,
        semester: true,
        division: true,
        registrationType: true,
        guestCategory: true,
        session: true,
        status: true,
        avatarUrl: true,
        registeredAt: true,
        motivation: true,
      },
    });

    res.json({
      results: results.map(p => ({
        ...p,
        registrationType: p.registrationType === 'Kader_KOPASUS' ? 'Kader KOPASUS' : 'Open House SIMAK',
        status: p.status.replace('_', ' '),
      })),
    });
  } catch (err) {
    console.error('[GET /api/participants/lookup]', err);
    res.status(500).json({ error: 'Gagal mencari data peserta' });
  }
});

/**
 * GET /api/participants/ticket/:code
 * Ambil data tiket berdasarkan kode (untuk E-Tiket Screen)
 */
router.get('/ticket/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const participant = await prisma.participant.findUnique({
      where: { ticketCode: req.params.code.toUpperCase() },
      select: {
        id: true, ticketCode: true, examNumber: true, seatNumber: true,
        gate: true, examRoom: true, examSession: true, examDate: true,
        fullName: true, nim: true, programStudi: true, campus: true,
        semester: true, division: true, registrationType: true,
        guestCategory: true, session: true, status: true, avatarUrl: true,
        registeredAt: true, motivation: true,
      },
    });

    if (!participant) {
      res.status(404).json({ error: 'Tiket tidak ditemukan' });
      return;
    }

    res.json({
      ...participant,
      registrationType: participant.registrationType === 'Kader_KOPASUS' ? 'Kader KOPASUS' : 'Open House SIMAK',
      status: participant.status.replace('_', ' '),
      qrPayload: generateQrPayload(participant.ticketCode, participant.nim),
    });
  } catch (err) {
    console.error('[GET /api/participants/ticket/:code]', err);
    res.status(500).json({ error: 'Gagal mengambil data tiket' });
  }
});

export default router;
