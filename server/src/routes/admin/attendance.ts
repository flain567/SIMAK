import { Router, Request, Response } from 'express';
import { ParticipantStatus, Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { verifyQrPayload } from '../../services/qrService';
import { authenticate, authorize } from '../../middleware/authenticate';

const router = Router();
router.use(authenticate, authorize('ADMIN', 'PANITIA'));

/**
 * POST /api/admin/attendance/verify-qr
 * Verifikasi QR code dan tandai kehadiran
 */
router.post('/verify-qr', async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrPayload, ticketCode: rawTicketCode, nim: rawNim } = req.body;

    let targetTicketCode = rawTicketCode?.trim();
    let isHmacVerified = false;

    if (qrPayload?.trim()) {
      const cleanPayload = qrPayload.trim();
      const parts = cleanPayload.split(':');
      targetTicketCode = parts[0];

      if (parts.length === 2) {
        // Cari peserta dulu untuk mendapatkan NIM yang sah
        const p = await prisma.participant.findUnique({
          where: { ticketCode: targetTicketCode },
          select: { nim: true },
        });

        if (!p) {
          res.status(404).json({ error: 'Kode tiket tidak ditemukan di sistem' });
          return;
        }

        const verifiedCode = verifyQrPayload(cleanPayload, p.nim);
        if (!verifiedCode) {
          res.status(400).json({ error: 'QR Code tidak valid atau tanda tangan digital HMAC telah dimanipulasi' });
          return;
        }
        isHmacVerified = true;
      }
    } else if (rawNim?.trim()) {
      const p = await prisma.participant.findFirst({
        where: { nim: rawNim.trim() },
        select: { ticketCode: true },
      });
      if (p) targetTicketCode = p.ticketCode;
    }

    if (!targetTicketCode) {
      res.status(400).json({ error: 'Payload QR, Kode Tiket, atau NIM wajib disertakan' });
      return;
    }

    // Cari data peserta lengkap
    const participant = await prisma.participant.findUnique({
      where: { ticketCode: targetTicketCode },
      select: {
        id: true,
        ticketCode: true,
        fullName: true,
        nim: true,
        seatNumber: true,
        status: true,
        session: true,
        programStudi: true,
        campus: true,
        checkedInAt: true,
      },
    });

    if (!participant) {
      res.status(404).json({ error: 'Peserta tidak ditemukan untuk kode tiket ini' });
      return;
    }

    // Jika NIM disertakan terpisah, cocokkan
    if (rawNim?.trim() && participant.nim !== rawNim.trim()) {
      res.status(400).json({ error: 'Data NIM tidak sesuai dengan pemilik tiket' });
      return;
    }

    // Cegah check-in ganda
    if (participant.checkedInAt) {
      res.json({
        success: false,
        alreadyCheckedIn: true,
        isHmacVerified,
        participant: {
          fullName: participant.fullName,
          ticketCode: participant.ticketCode,
          nim: participant.nim,
          seatNumber: participant.seatNumber,
          session: participant.session,
          checkedInAt: participant.checkedInAt,
        },
      });
      return;
    }

    // Tandai hadir di database
    const updated = await prisma.participant.update({
      where: { id: participant.id },
      data: { status: 'HADIR', checkedInAt: new Date() },
      select: {
        id: true,
        ticketCode: true,
        fullName: true,
        nim: true,
        seatNumber: true,
        session: true,
        status: true,
        checkedInAt: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.userId,
        action: 'CHECK_IN',
        entity: 'Participant',
        entityId: participant.id,
        metadata: {
          ticketCode: targetTicketCode,
          seatNumber: participant.seatNumber,
          isHmacVerified,
        },
      },
    });

    res.json({
      success: true,
      isHmacVerified,
      participant: updated,
    });
  } catch (err) {
    console.error('[POST /api/admin/attendance/verify-qr]', err);
    res.status(500).json({ error: 'Gagal memverifikasi kehadiran' });
  }
});

/**
 * GET /api/admin/attendance/summary
 * Ringkasan kehadiran HARLAH lengkap untuk komparasi 2 kelompok data
 */
router.get('/summary', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, hadir, terverifikasi, menunggu] = await Promise.all([
      prisma.participant.count(),
      prisma.participant.count({ where: { status: 'HADIR' } }),
      prisma.participant.count({ where: { status: 'TERVERIFIKASI' } }),
      prisma.participant.count({ where: { status: 'MENUNGGU_VERIFIKASI' } }),
    ]);

    const hadirPersen = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const tidakHadir = total - hadir;

    res.json({
      total,
      hadir,
      hadirPersen,
      terverifikasi,
      menungguVerifikasi: menunggu,
      tidakHadir,
      tidakHadirPersen: total > 0 ? Math.round((tidakHadir / total) * 100) : 0,
    });
  } catch (err) {
    console.error('[GET /api/admin/attendance/summary]', err);
    res.status(500).json({ error: 'Gagal mengambil ringkasan kehadiran' });
  }
});

