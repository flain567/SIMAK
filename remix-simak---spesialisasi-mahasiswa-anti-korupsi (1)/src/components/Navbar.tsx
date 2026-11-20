import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, ParticipantRecord } from '../types';

interface NavbarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  participantCount: number;
  myHarlahRegistration?: ParticipantRecord | null;
}

const HOME_SECTIONS: { label: string; href: string; id: string; screen?: ScreenId }[] = [
  { label: 'Beranda', href: '#top', id: 'top' },
  { label: 'Program Kerja', href: '#program-detail', id: 'program-detail', screen: 'program-detail' },
  { label: 'Tentang Kami', href: '#tentang-kami', id: 'tentang-kami' },
  { label: 'Direktori Kader', href: '#direktori', id: 'direktori', screen: 'direktori' },
  { label: 'Galeri', href: '#galeri', id: 'galeri', screen: 'galeri' },
  { label: 'Danus Store', href: '#merchandise', id: 'merchandise', screen: 'merchandise' },
  { label: 'E-Library', href: '#elibrary', id: 'elibrary', screen: 'elibrary' },
  { label: 'Whistleblower', href: '#whistleblower', id: 'whistleblower', screen: 'whistleblower' },
];

const PORTAL_ITEMS: { id: ScreenId; label: string; desc: string; icon: string }[] = [
  {
    id: 'program-detail',
    label: 'Kanvas 6 Program Unggulan',
    desc: 'Roadmap KOPASUS Day 1-3, HARLAH, TOT KPK & 9 Nilai Integritas',
    icon: 'view_timeline',
  },
  {
    id: 'merchandise',
    label: 'SIMAK Store & Danus HARLAH',
    desc: 'Official merchandise & cenderamata penggalangan dana',
    icon: 'storefront',
  },
  {
    id: 'pendaftaran',
    label: 'Registrasi Tamu HARLAH',
    desc: 'Daftar hadir tamu acara HARLAH 29 Jan (KOPASUS Ditutup)',
    icon: 'confirmation_number',
  },
  {
    id: 'etiket',
    label: 'E-Tiket & Piagam Integritas',
    desc: 'Unduh tiket QR Code & cetak sertifikat KOPASUS',
    icon: 'workspace_premium',
  },
  {
    id: 'kartu-ujian',
    label: 'Kartu Ujian (KTPU) & Simulasi',
    desc: 'Jadwal sesi tes tertulis & simulasi soal',
    icon: 'badge',
  },
  {
    id: 'direktori',
    label: 'Direktori & Buku Induk',
    desc: 'Silsilah 15 angkatan & profil kader aktif',
    icon: 'groups',
  },
  {
    id: 'galeri',
    label: 'Galeri & Dokumentasi',
    desc: 'Arsip 15 tahun aksi, KOPASUS, & liputan pers',
    icon: 'photo_library',
  },
  {
    id: 'elibrary',
    label: 'E-Library Integritas',
    desc: 'Modul antikorupsi & kanal advokasi',
    icon: 'local_library',
  },
  {
    id: 'whistleblower',
    label: 'Kanal Whistleblowing (WBS)',
    desc: 'Pengaduan integritas anonim & lacak laporan',
    icon: 'security',
  },
  {
    id: 'transparansi',
    label: 'Transparansi & Laporan Kas',
    desc: 'Buku Kas Umum terbuka & audit nol-selisih',
    icon: 'fact_check',
  },
  {
    id: 'admin',
    label: 'Panel Satgas & Panitia',
    desc: 'Verifikasi pendaftar, audit WBS & jejak audit',
    icon: 'admin_panel_settings',
  },
];

interface SearchableEntry {
  id: string;
  category: 'Layanan Portal' | 'Kader & Pengurus' | 'Modul E-Library' | 'Agenda & Arsip';
  title: string;
  subtitle: string;
  icon: string;
  screen: ScreenId;
}

