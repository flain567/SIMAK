import React, { useState, useRef } from 'react';
import { ParticipantRecord, ScreenId } from '../types';
import { QrCodeGraphic } from './QrCodeGraphic';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';
import {
  downloadHarlahIcsFile,
  getGoogleCalendarHarlahUrl,
  getWhatsAppShareText,
  getWhatsAppShareUrl,
} from '../utils/calendarAndShare';

interface ETicketScreenProps {
  participants: ParticipantRecord[];
  activeParticipant: ParticipantRecord;
  onSelectParticipant: (p: ParticipantRecord) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ETicketScreen: React.FC<ETicketScreenProps> = ({
  participants,
  activeParticipant,
  onSelectParticipant,
  onNavigate,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'ticket' | 'certificate'>('ticket');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'found' | 'not-found'>('idle');
  const [scanVerifiedToast, setScanVerifiedToast] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);
  const [icsDownloaded, setIcsDownloaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  const handleCopyWaInvite = () => {
    navigator.clipboard?.writeText(getWhatsAppShareText(activeParticipant));
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 2800);
  };

  const handleDownloadCalendarIcs = () => {
    downloadHarlahIcsFile(activeParticipant);
    setIcsDownloaded(true);
    setTimeout(() => setIcsDownloaded(false), 3200);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const match = participants.find(
      (p) =>
        p.nim.toLowerCase().includes(q) ||
        p.whatsapp.toLowerCase().includes(q) ||
        p.ticketCode.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q)
    );

    if (match) {
      onSelectParticipant(match);
      setSearchStatus('found');
    } else {
      setSearchStatus('not-found');
    }
  };

  const handlePrintPass = () => {
    window.print();
  };

  const handleSimulateScan = () => {
    setScanVerifiedToast(true);
    setTimeout(() => setScanVerifiedToast(false), 4000);
  };

  const isHarlahGuest =
    activeParticipant.ticketCode.startsWith('GUEST-') ||
    activeParticipant.registrationType === 'Open House SIMAK';

