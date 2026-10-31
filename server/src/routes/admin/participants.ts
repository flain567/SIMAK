import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, authorize } from '../../middleware/authenticate';

const router = Router();

// Semua admin routes butuh autentikasi
router.use(authenticate);

/**
 * GET /api/admin/participants
 * Semua peserta dengan data lengkap (termasuk WhatsApp & email)
 */
router.get('/', authorize('ADMIN', 'PANITIA'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, q, page = '1', limit = '50' } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { fullName: { contains: String(q), mode: 'insensitive' } },
        { nim: { contains: String(q) } },
        { ticketCode: { contains: String(q).toUpperCase() } },
        { whatsapp: { contains: String(q) } },
      ];
    }

    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(100, parseInt(String(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({ where, skip, take: limitNum, orderBy: { registeredAt: 'desc' } }),
      prisma.participant.count({ where }),
    ]);

    res.json({
      participants: participants.map(p => ({
        ...p,
        registrationType: p.registrationType === 'Kader_KOPASUS' ? 'Kader KOPASUS' : 'Open House SIMAK',
        status: p.status.replace('_', ' '),
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('[GET /api/admin/participants]', err);
    res.status(500).json({ error: 'Gagal mengambil data peserta' });
  }
});

/**
 * PATCH /api/admin/participants/:id/verify
 * Verifikasi peserta
 */
router.patch('/:id/verify', authorize('ADMIN', 'PANITIA'), async (req: Request, res: Response): Promise<void> => {
  try {
    const participant = await prisma.participant.update({
      where: { id: req.params.id },
      data: { status: 'TERVERIFIKASI', verifiedAt: new Date() },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'VERIFY_PARTICIPANT',
        entity: 'Participant',
        entityId: participant.id,
        metadata: { ticketCode: participant.ticketCode },
      },
    });

    res.json({ id: participant.id, status: 'TERVERIFIKASI', verifiedAt: participant.verifiedAt });
  } catch (err) {
    console.error('[PATCH /api/admin/participants/:id/verify]', err);
    res.status(500).json({ error: 'Gagal memverifikasi peserta' });
  }
});

/**
 * DELETE /api/admin/participants/:id
 * Hapus peserta (ADMIN only)
 */
router.delete('/:id', authorize('ADMIN'), async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.participant.delete({ where: { id: req.params.id } });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'DELETE_PARTICIPANT',
        entity: 'Participant',
        entityId: req.params.id,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/admin/participants/:id]', err);
    res.status(500).json({ error: 'Gagal menghapus peserta' });
  }
});

export default router;
