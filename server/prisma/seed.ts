import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database Portal SIMAK...');

  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@simak.ac.id';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SimakAdmin2026!';
  const hash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: hash, role: 'ADMIN' },
  });
  console.log(`✅ Admin user: ${adminEmail}`);

  // --- Library documents (dari mockData) ---
  const docs = [
    {
      code: 'MODUL-DIKLAT-001',
      title: 'Modul Diklat Antikorupsi: Integritas dalam Kehidupan Kampus',
      subtitle: 'Panduan Lengkap bagi Kader SIMAK Angkatan 2026',
      author: 'Tim Redaksi SIMAK STIAMI',
      category: 'Modul_Diklat' as const,
      year: '2026',
      pages: 112,
      fileSize: '4.2 MB',
      abstract: 'Modul ini dirancang sebagai panduan komprehensif bagi kader SIMAK dalam memahami dan menginternalisasi nilai-nilai antikorupsi dalam kehidupan sehari-hari di kampus.',
      keyTakeaways: ['Memahami 9 nilai antikorupsi KPK', 'Strategi pencegahan korupsi di lingkungan kampus', 'Studi kasus gratifikasi akademik'],
      featured: true,
    },
    {
      code: 'KAJIAN-STRAT-001',
      title: 'Kajian Strategis: Peta Risiko Korupsi di Perguruan Tinggi Indonesia',
      subtitle: 'Analisis Komprehensif 2024-2026',
      author: 'Satgas Riset & Advokasi SIMAK',
      category: 'Kajian_Strategis' as const,
      year: '2025',
      pages: 68,
      fileSize: '2.8 MB',
      abstract: 'Kajian ini memetakan risiko korupsi di 78 perguruan tinggi di Indonesia berdasarkan data LHKPN, laporan BPK, dan investigasi jurnalisme data.',
      keyTakeaways: ['Peta risiko korupsi PT Indonesia', 'Indeks transparansi anggaran kampus', 'Rekomendasi kebijakan pencegahan'],
      featured: true,
    },
    {
      code: 'REG-UU-001',
      title: 'Kompilasi Regulasi Antikorupsi Indonesia',
      subtitle: 'UU Tipikor, Gratifikasi, & Whistleblower Protection Act',
      author: 'Tim Legal SIMAK',
      category: 'Regulasi_UU' as const,
      year: '2024',
      pages: 240,
      fileSize: '8.1 MB',
      abstract: 'Kompilasi lengkap regulasi antikorupsi Indonesia mencakup UU No. 31/1999, UU No. 20/2001, PP Gratifikasi, dan perlindungan pelapor.',
      keyTakeaways: ['UU Tipikor lengkap dengan penjelasan', 'Panduan pelaporan gratifikasi KPK', 'Hak-hak perlindungan saksi & pelapor'],
      featured: false,
    },
  ];

  for (const doc of docs) {
    await prisma.libraryDocument.upsert({
      where: { code: doc.code },
      update: {},
      create: { ...doc, keyTakeaways: doc.keyTakeaways },
    });
  }
  console.log(`✅ Library documents: ${docs.length} dokumen`);

  // --- Ledger entries (data transparansi keuangan) ---
  const ledgerEntries = [
    { voucherCode: 'PKT-HRL-001', program: 'HARLAH SIMAK', category: 'Dana Iuran Kader', type: 'PEMASUKAN' as const, amount: BigInt(15000000), auditorStatus: 'Diverifikasi' as const, createdBy: 'admin@simak.ac.id' },
    { voucherCode: 'PKT-HRL-002', program: 'HARLAH SIMAK', category: 'Sponsorship UMKM Kampus', type: 'PEMASUKAN' as const, amount: BigInt(8500000), auditorStatus: 'Diverifikasi' as const, createdBy: 'admin@simak.ac.id' },
    { voucherCode: 'PKT-HRL-003', program: 'HARLAH SIMAK', category: 'Sewa Aula & Dekorasi', type: 'PENGELUARAN' as const, amount: BigInt(7200000), auditorStatus: 'Diverifikasi' as const, createdBy: 'admin@simak.ac.id' },
    { voucherCode: 'PKT-HRL-004', program: 'HARLAH SIMAK', category: 'Konsumsi & Katering', type: 'PENGELUARAN' as const, amount: BigInt(5400000), auditorStatus: 'Menunggu_Audit' as const, createdBy: 'admin@simak.ac.id' },
    { voucherCode: 'PKT-HRL-005', program: 'HARLAH SIMAK', category: 'Percetakan & Merchandise', type: 'PENGELUARAN' as const, amount: BigInt(3100000), auditorStatus: 'Menunggu_Audit' as const, createdBy: 'admin@simak.ac.id' },
  ];

  for (const entry of ledgerEntries) {
    await prisma.ledgerEntry.upsert({
      where: { voucherCode: entry.voucherCode },
      update: {},
      create: { ...entry, date: new Date('2026-10-01') },
    });
  }
  console.log(`✅ Ledger entries: ${ledgerEntries.length} entri`);

  // --- Gallery items ---
  const galleryItems = [
    {
      title: 'HARLAH SIMAK ke-16',
      category: 'HARLAH',
      date: new Date('2027-01-29'),
      participantsCount: 0,
      description: 'Hari Ulang Tahun ke-16 Spesialisasi Mahasiswa Anti Korupsi Institut STIAMI.',
      featured: true,
    },
    {
      title: 'Diklat Pembentukan Kader Angkatan 2026',
      category: 'Diklat',
      date: new Date('2026-08-15'),
      participantsCount: 48,
      description: 'Diklat Pembentukan Kader SIMAK Angkatan 2026 yang berlangsung selama 3 hari.',
      featured: false,
    },
    {
      title: 'Kajian Kebijakan Antikorupsi 2026',
      category: 'Kajian',
      date: new Date('2026-09-20'),
      participantsCount: 85,
      description: 'Forum kajian kebijakan antikorupsi bersama narasumber dari KPK dan akademisi.',
      featured: false,
    },
  ];

  for (const item of galleryItems) {
    const existing = await prisma.galleryItem.findFirst({ where: { title: item.title } });
    if (!existing) await prisma.galleryItem.create({ data: item });
  }
  console.log(`✅ Gallery items: ${galleryItems.length} item`);

  console.log('\n🎉 Seeding selesai!');
  console.log(`📧 Admin: ${adminEmail}`);
  console.log(`🔑 Password: ${adminPassword}`);
  console.log('⚠️  GANTI PASSWORD SETELAH LOGIN PERTAMA!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