  const certificateNumber = isHarlahGuest
    ? `SERT/SIMAK/HARLAH-29JAN/${activeParticipant.nim}`
    : `SERT/SIMAK-XVI/KOPASUS/2026/${activeParticipant.nim}`;

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Top Heritage Header (Hidden when printing) */}
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
              Layanan Mandiri E-Tiket &amp; Sertifikat Integritas
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                Otentikasi Kredensial &amp; Boarding Pass Peserta
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                E-Tiket Kegiatan &amp; Piagam Integritas SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Cek status kepesertaan menggunakan <strong className="text-on-surface">NIM</strong>,{' '}
                <strong className="text-on-surface">Nomor WhatsApp</strong>, atau{' '}
                <strong className="text-on-surface">Kode Tiket</strong>, lalu unduh E-Tiket maupun Piagam Sertifikat KOPASUS resmi ber-QR Code.
              </p>
            </div>

            <div
              data-gsap="hero-media"
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-end"
            >
              <button
                type="button"
                onClick={() => setActiveDocTab('ticket')}
                className={`px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeDocTab === 'ticket'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                <span>Boarding Pass E-Tiket</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('certificate')}
                className={`px-5 py-3 rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeDocTab === 'certificate'
                    ? 'bg-primary-container text-on-primary shadow-md'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                <span>Piagam &amp; Sertifikat Resmi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl space-y-10 w-full">
        {/* SELF-SERVICE CEK E-TIKET & PIAGAM LOOKUP PANEL */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 sm:p-8 shadow-xs space-y-6 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-headline-md font-extrabold text-on-surface">
                Pencarian Cepat Data Peserta &amp; Alumni
              </h2>
              <p className="text-body-md text-on-surface-variant mt-0.5">
                Pilih peserta terdaftar di bawah atau ketik NIM / Nomor WhatsApp untuk menampilkan dokumen.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('kartu-ujian')}
              className="self-start lg:self-auto px-4 py-2.5 rounded-lg bg-secondary-container text-on-secondary-fixed font-bold text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">badge</span>
              <span>Beralih ke Kartu Ujian Seleksi (KTPU)</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2 text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchStatus('idle');
                }}
                placeholder="Ketik NIM (contoh: CA221110482), Nama, atau No. WhatsApp..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">manage_search</span>
              <span>Cari Dokumen</span>
            </button>
          </form>

          {/* Search Feedback */}
          {searchStatus === 'not-found' && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 font-semibold">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>
                  Data peserta dengan kata kunci &ldquo;{searchQuery}&rdquo; belum ditemukan.
                  Pastikan NIM/WhatsApp sesuai atau lakukan pendaftaran terlebih dahulu.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('pendaftaran')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shrink-0 cursor-pointer"
              >
                Daftar Sekarang
              </button>
            </div>
          )}

          {/* Quick Select Registered Participants */}
          <div className="pt-2 border-t border-outline-variant/30 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mr-1">
              Data Peserta Terdaftar:
            </span>
            {participants.map((p) => {
              const isSelected = p.id === activeParticipant.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectParticipant(p);
                    setSearchQuery(p.nim);
                    setSearchStatus('found');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">person</span>
                  <span>{p.fullName}</span>
                  <span className="opacity-75 font-mono">({p.nim})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB 1: OFFICIAL E-TICKET PARTICIPANT PASS */}
        {activeDocTab === 'ticket' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
                  DOKUMEN RESMI PAS MASUK PESERTA — TERVERIFIKASI SISTEM SIMAK
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveDocTab('certificate')}
                  className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-primary text-label-md font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  <span>Lihat Piagam Sertifikat</span>
                </button>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-label-md font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    verified
                  </span>
                  <span>Simulasi Validasi QR</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintPass}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  <span>Cetak / Simpan PDF</span>
                </button>
              </div>
            </div>

            {/* BAR PENGINGAT KALENDER (29 JANUARI) & SHARE KE WHATSAPP */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-on-surface">
                      Pengingat Kalender Otomatis &amp; Bagikan E-Tiket ke WhatsApp
                    </h3>
                    {(copiedWaText || icsDownloaded) && (
                      <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-extrabold uppercase">
                        {copiedWaText ? 'Pesan WA Tersalin!' : 'Kalender .ics Terunduh!'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary">
                    Simpan jadwal <strong>Puncak HARLAH SIMAK (29 Januari • 08.30 WIB)</strong> ke HP Anda atau teruskan detail tiket ke WhatsApp pribadi/grup.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={getGoogleCalendarHarlahUrl(activeParticipant)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    calendar_add_on
                  </span>
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadCalendarIcs}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    download
                  </span>
                  <span>{icsDownloaded ? 'File .ics Terunduh!' : 'Kalender HP (.ics)'}</span>
                </button>

                <a
                  href={getWhatsAppShareUrl(activeParticipant, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Kirim detail E-Tiket ke nomor WhatsApp terdaftar (${activeParticipant.whatsapp})`}
                  className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">send_to_mobile</span>
                  <span>Kirim ke WA Saya</span>
                </a>

                <a
                  href={getWhatsAppShareUrl(activeParticipant, false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">share</span>
                  <span>Bagikan / Ajak Teman</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyWaInvite}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">
                    content_copy
                  </span>
                  <span>{copiedWaText ? 'Tersalin!' : 'Salin Teks WA'}</span>
                </button>
              </div>
            </div>

                 {/* BAR PENGINGAT KALENDER & SHARE WHATSAPP PADA TAB PIAGAM */}
                 <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
                   <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-[20px]">share</span>
                     </div>
                     <div className="text-xs text-secondary">
                       <strong className="text-on-surface block">Bagikan Bukti Kepesertaan &amp; Simpan Pengingat Acara</strong>
                       Teruskan informasi Piagam &amp; E-Tiket ke WhatsApp atau tambahkan pengingat 29 Januari ke kalender.
                     </div>
                   </div>
                   <div className="flex flex-wrap items-center gap-2">
                     <a href={getGoogleCalendarHarlahUrl(activeParticipant)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors">
                       <span className="material-symbols-outlined text-[16px] text-primary">calendar_add_on</span>
                       <span>Google Calendar</span>
                     </a>
                     <button type="button" onClick={handleDownloadCalendarIcs} className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer">
                       <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                       <span>{icsDownloaded ? 'File .ics Terunduh!' : 'Kalender .ics'}</span>
                     </button>
                     <a href={getWhatsAppShareUrl(activeParticipant, false)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                       <span className="material-symbols-outlined text-[16px]">share</span>
                       <span>Share ke WhatsApp</span>
                     </a>
                   </div>
                 </div>

            {scanVerifiedToast && (
              <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-500/40 flex items-center justify-between gap-4 shadow-md print:hidden">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[24px]">
                    check_circle
                  </span>
                  <div>
                    <div className="font-bold text-sm">
                      QR Code Valid — Kehadiran &amp; Keaslian Dokumen Terkonfirmasi!
                    </div>
                    <div className="text-xs text-emerald-200/80">
                      Kode Tiket {activeParticipant.ticketCode} atas nama{' '}
                      {activeParticipant.fullName} ({activeParticipant.nim}) berstatus AKTIF di
                      Pintu Masuk {activeParticipant.gate}.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Perforated Ticket Container */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 print:border-2 print:border-primary shadow-lg print:shadow-none overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Left 8 Cols: Main Ticket Body */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                {/* Ticket Top Header Bar */}
                <div className="bg-gradient-to-r from-primary via-primary-container to-flame text-on-primary p-6 sm:px-8 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/25">
                      <span className="material-symbols-outlined text-[28px] text-on-tertiary-container">
                        gavel
                      </span>
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest text-primary-fixed">
                        INSTITUT STIAMI • SPESIALISASI MAHASISWA ANTI KORUPSI
                      </div>
                      <h2 className="text-headline-sm sm:text-headline-md font-extrabold text-white">
                        {isHarlahGuest
                          ? 'E-TIKET TAMU UNDANGAN — HARLAH SIMAK (29 JANUARI)'
                          : 'ARSIP E-TIKET KADERISASI KOPASUS SIMAK'}
                      </h2>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-300/40 text-emerald-100 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>{activeParticipant.status}</span>
                  </div>
                </div>

                {/* Ticket Participant & Event Details */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Participant Identity Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-outline-variant/40">
                    <div className="flex items-center gap-4">
                      {activeParticipant.avatarUrl ? (
                        <img
                          src={activeParticipant.avatarUrl}
                          alt={activeParticipant.fullName}
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-primary shadow-xs shrink-0"
                        />
                      ) : null}
                      <div
                        style={{ display: activeParticipant.avatarUrl ? 'none' : 'flex' }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/10 border-2 border-primary text-primary font-black text-xl sm:text-2xl items-center justify-center shadow-xs shrink-0 select-none uppercase tracking-wider"
                      >
                        {activeParticipant.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                            {isHarlahGuest ? 'Tamu Undangan HARLAH' : 'Kader KOPASUS (Arsip)'}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium">
                            {activeParticipant.semester}
                          </span>
                        </div>
                        <h3 className="text-headline-md font-extrabold text-on-surface">
                          {activeParticipant.fullName}
                        </h3>
                        <div className="text-body-md text-on-surface-variant font-medium">
                          ID / NIM:{' '}
                          <strong className="font-mono text-on-surface">
                            {activeParticipant.nim}
                          </strong>{' '}
                          • {activeParticipant.programStudi}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/40">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        NOMOR KURSI AUDITORIUM
                      </div>
                      <div className="text-headline-lg font-extrabold text-primary font-mono">
                        {activeParticipant.seatNumber}
                      </div>
                      <div className="text-[11px] text-on-surface-variant font-semibold">
                        {isHarlahGuest ? 'Zona Tamu Kehormatan' : 'Zona Integritas Utama'}
                      </div>
                    </div>
                  </div>

                  {/* Event Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                      <div className="text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          event
                        </span>
                        HARI &amp; TANGGAL ACARA
                      </div>
                      <div className="font-bold text-on-surface text-sm">
                        {isHarlahGuest ? '29 Januari (Puncak HARLAH)' : activeParticipant.examDate}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        08.30 – 15.00 WIB (Registrasi 08.00)
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                      <div className="text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          location_on
                        </span>
                        LOKASI PELAKSANAAN
                      </div>
                      <div className="font-bold text-on-surface text-sm">
                        Auditorium Kampus Pusat Lt. 4
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {activeParticipant.campus}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-1">
                      <div className="text-label-sm uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          meeting_room
                        </span>
                        {isHarlahGuest ? 'AKSES & SESI KEHADIRAN' : 'AKSES & DIVISI PILIHAN'}
                      </div>
                      <div className="font-bold text-on-surface text-sm truncate">
                        {activeParticipant.gate}
                      </div>
                      <div className="text-xs text-primary font-semibold truncate">
                        {activeParticipant.division}
                      </div>
                    </div>
                  </div>

                  {/* Important Participant Notes */}
                  <div className="p-4 rounded-xl bg-tertiary-fixed/40 border border-tertiary/20 flex items-start gap-3">
                    <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                      tips_and_updates
                    </span>
                    <div className="text-xs text-on-tertiary-fixed leading-relaxed">
                      {isHarlahGuest ? (
                        <>
                          <strong>Ketentuan Kehadiran Tamu HARLAH (29 Januari):</strong> Tunjukkan QR
                          Code pada E-Tiket ini di Meja Registrasi Tamu HARLAH (Auditorium Lt. 4
                          Institut STIAMI Pusat) mulai pukul 08.00 WIB untuk verifikasi kursi{' '}
                          <strong>{activeParticipant.seatNumber}</strong> dan pengambilan Seminar Kit.
                        </>
                      ) : (
                        <>
                          <strong>Ketentuan Arsip Kepesertaan KOPASUS:</strong> Dokumen ini merupakan
                          arsip resmi kepesertaan Komunikasi Pendidikan Khusus (KOPASUS) yang telah
                          tercatat pada Buku Induk Kader SIMAK.
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ticket Bottom Strip */}
                <div className="px-6 sm:px-8 py-3.5 bg-surface-container border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                  <span>Waktu Registrasi: {activeParticipant.registeredAt}</span>
                  <span className="font-mono font-semibold text-on-surface">
                    WhatsApp Terdaftar: {activeParticipant.whatsapp}
                  </span>
                </div>
              </div>

              {/* Right 4 Cols: Perforated QR Verification Stub */}
              <div className="lg:col-span-4 bg-surface-container-low border-t lg:border-t-0 lg:border-l-2 border-dashed border-outline-variant p-6 sm:p-8 flex flex-col items-center justify-between text-center relative">
                {/* Decorative Ticket Punch Notches */}
                <div className="hidden lg:block w-6 h-6 rounded-full bg-surface border border-outline-variant/50 absolute -left-3 -top-3 print:hidden" />
                <div className="hidden lg:block w-6 h-6 rounded-full bg-surface border border-outline-variant/50 absolute -left-3 -bottom-3 print:hidden" />

                <div className="space-y-1">
                  <div className="text-label-sm uppercase tracking-widest text-primary font-extrabold">
                    KUPON VERIFIKASI KEHADIRAN
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    Pindai pada Gate Scanner SIMAK
                  </div>
                </div>

                <div className="my-6 flex flex-col items-center gap-3">
                  <QrCodeGraphic value={activeParticipant.qrPayload || activeParticipant.ticketCode} size={156} />
                  <div className="space-y-0.5">
                    <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
                      NOMOR SERI E-TIKET
                    </div>
                    <div className="font-mono text-lg font-extrabold text-primary tracking-wider">
                      {activeParticipant.ticketCode}
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-2.5 pt-4 border-t border-outline-variant/40 print:hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">
                      {isHarlahGuest ? 'Status Tamu:' : 'No. Ujian Seleksi:'}
                    </span>
                    <span className="font-mono font-bold text-on-surface">
                      {isHarlahGuest ? 'TAMU UNDANGAN HARLAH' : activeParticipant.examNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Hak Konsumsi &amp; Kit:</span>
                    <span className="font-bold text-emerald-700">TERMASUK (SEMINAR KIT)</span>
                  </div>
                  {!isHarlahGuest && (
                    <button
                      type="button"
                      onClick={() => onNavigate('kartu-ujian')}
                      className="mt-2 w-full py-2.5 px-4 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      <span>Buka Arsip Kartu Ujian KOPASUS</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* TAB 2: OFFICIAL DIGITAL CERTIFICATE / PIAGAM GENERATOR */
          <section className="space-y-4">
            {/* ═══ GEMBOK SERTIFIKAT — Tampil jika belum check-in (status bukan HADIR) ═══ */}
            {activeParticipant.status !== 'HADIR' ? (
              <div className="rounded-3xl border-2 border-dashed border-outline-variant/60 bg-surface-container-lowest p-10 sm:p-16 text-center space-y-6 print:hidden">
                {/* Icon gembok */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-700 mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[44px]">lock</span>
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <h2 className="text-xl font-extrabold text-on-surface">
                    Sertifikat Dikunci 🔒
                  </h2>
                  <p className="text-sm text-secondary leading-relaxed">
                    Sertifikat Seminar Nasional Integritas baru dapat dicetak setelah Anda{' '}
                    <strong className="text-on-surface">mengikuti seluruh rangkaian acara</strong> dan
                    kehadiran Anda dicatat oleh panitia melalui scan QR di lokasi.
                  </p>
                </div>

                {/* Status badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold mx-auto">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  Status Saat Ini:{' '}
                  <span className="uppercase tracking-wide">{activeParticipant.status?.replace(/_/g, ' ')}</span>
                </div>

                {/* Syarat 3 langkah */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                  <div className={`p-4 rounded-2xl border-2 ${
                    activeParticipant.status === 'TERVERIFIKASI' || activeParticipant.status === 'HADIR'
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-outline-variant/40 bg-surface-container'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm font-extrabold ${
                      activeParticipant.status === 'TERVERIFIKASI' || activeParticipant.status === 'HADIR'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-outline-variant/40 text-secondary'
                    }`}>
                      {activeParticipant.status === 'TERVERIFIKASI' || activeParticipant.status === 'HADIR' ? '✓' : '1'}
                    </div>
                    <p className="text-xs font-extrabold text-on-surface">Daftar &amp; Verifikasi</p>
                    <p className="text-[11px] text-secondary mt-0.5">Pendaftaran online dikonfirmasi panitia</p>
                  </div>
                  <div className={`p-4 rounded-2xl border-2 ${
                    activeParticipant.status === 'HADIR'
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-outline-variant/40 bg-surface-container'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm font-extrabold ${
                      activeParticipant.status === 'HADIR'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 text-white'
                    }`}>
                      {activeParticipant.status === 'HADIR' ? '✓' : '2'}
                    </div>
                    <p className="text-xs font-extrabold text-on-surface">Scan QR Masuk</p>
                    <p className="text-[11px] text-secondary mt-0.5">Tunjukkan tiket QR ke panitia di pintu masuk</p>
                  </div>
                  <div className="p-4 rounded-2xl border-2 border-outline-variant/40 bg-surface-container">
                    <div className="w-8 h-8 rounded-full bg-outline-variant/40 text-secondary flex items-center justify-center mb-2 text-sm font-extrabold">3</div>
                    <p className="text-xs font-extrabold text-on-surface">Ikuti Hingga Selesai</p>
                    <p className="text-[11px] text-secondary mt-0.5">Hadir sampai penutupan untuk mendapatkan sertifikat nasional</p>
                  </div>
                </div>

                <div className="text-xs text-secondary/70">
                  Setelah seminar selesai dan kehadiran Anda terverifikasi, muat ulang halaman ini untuk mencetak sertifikat.
                </div>
              </div>
            ) : (
              /* ═══ SERTIFIKAT TERBUKA — Hanya tampil jika status HADIR ═══ */
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-label-md font-bold uppercase tracking-wider text-on-surface-variant">
                      PIAGAM PENGHARGAAN &amp; SERTIFIKAT INTEGRITAS DIGITAL (SHA-256)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Telah Hadir Fisik — Sertifikat Aktif
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveDocTab('ticket')}
                      className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-label-md font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                      <span>Lihat E-Tiket Boarding Pass</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulateScan}
                      className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-label-md font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        verified
                      </span>
                      <span>Verifikasi Hash Piagam</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPass}
                      className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      <span>Cetak / Unduh PDF Piagam</span>
                    </button>
                  </div>
                </div>


            {scanVerifiedToast && (
              <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-500/40 flex items-center justify-between gap-4 shadow-md print:hidden">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-400 text-[24px]">
                    verified
                  </span>
                  <div>
                    <div className="font-bold text-sm">
                      Piagam Terautentikasi pada Buku Induk Digital SIMAK!
                    </div>
                    <div className="text-xs text-emerald-200/80">
                      Nomor Piagam {certificateNumber} atas nama {activeParticipant.fullName} (NIM:{' '}
                      {activeParticipant.nim}) sah dan ditandatangani secara elektronik oleh Dewan
                      Pimpinan Eksekutif SIMAK.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formal Certificate Frame */}
            <div className="bg-surface-container-lowest p-3 sm:p-5 rounded-2xl shadow-2xl print:shadow-none border-2 border-primary/80 relative overflow-hidden">
              <div className="border-2 border-tertiary/40 rounded-xl p-6 sm:p-12 relative overflow-hidden bg-gradient-to-br from-surface-container-lowest via-surface to-primary-fixed/15">
                {/* Subtle Megamendung Watermark */}
                <svg
                  className="absolute right-0 bottom-0 w-96 h-96 text-primary/5 pointer-events-none select-none"
                  fill="currentColor"
                  viewBox="0 0 200 200"
                >
                  <path d="M45,20 C60,5 90,5 105,25 C120,45 150,45 165,25 C180,5 200,20 190,45 C180,70 195,95 180,120 C165,145 135,145 120,165 C105,185 75,185 60,165 C45,145 15,145 5,120 C-5,95 10,70 5,45 C0,20 30,5 45,20 Z"></path>
                </svg>

                {/* Certificate Top Header */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-2 border-b-2 border-primary/20 pb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDieLd4FWbknOilP9vJrwkV9-mi7SHHBdyLXm7CPZfAsBvy1PEQr38BL2Ke3TWdw1oDPajnzHk8ktddihhhvNqeG2Meaoti7kY-_8MjZtU0truuzI6oAQtT0BEU6aHZhN-uQSQflV8WpIhfm7DfECQUhkGLbcHpOINuoctNguGF31zycBy-luBj3RzGT_bOojErv_kzTgLrUaqPYY9-IwF58V592i3I9PmbT9aYCDfR8y3inBlzC-wHfdHcim_vWTaOURg"
                      alt="Logo SIMAK"
                      referrerPolicy="no-referrer"
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                    DEWAN PIMPINAN EKSEKUTIF • SPESIALISASI MAHASISWA ANTI KORUPSI
                  </div>
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    INSTITUT STIAMI JAKARTA • BERDIRI SEJAK 29 JANUARI 2011
                  </div>
                  <div className="mt-2 inline-block px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-bold">
                    No. Registrasi: {certificateNumber}
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="relative z-10 py-8 text-center space-y-5 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="font-display-lg text-2xl sm:text-4xl font-extrabold tracking-tight text-primary uppercase">
                      {isHarlahGuest
                        ? 'PIAGAM PENGHARGAAN & PARTISIPASI HARLAH'
                        : 'PIAGAM INTEGRITAS KADER KOPASUS'}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-secondary font-semibold">
                      Diberikan Sebagai Bukti Kehadiran &amp; Partisipasi Gerakan Antikorupsi Kepada:
                    </p>
                  </div>

                  <div className="py-3 px-6 rounded-2xl bg-surface-container-lowest/90 border border-outline-variant/50 shadow-xs inline-block min-w-[280px] sm:min-w-[420px]">
                    <div className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                      {activeParticipant.fullName}
                    </div>
                    <div className="text-xs font-mono font-bold text-primary mt-1">
                      ID/NIM: {activeParticipant.nim} • {activeParticipant.programStudi}
                    </div>
                  </div>

                  <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant leading-relaxed">
                    {isHarlahGuest ? (
                      <>
                        Telah hadir dan berpartisipasi aktif sebagai{' '}
                        <strong className="text-on-surface">{activeParticipant.semester}</strong>{' '}
                        dalam rangkaian{' '}
                        <strong className="text-primary">
                          Peringatan Hari Lahir (HARLAH) SIMAK &amp; Seminar Nasional Integritas (29
                          Januari)
                        </strong>{' '}
                        pada sesi <strong className="text-on-surface">{activeParticipant.division}</strong>{' '}
                        guna memperkuat sinergi gerakan antikorupsi lintas elemen mahasiswa dan
                        publik.
                      </>
                    ) : (
                      <>
                        Telah mengikuti dan menyelesaikan rangkaian kaderisasi{' '}
                        <strong className="text-on-surface">
                          Komunikasi Pendidikan Khusus (KOPASUS) SIMAK
                        </strong>{' '}
                        pada divisi{' '}
                        <strong className="text-primary">{activeParticipant.division}</strong>, serta
                        mengikrarkan Pakta Integritas Mahasiswa untuk mengamalkan{' '}
                        <strong>9 Nilai Antikorupsi</strong>.
                      </>
                    )}
                  </p>
                </div>

                {/* Certificate Footer: Signatures & QR Seal */}
                <div className="relative z-10 pt-6 border-t border-outline-variant/40 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                  {/* Left Signer */}
                  <div className="space-y-1">
                    <div className="text-xs text-secondary">Mengetahui &amp; Mengesahkan,</div>
                    <div className="text-xs font-bold text-primary uppercase">
                      Pendiri &amp; Dewan Pembina SIMAK
                    </div>
                    <div className="py-2 font-mono text-[11px] text-emerald-700 font-bold">
                      [ TERTANDA ELEKTRONIK TERVERIFIKASI ]
                    </div>
                    <div className="font-headline-sm text-sm font-extrabold text-on-surface underline">
                      Ariawan, S.AP., M.A.
                    </div>
                    <div className="text-[11px] text-secondary">Inisiator Pendirian 29 Jan 2011</div>
                  </div>

                  {/* Center QR Seal */}
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="p-2 rounded-xl bg-white shadow-sm border border-outline-variant/40">
                      <QrCodeGraphic value={certificateNumber} size={96} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                      OTENTIKASI SHA-256 BUKU INDUK
                    </span>
                  </div>

                  {/* Right Signer */}
                  <div className="space-y-1">
                    <div className="text-xs text-secondary">Jakarta, 22 Oktober 2026</div>
                    <div className="text-xs font-bold text-primary uppercase">
                      Ketua Umum SIMAK Periode 2025–2026
                    </div>
                    <div className="py-2 font-mono text-[11px] text-emerald-700 font-bold">
                      [ TERTANDA ELEKTRONIK TERVERIFIKASI ]
                    </div>
                    <div className="font-headline-sm text-sm font-extrabold text-on-surface underline">
                      Venus Sangia Alfarizi
                    </div>
                    <div className="text-[11px] text-secondary">NIM: 2024102001 • Mandataris MUBES</div>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </section>
        )}

        {/* OFFICIAL CERTIFICATE VERIFICATION REGISTRY */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 sm:p-8 shadow-xs space-y-6 print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-label-sm uppercase tracking-widest text-primary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                REGISTRASI PIAGAM &amp; SERTIFIKAT DIKLAT SIMAK
              </div>
              <h2 className="text-headline-md font-extrabold text-on-surface mt-1">
                Daftar Piagam Terverifikasi pada Buku Induk Organisasi
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Klik pada salah satu piagam untuk membuka pratinjau sertifikat resmi siap cetak.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('direktori')}
              className="self-start md:self-auto px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
              <span>Lihat Buku Induk Kader</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                certNo: 'SERT/SIMAK-XV/KOPASUS/2026/001',
                holder: 'Venus Sangia Alfarizi',
                nim: '2024102001',
                program: 'Diklat KOPASUS & TOT KPK RI',
                predicate: 'Lulus Sangat Memuaskan (Kader Utama)',
              },
              {
                certNo: 'SERT/SIMAK-XV/KOPASUS/2026/014',
                holder: 'Fathan Hendrawan',
                nim: '2024102014',
                program: 'Diklat KOPASUS & PINSUS',
                predicate: 'Lulus Terverifikasi BPH',
              },
              {
                certNo: certificateNumber,
                holder: activeParticipant.fullName,
                nim: activeParticipant.nim,
                program: activeParticipant.registrationType,
                predicate: 'Peserta Terdaftar Aktif 2026',
              },
            ].map((cert) => (
              <div
                key={cert.certNo}
                onClick={() => {
                  setActiveDocTab('certificate');
                  window.scrollTo({ top: 240, behavior: 'smooth' });
                }}
                className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 space-y-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {cert.certNo}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    SAH
                  </span>
                </div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {cert.holder}
                </div>
                <div className="text-xs text-on-surface-variant">
                  NIM: <strong className="font-mono">{cert.nim}</strong> • {cert.program}
                </div>
                <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{cert.predicate}</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
