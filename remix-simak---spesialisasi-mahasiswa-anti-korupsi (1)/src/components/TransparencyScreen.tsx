import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';
import { getLedgerData } from '../api';

interface TransparencyScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface LedgerRow {
  id: string;
  voucherCode: string;
  date: string;
  program: string;
  category: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  amountRp: string;
  amountNum?: number;
  auditorStatus: string;
}

const LEDGER_ITEMS: LedgerRow[] = [
  {
    id: 'led-1',
    voucherCode: 'BKU-2026-001',
    date: '12 Jan 2026',
    program: 'Dana Kemahasiswaan Rektorat & Kas Mandiri Pengurus BPH',
    category: 'Riset & Operasional',
    type: 'PEMASUKAN',
    amountRp: 'Rp 28.500.000',
    amountNum: 28500000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
  {
    id: 'led-2',
    voucherCode: 'BKU-2026-004',
    date: '29 Jan 2026',
    program: 'Penyelenggaraan Seminar Nasional HARLAH SIMAK Ke-15',
    category: 'Riset & Operasional',
    type: 'PENGELUARAN',
    amountRp: 'Rp 7.450.000',
    amountNum: 7450000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
  {
    id: 'led-3',
    voucherCode: 'BKU-2026-009',
    date: '18 Mar 2026',
    program: 'Donasi Sivitas Akademika untuk Ramadhan Integrity (250 Paket)',
    category: 'Sosial & Ramadhan',
    type: 'PEMASUKAN',
    amountRp: 'Rp 19.200.000',
    amountNum: 19200000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
  {
    id: 'led-4',
    voucherCode: 'BKU-2026-010',
    date: '25 Mar 2026',
    program: 'Penyaluran 250 Paket Sembako & Santunan Yatim (0% Biaya Admin)',
    category: 'Sosial & Ramadhan',
    type: 'PENGELUARAN',
    amountRp: 'Rp 19.200.000',
    amountNum: 19200000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
  {
    id: 'led-5',
    voucherCode: 'BKU-2026-015',
    date: '14 Agu 2026',
    program: 'Pencetakan 350 Buku Saku Antikorupsi SIMAK Goes To School',
    category: 'Goes To School',
    type: 'PENGELUARAN',
    amountRp: 'Rp 5.800.000',
    amountNum: 5800000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
  {
    id: 'led-6',
    voucherCode: 'BKU-2026-021',
    date: '10 Okt 2026',
    program: 'Logistik, Modul & Sertifikasi Diklat Lapangan KOPASUS',
    category: 'KOPASUS & Kaderisasi',
    type: 'PENGELUARAN',
    amountRp: 'Rp 11.300.000',
    amountNum: 11300000,
    auditorStatus: 'Terverifikasi Nol-Selisih',
  },
];

export const TransparencyScreen: React.FC<TransparencyScreenProps> = ({ onNavigate }) => {
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ledgerRows, setLedgerRows] = useState<LedgerRow[]>(LEDGER_ITEMS);

  useEffect(() => {
    getLedgerData()
      .then((data) => {
        if (data?.entries && data.entries.length > 0) {
          const mapped: LedgerRow[] = data.entries.map((e) => ({
            id: e.id,
            voucherCode: e.voucherCode,
            date: e.date,
            program: e.program,
            category: e.category,
            type: e.type,
            amountNum: e.amount,
            amountRp: `Rp ${Number(e.amount).toLocaleString('id-ID')}`,
            auditorStatus: e.auditorStatus === 'Diverifikasi' ? 'Terverifikasi Nol-Selisih' : 'Menunggu Audit',
          }));
          setLedgerRows(mapped);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat data buku kas dari API, menggunakan data lokal:', err);
      });
  }, []);

  const filteredRows =
    selectedCat === 'Semua'
      ? ledgerRows
      : ledgerRows.filter((item) => item.category === selectedCat);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const exportLedgerCsv = () => {
    if (ledgerRows.length === 0) return;
    const headers = ['No. Bukti', 'Tanggal', 'Uraian Program', 'Kategori', 'Jenis', 'Nominal (Rp)', 'Status Audit'];
    const rows = ledgerRows.map((r) => [
      r.voucherCode,
      `"${r.date}"`,
      `"${r.program.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      r.type,
      r.amountNum ?? 0,
      `"${r.auditorStatus}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `buku_kas_umum_simak_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Laporan Buku Kas Umum berhasil diunduh (CSV).');
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-[22px]">
            verified
          </span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <section className="relative w-full bg-surface-container-lowest py-space-xl overflow-hidden border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin relative z-10">
          <nav className="flex items-center gap-space-xs mb-space-md text-secondary font-label-md text-label-md">
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Beranda
            </button>
            <span>/</span>
            <span className="text-on-surface font-semibold">
              Laporan Keuangan Terbuka &amp; Audit Kinerja
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">fact_check</span>
                Standar Akuntabilitas Nol-Selisih (Zero-Discrepancy Audit)
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                Transparansi Anggaran &amp; Audit Kinerja SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Sebagai pelopor gerakan mahasiswa antikorupsi, SIMAK mempublikasikan seluruh neraca kas, sumber pendanaan kegiatan, serta bukti pengeluaran secara terbuka dan dapat diaudit oleh publik.
              </p>
            </div>

            <div data-gsap="hero-media" className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3">
              <button
                type="button"
                onClick={() =>
                  triggerToast('Mengunduh Laporan_Audit_Keuangan_SIMAK_2026_Signed.pdf (4.2 MB)...')
                }
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Unduh Neraca Audit Lengkap (PDF)
              </button>
            </div>
          </div>

          {/* 4 Financial KPI Cards */}
          <div data-gsap="stagger-grid" className="mt-space-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-5 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                Total Dana Terhimpun (2026)
              </span>
              <div className="font-headline-md text-headline-md font-extrabold text-primary tabular-nums">
                Rp 47.700.000
              </div>
              <span className="font-label-sm text-label-sm text-secondary">
                100% Bebas Sponsor Konflik Kepentingan
              </span>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                Realisasi Program Kerja
              </span>
              <div className="font-headline-md text-headline-md font-extrabold text-on-surface tabular-nums">
                Rp 43.750.000
              </div>
              <span className="font-label-sm text-label-sm text-secondary">
                91,7% Serapan Langsung Kegiatan
              </span>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                Saldo Kas Berjalan
              </span>
              <div className="font-headline-md text-headline-md font-extrabold text-tertiary tabular-nums">
                Rp 3.950.000
              </div>
              <span className="font-label-sm text-label-sm text-secondary">
                Rekening Organisasi Terverifikasi
              </span>
            </div>
            <div className="p-5 rounded-xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-label-sm uppercase text-secondary font-bold">
                Opini Dewan Etik &amp; Audit
              </span>
              <div className="font-headline-md text-headline-md font-extrabold text-primary">
                Wajar Tanpa Pengecualian
              </div>
              <span className="font-label-sm text-label-sm text-secondary">
                Bendahara Umum: Rusni Ariantika
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ledger Table Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Buku Kas Umum (BKU) Terbuka Periode 2026
            </h2>
            <p className="font-body-md text-body-md text-secondary">
              Setiap transaksi dilengkapi nomor kuitansi resmi dan telah diverifikasi silang oleh Sekretaris Jenderal &amp; Dewan Pembina.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              'Semua',
              'KOPASUS & Kaderisasi',
              'Sosial & Ramadhan',
              'Goes To School',
              'Riset & Operasional',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-2 rounded-lg font-label-md text-label-md font-semibold transition-all cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={exportLedgerCsv}
              className="px-3.5 py-2 rounded-lg font-label-md text-label-md font-bold bg-primary text-on-primary hover:bg-primary-container transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Unduh Laporan Kas Format CSV"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Unduh CSV</span>
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-surface-container-high">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider border-b border-surface-container-high">
                  <th className="py-3.5 px-4">No. Bukti</th>
                  <th className="py-3.5 px-4">Tanggal</th>
                  <th className="py-3.5 px-4">Uraian Program &amp; Alokasi</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Jenis</th>
                  <th className="py-3.5 px-4 text-right">Nominal</th>
                  <th className="py-3.5 px-4 text-center">Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-body-md text-body-md">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-primary whitespace-nowrap">
                      {row.voucherCode}
                    </td>
                    <td className="py-3.5 px-4 text-secondary whitespace-nowrap">{row.date}</td>
                    <td className="py-3.5 px-4 font-semibold text-on-surface">{row.program}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm whitespace-nowrap">
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                          row.type === 'PEMASUKAN'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-primary-fixed text-on-primary-fixed'
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-on-surface tabular-nums whitespace-nowrap">
                      {row.amountRp}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-bold">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        {row.auditorStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
