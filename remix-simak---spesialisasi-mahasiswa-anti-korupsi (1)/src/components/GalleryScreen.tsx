import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import { useGsapPageAnimations, animateFilterGrid } from '../hooks/useGsapAnimations';
import { fetchGalleryItems } from '../api';
import { downloadPressKitZip } from '../utils/pdfDocuments';

interface GalleryScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

type GalleryCategory = 'all' | 'kopasus' | 'school' | 'tot' | 'sosial' | 'harlah';

interface GalleryItem {
  id: string;
  category: Exclude<GalleryCategory, 'all'>;
  badgeText: string;
  badgeClass: string;
  photoCount: string;
  date: string;
  location: string;
  title: string;
  modalTitle: string;
  modalLocation: string;
  modalDate: string;
  modalDesc: string;
  summary: string;
  statsLabel: string;
  imageUrl: string;
  imageAlt: string;
  participantsCount: number;
  orderIndex: number;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'kopasus',
    badgeText: 'KOPASUS XIV',
    badgeClass: 'bg-primary-container text-on-primary font-semibold',
    photoCount: '24 Foto',
    date: 'Oktober 2024',
    location: 'Villa Mandiri, Sukabumi',
    title: 'Diklat KOPASUS: Simulasi Investigasi & Solidaritas Mahasiswa',
    modalTitle: 'Diklat Lapangan KOPASUS: Simulasi Investigasi & Solidaritas',
    modalLocation: 'Villa Mandiri, Sukabumi',
    modalDate: 'Oktober 2024',
    modalDesc:
      'Latihan dasar kepemimpinan mahasiswa berintegritas. Membekali peserta dengan etika kepemimpinan anti-KKN, kerja sama regu tangguh, dan simulasi pembuktian data anggaran kemahasiswaan.',
    summary:
      'Pendidikan dasar komitmen anti-korupsi di alam terbuka, melatih kedisiplinan mental, keberanian moral, dan penanaman 9 nilai integritas KPK.',
    statsLabel: '110 Peserta Diklat',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4fiUAm-dSgJbLAqfJ9GuwDdlhGOMSqiwMt0P7r24ZBqgSm7GVhezpX9l00auOfDahnZMbsrD2miwQzU2YOxBKAxIwKU2-v7NUT78wrTH42n2ouYDj8adMQXYp79uL0tMu9430hn-27d2AIaJgER7Y1xhkMt1sWrmnaFqClq7yHhpDJkehR4EtivAzveaN54iTFeB21SzmSGwTOFqH75IRi8KbrATDBwSX1AoJyLhnzs28wzcQW2m-pvnzFCFypWGe5wM',
    imageAlt:
      'Group of 30 enthusiastic Indonesian university students kneeling and standing in rows holding red and black banners of SIMAK KOPASUS in an outdoor camping courtyard',
    participantsCount: 110,
    orderIndex: 2,
  },
  {
    id: 'gal-2',
    category: 'school',
    badgeText: 'Goes To School',
    badgeClass: 'bg-tertiary text-on-tertiary font-semibold',
    photoCount: '18 Foto',
    date: 'Agustus 2024',
    location: 'SMK Negeri 1 & SMA 30 Jakarta',
    title: 'SIMAK Goes To School: Menanamkan Integritas Sejak Dini',
    modalTitle: 'SIMAK Goes To School: Menanamkan Integritas Sejak Dini',
    modalLocation: 'SMK & SMA Jakarta Pusat',
    modalDate: 'Agustus 2024',
    modalDesc:
      'Edukasi interaktif mengenai bahaya gratifikasi kecil di lingkungan sekolah, menolak budaya mencontek, serta membangun ikrar jujur bagi siswa-siswi calon pemimpin bangsa.',
    summary:
      'Penyuluhan interaktif ke sekolah menengah mengenai bahaya gratifikasi mini, pembiasaan jujur dalam ujian, dan pengenalan kantin kejujuran.',
    statsLabel: '350 Siswa Terjangkau',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmKwOAbKxzWuDa0NuiOARrSOnlfHwNJVSLBA_SAzzRhs-fnNmF3EXvuRPfC30iD1zJdkzTZyp4Xmn1jMfE-qKfQH_kHgRBFhpHF6fyg_rmLU7kAPPNhfoOtvzG5r_zu6kiFKa5pm42uzSrjZDBr1ken_U0eNCiabgVZdYGPc9R7MPcNC0ZLHj9BjLfxt3t24h94t7z8WBN_7xwyRHldECeOny7AuRDaoVeqOso1x6eWbN8CApL7RcqhQ',
    imageAlt:
      'Young student facilitators in SIMAK organization jackets interacting with a large class of vocational high school students in modern Indonesian classroom',
    participantsCount: 350,
    orderIndex: 4,
  },
  {
    id: 'gal-3',
    category: 'tot',
    badgeText: 'Kemitraan KPK RI',
    badgeClass: 'bg-secondary text-on-secondary font-semibold',
    photoCount: '32 Foto',
    date: 'Juli 2024',
    location: 'ACLC KPK RI, Kuningan',
    title: 'Audiensi & TOT Bersama Direktorat Sosialisasi KPK RI',
    modalTitle: 'Audiensi & TOT Direktorat Sosialisasi KPK RI',
    modalLocation: 'ACLC KPK RI, Jakarta',
    modalDate: 'Juli 2024',
    modalDesc:
      'Pembekalan langsung dari penyidik dan deputi pendidikan anti korupsi KPK. Kader SIMAK dilatih menganalisis delik korupsi pengadaan barang/jasa dan modul penyuluhan antikorupsi bersertifikat.',
    summary:
      'Kunjungan kehormatan dan pelatihan pelatih (Training of Trainer) kader SIMAK dalam penguasaan delik pidana korupsi dan advokasi hukum publik.',
    statsLabel: '45 Kader Utusan',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTO9Lbo2Y0nLJj5qeoBvusgo3Qck6f1FUD-agJc5YbL-Dq3Pw1HeKHyLRAjj6LzCgMHN91ocbUm2GugWQUDtALqBbFKbl97vBJ4Qf09nOufd3Lx3A1ax2FS4WwDpbQQx7I9GaAQ72Kg_swCrI4F30KGakim5CgyBNHpYv6LOcq2VROspBKZAHQjv9ncZ3XLn-Y8qMTxoIf3-2m-SSzOPtW9tqKWGBcGDKT1WwyAWtxbM9KQE4itXS5qA',
    imageAlt:
      'Group of university student representatives standing on the steps of the Indonesian Corruption Eradication Commission KPK Merah Putih building in Kuningan Jakarta',
    participantsCount: 45,
    orderIndex: 5,
  },
  {
    id: 'gal-4',
    category: 'sosial',
    badgeText: 'Bakti Sosial',
    badgeClass: 'bg-tertiary-container text-on-tertiary font-semibold',
    photoCount: '15 Foto',
    date: 'Maret 2024',
    location: 'Panti Asuhan & Johar Baru',
    title: 'Ramadhan Integrity: Tebar Kepedulian & Santunan Sosial',
    modalTitle: 'Ramadhan Integrity: Berbagi Kasih & Integritas Nyata',
    modalLocation: 'Johar Baru & Matraman',
    modalDate: 'Maret 2024',
    modalDesc:
      'Penyaluran 250 paket sembako transparan tanpa potongan biaya admin, buka puasa bersama anak yatim piatu, dan kelas dongeng kejujuran untuk anak-anak sekolah dasar.',
    summary:
      'Aksi nyata kepedulian sivitas akademika lewat transparansi audit terbuka penyaluran bantuan sosial kepada keluarga kurang mampu.',
    statsLabel: '250 Paket Tersalurkan',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAAydEuxEUOlhE9rQ36tm3U1LIfNq4Ai6livDWOfAvG5nSpc0iF5t8R7kxKjwV6B9VmwiMe2BnRgHspeSKZhjqxMNQGxUYaYte4LSS-i6kxUSHVbqyA9kYS03Di3pJrpA0uFFJ56EhkY0d4QWpjc9eVvOFZO1pV-2bNfSZ78g2lYnt7E59NetrwHFDKx6Vq03axb08-pkJH7LfImKzsoOe8Bqx0q7xQaJkG406NYpdgidKFZVA6LPPLhQ',
    imageAlt:
      'Students and community volunteers distributing Ramadhan grocery packages and scholastic books to foster children and underprivileged families',
    participantsCount: 250,
    orderIndex: 7,
  },
  {
    id: 'gal-5',
    category: 'harlah',
    badgeText: '15 Tahun Milad',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed font-bold',
    photoCount: '40 Foto',
    date: '29 Januari 2024',
    location: 'Auditorium STIAMI Pusat',
    title: 'HARLAH Ke-15: Integritas Sebagai Modal Masa Depan',
    modalTitle: 'Peringatan Hari Lahir (HARLAH) SIMAK Ke-15',
    modalLocation: 'Auditorium STIAMI Pusat',
    modalDate: '29 Januari 2024',
    modalDesc:
      'Seminar nasional Mengawal Integritas Masa Depan AI & Disrupsi, temu akbar alumni 15 angkatan, dan penyerahan penghargaan aktivis anti korupsi muda terbaik se-DKI Jakarta.',
    summary:
      'Seminar nasional, silaturahmi alumni lintas dekade (2011–2026), pemotongan tumpeng integritas, dan peluncuran Buku Putih Riset Transparansi.',
    statsLabel: '500+ Hadirin & Alumni',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBnFuBId5xaQ3cxtp1Tp4QDeEysiPciqr7bO_sAVuSdsqYJ3fscWvhfhW3GKpyxaCKPkESG0Hp1e8e6E8B0p4S0ORrg2ynBePfNP6_17FYQiWs5qoYQ8HMJHgWMxrepI5-HKELCVX74CUGDCV5ahvaxTfV6Vz1CSRaQfxvAoV10b-sndgi1F_02Q2AcPpUddG9qcIrBCoYuFi8cwzUrjwjp_ru5eIN81JpYDxtTpAo-bmNpk55rqhYdA',
    imageAlt:
      'Grand university auditorium celebration of 15th anniversary of SIMAK anti-corruption organization',
    participantsCount: 500,
    orderIndex: 8,
  },
  {
    id: 'gal-6',
    category: 'kopasus',
    badgeText: 'Kader Lanjut PINSUS',
    badgeClass: 'bg-primary text-on-primary font-semibold',
    photoCount: '12 Foto',
    date: 'Desember 2024',
    location: 'Ruang Riset Integritas STIAMI',
    title: 'PINSUS: Penguatan Karakter & Kapasitas Pemimpin Mahasiswa',
    modalTitle: 'PINSUS (Pendidikan Khusus): Penguatan Pemimpin Berkarakter',
    modalLocation: 'Gedung Rektorat Lt. 4',
    modalDate: 'Desember 2024',
    modalDesc:
      'Program khusus pembentukan pengurus inti dan calon ketua umum SIMAK. Meliputi pelatihan diplomasi, audit forensik dasar, manajemen konflik, dan kepemimpinan visioner.',
    summary:
      'Penggemblengan kader inti dalam kepemimpinan, manajemen organisasi bebas konflik kepentingan, dan keteladanan moral kampus.',
    statsLabel: '35 Calon Pengurus',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4fiUAm-dSgJbLAqfJ9GuwDdlhGOMSqiwMt0P7r24ZBqgSm7GVhezpX9l00auOfDahnZMbsrD2miwQzU2YOxBKAxIwKU2-v7NUT78wrTH42n2ouYDj8adMQXYp79uL0tMu9430hn-27d2AIaJgER7Y1xhkMt1sWrmnaFqClq7yHhpDJkehR4EtivAzveaN54iTFeB21SzmSGwTOFqH75IRi8KbrATDBwSX1AoJyLhnzs28wzcQW2m-pvnzFCFypWGe5wM',
    imageAlt:
      'Intensive roundtable discussion session with student activists holding legal briefs and anti-corruption compliance manuals',
    participantsCount: 35,
    orderIndex: 1,
  },
  {
    id: 'gal-7',
    category: 'school',
    badgeText: 'Kampanye Kreatif',
    badgeClass: 'bg-secondary-container text-on-secondary-fixed font-semibold',
    photoCount: '22 Foto',
    date: 'Mei 2024',
    location: 'Plaza Kampus Perjuangan',
    title: 'Pekan Seni Budaya & Mimbar Integritas Mahasiswa',
    modalTitle: 'Pekan Aksi Kreatif & Mimbar Bebas Mahasiswa',
    modalLocation: 'Plaza Utama Kampus STIAMI',
    modalDate: 'Mei 2024',
    modalDesc:
      'Festival orasi integritas, pameran poster karikatur antikorupsi mahasiswa, instalasi seni kotak suara transparan, dan penandatanganan komitmen bersama civitas akademika.',
    summary:
      'Instalasi mural interaktif dan teatrikal puisi bertema kejujuran akademik untuk mengikis plagiarisme dan joki tugas perkuliahan.',
    statsLabel: '800 Mahasiswa Hadir',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAEgA3cx93P4HPW5-S67jD5bCHO44FtAtMo9dqknquWMU_a9ldKCv8znMeieOqJZsBLgnyc6K-85fYUBokobARHkUYBpt9P01eyIaqmiyXy0TGH178lU8WVcgLl0lu9sY7v6evhuxa9d4rxWkWzCbs8lc01L5a1pK6z0UIM_JEt6eIofrSbg5PimnEGjSBHuGl1e-_w69nJ8TzXajdqGJ_fHIyG-zAjwsVXxFcomzjJONQhVn9ZdA9KyQ',
    imageAlt:
      'Campus plaza open-mic civic oration event with collegiate speakers on a decorated wooden podium holding megaphones',
    participantsCount: 800,
    orderIndex: 6,
  },
  {
    id: 'gal-8',
    category: 'tot',
    badgeText: 'Kemitraan Mahkamah Agung',
    badgeClass: 'bg-secondary text-on-secondary font-semibold',
    photoCount: '16 Foto',
    date: 'September 2024',
    location: 'Pusdiklat Mahkamah Agung, Ciawi',
    title: 'Studi Yurisprudensi Hukum Tipikor di Pusdiklat MA',
    modalTitle: 'Kunjungan Litbang Diklat Mahkamah Agung',
    modalLocation: 'Ciawi, Bogor',
    modalDate: 'September 2024',
    modalDesc:
      'Studi yurisprudensi putusan tindak pidana korupsi bersama Hakim Tinggi Pusdiklat Kumdil MA RI untuk memahami keadilan substantif dalam vonis pengembalian aset negara.',
    summary:
      'Dialog hukum mendalam bersama Hakim Pengadilan Tipikor terkait pemulihan aset rampasan korupsi untuk kesejahteraan rakyat.',
    statsLabel: '30 Delegasi Terpilih',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9TY0Zo-GnPEoOYz0sRFks4J59WXR9g3eFZUn7vSGBWmLbMh9Z4bhwUREDGFlD1J8FWwo7oWwdXacdmuGszEB-ycp8joJVn0znpSd7JBzEzQQ0GybMjw_K4S1M4a_DMFeu-sRl60uH2_1SgI0dMiQJslZWgzTLpsFKQ1wXDrKU1NNJRti9Oym5vt5-RLOsJNghMxDqIiEvkltQABKcqcQ7knOrP7fVTMG2UO3okxZ2uhRhRmaCrl9U3A',
    imageAlt:
      'Formal delegation of law and public administration students visiting the Indonesian Supreme Court Judicial Training Research Center auditorium in Megamendung',
    participantsCount: 30,
    orderIndex: 3,
  },
];

