import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, WhistleblowerReport } from '../types';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';
import { submitWbsReport, trackWbsReport, getAllReportsLocal } from '../api/wbs';
import { IS_BACKEND_ENABLED } from '../api/client';
import { maskTrackingCode } from '../utils/wbsCrypto';

interface WhistleblowerScreenProps {
  reports: WhistleblowerReport[];
  onAddReport: (report: WhistleblowerReport) => void;
  onNavigate: (screen: ScreenId) => void;
}

const CATEGORIES: WhistleblowerReport['category'][] = [
  'Pungutan Liar (Pungli)',
  'Gratifikasi & Suap Akademik',
  'Penyelewengan Dana Kegiatan',
  'Konflik Kepentingan',
  'Pelanggaran Etik Kader',
];

export const WhistleblowerScreen: React.FC<WhistleblowerScreenProps> = ({
  reports,
  onAddReport,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'track'>('form');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterIdentity, setReporterIdentity] = useState('');
  const [category, setCategory] = useState<WhistleblowerReport['category']>(CATEGORIES[0]);
  const [unitReported, setUnitReported] = useState('');
  const [incidentDate, setIncidentDate] = useState('2026-10-15');
  const [summary, setSummary] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [createdReport, setCreatedReport] = useState<WhistleblowerReport | null>(null);

  // Tracking lookup state
  const [trackInput, setTrackInput] = useState('');
  const [trackedReport, setTrackedReport] = useState<WhistleblowerReport | null>(
    reports.find((r) => !r.encryptedPayload) || null
  );
  const [trackNotFound, setTrackNotFound] = useState(false);
  const [encryptedHint, setEncryptedHint] = useState(false);
  const [displayReports, setDisplayReports] = useState<WhistleblowerReport[]>(reports);
  const trackInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayReports(reports);
  }, [reports]);

  const openTrackTab = () => {
    setActiveTab('track');
    if (!IS_BACKEND_ENABLED) {
      const local = getAllReportsLocal();
      if (local.length > 0) setDisplayReports(local);
    }
  };

  const [isSubmittingWbs, setIsSubmittingWbs] = useState(false);
  const [wbsSubmitError, setWbsSubmitError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitReported.trim() || !summary.trim()) return;
    if (summary.trim().length < 50) {
      setWbsSubmitError('Kronologi kejadian minimal 50 karakter.');
      return;
    }

    setIsSubmittingWbs(true);
    setWbsSubmitError('');

    try {
      const { trackingCode, report } = await submitWbsReport({
        category,
        unitReported: unitReported.trim(),
        incidentDate,
        summary: summary.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        isAnonymous,
        reporterIdentity: !isAnonymous ? reporterIdentity.trim() : undefined,
      });

      const storedReport: WhistleblowerReport = {
        ...report,
        resolutionNote:
          'Laporan telah masuk ke brankas terenkripsi Satgas Advokasi & Dewan Etik SIMAK. Sedang dilakukan telaah bukti awal.',
      };

      // Tampilan untuk pelapor sendiri: isi lengkap tetap terlihat di perangkatnya,
      // record yang disimpan/publik hanya berisi ciphertext.
      const visibleReport: WhistleblowerReport = {
        ...storedReport,
        summary: summary.trim(),
        evidenceUrl: evidenceUrl.trim() || undefined,
        reporterIdentity: isAnonymous
          ? 'Anonim Terenkripsi (AES-256-GCM)'
          : reporterIdentity.trim() || 'Pelapor Terverifikasi (Dirahasiakan)',
      };

      onAddReport(storedReport);
      setCreatedReport(visibleReport);
      setTrackedReport(visibleReport);
      setTrackInput(trackingCode);
      setUnitReported('');
      setSummary('');
      setEvidenceUrl('');
    } catch (err: any) {
      setWbsSubmitError(err?.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsSubmittingWbs(false);
    }
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackInput.trim().toUpperCase();
    if (!q) return;

    // Validasi format: WBS-YYYY-XXXX (demo lama) atau WBS-YYYY-XXXXXXXXXXXX (terenkripsi)
    if (!/^WBS-\d{4}-(?:[A-F0-9]{4}|[A-F0-9]{12})$/i.test(q)) {
      setTrackNotFound(true);
      return;
    }

    setIsTracking(true);
    try {
      const found = await trackWbsReport(q);
      if (found) {
        setTrackedReport(found);
        setTrackNotFound(false);
        setEncryptedHint(false);
      } else {
        setTrackedReport(null);
        setTrackNotFound(true);
      }
    } catch {
      setTrackedReport(null);
      setTrackNotFound(true);
    } finally {
      setIsTracking(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Top Heritage Scrim & Institutional Header */}
      <section className="relative w-full bg-surface-container-lowest py-space-xl overflow-hidden border-b border-surface-container-high">
        <div
          data-gsap="parallax"
          className="absolute right-0 top-0 w-96 h-96 opacity-[0.035] pointer-events-none text-primary select-none"
        >
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 400 400">
            <path d="M0,100 C80,70 120,130 200,100 C280,70 320,130 400,100 L400,0 L0,0 Z"></path>
            <path d="M0,200 C80,170 120,230 200,200 C280,170 320,230 400,200 L400,100 C320,130 280,70 200,100 C120,130 80,70 0,100 Z"></path>
            <path d="M0,300 C80,270 120,330 200,300 C280,270 320,330 400,300 L400,200 C320,230 280,170 200,200 C120,230 80,170 0,200 Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin relative z-10">
          {/* Breadcrumb */}
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
              Kanal Whistleblowing &amp; Pengaduan Integritas
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">security</span>
                Perlindungan Saksi &amp; Pelapor Terenkripsi (AES-256-GCM)
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                Whistleblowing System (WBS) SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Saluran resmi pengaduan pelanggaran integritas, pungutan liar, gratifikasi akademik, dan penyimpangan anggaran kemahasiswaan. Identitas pelapor dijamin kerahasiaannya oleh Dewan Etik &amp; Satgas Advokasi SIMAK.
              </p>
            </div>

            <div data-gsap="hero-media" className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                Buat Laporan Pengaduan
              </button>
              <button
                type="button"
                onClick={openTrackTab}
                className={`px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'track'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">manage_search</span>
                Lacak Kode Laporan ({displayReports.length})
              </button>
            </div>
          </div>

          {/* 4 Guarantees Bar */}
          <div className="mt-space-lg grid grid-cols-2 lg:grid-cols-4 gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  100% Anonim
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Tanpa Log IP Pelapor
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  AES-256-GCM Vault
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Enkripsi Bukti Digital
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Independen
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Bebas Intervensi Birokrasi
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  3x24 Jam
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Respon Telaah Awal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl w-full">
        {activeTab === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Formulir Pengaduan Terenkripsi
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-0.5">
                    Sampaikan Laporan Dugaan Pelanggaran
                  </h2>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">shield_lock</span>
              </div>

              {createdReport && (
                <div className="p-5 rounded-xl bg-primary-fixed/50 border border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 font-label-md text-label-md font-bold text-primary uppercase">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      Laporan Berhasil Diterima &amp; Dienkripsi
                    </span>
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded bg-primary text-on-primary">
                      {createdReport.trackingCode}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface">
                    Simpan Kode Lacak <strong>{createdReport.trackingCode}</strong> di atas untuk memantau perkembangan investigasi laporan Anda secara berkala tanpa harus masuk akun.
                  </p>
                  <button
                    type="button"
                    onClick={openTrackTab}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">manage_search</span>
                    Pantau Status Investigasi Sekarang
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mode Pelapor */}
                <div className="space-y-2">
                  <label className="font-label-md text-label-md font-bold text-on-surface block">
                    1. Pilih Mode Kerahasiaan Pelapor
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(true)}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isAnonymous
                          ? 'bg-primary-fixed/40 border-primary text-on-surface'
                          : 'bg-surface-container-low border-transparent text-secondary hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between font-label-md text-label-md font-bold text-on-surface">
                        <span>Anonim Penuh (Disarankan)</span>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          visibility_off
                        </span>
                      </div>
                      <p className="font-label-sm text-label-sm text-secondary font-normal mt-1">
                        Nama, NIM, dan kontak tidak direkam sama sekali.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAnonymous(false)}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                        !isAnonymous
                          ? 'bg-primary-fixed/40 border-primary text-on-surface'
                          : 'bg-surface-container-low border-transparent text-secondary hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-center justify-between font-label-md text-label-md font-bold text-on-surface">
                        <span>Pelapor Terverifikasi</span>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          verified_user
                        </span>
                      </div>
                      <p className="font-label-sm text-label-sm text-secondary font-normal mt-1">
                        Identitas hanya diketahui Ketua Dewan Etik untuk klarifikasi.
                      </p>
                    </button>
                  </div>
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                      Nama / Kontak Rahasia (Hanya Diakses Dewan Etik)
                    </label>
                    <input
                      type="text"
                      value={reporterIdentity}
                      onChange={(e) => setReporterIdentity(e.target.value)}
                      placeholder="Cth: Mahasiswa Aktif / 0812xxxx (Opsional)"
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                      2. Kategori Dugaan Pelanggaran
                    </label>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as WhistleblowerReport['category'])
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                      3. Tanggal / Waktu Perkiraan Kejadian
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                    4. Unit / Oknum / Kegiatan yang Dilaporkan
                  </label>
                  <input
                    type="text"
                    required
                    value={unitReported}
                    onChange={(e) => setUnitReported(e.target.value)}
                    placeholder="Cth: Panitia Kegiatan X / Oknum Layanan Administrasi Gedung B"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                    5. Uraian Kronologi &amp; Indikasi Kerugian / Pelanggaran
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Jelaskan secara objektif kronologi kejadian, modus pungutan/penyimpangan, serta saksi atau bukti dokumen yang Anda ketahui..."
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-label-sm font-bold text-secondary uppercase block mb-1.5">
                    6. Tautan Bukti Dokumen / Foto / Rekaman (Opsional)
                  </label>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="https://drive.google.com/... (Kwitansi, Screenshot, atau Dokumen)"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Kirim Laporan Terenkripsi &amp; Terbitkan Kode Lacak
                </button>
              </form>
            </div>

            {/* Right Info Column: Prosedur & Perlindungan */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  Protokol Perlindungan Pelapor
                </div>
                <h3 className="font-headline-md text-headline-md font-bold leading-snug">
                  “Berani Melaporkan Ketidakjujuran Adalah Wujud Tertinggi Bela Kampus &amp; Negara.”
                </h3>
                <p className="font-body-md text-body-md text-on-primary-container leading-relaxed">
                  Berdasarkan Ketetapan BPH &amp; AD/ART SIMAK Pasal 24, setiap pelapor beritikad baik berhak atas pendampingan advokasi penuh dan jaminan kerahasiaan identitas dari segala bentuk intimidasi akademik.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Tahapan Penanganan Laporan WBS
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      step: '01',
                      title: 'Penerimaan & Enkripsi Laporan',
                      desc: 'Sistem menghapus metadata pelapor dan menerbitkan kode unik WBS-2026.',
                    },
                    {
                      step: '02',
                      title: 'Verifikasi & Audit Bukti Awal',
                      desc: 'Tim Satgas Advokasi memeriksa kelengkapan bukti permulaan dalam 3x24 jam.',
                    },
                    {
                      step: '03',
                      title: 'Investigasi & Gelar Perkara Etik',
                      desc: 'Klarifikasi silang dan audit forensik laporan keuangan/kebijakan terkait.',
                    },
                    {
                      step: '04',
                      title: 'Rekomendasi Tindakan & Publikasi',
                      desc: 'Penyerahan rekomendasi sanksi ke pimpinan institusi/Dewan Kehormatan.',
                    },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low"
                    >
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {s.step}
                      </span>
                      <div>
                        <div className="font-label-md text-label-md font-bold text-on-surface">
                          {s.title}
                        </div>
                        <p className="font-body-md text-body-md text-secondary text-xs mt-0.5">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: LACAK STATUS LAPORAN */
          <div className="space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Pelacakan Status Investigasi Mandiri
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    Cek Progres Tindak Lanjut Laporan WBS
                  </h2>
                </div>
                <form onSubmit={handleTrackSearch} className="flex items-center gap-2 w-full md:w-96">
                  <input
                    ref={trackInputRef}
                    type="text"
                    value={trackInput}
                    onChange={(e) => {
                      setTrackInput(e.target.value);
                      setEncryptedHint(false);
                    }}
                    placeholder="Kode Lacak (Cth: WBS-2026-A1B2C3D4E5F6)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer shrink-0"
                  >
                    Lacak
                  </button>
                </form>
              </div>

              {trackNotFound && (
                <div className="p-4 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md">
                  Kode laporan tidak ditemukan. Periksa kembali kode lacak yang Anda terima saat mengirim laporan.
                </div>
              )}

              {encryptedHint && (
                <div className="p-4 rounded-xl bg-primary-fixed/50 border border-primary/30 text-on-surface font-label-md text-label-md">
                  Laporan ini terenkripsi AES-256-GCM. Masukkan kode lacak lengkap yang diterima pelapor untuk membuka status dan isi laporan.
                </div>
              )}

              {trackedReport && (
                <div className="p-6 rounded-2xl bg-surface-container-low space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-base">
                          {trackedReport.trackingCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">
                          {trackedReport.status}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                        {trackedReport.category} — {trackedReport.unitReported}
                      </h3>
                    </div>
                    <div className="text-right font-label-sm text-label-sm text-secondary">
                      <div>Tanggal Lapor: {trackedReport.submittedAt}</div>
                      <div>Mode: {trackedReport.reporterIdentity}</div>
                    </div>
                  </div>

                  {trackedReport.summary && trackedReport.summary !== '(enkripsi server)' && (
                    <div className="p-4 rounded-xl bg-surface-container-lowest space-y-1">
                      <div className="font-label-sm text-label-sm uppercase text-primary font-bold">
                        Kronologi Laporan (Terbuka dengan Kode Lacak):
                      </div>
                      <p className="font-body-md text-body-md text-on-surface">
                        {trackedReport.summary}
                      </p>
                      {trackedReport.evidenceUrl && (
                        <a
                          href={trackedReport.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-bold hover:underline mt-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">attach_file</span>
                          Tautan Bukti Dokumen
                        </a>
                      )}
                    </div>
                  )}

                  {/* Stepper Progress */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { step: 1, label: '1. Laporan Diterima' },
                      { step: 2, label: '2. Verifikasi Bukti' },
                      { step: 3, label: '3. Investigasi Satgas' },
                      { step: 4, label: '4. Selesai Ditindaklanjuti' },
                    ].map((st) => {
                      const passed = trackedReport.progressStep >= st.step;
                      return (
                        <div
                          key={st.step}
                          className={`p-3 rounded-xl flex items-center gap-2 font-label-md text-label-md font-bold ${
                            passed
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'bg-surface-container-lowest text-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {passed ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>{st.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-lowest space-y-1">
                    <div className="font-label-sm text-label-sm uppercase text-primary font-bold">
                      Catatan Resmi Satgas Advokasi &amp; Dewan Etik:
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">
                      {trackedReport.resolutionNote}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Public Anonymized Case Log */}
            <div className="space-y-4">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Log Penanganan Pengaduan Publik (Identitas Disensor)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayReports.map((rep) => {
                  const isEncrypted = Boolean(rep.encryptedPayload);
                  return (
                    <div
                      key={rep.id}
                      onClick={() => {
                        if (isEncrypted) {
                          setTrackedReport(null);
                          setTrackInput('');
                          setTrackNotFound(false);
                          setEncryptedHint(true);
                          trackInputRef.current?.focus();
                          return;
                        }
                        setTrackedReport(rep);
                        setTrackInput(rep.trackingCode);
                        setTrackNotFound(false);
                        setEncryptedHint(false);
                      }}
                      className={`p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3 border ${
                        trackedReport?.id === rep.id ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-primary">
                            {maskTrackingCode(rep.trackingCode)}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                            {rep.status}
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                          {rep.category}
                        </h4>
                        <p className="font-body-md text-body-md text-secondary line-clamp-2">
                          {isEncrypted
                            ? 'Isi laporan terenkripsi AES-256-GCM. Masukkan kode lacak lengkap untuk membuka detail.'
                            : rep.summary}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-surface-container flex items-center justify-between font-label-sm text-label-sm text-primary font-bold">
                        <span>{rep.submittedAt}</span>
                        <span className="flex items-center gap-1">
                          {isEncrypted ? 'Buka dengan Kode' : 'Lihat Detail'}{' '}
                          <span className="material-symbols-outlined text-[15px]">
                            {isEncrypted ? 'lock' : 'arrow_forward'}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