/**
 * GET /api/admin/attendance/list?group=hadir|tidak_hadir
 * Daftar peserta per kelompok (untuk komparasi LPJ)
 */
router.get('/list', async (req: Request, res: Response): Promise<void> => {
  try {
    const { group = 'hadir', page = '1', limit = '100' } = req.query;
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(500, parseInt(String(limit)));
    const skip = (pageNum - 1) * limitNum;

    // group=hadir => status HADIR
    // group=tidak_hadir => status MENUNGGU_VERIFIKASI atau TERVERIFIKASI (belum check-in)
    const where: Prisma.ParticipantWhereInput =
      group === 'hadir'
        ? { status: ParticipantStatus.HADIR }
        : { status: { in: [ParticipantStatus.MENUNGGU_VERIFIKASI, ParticipantStatus.TERVERIFIKASI] } };

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: group === 'hadir' ? { checkedInAt: 'asc' } : { registeredAt: 'asc' },
        select: {
          id: true,
          ticketCode: true,
          fullName: true,
          nim: true,
          programStudi: true,
          campus: true,
          guestCategory: true,
          session: true,
          seatNumber: true,
          status: true,
          registeredAt: true,
          verifiedAt: true,
          checkedInAt: true,
        },
      }),
      prisma.participant.count({ where }),
    ]);

    res.json({
      group,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      participants: participants.map((p) => ({
        ...p,
        statusLabel:
          p.status === 'HADIR'
            ? 'HADIR ✓'
            : p.status === 'TERVERIFIKASI'
            ? 'Terverifikasi (Belum Hadir)'
            : 'Menunggu Verifikasi (Belum Hadir)',
        hakSertifikat: p.status === 'HADIR' ? 'BERHAK' : 'TIDAK BERHAK',
      })),
    });
  } catch (err) {
    console.error('[GET /api/admin/attendance/list]', err);
    res.status(500).json({ error: 'Gagal mengambil daftar kehadiran' });
  }
});

/**
 * GET /api/admin/attendance/export-csv?group=hadir|tidak_hadir
 * Export CSV untuk LPJ — daftar hadir atau daftar tidak hadir
 */
router.get('/export-csv', async (req: Request, res: Response): Promise<void> => {
  try {
    const { group = 'hadir' } = req.query;

    const where: Prisma.ParticipantWhereInput =
      group === 'hadir'
        ? { status: ParticipantStatus.HADIR }
        : { status: { in: [ParticipantStatus.MENUNGGU_VERIFIKASI, ParticipantStatus.TERVERIFIKASI] } };

    const participants = await prisma.participant.findMany({
      where,
      orderBy: group === 'hadir' ? { checkedInAt: 'asc' } : { registeredAt: 'asc' },
      select: {
        ticketCode: true,
        nim: true,
        fullName: true,
        programStudi: true,
        campus: true,
        guestCategory: true,
        seatNumber: true,
        session: true,
        status: true,
        registeredAt: true,
        checkedInAt: true,
      },
    });

    const label = group === 'hadir' ? 'DAFTAR HADIR RESMI' : 'DAFTAR TIDAK HADIR';
    const headers = [
      'No',
      'Kode Tiket',
      'NIM',
      'Nama Lengkap',
      'Program Studi',
      'Kampus',
      'Kategori Tamu',
      'No. Kursi',
      'Sesi',
      'Status Kehadiran',
      'Hak Sertifikat',
      'Tgl Daftar',
      'Jam Check-In',
    ];

    const rows = participants.map((p, i) => [
      i + 1,
      p.ticketCode,
      p.nim,
      `"${p.fullName}"`,
      `"${p.programStudi}"`,
      `"${p.campus}"`,
      `"${p.guestCategory}"`,
      p.seatNumber,
      p.session,
      p.status === 'HADIR' ? 'HADIR' : 'TIDAK HADIR',
      p.status === 'HADIR' ? 'BERHAK' : 'TIDAK BERHAK',
      new Date(p.registeredAt).toLocaleDateString('id-ID'),
      p.checkedInAt ? new Date(p.checkedInAt).toLocaleTimeString('id-ID') : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${group === 'hadir' ? 'daftar_hadir' : 'daftar_tidak_hadir'}_HARLAH_${date}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csvContent); // BOM untuk Excel Indonesia
  } catch (err) {
    console.error('[GET /api/admin/attendance/export-csv]', err);
    res.status(500).json({ error: 'Gagal mengekspor CSV' });
  }
});

export default router;
