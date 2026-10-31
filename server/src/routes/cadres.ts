import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/cadres
 * Daftar kader aktif untuk Direktori
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cohort, division, q } = req.query;
    const where: any = { status: 'Aktif' };
    if (cohort) where.cohort = cohort;
    if (division && division !== 'Semua') where.division = division;
    if (q) where.name = { contains: String(q), mode: 'insensitive' };

    const members = await prisma.cadreMember.findMany({
      where,
      orderBy: [{ cohort: 'desc' }, { name: 'asc' }],
      select: {
        id: true, cohort: true, name: true, nim: true,
        division: true, subDivision: true, status: true,
        avatarUrl: true, joinedAt: true,
        // photoUrl tidak dikembalikan ke publik
      },
    });

    res.json({ members });
  } catch (err) {
    console.error('[GET /api/cadres]', err);
    res.status(500).json({ error: 'Gagal mengambil direktori kader' });
  }
});

export default router;
