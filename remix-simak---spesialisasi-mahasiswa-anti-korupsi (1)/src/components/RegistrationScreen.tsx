import React, { useState, useRef, useEffect } from 'react';
import { ParticipantRecord, ScreenId } from '../types';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';
import {
  downloadHarlahIcsFile,
  getGoogleCalendarHarlahUrl,
  getWhatsAppShareText,
  getWhatsAppShareUrl,
} from '../utils/calendarAndShare';
import { registerParticipant } from '../api/participants';
import { submitWaitlistEntry } from '../api/waitlist';

interface RegistrationScreenProps {
  participants?: ParticipantRecord[];
  myHarlahRegistration?: ParticipantRecord | null;
  onRegisterParticipant: (newRecord: ParticipantRecord) => void;
  onNavigate: (screen: ScreenId) => void;
  onSelectParticipantForTicket?: (participant: ParticipantRecord) => void;
}

interface KopasusWaitlistEntry {
  id: string;
  queueCode: string;
  fullName: string;
  nim: string;
  programStudi: string;
  semester: string;
  whatsapp: string;
  email: string;
  preferredDivision: string;
  reason: string;
  createdAt: string;
}

const INITIAL_WAITLIST: KopasusWaitlistEntry[] = [
  {
    id: 'wl-1',
    queueCode: 'WL-KPS-NEXT-014',
    fullName: 'Muhammad Zaki Al-Ghifari',
    nim: 'CA251110112',
    programStudi: 'S1 Ilmu Administrasi Publik — Institut STIAMI',
    semester: 'Semester 1',
    whatsapp: '081290045511',
    email: 'zaki.ghifari@student.stiami.ac.id',
    preferredDivision: 'Divisi Acara (Waketum 1)',
    reason: 'Ingin menjadi bagian dari kader KOPASUS angkatan berikutnya dan belajar mengawal transparansi kebijakan publik.',
    createdAt: 'Terdaftar di Antrean Prioritas',
  },
  {
    id: 'wl-2',
    queueCode: 'WL-KPS-NEXT-015',
    fullName: 'Salsabila Putri Nadhira',
    nim: 'CB251120089',
    programStudi: 'D4 Akuntansi Bisnis / D3 Perpajakan — Institut STIAMI',
    semester: 'Semester 1',
    whatsapp: '085811229900',
    email: 'salsabila.nadhira@student.stiami.ac.id',
    preferredDivision: 'Divisi Dokumentasi & Desain (Waketum 2 - KOMINTEK)',
    reason: 'Siap mengikuti seleksi KOPASUS periode depan untuk memperdalam media kreatif dan edukasi antikorupsi.',
    createdAt: 'Terdaftar di Antrean Prioritas',
  },
];

const GUEST_CATEGORY_LIST = [
  {
    id: 'Mahasiswa Umum STIAMI',
    title: 'Mahasiswa Umum Institut STIAMI',
    desc: 'Mahasiswa aktif lintas jurusan (non-anggota SIMAK) yang ingin menghadiri Seminar Nasional & Puncak HARLAH SIMAK.',
    icon: 'school',
  },
  {
    id: 'Delegasi Ormawa / Kampus Mitra',
    title: 'Delegasi BEM / UKM / Kampus Mitra',
    desc: 'Perwakilan organisasi kemahasiswaan internal maupun eksternal kampus mitra yang diundang pada acara HARLAH.',
    icon: 'groups',
  },
  {
    id: 'Alumni SIMAK',
    title: 'Alumni & Senior Lintas Angkatan',
    desc: 'Keluarga besar purna-pengurus dan alumni SIMAK Angkatan I–XV yang hadir dalam malam refleksi 29 Januari.',
    icon: 'workspace_premium',
  },
  {
    id: 'Tamu Undangan Umum',
    title: 'Tamu Undangan Publik / Umum',
    desc: 'Tamu kehormatan, akademisi, praktisi, atau masyarakat umum pemerhati gerakan integritas antikorupsi.',
    icon: 'person_celebrate',
  },
];

const INSTITUTION_OR_PRODI_LIST = [
  'S1 Ilmu Administrasi Publik — Institut STIAMI',
  'S1 Ilmu Administrasi Bisnis — Institut STIAMI',
  'S1 Manajemen Komunikasi — Institut STIAMI',
  'S1 Manajemen Logistik — Institut STIAMI',
  'D4 Akuntansi Bisnis / D3 Perpajakan — Institut STIAMI',
  'Delegasi BEM / BLM / UKM Internal STIAMI',
  'Delegasi Universitas / Kampus Mitra Eksternal',
  'Ikatan Alumni SIMAK Lintas Angkatan',
  'Instansi Publik / Tamu Undangan Umum',
];

const CAMPUS_LIST = [
  'Kampus Pusat Cempaka Putih (Jakarta Pusat)',
  'Kampus Bekasi',
  'Kampus Depok',
  'Kampus Tangerang',
  'Kampus Cikarang',
  'Luar Kampus STIAMI / Instansi Mitra',
];

const HARLAH_SESSION_OPTIONS = [
  {
    name: 'Hadir Penuh: Seminar Nasional & Perayaan Puncak HARLAH',
    icon: 'celebration',
    desc: 'Mengikuti seluruh rangkaian acara dari pembukaan, Seminar Nasional Antikorupsi, hingga pemotongan tumpeng HARLAH.',
  },
  {
    name: 'Sesi I: Seminar Nasional Integritas & Dialog Kebangsaan',
    icon: 'forum',
    desc: 'Fokus menghadiri sesi diskusi publik & seminar bersama narasumber KPK RI, akademisi, dan tokoh antikorupsi.',
  },
  {
    name: 'Sesi II: Refleksi Pendirian SIMAK (29 Jan 2011) & Ramah Tamah',
    icon: 'history_edu',
    desc: 'Fokus menghadiri seremoni refleksi perjalanan SIMAK, penganugerahan apresiasi, dan silaturahmi tamu undangan.',
  },
];

const HARLAH_RUNDOWN_ITEMS = [
  {
    time: '08.00 – 08.30 WIB',
    phase: 'Registrasi & Penyambutan Tamu VIP',
    title: 'Pemindaian E-Tiket QR Code & Pembagian Seminar Kit Integritas',
    speaker: 'Tim Protokoler & Kesekretariatan HARLAH SIMAK',
    badge: 'Meja Registrasi Lt. 4',
    icon: 'qr_code_scanner',
  },
  {
    time: '08.30 – 09.15 WIB',
    phase: 'Seremoni Pembukaan HARLAH',
    title: 'Lagu Indonesia Raya, Mars Mahasiswa, & Sambutan Kehormatan',
    speaker: 'Ketua Umum SIMAK (Venus Sangia Alfarizi) & Jajaran Rektorat Institut STIAMI',
    badge: 'Sesi Pembukaan',
    icon: 'campaign',
  },
  {
    time: '09.15 – 12.00 WIB',
    phase: 'Sesi I • Seminar Nasional Integritas',
    title: '“Peran Strategis Intelektual Muda dalam Mengawal Akuntabilitas Publik”',
    speaker: 'Direktorat Jejaring Pendidikan KPK RI, Pakar Hukum Tata Negara, & Pendiri SIMAK',
    badge: 'Sesi I • Seminar Utama',
    icon: 'forum',
  },
  {
    time: '13.00 – 15.00 WIB',
    phase: 'Sesi II • Puncak Refleksi & Apresiasi',
    title: 'Pemotongan Tumpeng 15 Tahun SIMAK (29 Jan 2011 – 2026) & Temu Lintas Angkatan',
    speaker: 'Dewan Pembina, Alumni Angkatan I–XIV, Pengurus Aktif, & Tamu Kehormatan',
    badge: 'Sesi II • Puncak HARLAH',
    icon: 'celebration',
  },
];

