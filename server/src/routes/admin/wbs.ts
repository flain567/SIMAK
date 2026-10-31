import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { decrypt } from '../../services/encryptionService';
import { authenticate, authorize } from '../../middleware/authenticate';

const router = Router();
router.use(authenticate);

/**
 * GET /api/admin/wbs
 * Daftar semua laporan WBS (admin)
 */
router.get('/', authorize('ADMIN', 'SATGAS'), async (_req: Request, res: Response): Promise<void> => {
  try {
    const reports = await prisma.wbsReport.findMany({
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true, trackingCode: true, category: true, unitReported: true,
        incidentDate: true, isAnonymous: true, status: true,
        progressStep: true, resolutionNote: true, submittedAt: true,
      },
    });

    res.json({ reports });
  } catch (err) {
    console.error('[GET /api/admin/wbs]', err);
    res.status(500).json({ error: 'Gagal mengambil laporan WBS' });
  }
});

/**
 * GET /api/admin/wbs/:id/decrypt
 * Dekripsi konten laporan (ADMIN & SATGAS only, dilog)
 */
router.get('/:id/decrypt', authorize('ADMIN', 'SATGAS'), async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await prisma.wbsReport.findUnique({ where: { id: req.params.id } });
    if (!report) { res.status(404).json({ error: 'Laporan tidak ditemukan' }); return; }

    // Dekripsi summary
    const [summaryEnc, summaryTag] = report.summaryEnc.split(':');
    const summary = decrypt(report.summaryIv, summaryEnc, summaryTag);

    // Log akses dekripsi (audit trail penting)
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'DECRYPT_WBS_REPORT',
        entity: 'WbsReport',
        entityId: report.id,
        metadata: { trackingCode: report.trackingCode },
      },
    });

    res.json({ id: report.id, trackingCode: report.trackingCode, summary });
  } catch (err) {
    console.error('[GET /api/admin/wbs/:id/decrypt]', err);
    res.status(500).json({ error: 'Gagal mendekripsi laporan' });
  }
});

/**
 * PATCH /api/admin/wbs/:id/status
 * Update status laporan WBS
 */
router.patch('/:id/status', authorize('ADMIN', 'SATGAS'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, progressStep, resolutionNote } = req.body;

    const report = await prisma.wbsReport.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(progressStep && { progressStep }),
        ...(resolutionNote && { resolutionNote }),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'UPDATE_WBS_STATUS',
        entity: 'WbsReport',
        entityId: report.id,
        metadata: { trackingCode: report.trackingCode, newStatus: status },
      },
    });

    res.json({ id: report.id, status: report.status, progressStep: report.progressStep });
  } catch (err) {
    console.error('[PATCH /api/admin/wbs/:id/status]', err);
    res.status(500).json({ error: 'Gagal update status laporan' });
  }
});

export default router;
