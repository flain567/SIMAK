import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { encrypt } from '../services/encryptionService';
import { registrationLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/wbs/reports
 * Submit laporan WBS (anonim atau terverifikasi)
 */
router.post('/reports', registrationLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, unitReported, incidentDate, summary, evidenceUrl, isAnonymous, reporterIdentity } = req.body;

    if (!category?.trim()) { res.status(400).json({ error: 'Kategori pelanggaran wajib diisi' }); return; }
    if (!unitReported?.trim()) { res.status(400).json({ error: 'Unit yang dilaporkan wajib diisi' }); return; }
    if (!incidentDate?.trim()) { res.status(400).json({ error: 'Tanggal kejadian wajib diisi' }); return; }
    if (!summary?.trim() || summary.trim().length < 50) {
      res.status(400).json({ error: 'Kronologi kejadian minimal 50 karakter' }); return;
    }

    // Generate tracking code dengan entropi tinggi
    const trackingCode = `WBS-${new Date().getFullYear()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // Enkripsi summary (selalu)
    const summaryEnc = encrypt(summary.trim());

    // Enkripsi evidence URL jika ada
    let evidenceUrlEnc = null;
    let evidenceUrlIv = null;
    if (evidenceUrl?.trim()) {
      const enc = encrypt(evidenceUrl.trim());
      evidenceUrlEnc = `${enc.ciphertext}:${enc.authTag}`;
      evidenceUrlIv = enc.iv;
    }

    // Enkripsi identitas pelapor jika tidak anonim
    let reporterIdentityEnc = null;
    let reporterIdentityIv = null;
    if (!isAnonymous && reporterIdentity?.trim()) {
      const enc = encrypt(reporterIdentity.trim());
      reporterIdentityEnc = `${enc.ciphertext}:${enc.authTag}`;
      reporterIdentityIv = enc.iv;
    }

    // Map category ke enum Prisma
    const categoryMap: Record<string, string> = {
      'Pungutan Liar (Pungli)': 'Pungutan_Liar',
      'Gratifikasi & Suap Akademik': 'Gratifikasi_Suap_Akademik',
      'Penyelewengan Dana Kegiatan': 'Penyelewengan_Dana_Kegiatan',
      'Konflik Kepentingan': 'Konflik_Kepentingan',
      'Pelanggaran Etik Kader': 'Pelanggaran_Etik_Kader',
    };
    const prismaCategory = (categoryMap[category] || 'Pungutan_Liar') as any;

    const report = await prisma.wbsReport.create({
      data: {
        trackingCode,
        category: prismaCategory,
        unitReported: unitReported.trim(),
        incidentDate: incidentDate.trim(),
        summaryEnc: `${summaryEnc.ciphertext}:${summaryEnc.authTag}`,
        summaryIv: summaryEnc.iv,
        evidenceUrlEnc,
        evidenceUrlIv,
        isAnonymous: isAnonymous !== false,
        reporterIdentityEnc,
        reporterIdentityIv,
        status: 'Verifikasi_Bukti',
        progressStep: 2,
        resolutionNote: 'Laporan diterima dan sedang dalam antrian verifikasi oleh Dewan Etik.',
      },
    });

    // Hanya kembalikan tracking code — tidak ada data lain
    res.status(201).json({ trackingCode: report.trackingCode });
  } catch (err) {
    console.error('[POST /api/wbs/reports]', err);
    res.status(500).json({ error: 'Gagal mengirim laporan. Silakan coba lagi.' });
  }
});

/**
 * GET /api/wbs/reports/:code
 * Lacak status laporan berdasarkan kode persis (TIDAK boleh fuzzy search)
 */
router.get('/reports/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    // Validasi format kode: WBS-YYYY-XXXX
    if (!/^WBS-\d{4}-[A-F0-9]{4}$/i.test(code)) {
      res.status(404).json({ error: 'Laporan tidak ditemukan' });
      return;
    }

    const report = await prisma.wbsReport.findUnique({
      where: { trackingCode: code.toUpperCase() },
      select: {
        // TIDAK mengembalikan summary, identitas, atau data terenkripsi
        trackingCode: true,
        category: true,
        unitReported: true,
        incidentDate: true,
        isAnonymous: true,
        status: true,
        progressStep: true,
        resolutionNote: true,
        submittedAt: true,
        updatedAt: true,
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Laporan tidak ditemukan' });
      return;
    }

    // Map category kembali ke display string
    const categoryDisplayMap: Record<string, string> = {
      'Pungutan_Liar': 'Pungutan Liar (Pungli)',
      'Gratifikasi_Suap_Akademik': 'Gratifikasi & Suap Akademik',
      'Penyelewengan_Dana_Kegiatan': 'Penyelewengan Dana Kegiatan',
      'Konflik_Kepentingan': 'Konflik Kepentingan',
      'Pelanggaran_Etik_Kader': 'Pelanggaran Etik Kader',
    };

    res.json({
      trackingCode: report.trackingCode,
      category: categoryDisplayMap[report.category] || report.category,
      unitReported: report.unitReported,
      incidentDate: report.incidentDate,
      isAnonymous: report.isAnonymous,
      reporterIdentity: report.isAnonymous ? 'Anonim Terenkripsi (AES-256-GCM)' : 'Pelapor Terverifikasi (Identitas Dirahasiakan)',
      status: report.status.replace(/_/g, ' '),
      progressStep: report.progressStep,
      resolutionNote: report.resolutionNote,
      submittedAt: report.submittedAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      updatedAt: report.updatedAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    });
  } catch (err) {
    console.error('[GET /api/wbs/reports/:code]', err);
    res.status(500).json({ error: 'Gagal mengambil data laporan' });
  }
});

export default router;
