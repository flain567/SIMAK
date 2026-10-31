import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { registrationLimiter } from '../middleware/rateLimiter';

const router = Router();
const WHATSAPP_REGEX = /^(08|628|62)\d{8,13}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/waitlist
 * Daftarkan diri ke antrean KOPASUS
 */
router.post('/', registrationLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, nim, programStudi, semester, whatsapp, email, preferredDivision, reason } = req.body;

    if (!fullName?.trim()) { res.status(400).json({ error: 'Nama lengkap wajib diisi' }); return; }
    if (!nim?.trim()) { res.status(400).json({ error: 'NIM wajib diisi' }); return; }
    if (!whatsapp?.trim() || !WHATSAPP_REGEX.test(whatsapp.replace(/[\s-]/g, ''))) {
      res.status(400).json({ error: 'Nomor WhatsApp tidak valid' }); return;
    }
    if (!email?.trim() || !EMAIL_REGEX.test(email)) {
      res.status(400).json({ error: 'Format email tidak valid' }); return;
    }
    if (!preferredDivision?.trim()) { res.status(400).json({ error: 'Pilihan divisi wajib diisi' }); return; }
    if (!reason?.trim()) { res.status(400).json({ error: 'Alasan bergabung wajib diisi' }); return; }

    // Cek duplikasi NIM di waitlist
    const existing = await prisma.waitlist.findUnique({ where: { nim: nim.trim() } });
    if (existing) {
      res.status(409).json({
        error: 'NIM sudah terdaftar di antrean KOPASUS.',
        queueCode: existing.queueCode,
        position: existing.position,
      });
      return;
    }

    // Generate kode antrean sequential
    const count = await prisma.waitlist.count();
    const position = count + 1;
    const queueCode = `WL-KPS-NEXT-${String(position).padStart(3, '0')}`;

    const entry = await prisma.waitlist.create({
      data: {
        queueCode,
        position,
        fullName: fullName.trim(),
        nim: nim.trim(),
        programStudi: programStudi?.trim() || '',
        semester: semester?.trim() || '',
        whatsapp: whatsapp.replace(/[\s-]/g, ''),
        email: email.trim().toLowerCase(),
        preferredDivision: preferredDivision.trim(),
        reason: reason.trim(),
      },
    });

    res.status(201).json({
      id: entry.id,
      queueCode: entry.queueCode,
      position: entry.position,
      fullName: entry.fullName,
      nim: entry.nim,
      preferredDivision: entry.preferredDivision,
      createdAt: entry.createdAt.toISOString(),
    });
  } catch (err) {
    console.error('[POST /api/waitlist]', err);
    res.status(500).json({ error: 'Gagal mendaftarkan ke antrean' });
  }
});

/**
 * GET /api/waitlist/check/:nim
 * Cek status antrean berdasarkan NIM
 */
router.get('/check/:nim', async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = await prisma.waitlist.findUnique({
      where: { nim: req.params.nim },
      select: { queueCode: true, position: true, fullName: true, preferredDivision: true, createdAt: true },
    });

    if (!entry) {
      res.status(404).json({ error: 'NIM tidak ditemukan di antrean KOPASUS' });
      return;
    }

    res.json(entry);
  } catch (err) {
    console.error('[GET /api/waitlist/check/:nim]', err);
    res.status(500).json({ error: 'Gagal cek antrean' });
  }
});

export default router;
