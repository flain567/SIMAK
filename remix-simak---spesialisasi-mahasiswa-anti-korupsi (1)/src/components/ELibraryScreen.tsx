import React, { useState, useRef, useEffect } from 'react';
import { LibraryDocument, AdvocacySubmission } from '../types';
import { useGsapPageAnimations, animateFilterGrid } from '../hooks/useGsapAnimations';
import { submitAdvocacy } from '../api/library';
import { downloadPreviewPdf } from '../utils/pdfDocuments';

interface ELibraryScreenProps {
  documents: LibraryDocument[];
  submissions: AdvocacySubmission[];
  onAddSubmission: (submission: AdvocacySubmission) => void;
}

type DocCategory = 'all' | 'diklat' | 'adart' | 'policy' | 'school';
type TopicSelect = 'all' | 'kaderisasi' | 'hukum' | 'anggaran' | 'edukasi';

interface RepoDocItem {
  id: string;
  docCode: string;
  authorDivision: string;
  category: Exclude<DocCategory, 'all'>;
  topic: Exclude<TopicSelect, 'all'>;
  badgeText: string;
  badgeClass: string;
  yearLabel: string;
  yearFilter: '2024' | '2023' | 'arsip';
  icon: string;
  iconColorClass: string;
  title: string;
  desc: string;
  metaLeft: string;
  metaRight: string;
  metaRightClass: string;
  keyTakeaways: string[];
  chapters: { title: string; summary: string }[];
  citation: string;
}

