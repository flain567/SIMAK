/**
 * pdfDocuments.ts — Pembuat berkas unduhan asli (PDF & ZIP) untuk Portal SIMAK.
 * jspdf & jszip dimuat dynamic-import hanya saat tombol unduh diklik.
 */

import { KOPASUS_GENERATIONS } from '../data/programArchiveData';

const PRIMARY = '#760009';
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM_LIMIT = PAGE_H - 22;

type JsPDFCtor = typeof import('jspdf').jsPDF;
type JsPDFDoc = InstanceType<JsPDFCtor>;

async function loadJsPDF(): Promise<JsPDFCtor> {
  const mod = await import('jspdf');
  return mod.jsPDF;
}

/** Font standar PDF (WinAnsi) tidak mendukung tipografi Unicode tertentu. */
function sanitize(text: string): string {
  return text
    .replace(/[–—]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
}

function slugify(text: string): string {
  return sanitize(text).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_');
}

function addFooter(pdf: JsPDFDoc): void {
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor('#6b7280');
    pdf.text(
      `Portal SIMAK Institut STIAMI - Dihasilkan ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`,
      MARGIN,
      PAGE_H - 10
    );
    pdf.text(`Hal. ${i}/${pages}`, PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' });
  }
}

function addHeader(pdf: JsPDFDoc, subtitle: string): void {
  pdf.setFillColor(PRIMARY);
  pdf.rect(0, 0, PAGE_W, 30, 'F');
  pdf.setTextColor('#ffffff');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('SIMAK - Spesialisasi Mahasiswa Anti Korupsi', MARGIN, 13);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(sanitize(subtitle), MARGIN, 21);
  pdf.setTextColor('#1f2937');
}

function ensureSpace(pdf: JsPDFDoc, y: number, needed: number): number {
  if (y + needed > BOTTOM_LIMIT) {
    pdf.addPage();
    return MARGIN + 6;
  }
  return y;
}

function writeParagraph(
  pdf: JsPDFDoc,
  text: string,
  y: number,
  opts: { size?: number; bold?: boolean; color?: string; indent?: number } = {}
): number {
  const size = opts.size ?? 10;
  const lineHeight = size * 0.45;
  pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal');
  pdf.setFontSize(size);
  pdf.setTextColor(opts.color ?? '#1f2937');
  const x = MARGIN + (opts.indent ?? 0);
  const lines = pdf.splitTextToSize(sanitize(text), CONTENT_W - (opts.indent ?? 0)) as string[];
  for (const line of lines) {
    y = ensureSpace(pdf, y, lineHeight);
    pdf.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

function writeSectionTitle(pdf: JsPDFDoc, title: string, y: number): number {
  y = ensureSpace(pdf, y + 4, 12);
  pdf.setFillColor('#f3f4f6');
  pdf.rect(MARGIN, y - 4.5, CONTENT_W, 7, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(PRIMARY);
  pdf.text(sanitize(title.toUpperCase()), MARGIN + 2, y);
  pdf.setTextColor('#1f2937');
  return y + 6;
}

// ─── E-Library: PDF dokumen katalog & modul unggulan ─────────

export interface PdfDocData {
  docCode: string;
  authorDivision: string;
  title: string;
  badge: string;
  meta: string;
  desc: string;
  keyTakeaways: string[];
  chapters: { title: string; summary: string }[];
  citation: string;
}

export async function downloadPreviewPdf(data: PdfDocData): Promise<void> {
  const JsPDF = await loadJsPDF();
  const pdf = new JsPDF({ unit: 'mm', format: 'a4' });
  addHeader(pdf, `E-Library Antikorupsi - ${data.badge}`);

  let y = 42;
  y = writeParagraph(pdf, data.title, y, { size: 16, bold: true, color: PRIMARY });
  y += 2;
  y = writeParagraph(pdf, `Kode Dokumen: ${data.docCode}`, y, { size: 9, color: '#6b7280' });
  y = writeParagraph(pdf, `Penyusun: ${data.authorDivision}`, y + 0.5, { size: 9, color: '#6b7280' });
  y = writeParagraph(pdf, data.meta, y + 0.5, { size: 9, color: '#6b7280' });

  y = writeSectionTitle(pdf, 'Deskripsi Dokumen', y + 2);
  y = writeParagraph(pdf, data.desc, y, { size: 10 });

  y = writeSectionTitle(pdf, 'Poin Penting', y + 2);
  data.keyTakeaways.forEach((point, i) => {
    y = writeParagraph(pdf, `${i + 1}. ${point}`, y + 1, { size: 10, indent: 2 });
  });

  if (data.chapters.length > 0) {
    y = writeSectionTitle(pdf, 'Ringkasan Bab', y + 2);
    data.chapters.forEach((ch) => {
      y = writeParagraph(pdf, ch.title, y + 1.5, { size: 10, bold: true });
      y = writeParagraph(pdf, ch.summary, y + 0.5, { size: 9, indent: 2, color: '#4b5563' });
    });
  }

  y = writeSectionTitle(pdf, 'Kutipan Akademik (APA 7th Edition)', y + 3);
  y = writeParagraph(pdf, data.citation, y, { size: 9, color: '#4b5563' });

  y = writeSectionTitle(pdf, 'Catatan Penerbitan', y + 3);
  y = writeParagraph(
    pdf,
    'Dokumen ini dihasilkan otomatis dari katalog E-Library resmi Portal SIMAK Institut STIAMI sebagai materi edukasi antikorupsi terbuka (open access). Naskah lengkap dengan tata letak resmi tersedia melalui Divisi Litbang SIMAK.',
    y,
    { size: 9, color: '#4b5563' }
  );

  addFooter(pdf);
  pdf.save(`${slugify(data.title)}.pdf`);
}

// ─── Transparansi: PDF laporan audit buku kas ────────────────

export interface AuditLedgerRow {
  voucherCode: string;
  date: string;
  program: string;
  category: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  amountRp: string;
  amountNum?: number;
  auditorStatus: string;
}

export async function downloadAuditPdf(rows: AuditLedgerRow[]): Promise<void> {
  const JsPDF = await loadJsPDF();
  const pdf = new JsPDF({ unit: 'mm', format: 'a4' });
  addHeader(pdf, 'Laporan Audit Keuangan & Buku Kas Umum');

  const totalIn = rows.filter((r) => r.type === 'PEMASUKAN').reduce((s, r) => s + (r.amountNum ?? 0), 0);
  const totalOut = rows.filter((r) => r.type === 'PENGELUARAN').reduce((s, r) => s + (r.amountNum ?? 0), 0);
  const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  let y = 42;
  y = writeParagraph(pdf, 'Laporan Audit Keuangan SIMAK 2026', y, { size: 16, bold: true, color: PRIMARY });
  y = writeParagraph(pdf, 'Buku Kas Umum - Terverifikasi Dewan Audit & Bendahara BPH', y + 1, { size: 10, color: '#4b5563' });

  y = writeSectionTitle(pdf, 'Ringkasan Arus Kas', y + 3);
  y = writeParagraph(pdf, `Total Pemasukan: ${fmt(totalIn)}`, y, { size: 10, bold: true });
  y = writeParagraph(pdf, `Total Pengeluaran: ${fmt(totalOut)}`, y + 1, { size: 10, bold: true });
  y = writeParagraph(pdf, `Saldo Akhir: ${fmt(totalIn - totalOut)}`, y + 1, { size: 10, bold: true, color: PRIMARY });
  y = writeParagraph(pdf, `Jumlah transaksi tercatat: ${rows.length} entri buku kas.`, y + 1, { size: 9, color: '#6b7280' });

  y = writeSectionTitle(pdf, 'Rincian Transaksi', y + 3);
  rows.forEach((r) => {
    y = ensureSpace(pdf, y + 2, 20);
    y = writeParagraph(pdf, `${r.voucherCode}  -  ${r.date}  -  ${r.type}`, y, { size: 10, bold: true });
    y = writeParagraph(pdf, r.program, y + 0.5, { size: 9, indent: 2 });
    y = writeParagraph(pdf, `${r.category}  |  ${r.amountRp}  |  ${r.auditorStatus}`, y + 0.5, { size: 9, color: '#4b5563', indent: 2 });
    y += 2;
  });

  y = writeSectionTitle(pdf, 'Pernyataan Audit', y + 2);
  y = writeParagraph(
    pdf,
    'Seluruh entri di atas telah dicocokkan dengan bukti kas (kuitansi, nota, dan mutasi rekening) oleh tim audit internal SIMAK. Laporan ini dihasilkan otomatis dari data Buku Kas Umum Portal SIMAK pada tanggal unduh dan sah sebagai salinan kerja transparansi publik.',
    y,
    { size: 9, color: '#4b5563' }
  );

  addFooter(pdf);
  pdf.save(`Laporan_Audit_Keuangan_SIMAK_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Galeri: ZIP media kit & manifest arsip foto ─────────────

export async function downloadPressKitZip(): Promise<void> {
  const [{ default: JSZip }, JsPDF] = await Promise.all([import('jszip'), loadJsPDF()]);

  const pdf = new JsPDF({ unit: 'mm', format: 'a4' });
  addHeader(pdf, 'Media Kit & Press Kit Resmi 15 Tahun SIMAK');
  let y = 42;
  y = writeParagraph(pdf, 'SIMAK Media Kit - 15 Tahun Pengabdian Integritas', y, { size: 15, bold: true, color: PRIMARY });
  y = writeParagraph(
    pdf,
    'Spesialisasi Mahasiswa Anti Korupsi (SIMAK) Institut STIAMI adalah organisasi mahasiswa yang bergerak di bidang edukasi, kajian, dan advokasi antikorupsi sejak 2011. Paket ini disediakan Divisi Komunikasi & Informasi Teknologi (Komintek) untuk keperluan publikasi ilmiah, pers mahasiswa, dan penelitian.',
    y + 2,
    { size: 10 }
  );
  y = writeSectionTitle(pdf, 'Informasi Acara Terdekat', y + 2);
  y = writeParagraph(pdf, 'Puncak HARLAH SIMAK ke-16: 29 Januari 2027, 08.30-15.00 WIB, Auditorium Utama Lt. 4, Kampus Pusat Institut STIAMI, Cempaka Putih, Jakarta.', y, { size: 10 });
  y = writeSectionTitle(pdf, 'Isi Paket Arsip', y + 2);
  y = writeParagraph(pdf, '1. Press_Kit_SIMAK.pdf - profil organisasi dan informasi acara (berkas ini).', y, { size: 10 });
  y = writeParagraph(pdf, '2. manifest_arsip_foto.json - daftar lengkap foto dokumentasi resmi beserta judul, caption, dan path berkas di portal.', y + 1, { size: 10 });
  y = writeParagraph(pdf, '3. README.txt - ketentuan penggunaan aset.', y + 1, { size: 10 });

  KOPASUS_GENERATIONS.forEach((gen) => {
    const totalPhotos = gen.days.reduce((s, d) => s + d.photos.length, 0);
    y = writeSectionTitle(pdf, gen.batchName, y + 2);
    y = writeParagraph(pdf, `Tema: ${gen.theme}`, y, { size: 9 });
    y = writeParagraph(pdf, `Lokasi: ${gen.location} | Peserta: ${gen.participantCount} | Foto terkurasi: ${totalPhotos}`, y + 0.5, { size: 9, color: '#4b5563' });
    gen.days.forEach((d) => {
      y = writeParagraph(pdf, `${d.dayLabel} - ${d.title} (${d.photos.length} foto)`, y + 1, { size: 9, indent: 2 });
    });
  });

  y = writeSectionTitle(pdf, 'Kontak Resmi', y + 3);
  y = writeParagraph(pdf, 'Sekretariat SIMAK: sekretariat@simak-antikorupsi.or.id | Divisi Komintek melalui Portal SIMAK.', y, { size: 9 });
  addFooter(pdf);

  const manifest = KOPASUS_GENERATIONS.map((gen) => ({
    batch: gen.batchName,
    year: gen.year,
    theme: gen.theme,
    location: gen.location,
    participantCount: gen.participantCount,
    days: gen.days.map((d) => ({
      day: d.dayLabel,
      title: d.title,
      date: d.date,
      photos: d.photos.map((p) => ({ id: p.id, title: p.title, path: p.url, caption: p.caption })),
    })),
  }));

  const readme = [
    'SIMAK MEDIA KIT & ARSIP DOKUMENTASI',
    '===================================',
    '',
    'Paket ini dihasilkan otomatis dari Portal SIMAK Institut STIAMI.',
    '',
    'Isi:',
    '- Press_Kit_SIMAK.pdf      : profil organisasi, acara, dan ringkasan arsip.',
    '- manifest_arsip_foto.json : daftar lengkap foto resmi (judul, caption, path).',
    '',
    'Foto resolusi tinggi tersedia pada path yang tercantum di manifest,',
    'di-hosting langsung di portal SIMAK (folder /archives).',
    '',
    'Ketentuan: bebas hak cipta editorial untuk publikasi ilmiah, pers mahasiswa,',
    'dan penelitian antikorupsi dengan atribusi "Dokumentasi SIMAK Institut STIAMI".',
    '',
    `Dihasilkan: ${new Date().toLocaleString('id-ID')}`,
  ].join('\n');

  const zip = new JSZip();
  zip.file('Press_Kit_SIMAK.pdf', pdf.output('arraybuffer'));
  zip.file('manifest_arsip_foto.json', JSON.stringify(manifest, null, 2));
  zip.file('README.txt', readme);
  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'SIMAK_Media_Kit_15Tahun.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}