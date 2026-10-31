import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/gallery
 * Ambil semua item galeri
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category && category !== 'Semua') where.category = category;

    const items = await prisma.galleryItem.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { date: 'desc' }],
    });

    res.json({ items });
  } catch (err) {
    console.error('[GET /api/gallery]', err);
    res.status(500).json({ error: 'Gagal mengambil galeri' });
  }
});

export default router;