const ANNUAL_CALENDAR_EVENTS = [
  {
    month: '29 Januari (Agenda Terdekat)',
    title: 'Peringatan Hari Lahir (HARLAH) SIMAK & Seminar Nasional',
    category: 'Registrasi Tamu Undangan Dibuka',
    location: 'Auditorium Institut STIAMI • Pukul 08.30 WIB',
    status: 'Akan Datang • 29 Januari',
    statusClass: 'bg-primary-container text-on-primary animate-pulse',
    icon: 'celebration',
    note: 'Khusus pendaftaran kehadiran Tamu Undangan & Peserta Seminar HARLAH.',
  },
  {
    month: 'Telah Lewat',
    title: 'Komunikasi Pendidikan Khusus (KOPASUS)',
    category: 'Satu-satunya Jalur Rekrutmen Anggota Baru',
    location: 'Kampus Pusat Cempaka Putih & Pusat Diklat',
    status: 'Sudah Terlaksana • Ditutup',
    statusClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'military_tech',
    note: 'Pendaftaran anggota baru SIMAK ditutup dan akan dibuka kembali di periode selanjutnya.',
  },
  {
    month: 'Telah Lewat',
    title: 'Pendidikan Khusus Kader (PINSUS)',
    category: 'Pembinaan Lanjutan Internal',
    location: 'Kampus Pusat Institut STIAMI',
    status: 'Sudah Terlaksana • Selesai',
    statusClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'school',
    note: 'Khusus kader internal yang telah lulus KOPASUS. Dibuka kembali periode selanjutnya.',
  },
  {
    month: 'Telah Lewat',
    title: 'Training of Trainer (TOT) Penegakan Hukum',
    category: 'Kemitraan KPK RI & MA',
    location: 'Gedung Merah Putih KPK RI',
    status: 'Sudah Terlaksana • Selesai',
    statusClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'account_balance',
    note: 'Kegiatan telah selesai dan akan dibuka kembali di periode selanjutnya.',
  },
  {
    month: 'Telah Lewat',
    title: 'Ramadhan Integrity & Bakti Sosial Antikorupsi',
    category: 'Pengabdian Masyarakat',
    location: 'Jakarta & Bekasi (250 Paket Santunan)',
    status: 'Sudah Terlaksana • Selesai',
    statusClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'volunteer_activism',
    note: 'Kegiatan telah selesai dan akan dilaksanakan kembali pada Ramadhan berikutnya.',
  },
  {
    month: 'Telah Lewat',
    title: 'SIMAK Goes To School (Roadshow SMA/SMK)',
    category: 'Edukasi Pelajar',
    location: 'DKI Jakarta & Jawa Barat',
    status: 'Sudah Terlaksana • Selesai',
    statusClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'cast_for_education',
    note: 'Roadshow telah selesai dan akan dibuka kembali di periode selanjutnya.',
  },
];