const GLOBAL_SEARCH_INDEX: SearchableEntry[] = [
  // Layanan Portal
  {
    id: 'srv-merch',
    category: 'Layanan Portal',
    title: 'SIMAK Store & Toko Merchandise Dana Usaha (Danus HARLAH 16)',
    subtitle: 'Beli kaos resmi, lanyard KOPASUS, tumbler, tote bag & paket cinderamata',
    icon: 'storefront',
    screen: 'merchandise',
  },
  {
    id: 'srv-1',
    category: 'Layanan Portal',
    title: 'Registrasi Tamu Acara HARLAH SIMAK (29 Januari) & Status KOPASUS',
    subtitle: 'Daftar hadir tamu Seminar HARLAH (Rekrutmen anggota KOPASUS sedang ditutup)',
    icon: 'confirmation_number',
    screen: 'pendaftaran',
  },
  {
    id: 'srv-2',
    category: 'Layanan Portal',
    title: 'Cek E-Tiket & Generator Piagam Sertifikat Integritas',
    subtitle: 'Unduh Boarding Pass QR Code & cetak Piagam KOPASUS resmi (SHA-256)',
    icon: 'workspace_premium',
    screen: 'etiket',
  },
  {
    id: 'srv-3',
    category: 'Layanan Portal',
    title: 'Kartu Tanda Peserta Ujian (KTPU) & Simulasi Tes Antikorupsi',
    subtitle: 'Cetak kartu ujian seleksi tertulis & latihan soal 9 Nilai Integritas',
    icon: 'badge',
    screen: 'kartu-ujian',
  },
  {
    id: 'srv-4',
    category: 'Layanan Portal',
    title: 'Whistleblowing System (WBS) — Pengaduan Anonim Terenkripsi',
    subtitle: 'Lapor pungli, gratifikasi akademik, & lacak kode tiket WBS-2026',
    icon: 'security',
    screen: 'whistleblower',
  },
  {
    id: 'srv-5',
    category: 'Layanan Portal',
    title: 'Transparansi Anggaran & Buku Kas Umum (Zero-Discrepancy Audit)',
    subtitle: 'Laporan keuangan terbuka Rp 47,7 Juta & audit nol-selisih BPH',
    icon: 'fact_check',
    screen: 'transparansi',
  },
  // Kader & Pengurus (BPH & 8 Divisi Teknis)
  {
    id: 'kdr-1',
    category: 'Kader & Pengurus',
    title: 'Venus Sangia Alfarizi (NIM: 2024102001) — Ketua Umum SIMAK',
    subtitle: 'Mandataris MUBES Angkatan XV Satya Bhayangkara • Pimpinan Tertinggi BPH',
    icon: 'person',
    screen: 'direktori',
  },
  {
    id: 'kdr-2',
    category: 'Kader & Pengurus',
    title: 'Fathan Hendrawan (NIM: 2024102014) — Wakil Ketua Umum 1',
    subtitle: 'Membawahi Divisi Acara & Divisi Koordinator Lapangan (Korlap)',
    icon: 'event_note',
    screen: 'direktori',
  },
  {
    id: 'kdr-3',
    category: 'Kader & Pengurus',
    title: 'Dwi Agus Hidayat (NIM: 2024102019) — Wakil Ketua Umum 2 (KOMINTEK)',
    subtitle: 'Membawahi Divisi Dokumentasi & Divisi Desain Kreatif',
    icon: 'palette',
    screen: 'direktori',
  },
  {
    id: 'kdr-4',
    category: 'Kader & Pengurus',
    title: 'Putri Rizki Amelia (NIM: 2024102033) — Wakil Ketua Umum 3',
    subtitle: 'Membawahi Divisi Ekonomi Kreatif (Ekraf), Humas, Perlengkapan & Konsumsi',
    icon: 'storefront',
    screen: 'direktori',
  },
  {
    id: 'kdr-6',
    category: 'Kader & Pengurus',
    title: 'Elvira Wati Ningsi & Nabila Azzahra Putri — Sekretaris Umum 1 & 2',
    subtitle: 'Administrasi Kesekretariatan, Buku Induk NIA, Notulensi & Surat-Menyurat Eksternal',
    icon: 'description',
    screen: 'direktori',
  },
  {
    id: 'kdr-7',
    category: 'Kader & Pengurus',
    title: 'Rusni Ariantika (NIM: 2024102041) — Bendahara Umum SIMAK',
    subtitle: 'Akuntabilitas Finansial, Laporan Kas Terbuka & Audit Nol-Selisih',
    icon: 'account_balance_wallet',
    screen: 'direktori',
  },
  {
    id: 'kdr-8',
    category: 'Kader & Pengurus',
    title: '8 Divisi Teknis SIMAK: Acara, Korlap, Dokumentasi, Desain, Ekraf, Humas, Perlengkapan, Konsumsi',
    subtitle: 'Eksplorasi struktur divisi di bawah 3 Wakil Ketua Umum & filter kader per divisi',
    icon: 'account_tree',
    screen: 'direktori',
  },
  {
    id: 'kdr-9',
    category: 'Kader & Pengurus',
    title: 'Ariawan, S.AP., M.A. — Pendiri SIMAK (29 Januari 2011)',
    subtitle: 'Inisiator pendirian Spesialisasi Mahasiswa Anti Korupsi Institut STIAMI',
    icon: 'history_edu',
    screen: 'direktori',
  },
  // Modul E-Library
  {
    id: 'mod-1',
    category: 'Modul E-Library',
    title: 'Buku Pedoman Kaderisasi KOPASUS Batch XVI (PDF • 148 Hlm)',
    subtitle: 'Modul 01 Diklat Wajib • Prinsip Dasar Gerakan Moral & Etika Investigasi',
    icon: 'menu_book',
    screen: 'elibrary',
  },
  {
    id: 'mod-2',
    category: 'Modul E-Library',
    title: 'AD/ART Hasil MUBES & Kode Etik Perilaku Kader SIMAK',
    subtitle: 'Modul 02 Konstitusi SIMAK • Struktur Dewan Kehormatan & Disiplin',
    icon: 'gavel',
    screen: 'elibrary',
  },
  {
    id: 'mod-3',
    category: 'Modul E-Library',
    title: 'White Paper: Analisis Transparansi Anggaran Fasilitas Kampus',
    subtitle: 'Modul 03 Riset Kebijakan • Kajian serapan dana & keterbukaan informasi',
    icon: 'analytics',
    screen: 'elibrary',
  },
  {
    id: 'mod-4',
    category: 'Modul E-Library',
    title: 'Saku Integritas: 9 Nilai Antikorupsi KPK untuk Pelajar SMA/SMK',
    subtitle: 'Modul Edukasi SIMAK Goes To School • Jujur, Peduli, Mandiri, Berani',
    icon: 'cast_for_education',
    screen: 'elibrary',
  },
  // Agenda & Arsip
  {
    id: 'ars-1',
    category: 'Agenda & Arsip',
    title: 'Diklat Lapangan KOPASUS Batch XIV & XV — Cisarua, Bogor',
    subtitle: 'Galeri dokumentasi 120 kader baru, simulasi investigasi, & sumpah integritas',
    icon: 'photo_library',
    screen: 'galeri',
  },
  {
    id: 'ars-2',
    category: 'Agenda & Arsip',
    title: 'Training of Trainer (TOT) Bersama KPK RI & Mahkamah Agung',
    subtitle: 'Dokumentasi audiensi Gedung Merah Putih KPK RI & bedah Tipikor',
    icon: 'account_balance',
    screen: 'galeri',
  },
  {
    id: 'ars-3',
    category: 'Agenda & Arsip',
    title: 'SIMAK Goes To School & Ramadhan Integrity',
    subtitle: 'Roadshow edukasi antikorupsi 42+ sekolah & aksi santunan sosial',
    icon: 'volunteer_activism',
    screen: 'galeri',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  participantCount,
  myHarlahRegistration,
}) => {
  const [portalOpen, setPortalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [activeAnchor, setActiveAnchor] = useState('top');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setPortalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K and Escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setGlobalQuery('');
    }
  }, [searchModalOpen]);

  const filteredSearchEntries = GLOBAL_SEARCH_INDEX.filter((entry) => {
    const q = globalQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.subtitle.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q)
    );
  });

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    targetScreen?: ScreenId
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetScreen) {
      onNavigate(targetScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveAnchor(sectionId);

    if (activeScreen !== 'beranda') {
      onNavigate('beranda');
      setTimeout(() => {
        if (sectionId === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectScreen = (screen: ScreenId) => {
    onNavigate(screen);
    setPortalOpen(false);
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <a
            href="#top"
            onClick={(e) => handleSectionClick(e, 'top')}
            className="flex items-center gap-2.5 text-left focus:outline-none shrink-0"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDieLd4FWbknOilP9vJrwkV9-mi7SHHBdyLXm7CPZfAsBvy1PEQr38BL2Ke3TWdw1oDPajnzHk8ktddihhhvNqeG2Meaoti7kY-_8MjZtU0truuzI6oAQtT0BEU6aHZhN-uQSQflV8WpIhfm7DfECQUhkGLbcHpOINuoctNguGF31zycBy-luBj3RzGT_bOojErv_kzTgLrUaqPYY9-IwF58V592i3I9PmbT9aYCDfR8y3inBlzC-wHfdHcim_vWTaOURg"
              alt="Logo SIMAK"
              referrerPolicy="no-referrer"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary leading-none">
                  SIMAK
                </span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold whitespace-nowrap">
                  Sejak 2011
                </span>
              </div>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1 hidden sm:block whitespace-nowrap">
                Spesialisasi Mahasiswa Anti Korupsi
              </span>
            </div>
          </a>

          {/* Desktop Nav Links — Grouped cleanly in a subtle pill dock */}
          <nav
            className="hidden xl:flex items-center gap-0.5 p-1 rounded-xl bg-surface-container-low/80 border border-outline-variant/30"
            aria-label="Menu Utama"
          >
            {HOME_SECTIONS.map((sec) => {
              const isActive = sec.screen
                ? activeScreen === sec.screen
                : activeScreen === 'beranda' && activeAnchor === sec.id;
              return (
                <a
                  key={sec.id}
                  href={sec.href}
                  onClick={(e) => handleSectionClick(e, sec.id, sec.screen)}
                  aria-current={isActive ? 'page' : undefined}
                  className={
                    isActive
                      ? 'px-3 py-1.5 text-[13px] transition-all bg-primary-container text-on-primary font-bold rounded-lg shadow-xs whitespace-nowrap shrink-0'
                      : 'px-3 py-1.5 text-[13px] font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/70 rounded-lg transition-all whitespace-nowrap shrink-0'
                  }
                >
                  {sec.label}
                </a>
              );
            })}
          </nav>

          {/* Right Actions — Streamlined & Balanced */}
          <div className="flex items-center gap-2 shrink-0" ref={dropdownRef}>
            {/* Compact Command Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              title="Pencarian Cepat (Ctrl + K)"
              aria-label="Pencarian Cepat"
              className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[19px]">search</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setPortalOpen((prev) => !prev)}
                className={`hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                  activeScreen !== 'beranda'
                    ? 'bg-secondary-container text-on-secondary-fixed border-secondary/20'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[17px] text-primary">
                  grid_view
                </span>
                <span>Portal Kader</span>
                <span className="material-symbols-outlined text-[17px]">
                  {portalOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Portal Kader */}
              {portalOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 p-2 z-50">
                  <div className="px-3 py-1.5 flex items-center justify-between border-b border-outline-variant/30 mb-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Layanan Digital SIMAK
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {participantCount} Data
                    </span>
                  </div>
                  {PORTAL_ITEMS.map((item) => {
                    const isCurrent = activeScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectScreen(item.id)}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-surface-container text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                          {item.icon}
                        </span>
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="font-label-md text-label-md font-bold">
                              {item.label}
                            </span>
                            {item.id === 'pendaftaran' && myHarlahRegistration && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-extrabold uppercase tracking-wider shrink-0">
                                Terdaftar
                              </span>
                            )}
                          </div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                            {item.id === 'pendaftaran' && myHarlahRegistration
                              ? `Terdaftar Resmi: ${myHarlahRegistration.ticketCode}`
                              : item.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="#program-kerja"
              onClick={(e) => {
                e.preventDefault();
                handleSelectScreen('pendaftaran');
              }}
              title={
                myHarlahRegistration
                  ? `Anda Sudah Terdaftar: ${myHarlahRegistration.fullName} (${myHarlahRegistration.ticketCode})`
                  : 'Daftar Hadir Tamu HARLAH SIMAK (29 Januari)'
              }
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-[13px] font-bold rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0 ${
                myHarlahRegistration
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800 ring-2 ring-emerald-500/30'
                  : 'bg-primary-container text-on-primary hover:bg-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {myHarlahRegistration ? 'verified' : 'confirmation_number'}
              </span>
              <span>
                {myHarlahRegistration ? 'Terdaftar HARLAH' : 'Tamu HARLAH'}
              </span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden w-9 h-9 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center justify-center cursor-pointer border border-outline-variant/30"
              aria-label="Menu Navigasi"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-surface-container-lowest border-t border-outline-variant/40 px-margin-mobile py-4 space-y-3 shadow-xl max-h-[82vh] overflow-y-auto">
            <div className="flex flex-col space-y-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold px-2 py-1">
                Navigasi Halaman Utama
              </span>
              {HOME_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={sec.href}
                  onClick={(e) => handleSectionClick(e, sec.id, sec.screen)}
                  className="px-3 py-2 rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container transition-colors"
                >
                  {sec.label}
                </a>
              ))}
            </div>
            <div className="border-t border-outline-variant/40 pt-2 flex flex-col space-y-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold px-2 py-1">
                Portal Internal Kader
              </span>
              {PORTAL_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectScreen(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-label-lg text-label-lg text-left transition-colors ${
                    activeScreen === item.id
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global Command Search Modal (Ctrl + K) */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full shadow-2xl border border-outline-variant/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-surface-container-high flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[22px]">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                placeholder="Cari nama kader, 8 divisi (Korlap, Acara, Desain, Ekraf, Humas), NIM, atau layanan..."
                className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none"
              />
              {globalQuery && (
                <button
                  type="button"
                  onClick={() => setGlobalQuery('')}
                  className="text-secondary hover:text-on-surface cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="px-2 py-1 rounded bg-surface-container text-secondary font-mono text-[11px] font-bold cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Quick Suggestion Pills when query is empty */}
            {!globalQuery && (
              <div className="px-4 py-2.5 bg-surface-container-low/70 border-b border-surface-container-high flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary mr-1">
                  Cari Cepat:
                </span>
                {[
                  'Acara & Korlap',
                  'Dokumentasi & Desain',
                  'Ekraf & Humas',
                  'Perlengkapan & Konsumsi',
                  'Sekretaris',
                  'HARLAH 29 Jan',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setGlobalQuery(tag)}
                    className="px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/50 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Search Results List */}
            <div className="max-h-[65vh] overflow-y-auto p-3 space-y-1.5">
              {filteredSearchEntries.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <span className="material-symbols-outlined text-secondary text-[32px]">
                    manage_search
                  </span>
                  <p className="font-body-md text-body-md text-secondary">
                    Tidak ditemukan hasil untuk &ldquo;{globalQuery}&rdquo;. Coba kata kunci seperti{' '}
                    <strong>Korlap</strong>, <strong>Ekraf</strong>, <strong>Desain</strong>,{' '}
                    <strong>Sekretaris</strong>, atau <strong>HARLAH</strong>.
                  </p>
                </div>
              ) : (
                filteredSearchEntries.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectScreen(item.screen)}
                    className="w-full p-3 rounded-xl hover:bg-surface-container text-left transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary text-primary flex items-center justify-center shrink-0 transition-colors mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold text-primary">
                            {item.category}
                          </span>
                        </div>
                        <div className="font-label-lg text-label-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="font-label-sm text-label-sm text-secondary font-normal">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary text-[18px] mt-2">
                      arrow_forward
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-[11px] text-secondary">
              <span>Pencarian Terpadu Repositori &amp; Buku Induk SIMAK</span>
              <span>Tekan ESC untuk menutup</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
