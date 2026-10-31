import React, { useState, useRef } from 'react';
import { ParticipantRecord, ScreenId } from '../types';
import { INTEGRITY_QUIZ_QUESTIONS } from '../data/mockData';
import { QrCodeGraphic } from './QrCodeGraphic';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';

interface ExamCardScreenProps {
  participants: ParticipantRecord[];
  activeParticipant: ParticipantRecord;
  onSelectParticipant: (p: ParticipantRecord) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ExamCardScreen: React.FC<ExamCardScreenProps> = ({
  participants,
  activeParticipant,
  onSelectParticipant,
  onNavigate,
}) => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    INTEGRITY_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correct += 1;
    });
    return Math.round((correct / INTEGRITY_QUIZ_QUESTIONS.length) * 100);
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Institutional Heritage Header */}
      <section className="relative w-full bg-surface-container-lowest py-space-xl overflow-hidden border-b border-surface-container-high print:hidden">
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

        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin relative z-10 space-y-6">
          <nav className="flex items-center gap-space-xs text-secondary font-label-md text-label-md">
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
              Kartu Tanda Peserta Ujian (KTPU) KOPASUS
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">badge</span>
                Dokumen Kredensial Seleksi Kader KOPASUS 2026
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-extrabold text-on-surface tracking-tight">
                Kartu Tanda Peserta Ujian (KTPU) SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Kartu ini wajib dicetak atau ditunjukkan secara digital kepada pengawas ruangan saat
                pelaksanaan <strong className="text-on-surface">Tes Tertulis &amp; Wawancara Integritas</strong>.
              </p>
            </div>

            <div data-gsap="hero-media" className="lg:col-span-4 flex flex-wrap lg:flex-col gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowQuizModal(true);
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                }}
                className="px-5 py-3 rounded-xl bg-tertiary text-on-tertiary font-bold text-label-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">quiz</span>
                <span>Simulasi Tes Antikorupsi</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">print</span>
                <span>Cetak Kartu Ujian (PDF)</span>
              </button>
            </div>
          </div>

          {/* Participant Selector */}
          <div className="pt-4 border-t border-outline-variant/40 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mr-2">
              Pilih Kandidat Ujian:
            </span>
            {participants.map((p) => {
              const active = p.id === activeParticipant.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectParticipant(p)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="font-mono">{p.examNumber}</span>
                  <span>—</span>
                  <span>{p.fullName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl space-y-10 w-full">
        {/* Notice Banner: KOPASUS Exam Completed, HARLAH Guests use E-Tiket */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[22px] mt-0.5">
              inventory_2
            </span>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Mode Arsip Seleksi KOPASUS (Telah Terlaksana)
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Halaman Kartu Ujian (KTPU) ini merupakan <strong>arsip peserta seleksi KOPASUS periode lalu</strong>. Bagi <strong>Tamu Undangan Acara HARLAH SIMAK (29 Januari)</strong>, tidak terdapat ujian seleksi dan cukup menggunakan <strong>E-Tiket Tamu Undangan</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('etiket')}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shrink-0 hover:bg-primary-container transition-colors cursor-pointer"
          >
            Buka E-Tiket Tamu HARLAH
          </button>
        </div>

      {/* OFFICIAL EXAMINATION CARD DOCUMENT */}
      <section className="bg-surface-container-lowest rounded-2xl border-2 border-primary/80 shadow-xl overflow-hidden">
        {/* Official Institutional Letterhead */}
        <div className="bg-primary text-on-primary p-6 sm:px-8 border-b-4 border-on-tertiary-container flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px] text-on-tertiary-container">
                account_balance
              </span>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary-fixed">
                PANITIA SELEKSI PENERIMAAN KADER BARU BATCH VIII
              </div>
              <h2 className="text-headline-sm sm:text-headline-md font-extrabold text-white tracking-tight">
                SPESIALISASI MAHASISWA ANTI KORUPSI (SIMAK) — INSTITUT STIAMI
              </h2>
              <div className="text-xs text-primary-fixed/90">
                Sekretariat: Gedung PKM Lt. 2 Kampus Pusat Jl. Pangkalan Asem Raya No. 55, Jakarta
                Pusat
              </div>
            </div>
          </div>

          <div className="bg-white text-on-surface px-4 py-2.5 rounded-xl border border-outline-variant text-right shrink-0">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
              NOMOR PESERTA UJIAN
            </div>
            <div className="font-mono text-xl font-extrabold text-on-surface">
              {activeParticipant.examNumber}
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 4 Cols: Candidate Portrait & QR Validation */}
          <div className="lg:col-span-4 flex flex-col items-center justify-between bg-surface-container-low rounded-xl p-6 border border-outline-variant/50 text-center space-y-6">
            <div className="space-y-3 w-full flex flex-col items-center">
              <div className="relative">
                <img
                  src={activeParticipant.avatarUrl}
                  alt={activeParticipant.fullName}
                  className="w-36 h-44 object-cover rounded-lg border-4 border-white shadow-md"
                />
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-primary text-on-primary text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap shadow-xs">
                  PAS FOTO 3x4 TERVERIFIKASI
                </span>
              </div>

              <div className="pt-2">
                <div className="font-extrabold text-base text-on-surface">
                  {activeParticipant.fullName}
                </div>
                <div className="font-mono text-xs font-bold text-primary">
                  NIM: {activeParticipant.nim}
                </div>
              </div>
            </div>

            <div className="w-full pt-4 border-t border-outline-variant/40 flex flex-col items-center space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                QR VALIDASI PENGAWAS UJIAN
              </div>
              <QrCodeGraphic value={activeParticipant.examNumber} size={116} />
              <div className="text-[11px] font-mono text-on-surface-variant">
                ID Tiket: {activeParticipant.ticketCode}
              </div>
            </div>

            <div className="w-full pt-4 border-t border-outline-variant/40 text-xs text-on-surface-variant space-y-1">
              <div className="font-bold text-on-surface">Status Kelayakan Ujian:</div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold text-xs">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                BERHAK MENGIKUTI SELEKSI
              </div>
            </div>
          </div>

          {/* Right 8 Cols: Candidate Details, Schedule Table & Rules */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section A: Biodata Matrix */}
            <div className="space-y-3">
              <h3 className="text-label-md uppercase tracking-widest text-primary font-extrabold border-b border-outline-variant/50 pb-2">
                A. IDENTITAS PESERTA SELEKSI KOPASUS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
                <div>
                  <div className="text-xs text-on-surface-variant">Nama Lengkap Peserta</div>
                  <div className="font-bold text-on-surface text-sm">
                    {activeParticipant.fullName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant">Nomor Induk Mahasiswa (NIM)</div>
                  <div className="font-mono font-bold text-on-surface text-sm">
                    {activeParticipant.nim} ({activeParticipant.semester})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant">Program Studi</div>
                  <div className="font-bold text-on-surface text-sm">
                    {activeParticipant.programStudi}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-on-surface-variant">Lokasi Kampus</div>
                  <div className="font-bold text-on-surface text-sm">
                    {activeParticipant.campus}
                  </div>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-outline-variant/30">
                  <div className="text-xs text-on-surface-variant">
                    Peminatan Divisi Strategis KOPASUS
                  </div>
                  <div className="font-extrabold text-primary text-sm">
                    {activeParticipant.division}
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Jadwal & Materi Ujian */}
            <div className="space-y-3">
              <h3 className="text-label-md uppercase tracking-widest text-primary font-extrabold border-b border-outline-variant/50 pb-2">
                B. JADWAL SESI &amp; MATERI UJIAN SELEKSI ({activeParticipant.examDate})
              </h3>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/50">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-container text-on-surface text-xs uppercase tracking-wider">
                      <th className="py-3 px-4 font-bold">Waktu (WIB)</th>
                      <th className="py-3 px-4 font-bold">Mata Ujian &amp; Asesmen</th>
                      <th className="py-3 px-4 font-bold">Ruangan</th>
                      <th className="py-3 px-4 font-bold text-center">Status Paraf</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40 bg-surface-container-lowest">
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-xs whitespace-nowrap">
                        08.30 – 10.00
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-on-surface">
                          Tes Tertulis Wawasan Antikorupsi (CBT)
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          9 Nilai Integritas, Dasar UU Tipikor, &amp; Pengetahuan Umum SIMAK
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        {activeParticipant.examRoom}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-[11px] font-mono text-on-surface-variant">
                          TERJADWAL
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-mono font-bold text-xs whitespace-nowrap">
                        10.15 – 11.45
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-on-surface">
                          Wawancara Integritas &amp; Studi Kasus Etika
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          Uji Komitmen Kepemimpinan &amp; Pemecahan Masalah Advokasi Kampus
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        Ruang Sidang 204 - Gd. A
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-[11px] font-mono text-on-surface-variant">
                          TERJADWAL
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section C: Tata Tertib Ujian & Pengesahan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-2">
              <div className="md:col-span-7 p-4 rounded-xl bg-primary-fixed/30 border border-primary/20 space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">gavel</span>
                  TATA TERTIB WAJIB PESERTA UJIAN
                </div>
                <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside">
                  <li>Wajib hadir 30 menit sebelum jadwal sesi dimulai.</li>
                  <li>
                    Mengenakan kemeja putih berkerah, celana/rok hitam, dan Jas Almamater STIAMI.
                  </li>
                  <li>Menjunjung tinggi kejujuran; segala bentuk kecurangan langsung gugur.</li>
                </ul>
              </div>

              <div className="md:col-span-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 text-right space-y-1">
                <div className="text-[11px] text-on-surface-variant">
                  Jakarta, Oktober 2026
                </div>
                <div className="text-xs font-bold text-on-surface">
                  Komisi Seleksi &amp; Kaderisasi SIMAK
                </div>
                <div className="py-1 text-primary font-mono text-xs font-extrabold tracking-widest">
                  [ DITANDATANGANI SECARA ELEKTRONIK ]
                </div>
                <div className="text-xs font-bold text-on-surface underline">
                  Dewan Pengurus Pusat KOPASUS STIAMI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SIMULATION QUIZ MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant shadow-2xl overflow-hidden my-8">
            <div className="bg-primary text-on-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-on-tertiary-container">quiz</span>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-primary-fixed font-bold">
                    PERSIAPAN UJIAN SELEKSI KADER KOPASUS
                  </div>
                  <h3 className="font-extrabold text-base">
                    Simulasi Tes Wawasan Antikorupsi (CBT)
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {quizSubmitted && (
                <div className="p-4 rounded-xl bg-primary-fixed/40 border border-primary/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase text-primary">
                      HASIL SIMULASI TES INTEGRITAS
                    </div>
                    <div className="text-lg font-extrabold text-on-surface">
                      Skor Anda: {calculateScore()} / 100
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="px-3.5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold cursor-pointer"
                  >
                    Ulangi Simulasi
                  </button>
                </div>
              )}

              {INTEGRITY_QUIZ_QUESTIONS.map((item, qIdx) => (
                <div
                  key={qIdx}
                  className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-3"
                >
                  <div className="font-bold text-sm text-on-surface">
                    {qIdx + 1}. {item.question}
                  </div>
                  <div className="space-y-2">
                    {item.options.map((opt, optIdx) => {
                      const isChosen = selectedAnswers[qIdx] === optIdx;
                      const isCorrect = item.correctIndex === optIdx;
                      let btnStyle =
                        'border-outline-variant/50 bg-surface-container-lowest hover:border-primary';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'border-error bg-error-container/50 text-on-error-container';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-primary bg-primary-fixed/40 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                              check_circle
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="p-3 rounded-lg bg-surface-container text-xs text-on-surface-variant">
                      <strong>Pembahasan:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('elibrary')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Pelajari Modul Lengkap di E-Library</span>
              </button>

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container cursor-pointer"
                >
                  Periksa Jawaban Simulasi
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="px-5 py-2.5 rounded-lg bg-inverse-surface text-white text-xs font-bold cursor-pointer"
                >
                  Selesai &amp; Tutup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
