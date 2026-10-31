import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * GET /api/ledger
 * Ambil semua entri buku besar keuangan publik
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const entries = await prisma.ledgerEntry.findMany({
      orderBy: { date: 'desc' },
      select: {
        id: true, voucherCode: true, date: true, program: true,
        category: true, type: true, amount: true,
        auditorStatus: true, createdAt: true,
      },
    });

    // Summary totals
    const totalIncome = entries
      .filter(e => e.type === 'PEMASUKAN')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpense = entries
      .filter(e => e.type === 'PENGELUARAN')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    res.json({
      entries: entries.map(e => ({
        ...e,
        amount: Number(e.amount), // Convert BigInt to number for JSON
      })),
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        auditedCount: entries.filter(e => e.auditorStatus === 'Diverifikasi').length,
        pendingCount: entries.filter(e => e.auditorStatus === 'Menunggu_Audit').length,
      },
    });
  } catch (err) {
    console.error('[GET /api/ledger]', err);
    res.status(500).json({ error: 'Gagal mengambil data keuangan' });
  }
});

export default router;