const FILTER_TABS: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'Semua Arsip (8 Dokumentasi)' },
  { id: 'kopasus', label: 'Diklat Lapangan KOPASUS' },
  { id: 'school', label: 'SIMAK Goes to School' },
  { id: 'tot', label: 'TOT & Kemitraan KPK/MA' },
  { id: 'sosial', label: 'Ramadhan Integrity & Sosial' },
  { id: 'harlah', label: 'HARLAH & Refleksi 15 Tahun' },
];

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'participants'>('newest');
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [modalData, setModalData] = useState<{
    title: string;
    location: string;
    date: string;
    desc: string;
    imageUrl?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryItems(activeCategory)
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          // Merge or supplement items from DB
          const dbMapped: GalleryItem[] = apiItems.map((item, idx) => ({
            id: item.id,
            category: (item.category.toLowerCase().includes('kopasus') ? 'kopasus' : 'harlah') as any,
            badgeText: item.category,
            badgeClass: 'bg-primary-container text-on-primary font-semibold',
            photoCount: `${item.participantsCount || 10} Foto`,
            date: new Date(item.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            location: 'Kampus STIAMI Jakarta',
            title: item.title,
            modalTitle: item.title,
            modalLocation: 'Kampus STIAMI Jakarta',
            modalDate: new Date(item.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
            modalDesc: item.description || item.title,
            summary: item.description || item.title,
            statsLabel: `${item.participantsCount || 0} Partisipan`,
            imageUrl: item.imageUrl || GALLERY_ITEMS[idx % GALLERY_ITEMS.length].imageUrl,
            imageAlt: item.title,
            participantsCount: item.participantsCount || 0,
            orderIndex: idx,
          }));
          // Combine existing rich mock gallery with any new DB items
          const combined = [...GALLERY_ITEMS];
          dbMapped.forEach((dbItem) => {
            if (!combined.some((c) => c.title === dbItem.title)) {
              combined.unshift(dbItem);
            }
          });
          setGalleryList(combined);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat galeri dari API, memakai data lokal:', err);
      });
  }, [activeCategory]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openModalPreview = (
    title: string,
    location: string,
    date: string,
    desc: string,
    imageUrl?: string
  ) => {
    setModalData({ title, location, date, desc, imageUrl });
  };

  const closeModalPreview = () => {
    setModalData(null);
  };

  const filteredItems = galleryList.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.badgeText.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'participants') return b.participantsCount - a.participantsCount;
    if (sortBy === 'oldest') return b.orderIndex - a.orderIndex;
    return a.orderIndex - b.orderIndex;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGsapPageAnimations(containerRef);

  useEffect(() => {
    animateFilterGrid(gridRef.current);
  }, [activeCategory, sortBy]);

  const go = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-[22px]">
            cloud_download
          </span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-inverse-on-surface/70 hover:text-inverse-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Hero & Heritage Header Section */}
      <section className="relative w-full bg-surface-container-lowest overflow-hidden py-16 md:py-20">
        {/* Subtle Megamendung Heritage Watermark Vector */}
        <div
          data-gsap="parallax"
          className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center"
        >
          <svg
            className="w-full h-full object-cover"
            fill="none"
            viewBox="0 0 1000 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120 C 150 70, 250 180, 400 130 C 550 80, 650 190, 800 140 C 950 90, 1050 170, 1200 130"
              stroke="#760009"
              strokeLinecap="round"
              strokeWidth="28"
            ></path>
            <path
              d="M-100 280 C 80 220, 200 340, 380 290 C 560 240, 680 350, 860 300 C 1040 250, 1150 330, 1300 290"
              stroke="#760009"
              strokeLinecap="round"
              strokeWidth="24"
            ></path>
            <path
              d="M50 440 C 200 390, 320 500, 500 450 C 680 400, 790 510, 970 460 C 1120 410, 1220 490, 1370 450"
              stroke="#760009"
              strokeLinecap="round"
              strokeWidth="20"
            ></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb & Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md">
              <span className="material-symbols-outlined text-primary text-[18px]">
                history_edu
              </span>
              <span className="tracking-wide">
                ARSIP RESMI &amp; REKAM JEJAK 15 TAHUN SIMAK (2011 – 2026)
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
              <span>Institut STIAMI</span>
              <span>•</span>
              <span className="text-tertiary font-bold">15 Tahun Berintegritas</span>
              <span>•</span>
              <span className="text-primary font-bold">Integritas Tanpa Kompromi</span>
            </div>
          </div>

          {/* Main Headline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 space-y-4">
              <h1 className="font-display-lg text-display-lg-mobile sm:text-display-lg text-on-surface tracking-tight">
                Rekam Jejak, <span className="text-primary">Aksi Nyata</span>, &amp; Pengabdian Integritas.
              </h1>
              <p className="font-body-xl text-body-xl text-on-surface-variant max-w-3xl leading-relaxed">
                Dokumentasi komprehensif perjalanan kaderisasi KOPASUS, edukasi anti korupsi ke sekolah-sekolah, aksi bakti integritas, serta kolaborasi strategis bersama institusi penegak hukum nasional (KPK RI, Mahkamah Agung, dan Mabes Polri).
              </p>
            </div>

            <div data-gsap="hero-media" className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <div className="p-3.5 bg-surface-container-low rounded-2xl flex items-center gap-3.5 shadow-sm border-0 mb-1">
                <div className="p-2 bg-surface-container-lowest rounded-xl shadow-sm flex items-center justify-center shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9m6NwtdoMppxPukh0xgDuL_shroGn2pqME6UL39o3CeKQKUOgsUOhbIhBiwvCj11uSk5exKurj7qtBS_0iDXdve_lmX2AGKPNIu8ctPijmkJx--0UJaVSbo8N678VMpyf23f96PYpue6Se8w-tJ-p8QtAmLsVCAWMr1dklaNDV83QUpDoWGEvzrS6j2fXSxFrhN1TmFFMWA4SkA3rDkMFuYGJ__9QTdokP2QFkeoN0mnEXNYUcMLxRXUGdAZfxvI74QM"
                    alt="Logo SIMAK - Spesialisasi Mahasiswa Anti Korupsi"
                    referrerPolicy="no-referrer"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Arsip Digital Resmi
                  </span>
                  <span className="font-headline-sm text-[16px] font-bold text-on-surface leading-snug truncate">
                    SIMAK 2011–2026
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant leading-tight truncate">
                    Dokumentasi &amp; Portofolio Kader
                  </span>
                </div>
              </div>

              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-md hover:shadow-lg"
                href="#katalog-arsip"
              >
                <span className="material-symbols-outlined text-[20px]">photo_library</span>
                <span>Eksplorasi Arsip Foto</span>
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-all"
                href="#unduh-dokumen"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                <span>Unduh Laporan &amp; Press Kit</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div data-gsap="stagger-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 bg-surface-container-low rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="15"
                    className="font-headline-lg text-headline-lg text-on-surface font-extrabold tabular-nums"
                  >
                    15
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Tahun
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Perjalanan Dedikasi
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[28px]">military_tech</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="15"
                    className="font-headline-lg text-headline-lg text-on-surface font-extrabold tabular-nums"
                  >
                    15
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Batch
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Diklat KOPASUS
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[28px]">school</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="42"
                    data-suffix="+"
                    className="font-headline-lg text-headline-lg text-on-surface font-extrabold tabular-nums"
                  >
                    42+
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-tertiary">
                    Sekolah
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  SIMAK Goes to School
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[28px]">groups</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="1250"
                    data-separator="dot"
                    data-suffix="+"
                    className="font-headline-lg text-headline-lg text-on-surface font-extrabold tabular-nums"
                  >
                    1.250+
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Alumni
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Kader Berintegritas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Story & Key Milestones Grid */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div data-gsap="section-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                Sorotan Khusus &amp; Liputan Utama
              </span>
              <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface mt-1">
                Dua Pilar Gerakan Pengkaderan
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Dokumentasi intensif dari dua agenda mercusuar SIMAK yang mengasah kepemimpinan nurani dan keahlian advokasi publik.
            </p>
          </div>

          {/* Spotlight Bento Grid */}
          <div data-gsap="stagger-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Feature 1: KOPASUS Outdoor Training */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
              <div className="relative h-80 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Diklat Lapangan KOPASUS di Cisarua Bogor"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4fiUAm-dSgJbLAqfJ9GuwDdlhGOMSqiwMt0P7r24ZBqgSm7GVhezpX9l00auOfDahnZMbsrD2miwQzU2YOxBKAxIwKU2-v7NUT78wrTH42n2ouYDj8adMQXYp79uL0tMu9430hn-27d2AIaJgER7Y1xhkMt1sWrmnaFqClq7yHhpDJkehR4EtivAzveaN54iTFeB21SzmSGwTOFqH75IRi8KbrATDBwSX1AoJyLhnzs28wzcQW2m-pvnzFCFypWGe5wM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    Kaderisasi Inti
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm">
                    Batch XIV &amp; XV
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                  <div className="flex items-center gap-2 font-label-sm text-label-sm opacity-90 mb-1">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>Pusat Diklat Alam Terbuka, Cisarua, Bogor</span>
                    <span>•</span>
                    <span>120 Kader Baru</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-primary leading-snug">
                    Diklat Lapangan KOPASUS: Membentuk Sikap Anti Suap &amp; Ketahanan Mental
                  </h3>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Program wajib kaderisasi tingkat pertama yang menguji ketahanan moral, simulasi investigasi pelanggaran dana publik kampus, penjelajahan malam, serta penandatanganan Pakta Integritas Mahasiswa di hadapan dewan pendiri.
                </p>
                <div className="flex items-center justify-between pt-4 bg-surface-container-low p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                      VS
                    </div>
                    <div>
                      <div className="font-label-md text-label-md text-on-surface font-bold">
                        Venus Sangia Alfarizi
                      </div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        Ketua Umum SIMAK Periode 2024–2025
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-sm text-label-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    onClick={() =>
                      openModalPreview(
                        'Diklat Lapangan KOPASUS Batch XIV & XV',
                        'Cisarua, Bogor',
                        '24 - 26 November 2024',
                        'Pelatihan fisik dan integritas intensif 3 hari 2 malam. Melatih 120 mahasiswa baru untuk peka terhadap penyelewengan dana dan membangun etika birokrasi kampus yang transparan.',
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuD4fiUAm-dSgJbLAqfJ9GuwDdlhGOMSqiwMt0P7r24ZBqgSm7GVhezpX9l00auOfDahnZMbsrD2miwQzU2YOxBKAxIwKU2-v7NUT78wrTH42n2ouYDj8adMQXYp79uL0tMu9430hn-27d2AIaJgER7Y1xhkMt1sWrmnaFqClq7yHhpDJkehR4EtivAzveaN54iTFeB21SzmSGwTOFqH75IRi8KbrATDBwSX1AoJyLhnzs28wzcQW2m-pvnzFCFypWGe5wM'
                      )
                    }
                  >
                    <span>Galeri Lengkap</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Institutional Collaboration (KPK & Mahkamah Agung) */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group">
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Training of Trainer di Gedung KPK RI"
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAil5tvthqhdwC7WapzFQY7oQWLpn0BsslCIoK27chhiqP91_lKn51AO4CwpfwQBDMbLUNnJ0RqAnEiszxQ4CNollEEQC-06z4mPyKn9X8sZMdSDtefjdpi2fnkfHHBUQwBoraJYsIRJ48MZKx30G257IM1lpOnvtd2WGykMQ-MI9WtY64wfX-heciphFzTcjjVdt7KxSJ9aO-sBGGv_43dx0pS9Drpk8AvWnKxI8TbEFW4WaailKEYsw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-tertiary text-on-tertiary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    TOT Lembaga Penegak Hukum
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-on-primary">
                  <div className="flex items-center gap-2 font-label-sm text-label-sm opacity-90 mb-1">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    <span>Gedung Merah Putih KPK RI &amp; Diklat MA</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                    Training of Trainer: Bedah Tipikor &amp; Pengawalan Sidang Terbuka
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Pelatihan berjenjang bersama spesialis penyidik dan edukator KPK RI untuk mencetak fasilitator muda yang mampu membaca laporan keuangan publik dan memahami mekanisme peradilan hukum tindak pidana korupsi.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm py-1.5 px-3 bg-surface-container rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        check_circle
                      </span>
                      Modul Investigasi Anggaran
                    </span>
                    <span className="text-on-surface-variant">4 Modul Teruji</span>
                  </div>
                  <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm py-1.5 px-3 bg-surface-container rounded-lg">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        check_circle
                      </span>
                      Mentor Ahli KPK RI
                    </span>
                    <span className="text-on-surface-variant">Direktorat Sosdik KPK</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-colors text-center cursor-pointer"
                  onClick={() =>
                    openModalPreview(
                      'Training of Trainer Bersama KPK RI & Mahkamah Agung',
                      'Gedung KPK RI Jakarta',
                      '15 - 17 Agustus 2024',
                      'Sesi pembekalan intensif kader SIMAK mengenai perundang-undangan tindak pidana korupsi, hak uji materiil publik, dan tata cara pelaporan dugaan gratifikasi secara terenkripsi dan aman.',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuAil5tvthqhdwC7WapzFQY7oQWLpn0BsslCIoK27chhiqP91_lKn51AO4CwpfwQBDMbLUNnJ0RqAnEiszxQ4CNollEEQC-06z4mPyKn9X8sZMdSDtefjdpi2fnkfHHBUQwBoraJYsIRJ48MZKx30G257IM1lpOnvtd2WGykMQ-MI9WtY64wfX-heciphFzTcjjVdt7KxSJ9aO-sBGGv_43dx0pS9Drpk8AvWnKxI8TbEFW4WaailKEYsw'
                    )
                  }
                >
                  Lihat Rangkuman Audiensi
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filterable Interactive Documentation Catalog */}
      <section className="w-full py-16 bg-surface-container-low" id="katalog-arsip">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          {/* Section Header */}
          <div data-gsap="section-header" className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                Katalog Arsip Foto Kegiatan
              </span>
            </div>
            <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface">
              Dokumentasi Aksi Lapangan &amp; Advokasi
            </h2>
          </div>

          {/* Filter Controls */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm space-y-4">
            {/* Category Tab Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {FILTER_TABS.map((tab) => {
                const isSelected = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl font-label-md text-label-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Secondary Filters & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-container">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Cari kata kunci kegiatan, kota, batch..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <span className="font-label-sm text-label-sm text-on-surface-variant hidden md:inline">
                  Urutkan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'newest' | 'oldest' | 'participants')
                  }
                  className="px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md focus:outline-none"
                >
                  <option value="newest">Paling Baru (2024 - 2026)</option>
                  <option value="oldest">Arsip Dekade Awal (2011 - 2018)</option>
                  <option value="participants">Peserta Terbanyak</option>
                </select>
                <div className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Gallery Grid */}
          <div ref={gridRef} data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    alt={item.imageAlt}
                    referrerPolicy="no-referrer"
                    src={item.imageUrl}
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${item.badgeClass}`}
                  >
                    {item.badgeText}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-inverse-surface/80 text-inverse-on-surface font-label-sm text-label-sm backdrop-blur-sm">
                    {item.photoCount}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        calendar_today
                      </span>
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        location_on
                      </span>
                      <span>{item.location}</span>
                    </div>
                    <h3
                      className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight hover:text-primary transition-colors cursor-pointer"
                      onClick={() =>
                        openModalPreview(
                          item.modalTitle,
                          item.modalLocation,
                          item.modalDate,
                          item.modalDesc,
                          item.imageUrl
                        )
                      }
                    >
                      {item.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-secondary font-medium">
                      {item.statsLabel}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-primary font-label-md text-label-md hover:underline font-bold cursor-pointer"
                      onClick={() =>
                        openModalPreview(
                          item.modalTitle,
                          item.modalLocation,
                          item.modalDate,
                          item.modalDesc,
                          item.imageUrl
                        )
                      }
                    >
                      Detail &amp; Foto{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination & Archive Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Menampilkan <span className="font-bold text-on-surface">{filteredItems.length} dari 48</span> agenda terdokumentasi dalam repositori digital SIMAK
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-label-md text-label-md cursor-pointer"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('kopasus')}
                className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('tot')}
                className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Modal for High-Res Detail Preview */}
      {modalData && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModalPreview}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={modalData.title}
                referrerPolicy="no-referrer"
                src={
                  modalData.imageUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCVKxjtEAYeNWGUpw7juk_g1Oa5knCjwhjxl1BayLSjsddsphvO2eAKs1k-2Ge_T2dTREOZK27lgOC-H40A9m1cGiW7_ZqVSO_BzPRdLvamZgAd6yt6OL9UvbppANVpLO5G0u798f3r3Or2AZQMG272VvMFZIOeQAe24vY97Um7kEyn7vMpDtsDX4-owNJOXOgF47dlJ5ARKyxB_yX3culDUUUyYwGEXstpk4OH61cPwDSXE6pf4hchTg'
                }
              />
              <button
                type="button"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-inverse-surface/70 text-on-primary flex items-center justify-center hover:bg-inverse-surface transition-colors cursor-pointer"
                onClick={closeModalPreview}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
              <div className="absolute bottom-3 left-4 flex gap-2">
                <span className="px-2.5 py-1 rounded-md bg-surface/90 text-on-surface font-label-sm text-label-sm font-semibold">
                  {modalData.date}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface/90 text-on-surface font-label-sm text-label-sm font-semibold">
                  {modalData.location}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                {modalData.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {modalData.desc}
              </p>
              <div className="pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Dokumentasi Resmi Divisi Komintek SIMAK</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:bg-primary transition-colors cursor-pointer"
                    onClick={() => {
                      triggerToast(`Mengunduh resolusi penuh 4K (45 MB): ${modalData.title}`);
                      closeModalPreview();
                    }}
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Unduh Foto Full-Res (RAW)</span>
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
                    onClick={closeModalPreview}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Mentions & Public Recognition Section */}
      <section className="w-full py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div data-gsap="section-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                SIMAK di Ruang Publik &amp; Warta Media
              </span>
              <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface mt-1">
                Liputan Pers &amp; Rekomendasi Kebijakan
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                Transparansi Informasi Publik
              </span>
            </div>
          </div>

          <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Press Item 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span className="font-bold text-primary">Koran Integritas Kampus</span>
                  <span>12 Feb 2024</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                  &ldquo;15 Tahun SIMAK: Konsistensi Mengawal Kampus Bersih dari Praktik Gratifikasi&rdquo;
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Wawancara khusus bersama pendiri dan jajaran pengurus demisioner tentang resep menjaga independensi mahasiswa di tengah dinamika birokrasi kampus.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Kategori: Edisi Khusus HARLAH
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openModalPreview(
                      '15 Tahun SIMAK: Konsistensi Mengawal Kampus Bersih dari Praktik Gratifikasi',
                      'Koran Integritas Kampus',
                      '12 Februari 2024',
                      'Wawancara khusus bersama pendiri dan jajaran pengurus demisioner tentang resep menjaga independensi mahasiswa di tengah dinamika birokrasi kampus serta komitmen pengawasan dana kemahasiswaan.'
                    )
                  }
                  className="text-primary font-label-md text-label-md hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  Baca Rilis <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </button>
              </div>
            </div>

            {/* Press Item 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span className="font-bold text-tertiary">Buletin Antikorupsi KPK</span>
                  <span>November 2024</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                  &ldquo;SIMAK Goes to School: Praktik Baik Kaderisasi Integritas di Ranah Sekolah Menengah&rdquo;
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Direktorat Sosialisasi KPK mengapresiasi model modul pembelajaran mandiri SIMAK yang mudah dicerna peserta didik SMA/SMK dalam pencegahan pungli.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Kategori: Apresiasi Nasional
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openModalPreview(
                      'SIMAK Goes to School: Praktik Baik Kaderisasi Integritas di Ranah Sekolah Menengah',
                      'Buletin Antikorupsi KPK',
                      'November 2024',
                      'Direktorat Sosialisasi KPK mengapresiasi model modul pembelajaran mandiri SIMAK yang mudah dicerna peserta didik SMA/SMK dalam pencegahan pungli dan penanaman 9 Nilai Integritas.'
                    )
                  }
                  className="text-primary font-label-md text-label-md hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  Baca Rilis <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </button>
              </div>
            </div>

            {/* Press Item 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span className="font-bold text-secondary">Portal Berita Mahasiswa</span>
                  <span>08 Oktober 2024</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                  &ldquo;KOPASUS Batch XIV Sukses Lantik 110 Pejuang Muda Anti Korupsi di Jawa Barat&rdquo;
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Liputan eksklusif tahapan penggemblengan kader di Sukabumi, mulai dari ekspedisi disiplin hingga sidang etika pakta kejujuran kepemimpinan.
                </p>
              </div>
              <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Kategori: Laporan Liputan
                </span>
                <button
                  type="button"
                  onClick={() =>
                    openModalPreview(
                      'KOPASUS Batch XIV Sukses Lantik 110 Pejuang Muda Anti Korupsi di Jawa Barat',
                      'Portal Berita Mahasiswa',
                      '08 Oktober 2024',
                      'Liputan eksklusif tahapan penggemblengan kader di Sukabumi, mulai dari ekspedisi disiplin hingga sidang etika pakta kejujuran kepemimpinan di hadapan dewan pembina.'
                    )
                  }
                  className="text-primary font-label-md text-label-md hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  Baca Rilis <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download & Archive Access CTA Section */}
      <section
        className="w-full py-16 bg-gradient-to-b from-surface-container-low to-surface-container-lowest"
        id="unduh-dokumen"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative bg-inverse-surface rounded-3xl p-8 md:p-14 overflow-hidden text-inverse-on-surface shadow-xl">
            {/* Abstract Red/Amber glow accent */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-primary/25 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-tertiary/20 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[16px]">folder_zip</span>
                  <span>LAYANAN ARSIP PERS &amp; MAHASISWA</span>
                </div>
                <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-inverse-on-surface leading-tight">
                  Butuh Press Kit Lengkap, Modul Integritas, atau Foto Resolusi Tinggi?
                </h2>
                <p className="font-body-lg text-body-lg text-surface-container-high max-w-2xl">
                  Divisi Komunikasi &amp; Informasi Teknologi (Komintek) SIMAK menyediakan paket aset terverifikasi bebas hak cipta editorial untuk publikasi ilmiah, pers mahasiswa, dan penelitian antikorupsi.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        triggerToast('Menyiapkan Media Kit & manifest arsip foto (ZIP)...');
                        await downloadPressKitZip();
                        triggerToast('SIMAK_Media_Kit_15Tahun.zip berhasil diunduh (press kit PDF + manifest 306 foto).');
                      } catch {
                        triggerToast('Gagal membuat berkas ZIP. Silakan coba lagi.');
                      }
                    }}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span>Unduh Media Kit &amp; Arsip (.ZIP)</span>
                  </button>
                  <a
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-surface-container-low/10 hover:bg-surface-container-low/20 text-inverse-on-surface font-label-lg text-label-lg transition-all backdrop-blur-md"
                    href="mailto:sekretariat@simak-antikorupsi.or.id"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Kontak Divisi Komintek</span>
                  </a>
                </div>
              </div>

              {/* Quick Box Info & HARLAH Guest Registration */}
              <div className="lg:col-span-4 bg-surface/10 border-0 rounded-2xl p-6 backdrop-blur-lg space-y-4 text-on-primary">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold">
                    29
                  </div>
                  <div>
                    <div className="font-label-lg text-label-lg font-bold text-inverse-on-surface">
                      Puncak HARLAH SIMAK (29 Jan)
                    </div>
                    <div className="font-label-sm text-label-sm text-surface-container-high">
                      Registrasi Tamu Undangan Dibuka
                    </div>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-surface-container-high leading-relaxed">
                  Pendaftaran kader baru KOPASUS periode ini telah selesai dan dibuka kembali periode depan. Untuk acara HARLAH 29 Januari, pendaftaran dibuka khusus bagi Tamu Undangan &amp; Peserta Seminar.
                </p>
                <button
                  type="button"
                  onClick={() => go('pendaftaran')}
                  className="block w-full py-3 rounded-xl bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim text-center font-label-lg text-label-lg font-bold transition-colors cursor-pointer"
                >
                  Daftar Sebagai Tamu HARLAH
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
