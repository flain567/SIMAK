import { Router, Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { authenticate, authorize } from '../../middleware/authenticate';

const router = Router();
router.use(authenticate, authorize('ADMIN'));

/**
 * GET /api/admin/audit-log
 * Ambil audit log (ADMIN only)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '100' } = req.query;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: parseInt(String(limit)),
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { email: true, role: true } } },
      }),
      prisma.auditLog.count(),
    ]);

    res.json({ logs, total });
  } catch (err) {
    console.error('[GET /api/admin/audit-log]', err);
    res.status(500).json({ error: 'Gagal mengambil audit log' });
  }
});

export default router;
