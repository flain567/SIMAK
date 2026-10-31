import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/library/documents
 * Daftar semua dokumen dengan filter opsional
 */
router.get('/documents', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, q, featured } = req.query;

    const where: any = {};
    if (category && category !== 'Semua') where.category = category;
    if (featured === 'true') where.featured = true;
    if (q) where.title = { contains: String(q), mode: 'insensitive' };

    const docs = await prisma.libraryDocument.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, code: true, title: true, subtitle: true,
        author: true, category: true, year: true, pages: true,
        fileSize: true, downloads: true, abstract: true,
        keyTakeaways: true, coverImage: true, featured: true,
      },
    });

    res.json({ documents: docs });
  } catch (err) {
    console.error('[GET /api/library/documents]', err);
    res.status(500).json({ error: 'Gagal mengambil dokumen' });
  }
});

/**
 * GET /api/library/documents/:code
 * Detail satu dokumen dan increment download counter
 */
router.get('/documents/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await prisma.libraryDocument.findUnique({
      where: { code: req.params.code },
    });

    if (!doc) { res.status(404).json({ error: 'Dokumen tidak ditemukan' }); return; }

    // Fire-and-forget increment
    prisma.libraryDocument.update({
      where: { code: req.params.code },
      data: { downloads: { increment: 1 } },
    }).catch(console.error);

    res.json(doc);
  } catch (err) {
    console.error('[GET /api/library/documents/:code]', err);
    res.status(500).json({ error: 'Gagal mengambil dokumen' });
  }
});

/**
 * GET /api/library/submissions
 * Daftar naskah advokasi yang diterbitkan
 */
router.get('/submissions', async (req: Request, res: Response): Promise<void> => {
  try {
    const submissions = await prisma.advocacySubmission.findMany({
      where: { status: 'Diterbitkan' },
      orderBy: { submittedAt: 'desc' },
      select: {
        id: true, title: true, authorName: true, nim: true,
        category: true, abstract: true, readTime: true,
        status: true, submittedAt: true,
        // linkUrl tidak dikembalikan di listing (hanya di detail)
      },
    });

    res.json({ submissions });
  } catch (err) {
    console.error('[GET /api/library/submissions]', err);
    res.status(500).json({ error: 'Gagal mengambil naskah advokasi' });
  }
});

/**
 * POST /api/library/submissions
 * Submit naskah advokasi baru
 */
router.post('/submissions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, authorName, nim, category, linkUrl, abstract, readTime } = req.body;

    if (!title?.trim()) { res.status(400).json({ error: 'Judul wajib diisi' }); return; }
    if (!authorName?.trim()) { res.status(400).json({ error: 'Nama penulis wajib diisi' }); return; }
    if (!nim?.trim()) { res.status(400).json({ error: 'NIM wajib diisi' }); return; }
    if (!abstract?.trim()) { res.status(400).json({ error: 'Abstrak wajib diisi' }); return; }

    const categoryMap: Record<string, string> = {
      'Opini Antikorupsi': 'Opini_Antikorupsi',
      'Policy Brief': 'Policy_Brief',
      'Laporan Kajian': 'Laporan_Kajian',
      'Esai Integritas': 'Esai_Integritas',
    };

    const submission = await prisma.advocacySubmission.create({
      data: {
        title: title.trim(),
        authorName: authorName.trim(),
        nim: nim.trim(),
        category: (categoryMap[category] || 'Esai_Integritas') as any,
        linkUrl: linkUrl?.trim() || '',
        abstract: abstract.trim(),
        readTime: readTime?.trim() || '5 menit baca',
        status: 'Dalam_Kurasi',
      },
    });

    res.status(201).json({
      id: submission.id,
      title: submission.title,
      status: 'Dalam Kurasi',
      message: 'Naskah berhasil dikirim dan sedang dalam kurasi Tim Redaksi SIMAK.',
    });
  } catch (err) {
    console.error('[POST /api/library/submissions]', err);
    res.status(500).json({ error: 'Gagal mengirim naskah' });
  }
});

export default router;