function getSecondsUntilNextHarlah(): number {
  const now = new Date();
  const targetYear = now.getFullYear();
  let target = new Date(targetYear, 0, 29, 8, 30, 0);
  if (now.getTime() >= target.getTime()) {
    target = new Date(targetYear + 1, 0, 29, 8, 30, 0);
  }
  return Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  participants = [],
  myHarlahRegistration = null,
  onRegisterParticipant,
  onNavigate,
  onSelectParticipantForTicket,
}) => {
  const [activeMode, setActiveMode] = useState<'harlah-guest' | 'kopasus-closed'>('harlah-guest');
  const [guestCategory, setGuestCategory] = useState(GUEST_CATEGORY_LIST[0].id);
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [programStudi, setProgramStudi] = useState(INSTITUTION_OR_PRODI_LIST[0]);
  const [campus, setCampus] = useState(CAMPUS_LIST[0]);
  const [sessionChoice, setSessionChoice] = useState(HARLAH_SESSION_OPTIONS[0].name);
  const [motivation, setMotivation] = useState('');
  const [agreedPledge, setAgreedPledge] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdRecord, setCreatedRecord] = useState<ParticipantRecord | null>(
    () => myHarlahRegistration
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copiedTicketCode, setCopiedTicketCode] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [downloadedIcsToast, setDownloadedIcsToast] = useState(false);
  const [statusCheckQuery, setStatusCheckQuery] = useState('');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState<string>('Semua');
  const [openRegFaq, setOpenRegFaq] = useState<string | null>('reg-faq-1');

  const confirmationRef = useRef<HTMLDivElement>(null);
  const guestbookRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (myHarlahRegistration && !createdRecord) {
      setCreatedRecord(myHarlahRegistration);
    }
  }, [myHarlahRegistration, createdRecord]);

  // Waiting List State for Next KOPASUS Period
  const [waitlistEntries, setWaitlistEntries] = useState<KopasusWaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('simak_kopasus_waitlist_v1');
      return saved ? JSON.parse(saved) : INITIAL_WAITLIST;
    } catch {
      return INITIAL_WAITLIST;
    }
  });
  const [wlName, setWlName] = useState('');
  const [wlNim, setWlNim] = useState('');
  const [wlProdi, setWlProdi] = useState(INSTITUTION_OR_PRODI_LIST[0]);
  const [wlSemester, setWlSemester] = useState('Semester 1 (Mahasiswa Baru)');
  const [wlWhatsapp, setWlWhatsapp] = useState('');
  const [wlEmail, setWlEmail] = useState('');
  const [wlDivision, setWlDivision] = useState('Divisi Acara (Waketum 1)');
  const [wlReason, setWlReason] = useState('');
  const [wlSubmittedEntry, setWlSubmittedEntry] = useState<KopasusWaitlistEntry | null>(null);
  const [wlError, setWlError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('simak_kopasus_waitlist_v1', JSON.stringify(waitlistEntries));
    } catch {
      // ignore storage errors
    }
  }, [waitlistEntries]);

  // Live Countdown to Upcoming HARLAH SIMAK on 29 Januari
  const [secondsLeft, setSecondsLeft] = useState<number>(() => getSecondsUntilNextHarlah());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(getSecondsUntilNextHarlah());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  const harlahGuests = participants.filter(
    (p) => p.ticketCode.startsWith('GUEST-') || p.registrationType === 'Open House SIMAK'
  );

  const filteredHarlahGuests =
    guestCategoryFilter === 'Semua'
      ? harlahGuests
      : harlahGuests.filter((g) => g.semester === guestCategoryFilter);

  const handleAutoFillDemo = () => {
    setGuestCategory('Delegasi Ormawa / Kampus Mitra');
    setFullName('Bagas Adi Nugroho');
    setNim('GUEST-BEM-2026');
    setWhatsapp('081299887766');
    setEmail('bagas.nugroho@student.stiami.ac.id');
    setProgramStudi('Delegasi BEM / BLM / UKM Internal STIAMI');
    setCampus('Kampus Pusat Cempaka Putih (Jakarta Pusat)');
    setSessionChoice(HARLAH_SESSION_OPTIONS[0].name);
    setMotivation(
      'Selamat Hari Lahir untuk SIMAK Institut STIAMI! Semoga terus konsisten menjadi garda terdepan gerakan mahasiswa antikorupsi di Indonesia.'
    );
    setAgreedPledge(true);
    setErrorMessage('');
  };

  const handleAutoFillWaitlistDemo = () => {
    setWlName('Raisa Kamila Azzahra');
    setWlNim('CA251110309');
    setWlProdi('S1 Ilmu Administrasi Publik — Institut STIAMI');
    setWlSemester('Semester 1 (Mahasiswa Baru)');
    setWlWhatsapp('081377889922');
    setWlEmail('raisa.azzahra@student.stiami.ac.id');
    setWlDivision('Divisi Acara (Waketum 1)');
    setWlReason(
      'Saya sangat ingin bergabung menjadi kader resmi SIMAK pada pembukaan KOPASUS periode berikutnya untuk mengasah kepemimpinan berintegritas.'
    );
    setWlError('');
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName.trim() || !wlNim.trim() || !wlWhatsapp.trim() || !wlEmail.trim()) {
      setWlError('Mohon lengkapi Nama Lengkap, NIM, Nomor WhatsApp, dan Email untuk antrean KOPASUS.');
      return;
    }

    try {
      const result = await submitWaitlistEntry({
        fullName: wlName.trim(),
        nim: wlNim.trim().toUpperCase(),
        programStudi: wlProdi,
        semester: wlSemester,
        whatsapp: wlWhatsapp.trim(),
        email: wlEmail.trim(),
        preferredDivision: wlDivision,
        reason: wlReason.trim() || 'Siap mengikuti seleksi KOPASUS periode kepengurusan berikutnya.',
      });

      const newEntry: KopasusWaitlistEntry = {
        id: result.id,
        queueCode: result.queueCode,
        fullName: wlName.trim(),
        nim: wlNim.trim().toUpperCase(),
        programStudi: wlProdi,
        semester: wlSemester,
        whatsapp: wlWhatsapp.trim(),
        email: wlEmail.trim(),
        preferredDivision: wlDivision,
        reason: wlReason.trim() || 'Siap mengikuti seleksi KOPASUS periode kepengurusan berikutnya.',
        createdAt: 'Baru Saja Terdaftar',
      };

      setWaitlistEntries((prev) => [newEntry, ...prev]);
      setWlSubmittedEntry(newEntry);
      setWlError('');
      setWlName('');
      setWlNim('');
      setWlWhatsapp('');
      setWlEmail('');
      setWlReason('');
    } catch (err: any) {
      setWlError(err?.message || 'Gagal mendaftar antrean. Silakan coba lagi.');
    }
  };

  // Live detection if typed NIM / WhatsApp / Name or statusCheckQuery is already registered in HARLAH
  const existingMatchedGuest = React.useMemo(() => {
    const qNim = nim.trim().toLowerCase();
    const qWa = whatsapp.trim();
    const qName = fullName.trim().toLowerCase();
    const qSearch = statusCheckQuery.trim().toLowerCase();

    if (qSearch.length >= 3) {
      return (
        harlahGuests.find(
          (g) =>
            g.fullName.toLowerCase().includes(qSearch) ||
            g.nim.toLowerCase().includes(qSearch) ||
            g.ticketCode.toLowerCase().includes(qSearch) ||
            g.whatsapp.includes(qSearch)
        ) || null
      );
    }

    if (qNim.length >= 5 || qWa.length >= 9 || qName.length >= 5) {
      return (
        harlahGuests.find(
          (g) =>
            (qNim.length >= 5 && g.nim.toLowerCase() === qNim) ||
            (qWa.length >= 9 && g.whatsapp === qWa) ||
            (qName.length >= 5 && g.fullName.toLowerCase() === qName)
        ) || null
      );
    }
    return null;
  }, [nim, whatsapp, fullName, statusCheckQuery, harlahGuests]);

  const handleCopyTicket = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedTicketCode(true);
    setTimeout(() => setCopiedTicketCode(false), 2500);
  };

  const handleCopyWhatsAppMessage = (record: ParticipantRecord) => {
    navigator.clipboard?.writeText(getWhatsAppShareText(record));
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 2800);
  };

  const handleDownloadIcs = (record: ParticipantRecord) => {
    downloadHarlahIcsFile(record);
    setDownloadedIcsToast(true);
    setTimeout(() => setDownloadedIcsToast(false), 3200);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nim.trim() || !whatsapp.trim() || !email.trim()) {
      setErrorMessage(
        'Mohon lengkapi Nama Lengkap Tamu, NIM/ID Identitas, Nomor WhatsApp, dan Email.'
      );
      return;
    }
    if (!agreedPledge) {
      setErrorMessage('Anda wajib menyetujui konfirmasi kehadiran tamu acara HARLAH SIMAK.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { participant: newParticipant } = await registerParticipant({
        fullName: fullName.trim(),
        nim: nim.trim().toUpperCase(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        programStudi,
        campus: campus.replace(' (Jakarta Pusat)', ''),
        semester: guestCategory,
        division: sessionChoice,
        guestCategory,
        session: sessionChoice,
        registrationType: 'Open House SIMAK',
        motivation:
          motivation.trim() ||
          'Turut hadir memeriahkan Peringatan Hari Lahir (HARLAH) SIMAK pada 29 Januari sebagai tamu undangan.',
        agreement: agreedPledge,
      });

      onRegisterParticipant(newParticipant);
      setCreatedRecord(newParticipant);
      setShowSuccessModal(true);
      setTimeout(() => {
        confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal mendaftarkan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* POP-UP MODAL BUKTI PENDAFTARAN TAMU HARLAH BERHASIL */}
      {showSuccessModal && createdRecord && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-xl w-full border-2 border-emerald-600 shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Verified Header */}
            <div className="bg-emerald-700 text-white p-6 sm:p-7 relative">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white cursor-pointer"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[34px]">verified</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-100 text-[11px] font-extrabold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    Status Web: Resmi Terdaftar
                  </span>
                  <h3 className="text-headline-md font-extrabold mt-1">
                    Pendaftaran Tamu HARLAH Berhasil!
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Data kehadiran Anda untuk Puncak HARLAH SIMAK (29 Januari) telah diverifikasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Details Body */}
            <div className="p-6 sm:p-7 space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                    Nama Tamu Terdaftar
                  </div>
                  <div className="text-lg font-extrabold text-on-surface">
                    {createdRecord.fullName}
                  </div>
                  <div className="text-xs text-secondary font-medium">
                    {createdRecord.semester} • ID: {createdRecord.nim}
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-bold uppercase text-emerald-800">
                    Kode E-Tiket Resmi
                  </div>
                  <div className="font-mono text-lg font-extrabold text-primary flex items-center sm:justify-end gap-1.5">
                    <span>{createdRecord.ticketCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyTicket(createdRecord.ticketCode)}
                      className="px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-sans font-bold cursor-pointer"
                    >
                      {copiedTicketCode ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-emerald-800">
                    Kursi Auditorium: {createdRecord.seatNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="text-secondary font-semibold">Sesi Kehadiran:</div>
                  <div className="font-bold text-on-surface mt-0.5">{createdRecord.division}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="text-secondary font-semibold">Lokasi &amp; Waktu:</div>
                  <div className="font-bold text-on-surface mt-0.5">
                    29 Januari • Auditorium Lt. 4 STIAMI
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border-l-4 border-primary text-xs text-on-surface-variant leading-relaxed">
                <strong className="text-on-surface">Notifikasi Sistem Web:</strong> Status Anda di pojok kanan atas Navbar kini telah berubah menjadi{' '}
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
                  Terdaftar HARLAH
                </span>{' '}
                dan nama beserta ucapan Anda telah tampil secara langsung di{' '}
                <strong>Buku Tamu Digital</strong> di bawah.
              </div>

              {/* FITUR KALENDER PENGINGAT (29 JANUARI) & FITUR SHARING WHATSAPP */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    Simpan Pengingat Kalender (29 Jan) &amp; Bagikan Undangan
                  </span>
                  {(copiedShareText || downloadedIcsToast) && (
                    <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold">
                      {copiedShareText
                        ? 'Pesan Undangan WA Tersalin!'
                        : 'File Kalender (.ics) Terunduh!'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <a
                    href={getGoogleCalendarHarlahUrl(createdRecord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      calendar_add_on
                    </span>
                    <span>Simpan ke Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDownloadIcs(createdRecord)}
                    className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-primary-fixed/40 border border-outline-variant/60 text-on-surface font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      download
                    </span>
                    <span>Unduh Kalender HP (.ics)</span>
                  </button>

                  <a
                    href={getWhatsAppShareUrl(createdRecord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Bagikan / Simpan ke WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyWhatsAppMessage(createdRecord)}
                    className="py-2.5 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/60 text-on-surface font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      content_copy
                    </span>
                    <span>
                      {copiedShareText ? 'Pesan Tersalin!' : 'Salin Pesan Undangan WA'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    if (onSelectParticipantForTicket) {
                      onSelectParticipantForTicket(createdRecord);
                    } else {
                      onNavigate('etiket');
                    }
                  }}
                  className="flex-1 py-3.5 px-5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                  <span>Buka &amp; Cetak E-Tiket QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSuccessModal(false);
                    setTimeout(() => {
                      guestbookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="py-3.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    menu_book
                  </span>
                  <span>Lihat di Buku Tamu</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Institutional Heritage Hero Header */}
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
              Registrasi Tamu HARLAH &amp; Info KOPASUS
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                Rekrutmen KOPASUS Ditutup • Registrasi Tamu HARLAH Dibuka
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                Registrasi Tamu Undangan Acara HARLAH SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Pendaftaran anggota baru SIMAK{' '}
                <strong className="text-on-surface">hanya dibuka melalui KOPASUS</strong> (saat ini telah selesai dan akan dibuka kembali di periode selanjutnya). Untuk agenda terdekat pada{' '}
                <strong className="text-primary">29 Januari</strong>, kami membuka{' '}
                <strong className="text-on-surface">Pendaftaran Khusus Tamu &amp; Peserta Umum</strong>{' '}
                yang ingin ikut serta menghadiri acara puncak HARLAH SIMAK.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('harlah-guest');
                    handleAutoFillDemo();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Isi Contoh Data Tamu HARLAH</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('etiket')}
                  className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    qr_code_2
                  </span>
                  <span>Sudah Daftar? Ambil E-Tiket Tamu</span>
                </button>
              </div>
            </div>

            {/* Live Countdown Widget for HARLAH SIMAK 29 Januari */}
            <div data-gsap="hero-media" className="lg:col-span-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-tertiary-fixed font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
                    Hitung Mundur HARLAH SIMAK
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/15 text-[11px] font-bold">
                    29 Januari
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-xs">
                    <div className="font-headline-md text-headline-md font-extrabold tabular-nums text-white">
                      {String(days).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-fixed">
                      Hari
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-xs">
                    <div className="font-headline-md text-headline-md font-extrabold tabular-nums text-white">
                      {String(hours).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-fixed">
                      Jam
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-xs">
                    <div className="font-headline-md text-headline-md font-extrabold tabular-nums text-white">
                      {String(minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-fixed">
                      Menit
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/25 backdrop-blur-xs">
                    <div className="font-headline-md text-headline-md font-extrabold tabular-nums text-tertiary-fixed">
                      {String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-primary-fixed">
                      Detik
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-primary-fixed pt-1 border-t border-white/15">
                  <span>Rekrutmen KOPASUS: Ditutup</span>
                  <span className="font-bold text-white">
                    Tamu Terdaftar: {harlahGuests.length} Orang
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl space-y-12 w-full">
        {/* 2-Tab Mode Switcher: Registrasi Tamu HARLAH (Dibuka) vs Rekrutmen KOPASUS (Ditutup) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setActiveMode('harlah-guest')}
            className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-4 ${
              activeMode === 'harlah-guest'
                ? 'border-primary bg-surface-container-lowest shadow-md ring-4 ring-primary/10'
                : 'border-outline-variant/50 bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">celebration</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[11px] font-extrabold uppercase tracking-wider">
                    Sedang Dibuka • 29 Januari
                  </span>
                </div>
                <h2 className="text-headline-sm font-extrabold text-on-surface mt-1">
                  Registrasi Tamu Acara HARLAH SIMAK
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Pendaftaran khusus bagi tamu undangan, mahasiswa umum, delegasi UKM/BEM, &amp; alumni yang ingin hadir di acara Hari Lahir SIMAK.
                </p>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[24px] shrink-0 ${
                activeMode === 'harlah-guest' ? 'text-primary' : 'text-outline'
              }`}
            >
              {activeMode === 'harlah-guest' ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('kopasus-closed')}
            className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between gap-4 ${
              activeMode === 'kopasus-closed'
                ? 'border-primary bg-surface-container-lowest shadow-md ring-4 ring-primary/10'
                : 'border-outline-variant/50 bg-surface-container-low hover:bg-surface-container'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-surface-container-highest text-on-surface-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock_clock</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-extrabold uppercase tracking-wider">
                    Sudah Lewat • Waiting List Periode Depan
                  </span>
                </div>
                <h2 className="text-headline-sm font-extrabold text-on-surface mt-1">
                  Pendaftaran Anggota Baru (KOPASUS)
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  Satu-satunya jalur rekrutmen kader SIMAK. Periode ini telah selesai; daftarkan diri di Waiting List untuk periode selanjutnya.
                </p>
              </div>
            </div>
            <span
              className={`material-symbols-outlined text-[24px] shrink-0 ${
                activeMode === 'kopasus-closed' ? 'text-primary' : 'text-outline'
              }`}
            >
              {activeMode === 'kopasus-closed' ? 'notifications_active' : 'lock'}
            </span>
          </button>
        </div>

        {/* MODE 2: KOPASUS CLOSED / LOCKED VIEW + WAITING LIST NEXT PERIOD */}
        {activeMode === 'kopasus-closed' ? (
          <div className="space-y-8">
            <div className="bg-surface-container-lowest rounded-2xl border-2 border-outline-variant/60 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-container-high pb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px]">lock_clock</span>
                  </div>
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase font-bold tracking-wider">
                      Status Rekrutmen Kader: Ditutup Sementara
                    </span>
                    <h2 className="text-headline-lg font-extrabold text-on-surface">
                      Pendaftaran KOPASUS Periode Ini Telah Selesai
                    </h2>
                    <p className="text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                      Pendaftaran untuk menjadi <strong>Anggota / Kader Resmi SIMAK</strong> hanya dilakukan melalui program{' '}
                      <strong>Komunikasi Pendidikan Khusus (KOPASUS)</strong>. Karena kegiatan KOPASUS periode ini telah lewat, Anda dapat mencatatkan nama pada{' '}
                      <strong className="text-primary">Formulir Waiting List Prioritas</strong> di bawah agar dihubungi panitia begitu KOPASUS periode selanjutnya dibuka.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveMode('harlah-guest')}
                  className="px-5 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-label-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">celebration</span>
                  <span>Daftar Tamu HARLAH (29 Januari)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span>Hanya Melalui KOPASUS</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    SIMAK tidak membuka pendaftaran anggota baru di luar siklus KOPASUS guna menjaga kualitas kaderisasi, integritas, dan pembinaan berjenjang.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                    <span>Notifikasi Prioritas Gelombang I</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Mahasiswa yang terdaftar di Waiting List akan menerima undangan pembukaan seleksi KOPASUS periode berikutnya lebih awal melalui WhatsApp &amp; Email.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-primary-fixed/40 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                    <span>Ikut Serta Sebagai Tamu HARLAH</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Sambil menunggu KOPASUS periode depan, mahasiswa umum dapat mendaftar sebagai{' '}
                    <strong>Tamu / Peserta Seminar Nasional HARLAH SIMAK pada 29 Januari</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* WAITING LIST FORM & LIVE QUEUE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high pb-4">
                  <div>
                    <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                      Antrean Prioritas Calon Kader Baru
                    </span>
                    <h3 className="text-headline-md font-extrabold text-on-surface">
                      Formulir Waiting List KOPASUS Periode Selanjutnya
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillWaitlistDemo}
                    className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
                    <span>Isi Contoh Calon Kader</span>
                  </button>
                </div>

                {wlSubmittedEntry && (
                  <div className="p-5 rounded-xl bg-primary-fixed/40 border-2 border-primary space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-primary">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Berhasil Masuk Waiting List KOPASUS Periode Selanjutnya
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-primary text-on-primary font-mono text-xs font-bold">
                        {wlSubmittedEntry.queueCode}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      Halo <strong>{wlSubmittedEntry.fullName}</strong> ({wlSubmittedEntry.nim}), data Anda telah tercatat di antrean prioritas Divisi Litbang &amp; Kaderisasi SIMAK. Kami akan mengirimkan notifikasi pembukaan KOPASUS ke WhatsApp{' '}
                      <strong>{wlSubmittedEntry.whatsapp}</strong>.
                    </p>
                  </div>
                )}

                {wlError && (
                  <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{wlError}</span>
                  </div>
                )}

                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Nama Lengkap Calon Kader <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={wlName}
                        onChange={(e) => setWlName(e.target.value)}
                        placeholder="Contoh: Raisa Kamila Azzahra"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        NIM Mahasiswa <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={wlNim}
                        onChange={(e) => setWlNim(e.target.value)}
                        placeholder="Contoh: CA251110309"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md font-mono uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Semester Saat Ini
                      </label>
                      <select
                        value={wlSemester}
                        onChange={(e) => setWlSemester(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                      >
                        <option>Semester 1 (Mahasiswa Baru)</option>
                        <option>Semester 2</option>
                        <option>Semester 3</option>
                        <option>Semester 4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Nomor WhatsApp Aktif <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        value={wlWhatsapp}
                        onChange={(e) => setWlWhatsapp(e.target.value)}
                        placeholder="Contoh: 081377889922"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Email Mahasiswa <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        value={wlEmail}
                        onChange={(e) => setWlEmail(e.target.value)}
                        placeholder="nama@student.stiami.ac.id"
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Program Studi
                      </label>
                      <select
                        value={wlProdi}
                        onChange={(e) => setWlProdi(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                      >
                        {INSTITUTION_OR_PRODI_LIST.slice(0, 5).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Divisi SIMAK yang Diminati (8 Divisi)
                      </label>
                      <select
                        value={wlDivision}
                        onChange={(e) => setWlDivision(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                      >
                        <option>Divisi Acara (Waketum 1)</option>
                        <option>Divisi Koordinator Lapangan / Korlap (Waketum 1)</option>
                        <option>Divisi Dokumentasi (Waketum 2 - KOMINTEK)</option>
                        <option>Divisi Desain (Waketum 2 - KOMINTEK)</option>
                        <option>Divisi Ekonomi Kreatif (Waketum 3)</option>
                        <option>Divisi Humas (Waketum 3)</option>
                        <option>Divisi Perlengkapan (Waketum 4)</option>
                        <option>Divisi Konsumsi (Waketum 4)</option>
                        <option>Kesekretariatan / Kebendaharaan BPH</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-label-md font-bold text-on-surface mb-1">
                        Motivasi Singkat Bergabung di KOPASUS Periode Depan
                      </label>
                      <textarea
                        rows={2}
                        value={wlReason}
                        onChange={(e) => setWlReason(e.target.value)}
                        placeholder="Tuliskan alasan Anda ingin mengikuti KOPASUS pada periode selanjutnya..."
                        className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      notifications_active
                    </span>
                    <span>Simpan ke Waiting List KOPASUS Periode Selanjutnya</span>
                  </button>
                </form>
              </div>

              {/* Right Column: Waiting List Queue */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                  <div>
                    <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                      Daftar Antrean Prioritas
                    </span>
                    <h3 className="text-headline-sm font-extrabold text-on-surface">
                      Calon Peserta KOPASUS Periode Depan
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                    {waitlistEntries.length} Terdaftar
                  </span>
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {waitlistEntries.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-extrabold text-primary bg-primary-fixed/60 px-2 py-0.5 rounded">
                          {item.queueCode}
                        </span>
                        <span className="text-[11px] font-semibold text-secondary">
                          {item.semester}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">{item.fullName}</div>
                        <div className="text-xs text-secondary">
                          NIM: {item.nim} • {item.preferredDivision}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant italic leading-relaxed">
                        &ldquo;{item.reason}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Confirmation Alert when Guest Registration Succeeds */}
            {createdRecord && (
              <div
                ref={confirmationRef}
                className="bg-emerald-50/90 border-2 border-emerald-600 rounded-2xl p-6 sm:p-8 shadow-lg space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-600/20 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">verified</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[11px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping" />
                          STATUS WEB: SUDAH TERDAFTAR RESMI
                        </span>
                        <span className="text-xs font-bold text-emerald-900">
                          • HARLAH SIMAK (29 Januari)
                        </span>
                      </div>
                      <h2 className="text-headline-md font-extrabold text-on-surface mt-1.5">
                        Halo, {createdRecord.fullName}! Anda Sudah Terdaftar.
                      </h2>
                      <p className="text-body-md text-on-surface-variant mt-0.5">
                        Kehadiran Anda sebagai <strong>{createdRecord.semester}</strong> pada Puncak{' '}
                        <strong>Hari Lahir (HARLAH) SIMAK — 29 Januari</strong> telah tercatat di database web &amp; Buku Tamu Digital.
                      </p>
                    </div>
                  </div>
                  <div className="bg-white px-4 py-3 rounded-xl border-2 border-emerald-600/30 text-right shrink-0 shadow-xs">
                    <div className="text-[11px] font-bold uppercase text-emerald-800">
                      KODE E-TIKET TAMU ANDA
                    </div>
                    <div className="font-mono text-lg font-extrabold text-primary">
                      {createdRecord.ticketCode}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-800">
                      Kursi Tamu: {createdRecord.seatNumber}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-body-md text-on-surface">
                    Gunakan tombol di samping untuk melihat detail bukti pendaftaran, mengunduh{' '}
                    <strong>E-Tiket QR Code</strong>, atau melihat nama Anda di Buku Tamu:
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowSuccessModal(true)}
                      className="px-4 py-2.5 rounded-lg bg-white border border-emerald-600 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      <span>Lihat Bukti Terdaftar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        guestbookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="px-4 py-2.5 rounded-lg bg-white border border-outline-variant text-on-surface font-bold text-xs hover:bg-surface-container transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        menu_book
                      </span>
                      <span>Cek Nama di Buku Tamu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectParticipantForTicket) {
                          onSelectParticipantForTicket(createdRecord);
                        } else {
                          onNavigate('etiket');
                        }
                      }}
                      className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-primary-container transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        confirmation_number
                      </span>
                      <span>Buka E-Tiket Tamu &amp; Sertifikat HARLAH</span>
                    </button>
                  </div>
                </div>

                {/* Quick Calendar & WhatsApp Share Strip inside Persistent Registered Card */}
                <div className="pt-4 border-t border-emerald-600/20 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <span className="material-symbols-outlined text-[18px] text-emerald-700">
                      notifications_active
                    </span>
                    <span>
                      Simpan Pengingat Jadwal HARLAH (29 Januari • 08.30 WIB) &amp; Bagikan Bukti Tiket:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={getGoogleCalendarHarlahUrl(createdRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-600/40 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        calendar_add_on
                      </span>
                      <span>Google Calendar</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDownloadIcs(createdRecord)}
                      className="px-3 py-2 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-600/40 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        download
                      </span>
                      <span>
                        {downloadedIcsToast ? 'Kalender .ics Terunduh!' : 'Kalender HP (.ics)'}
                      </span>
                    </button>
                    <a
                      href={getWhatsAppShareUrl(createdRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      <span>Share ke WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyWhatsAppMessage(createdRecord)}
                      className="px-3 py-2 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-600/40 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        content_copy
                      </span>
                      <span>
                        {copiedShareText ? 'Pesan WA Tersalin!' : 'Salin Pesan Undangan'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Status Checker Bar: Cek Apakah Nama / NIM / WA Sudah Terdaftar */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">fact_check</span>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-on-surface">
                    Cek Status Terdaftar Tamu HARLAH (Verifikasi Cepat)
                  </h3>
                  <p className="text-xs text-secondary">
                    Ketik Nama, NIM/ID, Nomor WhatsApp, atau Kode Tiket untuk mengecek apakah Anda sudah terdaftar di sistem web.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-80">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary absolute left-3 top-1/2 -translate-y-1/2">
                    search
                  </span>
                  <input
                    type="text"
                    value={statusCheckQuery}
                    onChange={(e) => setStatusCheckQuery(e.target.value)}
                    placeholder="Cek Nama / NIM / No. WA..."
                    className="w-full pl-9 pr-8 py-2 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-xs font-medium"
                  />
                  {statusCheckQuery && (
                    <button
                      type="button"
                      onClick={() => setStatusCheckQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {statusCheckQuery.trim().length >= 3 && (
              <div
                className={`p-4 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  existingMatchedGuest
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                    : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
                }`}
              >
                {existingMatchedGuest ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-emerald-600 text-[28px]">
                        verified
                      </span>
                      <div>
                        <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                          DATA DITEMUKAN • SUDAH TERDAFTAR RESMI
                        </span>
                        <div className="font-bold text-sm text-on-surface mt-1">
                          {existingMatchedGuest.fullName} ({existingMatchedGuest.nim}) —{' '}
                          <span className="text-primary font-mono">
                            {existingMatchedGuest.ticketCode}
                          </span>
                        </div>
                        <div className="text-xs text-secondary">
                          Kategori: {existingMatchedGuest.semester} • Kursi:{' '}
                          {existingMatchedGuest.seatNumber}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectParticipantForTicket) {
                          onSelectParticipantForTicket(existingMatchedGuest);
                        } else {
                          onNavigate('etiket');
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>Buka E-Tiket</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[20px] text-secondary">
                      info
                    </span>
                    <span>
                      Belum ditemukan data tamu HARLAH untuk pencarian{' '}
                      <strong>&ldquo;{statusCheckQuery}&rdquo;</strong>. Silakan isi formulir pendaftaran di bawah.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Main Guest Registration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Left 8 Cols */}
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 sm:p-8 shadow-xs space-y-8"
              >
                {/* Step 1: Kategori Tamu Undangan HARLAH */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-extrabold flex items-center justify-center">
                        1
                      </span>
                      Pilih Kategori Tamu Acara HARLAH (29 Januari)
                    </h2>
                    <span className="text-xs font-semibold text-primary">Khusus Tamu Acara</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {GUEST_CATEGORY_LIST.map((cat) => {
                      const selected = guestCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setGuestCategory(cat.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            selected
                              ? 'border-primary bg-primary-fixed/30'
                              : 'border-outline-variant/50 hover:border-outline bg-surface-container-low'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[20px]">
                                {cat.icon}
                              </span>
                              <span className="font-bold text-on-surface text-sm">{cat.title}</span>
                            </div>
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                selected ? 'text-primary' : 'text-on-surface-variant/50'
                              }`}
                            >
                              {selected ? 'radio_button_checked' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                            {cat.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Identitas Tamu Undangan */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/40">
                  <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-extrabold flex items-center justify-center">
                      2
                    </span>
                    Data Diri Tamu Undangan / Peserta Seminar
                  </h2>

                  {errorMessage && (
                    <div className="p-3.5 rounded-lg bg-error-container text-on-error-container text-body-md font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">error</span>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        Nama Lengkap Tamu (Untuk E-Tiket &amp; E-Sertifikat){' '}
                        <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Bagas Adi Nugroho"
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        NIM / Kode Delegasi / No. Identitas <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="Contoh: CA241110775 / BEM-STIAMI"
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md font-mono font-semibold uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        Nomor WhatsApp Aktif (Pengiriman Tiket) <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Contoh: 081288943210"
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md font-mono font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        Email Aktif <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        Asal Kampus / Lokasi Kehadiran
                      </label>
                      <select
                        value={campus}
                        onChange={(e) => setCampus(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md font-medium"
                      >
                        {CAMPUS_LIST.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-label-md font-bold text-on-surface mb-1.5">
                        Asal Instansi / Organisasi / Program Studi
                      </label>
                      <select
                        value={programStudi}
                        onChange={(e) => setProgramStudi(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:outline-none text-body-md font-medium"
                      >
                        {INSTITUTION_OR_PRODI_LIST.map((inst) => (
                          <option key={inst} value={inst}>
                            {inst}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: Sesi Kehadiran Tamu di Acara HARLAH */}
                <div className="space-y-4 pt-4 border-t border-outline-variant/40">
                  <h2 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary text-on-primary text-xs font-extrabold flex items-center justify-center">
                      3
                    </span>
                    Sesi Acara HARLAH yang Akan Dihadiri
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    {HARLAH_SESSION_OPTIONS.map((opt) => {
                      const isSelected = sessionChoice === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setSessionChoice(opt.name)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary-fixed/35 shadow-xs'
                              : 'border-outline-variant/50 bg-surface-container-low hover:border-outline'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="material-symbols-outlined text-primary text-[20px]">
                                {opt.icon}
                              </span>
                              <span className="font-bold text-sm text-on-surface">{opt.name}</span>
                            </div>
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-label-md font-bold text-on-surface mb-1.5">
                      Ucapan Selamat / Pesan untuk Hari Lahir (HARLAH) SIMAK (Tampil di Buku Tamu)
                    </label>
                    <textarea
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Tuliskan ucapan selamat atau harapan Anda untuk perjalanan SIMAK di usia ke-15..."
                      className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-outline-variant focus:border-primary focus:bg-surface-container-lowest focus:outline-none text-body-md"
                    />
                  </div>
                </div>

                {/* Step 4: Konfirmasi Tamu */}
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedPledge}
                      onChange={(e) => setAgreedPledge(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary rounded"
                    />
                    <span className="text-xs sm:text-body-md text-on-surface leading-relaxed">
                      <strong>Konfirmasi Kehadiran Tamu Undangan:</strong> Saya bersedia hadir sebagai tamu/peserta pada Peringatan Hari Lahir (HARLAH) SIMAK tanggal 29 Januari di Auditorium Institut STIAMI serta menunjukkan E-Tiket QR Code pada meja registrasi tamu.
                    </span>
                  </label>
                </div>

                {/* Live Notification right inside the Form when user is already registered or matches existing record */}
                {(createdRecord || existingMatchedGuest) && (
                  <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-700 text-[24px] shrink-0 mt-0.5">
                        verified
                      </span>
                      <div className="text-xs leading-relaxed">
                        <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                          NOTIFIKASI WEB: SUDAH TERDAFTAR DI HARLAH SIMAK
                        </span>
                        <p className="text-on-surface font-semibold mt-1">
                          Tercatat atas nama{' '}
                          <strong>
                            {(existingMatchedGuest || createdRecord)?.fullName}
                          </strong>{' '}
                          • Kode Tiket:{' '}
                          <strong className="font-mono text-primary">
                            {(existingMatchedGuest || createdRecord)?.ticketCode}
                          </strong>{' '}
                          ({(existingMatchedGuest || createdRecord)?.seatNumber}).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const target = existingMatchedGuest || createdRecord;
                        if (target && onSelectParticipantForTicket) {
                          onSelectParticipantForTicket(target);
                        } else {
                          onNavigate('etiket');
                        }
                      }}
                      className="px-3.5 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>Lihat E-Tiket Saya</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  {createdRecord ? (
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3.5 py-2 rounded-lg">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>
                        Status Anda: Sudah Terdaftar ({createdRecord.ticketCode})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-secondary">
                      * Notifikasi bukti terdaftar &amp; E-Tiket akan langsung muncul di layar setelah tombol diklik.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-extrabold text-label-lg shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {createdRecord ? 'person_add' : 'confirmation_number'}
                    </span>
                    <span>
                      {createdRecord
                        ? 'Daftarkan Tamu Lain & Terbitkan E-Tiket Baru'
                        : 'Daftar Sebagai Tamu HARLAH & Terbitkan E-Tiket'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Right Info Sidebar 4 Cols */}
              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2.5 text-primary font-bold">
                    <span className="material-symbols-outlined text-[22px]">policy</span>
                    <h3 className="text-headline-sm font-bold text-on-surface">
                      Aturan Pendaftaran di SIMAK
                    </h3>
                  </div>
                  <ul className="space-y-3 text-body-md text-on-surface-variant">
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                        lock_clock
                      </span>
                      <span>
                        <strong>Rekrutmen Anggota Baru Hanya di KOPASUS:</strong> Saat ini pendaftaran KOPASUS telah ditutup karena acara sudah lewat, dan baru akan dibuka kembali di periode selanjutnya.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                        celebration
                      </span>
                      <span>
                        <strong>HARLAH Khusus Tamu Acara:</strong> Formulir di halaman ini khusus untuk mendata tamu undangan, mahasiswa umum, delegasi UKM/BEM, &amp; alumni yang ingin menghadiri perayaan HARLAH 29 Januari.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary text-on-primary rounded-2xl p-6 space-y-4 shadow-md">
                  <div className="text-label-sm uppercase tracking-widest text-on-tertiary-container font-bold">
                    FASILITAS TAMU UNDANGAN HARLAH
                  </div>
                  <h3 className="text-headline-sm font-bold">
                    Apa yang Didapatkan Tamu Acara 29 Januari?
                  </h3>
                  <ul className="space-y-2.5 text-body-md text-primary-fixed">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                        qr_code_2
                      </span>
                      <span>E-Tiket Kursi Tamu Auditorium (Guest Pass)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                        workspace_premium
                      </span>
                      <span>E-Sertifikat Resmi Seminar Nasional HARLAH</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                        forum
                      </span>
                      <span>Akses Dialog Publik bersama Tokoh Antikorupsi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">
                        menu_book
                      </span>
                      <span>Souvenir &amp; Paket Modul Edukasi Integritas</span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </>
        )}

        {/* RUNDOWN ACARA PUNCAK HARLAH SIMAK (29 JANUARI) */}
        <section className="space-y-6 pt-6 border-t border-surface-container-high">
          <div
            data-gsap="section-header"
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Susunan Acara Resmi • 29 Januari
              </span>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface mt-1">
                Rundown Puncak HARLAH SIMAK &amp; Seminar Nasional
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Panduan jadwal sesi bagi seluruh Tamu Undangan, Delegasi BEM/UKM, dan Peserta Seminar di Auditorium Utama Institut STIAMI.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              <span>Auditorium Utama Lt. 4 • Institut STIAMI Pusat</span>
            </div>
          </div>

          <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {HARLAH_RUNDOWN_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary-fixed text-on-primary-fixed font-mono text-xs font-extrabold">
                      {item.time}
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </span>
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary pt-1">
                    {item.phase}
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                    {item.title}
                  </h3>
                </div>
                <div className="pt-3 border-t border-surface-container space-y-1">
                  <div className="text-[11px] text-secondary font-semibold">Narasumber / PIC:</div>
                  <div className="text-xs font-bold text-on-surface leading-snug">{item.speaker}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BUKU TAMU DIGITAL & DINDING UCAPAN SELAMAT HARLAH (LIVE GUESTBOOK) */}
        <section
          ref={guestbookRef}
          id="buku-tamu-harlah"
          className="space-y-6 pt-6 border-t border-surface-container-high"
        >
          <div
            data-gsap="section-header"
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
          >
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Live RSVP &amp; Guestbook • 29 Januari
              </span>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface mt-1">
                Buku Tamu Digital &amp; Dinding Ucapan HARLAH SIMAK
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Daftar tamu undangan, delegasi organisasi, dan alumni yang telah mengonfirmasi kehadiran beserta doa &amp; harapan untuk SIMAK.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                'Semua',
                'Mahasiswa Umum STIAMI',
                'Delegasi Ormawa / Kampus Mitra',
                'Alumni SIMAK',
                'Tamu Undangan Umum',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setGuestCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    guestCategoryFilter === cat
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-secondary hover:text-on-surface'
                  }`}
                >
                  {cat === 'Semua' ? `Semua Tamu (${harlahGuests.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          <div
            data-gsap="stagger-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredHarlahGuests.map((guest) => {
              const isMyGuestCard =
                createdRecord?.id === guest.id ||
                createdRecord?.ticketCode === guest.ticketCode;
              return (
                <div
                  key={guest.id}
                  className={`p-5 rounded-2xl bg-surface-container-lowest shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                    isMyGuestCard
                      ? 'border-2 border-emerald-600 ring-4 ring-emerald-500/15'
                      : 'border border-outline-variant/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={guest.avatarUrl}
                          alt={guest.fullName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-primary/30 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-on-surface leading-tight">
                            {guest.fullName}
                          </h3>
                          <p className="text-xs text-secondary">{guest.programStudi}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-mono text-[11px] font-bold shrink-0">
                        {guest.seatNumber}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {isMyGuestCard && (
                        <span className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider">
                          Pendaftaran Anda • Sudah Terdaftar
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-[11px] font-bold">
                        {guest.semester}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                        Hadir Terkonfirmasi
                      </span>
                    </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-low border-l-3 border-primary text-xs text-on-surface italic leading-relaxed">
                    &ldquo;{guest.motivation}&rdquo;
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-secondary">{guest.ticketCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectParticipantForTicket) {
                        onSelectParticipantForTicket(guest);
                      } else {
                        onNavigate('etiket');
                      }
                    }}
                    className="text-primary font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
                    <span>Lihat Pas Tamu</span>
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Kalender Siklus Kegiatan Tahunan SIMAK */}
        <section className="space-y-6 pt-4 border-t border-surface-container-high">
          <div
            data-gsap="section-header"
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Status Real-Time 6 Program Kerja
              </span>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface mt-1">
                Kalender &amp; Status Siklus Proker SIMAK
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Pendaftaran anggota baru hanya dibuka saat KOPASUS berlangsung. Untuk HARLAH 29 Januari, pendaftaran dibuka khusus bagi tamu undangan acara.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold self-start md:self-auto">
              Agenda Terdekat: HARLAH SIMAK (29 Januari)
            </span>
          </div>

          <div
            data-gsap="stagger-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {ANNUAL_CALENDAR_EVENTS.map((ev) => (
              <div
                key={ev.title}
                className={`p-5 rounded-2xl bg-surface-container-lowest border shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                  ev.month.includes('29 Januari')
                    ? 'border-2 border-primary ring-2 ring-primary/10'
                    : 'border-outline-variant/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      {ev.month}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${ev.statusClass}`}
                    >
                      {ev.status}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{ev.icon}</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                        {ev.category}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                        {ev.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant pt-1 leading-relaxed">
                    {ev.note}
                  </p>
                </div>
                <div className="pt-3 border-t border-surface-container flex items-center gap-1.5 text-xs text-secondary">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    location_on
                  </span>
                  <span>{ev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Interaktif Pendaftaran Tamu HARLAH & Penempatan 8 Divisi KOPASUS */}
        <section className="space-y-5 pt-6 border-t border-surface-container-high">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Panduan Cepat Pendaftar
              </span>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface mt-1">
                Tanya Jawab Seputar Registrasi HARLAH, KOPASUS &amp; 8 Divisi SIMAK
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('direktori')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors self-start md:self-auto cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Eksplorasi 8 Divisi di Direktori</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                id: 'reg-faq-1',
                q: 'Bagaimana tanda bahwa saya sudah resmi terdaftar di web untuk acara HARLAH 29 Januari?',
                a: 'Begitu Anda klik tombol Konfirmasi Kehadiran, akan muncul Modal Konfirmasi Resmi Terdaftar, notifikasi di pojok kanan atas layar, lencana hijau "Terdaftar HARLAH" di Navbar, serta kartu Anda muncul di urutan teratas Buku Tamu Digital.',
              },
              {
                id: 'reg-faq-2',
                q: 'Bagaimana cara menyimpan jadwal HARLAH ke Kalender HP dan membagikannya ke WhatsApp?',
                a: 'Pada kartu bukti pendaftaran maupun modal sukses, klik tombol "Simpan ke Google Calendar" atau "Unduh Kalender HP (.ics)" untuk menyetel alarm otomatis H-1 (28 Jan) & Hari-H (29 Jan), serta klik "Bagikan / Simpan ke WhatsApp" untuk mengirim tiket ke chat Anda.',
              },
              {
                id: 'reg-faq-3',
                q: 'Kapan saya bisa memilih salah satu dari 8 Divisi SIMAK (Acara, Korlap, Dokumentasi, Desain, Ekraf, Humas, Perlengkapan, Konsumsi)?',
                a: 'Pemilihan dan penempatan ke dalam 8 Divisi Teknis di bawah 4 Wakil Ketua Umum dilakukan khusus bagi anggota baru yang mendaftar melalui jalur KOPASUS pada periode pembukaan berikutnya.',
              },
              {
                id: 'reg-faq-4',
                q: 'Apakah saya tetap bisa melihat E-Tiket jika halaman web di-refresh atau ditutup?',
                a: 'Ya! Data pendaftaran HARLAH Anda tersimpan secara otomatis di peramban (localStorage) sehingga lencana "Terdaftar HARLAH" dan tombol melayang "E-Tiket Saya" tetap aktif kapan pun Anda kembali membuka web.',
              },
            ].map((faq) => {
              const isOpen = openRegFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl bg-surface-container-lowest border transition-all overflow-hidden ${
                    isOpen
                      ? 'border-primary shadow-sm ring-2 ring-primary/10'
                      : 'border-outline-variant/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenRegFaq(isOpen ? null : faq.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">
                        help
                      </span>
                      <span className="font-bold text-sm text-on-surface leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[20px] text-secondary transition-transform shrink-0 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 pl-11 border-t border-surface-container text-xs text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
