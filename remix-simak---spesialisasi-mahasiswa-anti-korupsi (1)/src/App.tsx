/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ScreenId,
  ParticipantRecord,
  AdvocacySubmission,
  WhistleblowerReport,
} from './types';
import {
  INITIAL_PARTICIPANTS,
  LIBRARY_DOCUMENTS,
  INITIAL_ADVOCACY_SUBMISSIONS,
} from './data/mockData';
import { IS_BACKEND_ENABLED } from './api/client';
import { fetchParticipants } from './api/participants';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { GalleryScreen } from './components/GalleryScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { ETicketScreen } from './components/ETicketScreen';
import { ExamCardScreen } from './components/ExamCardScreen';
import { ELibraryScreen } from './components/ELibraryScreen';
import { WhistleblowerScreen } from './components/WhistleblowerScreen';
import { TransparencyScreen } from './components/TransparencyScreen';
import { AdminPanelScreen } from './components/AdminPanelScreen';
import { MerchandiseScreen } from './components/MerchandiseScreen';
import { ProgramCanvasScreen } from './components/ProgramCanvasScreen';

const INITIAL_WBS_REPORTS: WhistleblowerReport[] = [
  {
    id: 'wbs-1',
    trackingCode: 'WBS-2026-4410',
    category: 'Pungutan Liar (Pungli)',
    unitReported: 'Oknum Administrasi Legalisir Dokumen',
    incidentDate: '2026-09-12',
    summary:
      'Laporan dugaan pungutan biaya tidak resmi di luar ketentuan SK Rektorat pada pengurusan berkas administrasi.',
    isAnonymous: true,
    reporterIdentity: 'Anonim Terenkripsi (AES-256-GCM)',
    submittedAt: '14 September 2026',
    status: 'Selesai Ditindaklanjuti',
    progressStep: 4,
    resolutionNote:
      'Telah ditindaklanjuti bersama Biro Kemahasiswaan & Satgas Pencegahan Pungli. Layanan legalisir kini sepenuhnya digital dan bebas pungutan tunai.',
  },
  {
    id: 'wbs-2',
    trackingCode: 'WBS-2026-7823',
    category: 'Penyelewengan Dana Kegiatan',
    unitReported: 'Kepanitiaan Acara Eksternal Kampus',
    incidentDate: '2026-10-03',
    summary:
      'Laporan ketidaksesuaian nota pengadaan konsumsi dan perlengkapan panggung pada LPJ kegiatan mahasiswa.',
    isAnonymous: true,
    reporterIdentity: 'Anonim Terenkripsi (AES-256-GCM)',
    submittedAt: '05 Oktober 2026',
    status: 'Investigasi Satgas',
    progressStep: 3,
    resolutionNote:
      'Tim Audit Forensik & Satgas Advokasi SIMAK sedang melakukan pencocokan kuitansi vendor dan pemanggilan bendahara kepanitiaan terkait.',
  },
  {
    id: 'wbs-3',
    trackingCode: 'WBS-2026-9105',
    category: 'Gratifikasi & Suap Akademik',
    unitReported: 'Indikasi Joki Tugas & Gratifikasi Nilai',
    incidentDate: '2026-10-14',
    summary:
      'Temuan sindikat penawaran joki karya tulis ilmiah dan pemberian bingkisan tidak wajar menjelang sidang.',
    isAnonymous: false,
    reporterIdentity: 'Pelapor Terverifikasi (Dirahasiakan Dewan Etik)',
    submittedAt: '15 Oktober 2026',
    status: 'Verifikasi Bukti',
    progressStep: 2,
    resolutionNote:
      'Bukti tangkapan layar dan dokumen sedang diverifikasi oleh Dewan Etik untuk diteruskan ke Komisi Disiplin Akademik.',
  },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('beranda');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('kopasus');

  const [participants, setParticipants] = useState<ParticipantRecord[]>(() => {
    try {
      const saved = localStorage.getItem('simak_participants_v1');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  });

  const [activeParticipant, setActiveParticipant] = useState<ParticipantRecord>(
    () => participants[0] || INITIAL_PARTICIPANTS[0]
  );

  const [myHarlahRegistration, setMyHarlahRegistration] = useState<ParticipantRecord | null>(() => {
    try {
      const saved = localStorage.getItem('simak_my_harlah_registration_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [webToast, setWebToast] = useState<{
    fullName: string;
    ticketCode: string;
    seatNumber: string;
    category: string;
  } | null>(null);

  const [submissions, setSubmissions] = useState<AdvocacySubmission[]>(() => {
    try {
      const saved = localStorage.getItem('simak_submissions_v1');
      return saved ? JSON.parse(saved) : INITIAL_ADVOCACY_SUBMISSIONS;
    } catch {
      return INITIAL_ADVOCACY_SUBMISSIONS;
    }
  });

  const [wbsReports, setWbsReports] = useState<WhistleblowerReport[]>(() => {
    try {
      const saved = localStorage.getItem('simak_wbs_reports_v1');
      return saved ? JSON.parse(saved) : INITIAL_WBS_REPORTS;
    } catch {
      return INITIAL_WBS_REPORTS;
    }
  });

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Sinkronisasi data dari Supabase Cloud & Backend saat startup ──────────
  useEffect(() => {
    fetchParticipants()
      .then((remoteList) => {
        if (remoteList && remoteList.length > 0) {
          setParticipants(remoteList);
        }
      })
      .catch(() => { /* fallback ke localStorage */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('simak_participants_v1', JSON.stringify(participants));
    } catch {
      // Ignore storage quota errors
    }
  }, [participants]);

  useEffect(() => {
    try {
      if (myHarlahRegistration) {
        localStorage.setItem(
          'simak_my_harlah_registration_v1',
          JSON.stringify(myHarlahRegistration)
        );
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [myHarlahRegistration]);

  useEffect(() => {
    try {
      localStorage.setItem('simak_submissions_v1', JSON.stringify(submissions));
    } catch {
      // Ignore storage quota errors
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('simak_wbs_reports_v1', JSON.stringify(wbsReports));
    } catch {
      // Ignore storage quota errors
    }
  }, [wbsReports]);

  const handleRegisterParticipant = (newRecord: ParticipantRecord) => {
    setParticipants((prev) => [newRecord, ...prev]);
    setActiveParticipant(newRecord);
    setMyHarlahRegistration(newRecord);
    setWebToast({
      fullName: newRecord.fullName,
      ticketCode: newRecord.ticketCode,
      seatNumber: newRecord.seatNumber,
      category: newRecord.semester,
    });
  };

  const handleSelectParticipantForTicket = (participant: ParticipantRecord) => {
    setActiveParticipant(participant);
    setActiveScreen('etiket');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSubmission = (newSub: AdvocacySubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleAddWbsReport = (newRep: WhistleblowerReport) => {
    setWbsReports((prev) => [newRep, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-on-surface">
      <div className="print:hidden">
        <Navbar
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
          participantCount={participants.length}
          myHarlahRegistration={myHarlahRegistration}
        />
      </div>

      {/* Floating Global Web Notification Toast when User Registers for HARLAH */}
      {webToast && (
        <div className="fixed top-24 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-surface-container-lowest border-2 border-emerald-600 rounded-2xl shadow-2xl p-4 sm:p-5 print:hidden animate-[fadeIn_0.25s_ease-out]">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Notifikasi Web: Sudah Terdaftar
                </span>
                <button
                  type="button"
                  onClick={() => setWebToast(null)}
                  className="text-secondary hover:text-on-surface cursor-pointer"
                  aria-label="Tutup Notifikasi"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <h4 className="font-headline-sm text-sm font-extrabold text-on-surface mt-1.5 truncate">
                {webToast.fullName} Resmi Terdaftar!
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                Status kehadiran Anda sebagai <strong>{webToast.category}</strong> pada HARLAH SIMAK (29 Januari) telah aktif.
              </p>
              <div className="mt-2.5 p-2 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-secondary">E-Tiket: </span>
                  <strong className="font-mono text-primary">{webToast.ticketCode}</strong>
                </div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {webToast.seatNumber}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWebToast(null);
                    setActiveScreen('etiket');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Buka E-Tiket Saya</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWebToast(null)}
                  className="py-2 px-3 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-20 print:pt-0">
        {activeScreen === 'beranda' && (
          <HomeScreen
            onNavigate={setActiveScreen}
            participants={participants}
            documents={LIBRARY_DOCUMENTS}
            myHarlahRegistration={myHarlahRegistration}
            onSelectParticipantForTicket={handleSelectParticipantForTicket}
          />
        )}

        {activeScreen === 'galeri' && <GalleryScreen onNavigate={setActiveScreen} />}

        {activeScreen === 'direktori' && (
          <DirectoryScreen onNavigate={setActiveScreen} participants={participants} />
        )}

        {activeScreen === 'pendaftaran' && (
          <RegistrationScreen
            participants={participants}
            myHarlahRegistration={myHarlahRegistration}
            onRegisterParticipant={handleRegisterParticipant}
            onNavigate={setActiveScreen}
            onSelectParticipantForTicket={handleSelectParticipantForTicket}
          />
        )}

        {activeScreen === 'etiket' && (
          <ETicketScreen
            participants={participants}
            activeParticipant={activeParticipant}
            onSelectParticipant={setActiveParticipant}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'kartu-ujian' && (
          <ExamCardScreen
            participants={participants}
            activeParticipant={activeParticipant}
            onSelectParticipant={setActiveParticipant}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'elibrary' && (
          <ELibraryScreen
            documents={LIBRARY_DOCUMENTS}
            submissions={submissions}
            onAddSubmission={handleAddSubmission}
          />
        )}

        {activeScreen === 'whistleblower' && (
          <WhistleblowerScreen
            reports={wbsReports}
            onAddReport={handleAddWbsReport}
            onNavigate={setActiveScreen}
          />
        )}

        {activeScreen === 'transparansi' && (
          <TransparencyScreen onNavigate={setActiveScreen} />
        )}

        {activeScreen === 'merchandise' && (
          <MerchandiseScreen onNavigate={setActiveScreen} />
        )}

        {activeScreen === 'program-detail' && (
          <ProgramCanvasScreen
            initialProgramId={selectedProgramId}
            onNavigate={setActiveScreen}
            onSelectProgram={setSelectedProgramId}
          />
        )}

        {activeScreen === 'admin' && (
          <AdminPanelScreen
            onNavigate={setActiveScreen}
            onSelectParticipantForTicket={handleSelectParticipantForTicket}
            liveParticipants={participants}
            onUpdateParticipants={setParticipants}
          />
        )}
      </main>

      {/* Floating Quick-Action Dock (Pintasan Tiket HARLAH Saya & Tombol Ke Atas) */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 print:hidden">
        {myHarlahRegistration && activeScreen !== 'etiket' && (
          <button
            type="button"
            onClick={() => handleSelectParticipantForTicket(myHarlahRegistration)}
            title={`Buka E-Tiket HARLAH atas nama ${myHarlahRegistration.fullName}`}
            className="group flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white shadow-xl border-2 border-emerald-400/50 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <span className="material-symbols-outlined text-[19px]">qr_code_2</span>
            <div className="text-left leading-tight">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                Terdaftar HARLAH
              </div>
              <div className="text-xs font-extrabold">
                E-Tiket Saya ({myHarlahRegistration.seatNumber})
              </div>
            </div>
          </button>
        )}

        {showBackToTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Kembali ke atas halaman"
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary shadow-xl border border-white/20 flex items-center justify-center transition-all hover:-translate-y-0.5 cursor-pointer"
            title="Kembali ke Atas"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
          </button>
        )}
      </div>

      <Footer onNavigate={setActiveScreen} />
    </div>
  );
}