interface PreviewModalData {
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

const FEATURED_MOD_01: PreviewModalData = {
  docCode: 'MOD-KPS/SIMAK-XVI/2024/001',
  authorDivision: 'Bidang I (Divisi Acara & Korlap) & Komisi Kaderisasi',
  title:
    'Buku Pedoman Kaderisasi KOPASUS Batch XVI: Prinsip Dasar Gerakan Moral & Etika Investigasi Mahasiswa',
  badge: 'Modul 01 • Diklat Wajib',
  meta: 'PDF • 148 Halaman • 8.4 MB',
  desc: 'Panduan fundamental penempaan integritas calon kader anti-korupsi. Memuat kerangka pemikiran hukum tindak pidana korupsi, metodologi pelaporan aduan kampus, kode etik whistleblower internal, serta strategi aksi moral mahasiswa.',
  keyTakeaways: [
    'Kurikulum wajib 9 Nilai Integritas KPK dan sejarah gerakan mahasiswa antikorupsi sejak 29 Januari 2011.',
    'Pemetaan tugas 3 Bidang Wakil Ketua Umum dan 8 Divisi Teknis SIMAK (Acara, Korlap, Dokumentasi, Desain, Ekraf, Humas, Perlengkapan, Konsumsi).',
    'Simulasi investigasi lapangan, manajemen aksi simpatik, dan perlindungan pelapor (Whistleblower).',
  ],
  chapters: [
    {
      title: 'Bab I: Sejarah Kelahiran SIMAK (29 Januari 2011) & Filosofi KOPASUS',
      summary:
        'Mengulas tonggak pendirian SIMAK di Institut STIAMI serta peran KOPASUS sebagai kawah candradimuka kader antikorupsi yang berani, jujur, dan independen.',
    },
    {
      title: 'Bab II: Anatomi Tindak Pidana Korupsi & Trisula Pemberantasan',
      summary:
        'Membedah 7 kelompok delik Tipikor (kerugian negara, suap, penggelapan jabatan, pemerasan, perbuatan curang, benturan kepentingan, gratifikasi) serta strategi Pendidikan, Pencegahan, dan Penindakan.',
    },
    {
      title: 'Bab III: Sinergi 8 Divisi Teknis dalam Program Kerja Integritas',
      summary:
        'Panduan kolaborasi teknis antara Divisi Acara, Korlap, Dokumentasi, Desain, Ekonomi Kreatif, Humas, Perlengkapan, dan Konsumsi dalam mengeksekusi kegiatan berstandar audit nol-selisih.',
    },
  ],
  citation:
    'Tim Litbang & Kaderisasi SIMAK. (2024). Buku Pedoman Kaderisasi KOPASUS Batch XVI: Prinsip Dasar Gerakan Moral & Etika Investigasi Mahasiswa. Jakarta: SIMAK Institut STIAMI.',
};

const FEATURED_MOD_02: PreviewModalData = {
  docCode: 'KONST-ADART/SIMAK-XV/2024/002',
  authorDivision: 'Badan Pengurus Harian (BPH) & Sekretaris Umum 1 & 2',
  title:
    'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) Hasil Mubes Terakhir & Kode Etik Perilaku Kader SIMAK',
  badge: 'Modul 02 • Konstitusi SIMAK',
  meta: 'PDF • 64 Hlm • 2.1 MB',
  desc: 'Pilar konstitusi organisasi yang mengatur hak suara, struktur Dewan Kehormatan, mekanisme whistleblowing kader, serta tata tertib kedisiplinan 15 tahun kepengurusan.',
  keyTakeaways: [
    'Struktur baku kepemimpinan BPH: Ketua Umum, 3 Wakil Ketua Umum, Sekretaris Umum 1 & 2, dan Bendahara Umum.',
    'Tata kelola 8 Divisi Teknis dan mekanisme koordinasi lintas bidang dalam pelaksanaan program kerja.',
    'Kode Etik Perilaku Kader dan sanksi tegas terhadap pelanggaran integritas akademik maupun organisasi.',
  ],
  chapters: [
    {
      title: 'Anggaran Dasar (AD): Azas, Tujuan & Kedaulatan Organisasi',
      summary:
        'Menegaskan kedudukan SIMAK sebagai organisasi mahasiswa ekstra/intra kampus yang berfokus pada edukasi, riset, dan advokasi antikorupsi.',
    },
    {
      title: 'Anggaran Rumah Tangga (ART): Struktur 4 Waka, 2 Sekretaris & 8 Divisi',
      summary:
        'Merinci pembagian wewenang Wakil Ketua 1 (Acara & Korlap), Wakil Ketua 2 (Dokumentasi & Desain), Wakil Ketua 3 (Ekonomi Kreatif & Humas), dan Wakil Ketua 4 (Perlengkapan & Konsumsi).',
    },
    {
      title: 'Lampiran Kode Etik & Pakta Integritas Fungsionaris',
      summary:
        'Standar kepatuhan pelaporan kas nol-selisih serta pedoman perlindungan saksi internal organisasi.',
    },
  ],
  citation:
    'Musyawarah Besar SIMAK. (2024). Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) serta Kode Etik Perilaku Kader SIMAK. Jakarta: Sekretariat Jenderal SIMAK.',
};

const FEATURED_MOD_03: PreviewModalData = {
  docCode: 'WP-AUDIT/SIMAK-XV/2024/003',
  authorDivision: 'Bendahara Umum & Tim Audit Internal SIMAK',
  title:
    'White Paper: Analisis Transparansi Anggaran Fasilitas Kampus & Penguatan Integritas Sivitas Akademika',
  badge: 'Modul 03 • White Paper Riset',
  meta: 'PDF • 92 Hlm • 5.6 MB',
  desc: 'Kajian independen divisi advokasi mengenai rasio serapan dana kegiatan kemahasiswaan, keterbukaan informasi publik, dan rekomendasi reformasi birokrasi kampus.',
  keyTakeaways: [
    'Kerangka kerja e-Budgeting dan Buku Kas Umum (BKU) terbuka untuk organisasi kemahasiswaan.',
    'Indeks kepuasan transparansi pengelolaan dana kegiatan mahasiswa di tingkat fakultas dan institut.',
    'Model audit silang antara Bendahara Umum, Sekretaris Umum, dan Koordinator Divisi.',
  ],
  chapters: [
    {
      title: 'Bab I: Metodologi Pengukuran Indeks Transparansi Ormawa',
      summary:
        'Penjelasan variabel keterbukaan kuitansi, ketepatan waktu LPJ, dan aksesibilitas laporan kas bagi publik.',
    },
    {
      title: 'Bab II: Studi Kasus Audit Nol-Selisih pada Program SIMAK',
      summary:
        'Bedah praktik terbaik pengelolaan dana kegiatan Seminar HARLAH, Ramadhan Integrity, dan SIMAK Goes To School.',
    },
    {
      title: 'Bab III: Peta Jalan Zona Integritas Kampus 2026',
      summary:
        'Rekomendasi kolaborasi antara pimpinan perguruan tinggi dan lembaga kemahasiswaan dalam mencegah pungutan liar.',
    },
  ],
  citation:
    'Tim Audit & Advokasi SIMAK. (2024). White Paper: Analisis Transparansi Anggaran Fasilitas Kampus & Penguatan Integritas Sivitas Akademika. Jakarta: SIMAK Institut STIAMI.',
};

const CATALOG_DOCS: RepoDocItem[] = [
  {
    id: 'doc-1',
    docCode: 'MOD-KPS/SIMAK-XV/2024/01',
    authorDivision: 'Bidang I (Divisi Acara & Korlap) bersama Dewan Etik SIMAK',
    category: 'diklat',
    topic: 'hukum',
    badgeText: 'KOPASUS Diklat',
    badgeClass: 'bg-error-container text-on-error-container',
    yearLabel: 'Tahun 2024',
    yearFilter: '2024',
    icon: 'terminal',
    iconColorClass: 'text-primary',
    title: 'Teknik Investigasi Terbuka (OSINT) untuk Dugaan Pengadaan Fiktif',
    desc: 'Modul metodologi riset digital, penelusuran LPSE, analisa anomali tender publik, serta teknik cross-referencing bagi satuan tugas KOPASUS.',
    metaLeft: 'PDF • 76 Halaman',
    metaRight: 'Khusus Kader Aktif',
    metaRightClass: 'text-primary font-semibold',
    keyTakeaways: [
      'Pemetaan 10 indikator red-flag pada dokumen perencanaan dan spesifikasi teknis pengadaan publik.',
      'Teknik pelacakan jejak digital korporasi dan afiliasi konflik kepentingan menggunakan sumber data terbuka (OSINT).',
      'Standar pembuktian berlapis dan penyusunan Berita Acara Telaah Faktual sebelum pelaporan ke kanal resmi.',
    ],
    chapters: [
      {
        title: 'Bab I: Anatomi Pengadaan Publik & Celah Mark-Up Anggaran',
        summary:
          'Membedah siklus pengadaan barang/jasa mulai dari tahap perencanaan kebutuhan (RKBMN), penyusunan HPS, hingga potensi pemecahan paket guna menghindari lelang terbuka.',
      },
      {
        title: 'Bab II: Instrumen OSINT & Penelusuran Data LPSE',
        summary:
          'Panduan teknis menelusuri histori pemenang tender, kemiripan alamat domisili vendor, serta verifikasi silang harga pasar wajar secara daring.',
      },
      {
        title: 'Bab III: Etika Investigasi Mahasiswa & Perlindungan Hukum',
        summary:
          'Batas-batas hukum pengumpulan data oleh masyarakat sipil/mahasiswa agar tetap berada dalam koridor UU Keterbukaan Informasi Publik dan bebas dari delik pencemaran nama baik.',
      },
    ],
    citation:
      'SIMAK Institut STIAMI. (2024). Teknik Investigasi Terbuka (OSINT) untuk Dugaan Pengadaan Fiktif (MOD-KPS/SIMAK-XV/2024/01). Jakarta: Sekretariat Jenderal SIMAK.',
  },
  {
    id: 'doc-2',
    docCode: 'MOD-PNS/SIMAK-XIV/2023/02',
    authorDivision: 'BPH Inti & Komisi Kaderisasi PINSUS SIMAK',
    category: 'diklat',
    topic: 'kaderisasi',
    badgeText: 'PINSUS Lanjutan',
    badgeClass: 'bg-secondary-container text-on-secondary-container',
    yearLabel: 'Tahun 2023',
    yearFilter: '2023',
    icon: 'shield_person',
    iconColorClass: 'text-on-secondary-container',
    title: 'Kepemimpinan Berintegritas & Mitigasi Konflik Kepentingan Ormawa',
    desc: 'Panduan pembinaan bagi pengurus inti BEM, DPM, dan UKM dalam menjaga netralitas dari gratifikasi sponsor komersial dan intervensi eksternal.',
    metaLeft: 'PDF • 54 Halaman',
    metaRight: 'Publik Terbuka',
    metaRightClass: 'text-tertiary-container font-semibold',
    keyTakeaways: [
      'Deklarasi bebas konflik kepentingan (Conflict of Interest Disclosure) bagi setiap fungsionaris kepanitiaan kampus.',
      'Pedoman seleksi sponsor kegiatan mahasiswa agar tidak menggadaikan independensi kritis lembaga.',
      'Simulasi penanganan dilema etika kepemimpinan mahasiswa saat menghadapi tekanan birokrasi maupun politik uang.',
    ],
    chapters: [
      {
        title: 'Bab I: 9 Nilai Integritas dalam Kepemimpinan Mahasiswa',
        summary:
          'Internalisasi nilai Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, dan Adil sebagai fondasi karakter pengurus organisasi.',
      },
      {
        title: 'Bab II: Mitigasi Gratifikasi Sponsor & Kemitraan Eksternal',
        summary:
          'Prosedur verifikasi mitra kerja sama oleh Divisi Humas & Ekonomi Kreatif agar seluruh aliran dana tercatat di rekening resmi organisasi tanpa komisi pribadi.',
      },
      {
        title: 'Bab III: Audit Silang & Pertanggungjawaban Publik',
        summary:
          'Standar pelaporan Buku Kas Umum (BKU) terbuka maksimal 14 hari setelah kegiatan selesai dilaksanakan.',
      },
    ],
    citation:
      'Komisi Kaderisasi SIMAK. (2023). Kepemimpinan Berintegritas & Mitigasi Konflik Kepentingan Ormawa (MOD-PNS/SIMAK-XIV/2023/02). Jakarta: SIMAK Press.',
  },
  {
    id: 'doc-3',
    docCode: 'TAP-BPH/SIMAK-XV/2024/03',
    authorDivision: 'Sekretaris Umum 1 & 2 (Elvira Wati Ningsi & Nabila Azzahra Putri)',
    category: 'adart',
    topic: 'kaderisasi',
    badgeText: 'Ketetapan BPH',
    badgeClass: 'bg-surface-container text-primary',
    yearLabel: 'Tahun 2024',
    yearFilter: '2024',
    icon: 'balance',
    iconColorClass: 'text-primary',
    title: 'Pakta Integritas Calon Fungsionaris & Mekanisme Recall Presidium',
    desc: 'Regulasi yuridis internal yang mengikat seluruh pimpinan struktural SIMAK mengenai sanksi pelanggaran moralitas dan manipulasi kas organisasi.',
    metaLeft: 'PDF • 38 Halaman',
    metaRight: 'Publik Terbuka',
    metaRightClass: 'text-tertiary-container font-semibold',
    keyTakeaways: [
      'Kewajiban penandatanganan Pakta Integritas di atas materai bagi Ketua Umum, 3 Wakil Ketua Umum, Sekretaris, Bendahara, dan 8 Koordinator Divisi.',
      'Prinsip Zero-Tolerance terhadap penyalahgunaan wewenang, pungutan liar, dan manipulasi nota kegiatan.',
      'Prosedur sidang etik terbuka dan mekanisme pemberhentian antar-waktu (Recall) melalui Musyawarah Istimewa.',
    ],
    chapters: [
      {
        title: 'Pasal 1–8: Sumpah Jabatan & Larangan Rangkap Kepentingan',
        summary:
          'Mengatur batasan jabatan struktural BPH dan 8 Divisi agar tidak terjadi tumpang tindih kewenangan maupun penyalahgunaan atribut SIMAK.',
      },
      {
        title: 'Pasal 9–17: Tata Kelola Administrasi & Kesekretariatan',
        summary:
          'Standar penomoran surat keputusan, pengarsipan Buku Induk Kader oleh Sekretaris Umum 1 & 2, serta otentikasi QR Code SHA-256.',
      },
      {
        title: 'Pasal 18–25: Hukum Acara Dewan Etik & Mekanisme Recall',
        summary:
          'Tahapan pemanggilan, hak jawab terperiksa, pembuktian kuitansi, hingga ketetapan sanksi administratif maupun pencabutan status kader.',
      },
    ],
    citation:
      'Badan Pengurus Harian SIMAK. (2024). Pakta Integritas Calon Fungsionaris & Mekanisme Recall Presidium (TAP-BPH/SIMAK-XV/2024/03). Jakarta: Sekretariat Jenderal SIMAK.',
  },
  {
    id: 'doc-4',
    docCode: 'PB-RIS/SIMAK-XV/2024/04',
    authorDivision: 'Tim Kajian Kebijakan Publik & BPH SIMAK',
    category: 'policy',
    topic: 'anggaran',
    badgeText: 'Policy Brief Riset',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    yearLabel: 'Tahun 2024',
    yearFilter: '2024',
    icon: 'description',
    iconColorClass: 'text-tertiary-container',
    title: 'Policy Brief: Urgensi Keterbukaan Rencana Kebutuhan Barang Milik Negara (RKBMN)',
    desc: 'Rekomendasi kebijakan bagi rektorat terkait akuntabilitas pemeliharaan sarana prasarana laboratorium kampus berdaya saing tinggi.',
    metaLeft: 'PDF • 28 Halaman',
    metaRight: 'Publik Terbuka',
    metaRightClass: 'text-tertiary-container font-semibold',
    keyTakeaways: [
      'Pentingnya publikasi berkala jadwal pemeliharaan fasilitas belajar dan laboratorium mahasiswa.',
      'Partisipasi mahasiswa melalui kanal umpan balik digital untuk melaporkan kerusakan sarana kampus secara real-time.',
      'Efisiensi anggaran operasional hingga 22% melalui pengawasan partisipatif sivitas akademika.',
    ],
    chapters: [
      {
        title: 'Bagian I: Ringkasan Eksekutif & Temuan Lapangan',
        summary:
          'Hasil survei kepuasan sarana prasarana terhadap 420 responden mahasiswa lintas program studi di lingkungan Institut STIAMI.',
      },
      {
        title: 'Bagian II: Analisis Regulasi Akuntabilitas Aset Pendidikan',
        summary:
          'Kajian komparatif standar transparansi pengelolaan fasilitas perguruan tinggi dan indikator Zona Integritas.',
      },
      {
        title: 'Bagian III: Matriks Rekomendasi Kebijakan Jangka Pendek & Menengah',
        summary:
          'Usulan konkret dashboard status pemeliharaan ruang kelas dan pelibatan perwakilan mahasiswa dalam evaluasi layanan akademik.',
      },
    ],
    citation:
      'Divisi Riset & Advokasi SIMAK. (2024). Policy Brief: Urgensi Keterbukaan Rencana Kebutuhan Barang Milik Negara (PB-RIS/SIMAK-XV/2024/04). Jakarta: SIMAK Institut STIAMI.',
  },
  {
    id: 'doc-5',
    docCode: 'MOD-GTS/SIMAK-XV/2024/05',
    authorDivision: 'Bidang II & III (Divisi Desain, Dokumentasi & Humas)',
    category: 'school',
    topic: 'edukasi',
    badgeText: 'SIMAK Goes to School',
    badgeClass: 'bg-surface-container-high text-on-surface',
    yearLabel: 'Tahun 2024',
    yearFilter: '2024',
    icon: 'school',
    iconColorClass: 'text-primary',
    title: 'Modul Siswa Jujur: Menangkal Budaya Mencontek & Titip Absen Sejak Dini',
    desc: 'Buku saku interaktif dengan studi kasus bergambar, permainan simulasi nilai integritas, dan kuis pemahaman anti-suap bagi pelajar SMA/SMK.',
    metaLeft: 'PDF Bergambar • 40 Halaman',
    metaRight: 'Bebas Royalti',
    metaRightClass: 'text-tertiary-container font-semibold',
    keyTakeaways: [
      'Pendekatan visual komik dan boardgame interaktif karya Divisi Desain SIMAK agar materi mudah dipahami siswa SMA/SMK.',
      'Studi kasus sehari-hari: bahaya menyontek, ketidakjujuran kas kelas, dan budaya titip absen sebagai benih perilaku koruptif.',
      'Panduan pendirian "Kantin Kejujuran Digital" dan Duta Integritas Siswa di sekolah mitra.',
    ],
    chapters: [
      {
        title: 'Modul A: Kenali Korupsi Kecil di Sekitar Kita',
        summary:
          'Ilustrasi interaktif yang membedakan perilaku jujur dan manipulatif dalam kehidupan sehari-hari pelajar sekolah menengah.',
      },
      {
        title: 'Modul B: Permainan Simulasi "Kota Tanpa Suap"',
        summary:
          'Panduan fasilitator kader SIMAK saat memandu diskusi kelompok (FGD) selama 45 menit di ruang kelas SMA/SMK.',
      },
      {
        title: 'Modul C: Lembar Komitmen & Ikrar Pelajar Berintegritas',
        summary:
          'Template deklarasi bersama siswa dan guru BK untuk menjaga kejujuran ujian sekolah.',
      },
    ],
    citation:
      'Tim Penyuluh SIMAK Goes To School. (2024). Modul Siswa Jujur: Menangkal Budaya Mencontek & Titip Absen Sejak Dini (MOD-GTS/SIMAK-XV/2024/05). Jakarta: SIMAK Institut STIAMI.',
  },
  {
    id: 'doc-6',
    docCode: 'JUR-INT/SIMAK-XIV/2023/06',
    authorDivision: 'Dewan Redaksi Jurnal & Alumni SIMAK Lintas Angkatan',
    category: 'policy',
    topic: 'hukum',
    badgeText: 'Jurnal Kajian Mahasiswa',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
    yearLabel: 'Tahun 2023',
    yearFilter: '2023',
    icon: 'menu_book',
    iconColorClass: 'text-tertiary-container',
    title: 'Kompilasi Esai Kritis: Digitalisasi Layanan Kampus Memutus Mata Rantai Pungli',
    desc: 'Kumpulan 10 karya esai terbaik pemenang Lomba Penulisan Integritas Nasional Dies Natalis SIMAK ke-14.',
    metaLeft: 'PDF • 112 Halaman',
    metaRight: 'Publik Terbuka',
    metaRightClass: 'text-tertiary-container font-semibold',
    keyTakeaways: [
      'Digitalisasi layanan surat-menyurat dan pembayaran akademik menekan potensi transaksi tatap muka hingga 75%.',
      'Peran mahasiswa Ilmu Administrasi Publik & Pajak dalam mengawal reformasi pelayanan terpadu satu pintu.',
      'Kumpulan gagasan inovatif mahasiswa dari 12 perguruan tinggi se-Jabodetabek.',
    ],
    chapters: [
      {
        title: 'Esai Pilihan 1–3: E-Governance & Pencegahan Pungutan Liar',
        summary:
          'Analisis efektivitas sistem antrean dan verifikasi dokumen daring dalam memangkas birokrasi berbelit.',
      },
      {
        title: 'Esai Pilihan 4–7: Literasi Pajak & Akuntabilitas Publik',
        summary:
          'Tinjauan kritis kaitan antara kesadaran perpajakan generasi muda dengan tuntutan transparansi belanja negara.',
      },
      {
        title: 'Esai Pilihan 8–10: Peran Pers Mahasiswa & Whistleblowing System',
        summary:
          'Strategi penguatan kanal pengaduan yang aman dan responsif di lingkungan pendidikan tinggi.',
      },
    ],
    citation:
      'Dewan Redaksi SIMAK. (2023). Kompilasi Esai Kritis: Digitalisasi Layanan Kampus Memutus Mata Rantai Pungli (JUR-INT/SIMAK-XIV/2023/06). Jakarta: SIMAK Press.',
  },
];

const FILTER_TABS: { id: DocCategory; label: string }[] = [
  { id: 'all', label: 'Semua Dokumen (24)' },
  { id: 'diklat', label: 'Modul Diklat (KOPASUS & PINSUS)' },
  { id: 'adart', label: 'AD/ART & Ketetapan BPH' },
  { id: 'policy', label: 'Policy Brief & Opini' },
  { id: 'school', label: 'Materi Penyuluhan Sekolah (Goes to School)' },
];

export const ELibraryScreen: React.FC<ELibraryScreenProps> = ({
  submissions,
  onAddSubmission,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<TopicSelect>('all');
  const [yearFilter, setYearFilter] = useState<'all' | '2024' | '2023' | 'arsip'>('all');
  const [activeCategory, setActiveCategory] = useState<DocCategory>('all');

  const [previewModal, setPreviewModal] = useState<PreviewModalData | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [copiedCitation, setCopiedCitation] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Pengajuan Naskah State
  const [authorInput, setAuthorInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Kajian Hukum & Kebijakan Kampus');
  const [linkInput, setLinkInput] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadPdf = async (data: PreviewModalData) => {
    try {
      triggerToast(`Menyiapkan berkas PDF: ${data.title}...`);
      await downloadPreviewPdf(data);
      triggerToast('Berkas PDF berhasil diunduh.');
    } catch {
      triggerToast('Gagal membuat berkas PDF. Silakan coba lagi.');
    }
  };

  const filteredDocs = CATALOG_DOCS.filter((doc) => {
    const matchesCat = activeCategory === 'all' || doc.category === activeCategory;
    const matchesTopic = topicFilter === 'all' || doc.topic === topicFilter;
    const matchesYear = yearFilter === 'all' || doc.yearFilter === yearFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.desc.toLowerCase().includes(q) ||
      doc.badgeText.toLowerCase().includes(q) ||
      doc.authorDivision.toLowerCase().includes(q);
    return matchesCat && matchesTopic && matchesYear && matchesSearch;
  });

  const [submittingAdvocacy, setSubmittingAdvocacy] = useState(false);
  const [advocacyError, setAdvocacyError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput.trim() || !linkInput.trim()) return;

    setSubmittingAdvocacy(true);
    setAdvocacyError('');

    try {
      await submitAdvocacy({
        title: `${categoryInput} — ${authorInput.trim()}`,
        authorName: authorInput.trim(),
        nim: 'TERVERIFIKASI',
        category: 'Laporan_Kajian' as any,
        linkUrl: linkInput.trim(),
        abstract: `Tautan Naskah: ${linkInput.trim()}`,
        readTime: '5 Menit Baca',
      });

      // Update local React state lewat callback
      onAddSubmission({
        id: `adv-${Date.now()}`,
        title: `${categoryInput} — ${authorInput.trim()}`,
        authorName: authorInput.trim(),
        nim: 'TERVERIFIKASI',
        category: 'Laporan Kajian',
        submittedAt: 'Oktober 2026',
        abstract: `Tautan Naskah: ${linkInput.trim()}`,
        status: 'Dalam Kurasi',
        readTime: '5 Menit Baca',
      });

      setAuthorInput('');
      setLinkInput('');
      triggerToast(
        'Naskah Anda berhasil dikirim ke Divisi Riset SIMAK. Kami akan meninjau dalam 3 hari kerja.'
      );
    } catch (err: any) {
      setAdvocacyError(err?.message || 'Gagal mengirim naskah. Silakan coba lagi.');
    } finally {
      setSubmittingAdvocacy(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGsapPageAnimations(containerRef);

  useEffect(() => {
    animateFilterGrid(gridRef.current);
  }, [activeCategory, topicFilter, yearFilter]);

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30 max-w-md">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-[22px] shrink-0">
            check_circle
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

      {/* Top Academic Scrim / Institutional Context Header */}
      <div className="relative w-full bg-surface-container-lowest overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/4 -bottom-16 w-80 h-80 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin py-space-xl relative z-10">
          {/* Breadcrumb & Authority Badge */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-xs font-label-md text-label-md text-secondary">
              <span className="hover:text-primary transition-colors">Repositori Resmi</span>
              <span>/</span>
              <span className="text-on-surface font-semibold">
                E-Library &amp; Riset Integritas
              </span>
            </div>
            <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Pusat Literasi, Riset &amp; Dokumen Resmi Organisasi
            </div>
          </div>

          {/* Main Header Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center mb-space-xl">
            <div data-gsap="hero-text" className="lg:col-span-8 flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-md">
                <img
                  alt="Logo Resmi SIMAK"
                  referrerPolicy="no-referrer"
                  className="h-16 w-auto object-contain filter drop-shadow-sm"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Lw2jrTMPcL02j-zQ9lDStf8IskIFjujvzmbERZKHeIWrCvb-ElGaZvynKdyWzPcBLpjgmbgMUEUpuNdbOKQxrJOgYrjzc0k_hmEuIq3Skg3Qj5i-Q75Zgu_VcYrbyMx5siL_DTkzQ74Vp-3gltlOA4CkCgoKZIdPl0cwqKMaxscX9MrEsMjmLrHmCXlZDK6pxGvWaszigQpXY2MS5zzOlwlQlckYT6palmFTp9abTgvGTn5axTYwArVvv8cyRwDBhrQ"
                />
                <span className="h-10 w-1 bg-primary rounded-full hidden sm:block"></span>
                <div>
                  <p className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
                    Lembaga Pers &amp; Kajian Etika
                  </p>
                  <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                    E-Library Integritas &amp; Repositori SIMAK
                  </h1>
                </div>
              </div>
              <p className="font-body-xl text-body-xl text-secondary max-w-2xl mt-space-xs">
                Akses terbuka modul kaderisasi, kajian kebijakan publik anti-korupsi, serta pedoman konstitusi AD/ART Spesialisasi Mahasiswa Anti Korupsi dalam merawat integritas bangsa.
              </p>
            </div>

            {/* Quick Summary Stats Card */}
            <div data-gsap="hero-media" className="lg:col-span-4 bg-surface-container-low p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between pb-space-sm">
                <span className="font-label-md text-label-md font-bold text-on-surface uppercase">
                  Status Repositori
                </span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Open Access
                </span>
              </div>
              <div className="grid grid-cols-3 gap-space-xs text-center py-space-sm">
                <div className="bg-surface-container-lowest p-space-xs rounded">
                  <p
                    data-gsap-counter="24"
                    className="font-headline-md text-headline-md text-primary font-bold tabular-nums"
                  >
                    24
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary">Naskah</p>
                </div>
                <div className="bg-surface-container-lowest p-space-xs rounded">
                  <p
                    data-gsap-counter="15"
                    className="font-headline-md text-headline-md text-on-surface font-bold tabular-nums"
                  >
                    15
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary">Th. Arsip</p>
                </div>
                <div className="bg-surface-container-lowest p-space-xs rounded">
                  <p
                    data-gsap-counter="100"
                    data-suffix="%"
                    className="font-headline-md text-headline-md text-tertiary-container font-bold tabular-nums"
                  >
                    100%
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary">Valid BPH</p>
                </div>
              </div>
              <p className="font-label-sm text-label-sm text-secondary text-right pt-space-xs">
                Terakhir diverifikasi: Oktober 2024
              </p>
            </div>
          </div>

          {/* Live Search & Filtering Input Box */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md">
            <form
              className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="md:col-span-5 relative flex items-center">
                <span className="material-symbols-outlined absolute left-space-md text-secondary">
                  search
                </span>
                <input
                  className="w-full pl-11 pr-space-md py-space-sm rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest transition-all"
                  placeholder="Cari modul, topik (Gratifikasi, PBJ, Tipikor)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as TopicSelect)}
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                >
                  <option value="all">Semua Bidang Kajian</option>
                  <option value="kaderisasi">Kaderisasi &amp; Diklat Etika</option>
                  <option value="hukum">Hukum &amp; Penegakan Tipikor</option>
                  <option value="anggaran">Audit Anggaran &amp; Transparansi</option>
                  <option value="edukasi">Penyuluhan Generasi Muda</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <select
                  value={yearFilter}
                  onChange={(e) =>
                    setYearFilter(e.target.value as 'all' | '2024' | '2023' | 'arsip')
                  }
                  className="w-full px-space-md py-space-sm rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                >
                  <option value="all">Semua Tahun</option>
                  <option value="2024">Tahun 2024</option>
                  <option value="2023">Tahun 2023</option>
                  <option value="arsip">Arsip (2009-2022)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById('katalog-modul')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-space-sm px-space-md rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Cari Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Documents (Sorotan Dokumen Utama) */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          <div data-gsap="section-header" className="flex items-center justify-between mb-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Koleksi Utama
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Dokumen Rujukan &amp; Sorotan Kader
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs font-label-md text-label-md text-secondary">
              <span className="material-symbols-outlined text-primary text-[18px]">
                auto_stories
              </span>
              Standar Resmi Kurikulum Organisasi
            </div>
          </div>

          {/* Bento Grid for Featured 3 Items */}
          <div data-gsap="stagger-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
            {/* Modul 01: Hero Big Card with Diklat Photo */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col justify-between group">
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  alt="Dokumentasi Pelatihan Kaderisasi KOPASUS SIMAK"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuABL5CQC-iW27gmwIP2zoy6a3QHm5HxfCMHQoIaf7jb8YGc1FeKLGwXDinV9H1t63Ng6adsma9e2ftvtdDtBynxfq1H3nbIx5vc-XHW0CPS_dcuABk3YiPV-8uaCDciqKz2TQtUsuhUX77JD607CyuGogsgpGlzOIjtoIZCF15rvoWZT5Sj7SQl1TJnUa1XaD3g6qGu4uz-V9yg_4H8r8HDpAEkm40aE8JLZYYYPt1Dmc8awzSNUmEJdaJ5DNBF_Hj8jeM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/40 to-transparent"></div>
                <div className="absolute top-space-md left-space-md flex gap-space-xs">
                  <span className="px-space-sm py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold tracking-wider uppercase">
                    Modul 01 • Diklat Wajib
                  </span>
                  <span className="px-space-sm py-1 rounded bg-surface-container-lowest text-on-surface font-label-sm text-label-sm font-semibold shadow-sm">
                    Batch XVI (2024)
                  </span>
                </div>
                <div className="absolute bottom-space-md left-space-md right-space-md text-inverse-on-surface">
                  <p className="font-label-md text-label-md text-tertiary-fixed font-semibold tracking-wide">
                    SILABUS KADERISASI KOPASUS
                  </p>
                  <h3 className="font-headline-md text-headline-md font-bold text-white leading-tight">
                    Buku Pedoman Kaderisasi KOPASUS Batch XVI: Prinsip Dasar Gerakan Moral &amp; Etika Investigasi Mahasiswa
                  </h3>
                </div>
              </div>
              <div className="p-space-lg flex flex-col justify-between flex-grow gap-space-md">
                <p className="font-body-md text-body-md text-secondary leading-relaxed">
                  Panduan fundamental penempaan integritas calon kader anti-korupsi. Memuat kerangka pemikiran hukum tindak pidana korupsi, metodologi pelaporan aduan kampus, kode etik whistleblower internal, serta strategi aksi moral mahasiswa.
                </p>
                <div className="pt-space-md bg-surface-container-low p-space-md rounded-lg flex flex-wrap items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-md font-label-sm text-label-sm text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        picture_as_pdf
                      </span>{' '}
                      148 Halaman
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">folder_zip</span> 8.4 MB
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-on-tertiary-container font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock_open</span> Publik SIMAK
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterIdx(0);
                        setCopiedCitation(false);
                        setPreviewModal(FEATURED_MOD_01);
                      }}
                      className="px-space-md py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                    >
                      Baca Online
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(FEATURED_MOD_01)}
                      className="px-space-md py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span> Unduh PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Modul 02 & Modul 03 */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg">
              {/* Modul 02: AD / ART Card */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="w-1.5 h-full bg-primary absolute top-0 left-0"></div>
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-space-sm py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-bold uppercase">
                      Modul 02 • Konstitusi SIMAK
                    </span>
                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">
                      gavel
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                    Anggaran Dasar &amp; Anggaran Rumah Tangga (AD/ART) Hasil Mubes Terakhir &amp; Kode Etik Perilaku Kader SIMAK
                  </h3>
                  <p className="font-body-md text-body-md text-secondary mt-space-xs">
                    Pilar konstitusi organisasi yang mengatur hak suara, struktur Dewan Kehormatan, mekanisme whistleblowing kader, serta tata tertib kedisiplinan 15 tahun kepengurusan.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center justify-between">
                  <div className="font-label-sm text-label-sm text-secondary">
                    <span>PDF • 64 Hlm • 2.1 MB</span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterIdx(0);
                        setCopiedCitation(false);
                        setPreviewModal(FEATURED_MOD_02);
                      }}
                      className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high cursor-pointer"
                    >
                      Pratinjau
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(FEATURED_MOD_02)}
                      className="px-space-md py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container cursor-pointer"
                    >
                      Unduh Dokumen
                    </button>
                  </div>
                </div>
              </div>

              {/* Modul 03: White Paper / Policy Brief */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="w-1.5 h-full bg-tertiary-container absolute top-0 left-0"></div>
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-space-sm py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">
                      Modul 03 • White Paper Riset
                    </span>
                    <span className="material-symbols-outlined text-secondary group-hover:text-tertiary-container transition-colors">
                      analytics
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                    White Paper: Analisis Transparansi Anggaran Fasilitas Kampus &amp; Penguatan Integritas Sivitas Akademika
                  </h3>
                  <p className="font-body-md text-body-md text-secondary mt-space-xs">
                    Kajian independen divisi advokasi mengenai rasio serapan dana kegiatan kemahasiswaan, keterbukaan informasi publik, dan rekomendasi reformasi birokrasi kampus.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm flex items-center justify-between">
                  <div className="font-label-sm text-label-sm text-secondary">
                    <span>PDF • 92 Hlm • 5.6 MB</span>
                  </div>
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterIdx(0);
                        setCopiedCitation(false);
                        setPreviewModal(FEATURED_MOD_03);
                      }}
                      className="px-space-sm py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold hover:bg-surface-container-high cursor-pointer"
                    >
                      Pratinjau
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(FEATURED_MOD_03)}
                      className="px-space-md py-1 rounded bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-semibold hover:opacity-90 cursor-pointer"
                    >
                      Unduh Dokumen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Catalog Repository with Filter Tabs */}
      <section className="w-full bg-surface-container-low py-space-xl" id="katalog-modul">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          {/* Section Title & Meta */}
          <div data-gsap="section-header" className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Katalog Terstruktur
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                Koleksi Modul &amp; Naskah Publikasi
              </h2>
              <p className="font-body-md text-body-md text-secondary mt-1">
                Seluruh berkas telah diautentikasi oleh Divisi Riset &amp; Dewan Etik SIMAK.
              </p>
            </div>
            {/* Active View / Display Switcher */}
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Tanda Tangan Elektronik Aktif (SHA-256)
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-space-xs mb-space-lg">
            {FILTER_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={
                    isSelected
                      ? 'px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold transition-all shadow-sm cursor-pointer'
                      : 'px-space-md py-2 rounded-lg bg-surface-container-lowest text-secondary hover:text-on-surface font-label-md text-label-md font-semibold transition-all cursor-pointer'
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Document Cards Grid */}
          <div ref={gridRef} data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span
                      className={`px-space-xs py-0.5 rounded font-label-sm text-label-sm font-bold ${doc.badgeClass}`}
                    >
                      {doc.badgeText}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                      {doc.yearLabel}
                    </span>
                  </div>
                  <div className="flex items-start gap-space-sm mb-space-xs">
                    <div className={`p-2 rounded bg-surface-container ${doc.iconColorClass}`}>
                      <span className="material-symbols-outlined text-[24px]">{doc.icon}</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                      {doc.title}
                    </h4>
                  </div>
                  <p className="font-body-md text-body-md text-secondary line-clamp-3 mb-space-sm">
                    {doc.desc}
                  </p>
                  <div className="text-[11px] text-secondary mb-space-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      verified
                    </span>
                    <span className="truncate">{doc.authorDivision}</span>
                  </div>
                </div>
                <div className="pt-space-sm border-t-0 bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-label-sm text-label-sm text-secondary">
                    <span>{doc.metaLeft}</span>
                    <span className={doc.metaRightClass}>{doc.metaRight}</span>
                  </div>
                  <div className="flex items-center justify-between gap-space-xs mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChapterIdx(0);
                        setCopiedCitation(false);
                        setPreviewModal({
                          docCode: doc.docCode,
                          authorDivision: doc.authorDivision,
                          title: doc.title,
                          badge: doc.badgeText,
                          meta: `${doc.metaLeft} • ${doc.yearLabel}`,
                          desc: doc.desc,
                          keyTakeaways: doc.keyTakeaways,
                          chapters: doc.chapters,
                          citation: doc.citation,
                        });
                      }}
                      className="w-1/2 py-1.5 rounded bg-surface-container-highest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">menu_book</span>
                      Baca Online
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadPdf({
                          docCode: doc.docCode,
                          authorDivision: doc.authorDivision,
                          title: doc.title,
                          badge: doc.badgeText,
                          meta: `${doc.metaLeft} • ${doc.yearLabel}`,
                          desc: doc.desc,
                          keyTakeaways: doc.keyTakeaways,
                          chapters: doc.chapters,
                          citation: doc.citation,
                        })
                      }
                      className="w-1/2 py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">file_download</span>{' '}
                      Unduh
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Kontribusi & Pengajuan Riset Mahasiswa */}
      <section className="w-full bg-surface-container-lowest py-space-xl relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-xl p-space-lg sm:p-space-xl relative overflow-hidden">
            {/* Subtle Vector Batik Motif Watermark */}
            <svg
              className="absolute -right-10 -bottom-10 w-96 h-96 text-primary/5 pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <path d="M50 0 L100 50 L50 100 L0 50 Z"></path>
              <circle cx="50" cy="50" r="25"></circle>
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
              <div className="lg:col-span-7 flex flex-col gap-space-sm">
                <span className="inline-flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">rate_review</span>
                  Kanal Penulisan &amp; Advokasi
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                  Punya Naskah Kajian atau Fakta Investigasi Integritas Kampus?
                </h2>
                <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
                  Divisi Riset, Kajian &amp; Media SIMAK membuka ruang publikasi terbuka bagi seluruh kader dan mahasiswa lintas universitas. Kirimkan draft artikel opini, naskah riset kebijakan hukum antikorupsi, atau policy brief untuk ditinjau oleh Dewan Redaksi.
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-md text-label-md text-secondary">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                    Review Independen
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                    ISBN / Digital DOI
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      check_circle
                    </span>
                    Perlindungan Whistleblower
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm">
                  Formulir Pengajuan Naskah
                </h3>
                <form className="flex flex-col gap-space-sm" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-secondary block mb-1">
                      Nama Lengkap &amp; NIM / Instansi
                    </label>
                    <input
                      className="w-full px-space-sm py-2 rounded bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                      placeholder="Cth: Raditya Pratama (Fakultas Hukum)"
                      required
                      type="text"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-secondary block mb-1">
                      Kategori Naskah
                    </label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full px-space-sm py-2 rounded bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                    >
                      <option>Kajian Hukum &amp; Kebijakan Kampus</option>
                      <option>Esai Opini Publik Antikorupsi</option>
                      <option>Hasil Investigasi Satgas Mahasiswa</option>
                      <option>Modul Penyuluhan Pelajar</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-secondary block mb-1">
                      Tautan Naskah / Dokumen (Google Drive / Cloud)
                    </label>
                    <input
                      className="w-full px-space-sm py-2 rounded bg-surface-container-low font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest"
                      placeholder="https://drive.google.com/file/d/..."
                      required
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                    />
                  </div>
                  <button
                    className="mt-space-xs w-full py-space-sm px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg font-semibold transition-colors flex items-center justify-center gap-space-xs shadow-sm cursor-pointer"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Kirim Naskah ke Divisi Riset
                  </button>
                </form>
              </div>
            </div>

            {/* Live Submitted Manuscripts Feed */}
            {submissions.length > 0 && (
              <div className="mt-space-xl pt-space-lg border-t border-outline-variant/40 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-space-md">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Antrean Redaksi &amp; Publikasi Mahasiswa
                    </span>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Naskah Kajian &amp; Opini Sivitas Akademika ({submissions.length})
                    </h3>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Menampilkan kiriman naskah terbaru yang masuk ke meja redaksi SIMAK
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                            {sub.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded font-label-sm text-label-sm font-bold ${
                              sub.status === 'Diterbitkan'
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-sm font-bold text-on-surface leading-snug">
                          {sub.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2">{sub.abstract}</p>
                      </div>
                      <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-secondary">
                        <span className="font-semibold text-on-surface">{sub.authorName}</span>
                        <span>
                          {sub.submittedAt} • {sub.readTime}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Academic Reader View / Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-outline-variant/40 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Reader Header */}
            <div className="bg-primary p-6 sm:px-8 text-on-primary flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase">
                    {previewModal.badge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-white/15 text-white font-mono text-xs font-semibold">
                    Kode: {previewModal.docCode}
                  </span>
                </div>
                <h3 className="font-headline-md text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {previewModal.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-primary-container">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">groups</span>
                    Penyusun: <strong className="text-white">{previewModal.authorDivision}</strong>
                  </span>
                  <span>•</span>
                  <span>{previewModal.meta}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shrink-0 cursor-pointer"
                aria-label="Tutup pratinjau dokumen"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Executive Abstract */}
              <div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                    Ringkasan Eksekutif &amp; Abstrak Naskah
                  </span>
                  <span className="text-[11px] font-semibold text-tertiary-container">
                    Open Access • Bebas Unduh
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  {previewModal.desc}
                </p>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-3">
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-extrabold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    task_alt
                  </span>
                  Poin Kunci Pembelajaran (Key Takeaways)
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {previewModal.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        0{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-on-surface leading-relaxed font-medium">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Chapter Outline / Reader Tabs */}
              <div className="space-y-3">
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface font-extrabold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    toc
                  </span>
                  Pratinjau Struktur Bab &amp; Cuplikan Isi
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewModal.chapters.map((ch, idx) => {
                    const isActive = activeChapterIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveChapterIdx(idx)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface'
                        }`}
                      >
                        Bagian {idx + 1}
                      </button>
                    );
                  })}
                </div>
                {previewModal.chapters[activeChapterIdx] && (
                  <div className="p-4 rounded-xl bg-primary-fixed/25 border border-primary/20 space-y-1.5">
                    <div className="font-bold text-sm text-primary">
                      {previewModal.chapters[activeChapterIdx].title}
                    </div>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {previewModal.chapters[activeChapterIdx].summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Academic Citation Box */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      format_quote
                    </span>
                    Format Kutipan Akademik (APA 7th Edition)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(previewModal.citation);
                      setCopiedCitation(true);
                      setTimeout(() => setCopiedCitation(false), 2500);
                    }}
                    className="px-2.5 py-1 rounded bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-primary border border-primary/30 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedCitation ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedCitation ? 'Kutipan Tersalin!' : 'Salin Kutipan'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-on-surface-variant leading-relaxed select-all">
                  {previewModal.citation}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    verified_user
                  </span>
                  Tanda Tangan Elektronik Aktif (SHA-256) • Terverifikasi BPH SIMAK
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadPdf(previewModal);
                      setPreviewModal(null);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[17px]">download</span>
                    Unduh PDF Lengkap
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewModal(null)}
                    className="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
