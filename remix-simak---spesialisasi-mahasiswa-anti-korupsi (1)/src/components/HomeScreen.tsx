import React, { useState, useRef } from 'react';
import { ScreenId, ParticipantRecord, LibraryDocument } from '../types';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  participants: ParticipantRecord[];
  documents: LibraryDocument[];
  myHarlahRegistration?: ParticipantRecord | null;
  onSelectParticipantForTicket: (participant: ParticipantRecord) => void;
}

interface SubDivisionItem {
  name: string;
  icon: string;
  desc: string;
}

interface BphLeaderProfile {
  id: string;
  roleBadge: string;
  fullName: string;
  divisionTitle: string;
  nia: string;
  nim: string;
  cohort: string;
  prodi: string;
  photo: string;
  quote: string;
  subDivisions?: SubDivisionItem[];
  mandates: string[];
}

const BPH_LEADERS: Record<string, BphLeaderProfile> = {
  venus: {
    id: 'venus',
    roleBadge: 'Ketua Umum SIMAK',
    fullName: 'Venus Sangia Alfarizi',
    divisionTitle: 'Mandataris MUBES & Koordinator Umum SIMAK',
    nia: 'NIA.SIMAK.XV.001',
    nim: '2024102001',
    cohort: 'Angkatan XV',
    prodi: 'Ilmu Administrasi Publik — Institut STIAMI',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDADPJNYCgxb95EXXFZ2oTViLdgWeaxY5NUd01v-4rICm43RDkUme6FKTeKyAo-ohGO-5Q06TEdHKhFN1qboiPHkwxQa1gZjnJvoNcQG1tD1e5ZRmVna65OTNyenwOLaNB-ym6z-7MJRcwHje-10lvVZjznvy6gA5OLKf4L5A0aqj6LNA68gLiJ4IJD0G-hXvKHF40Lf2gOWzThpU13gzlTzyBEA8-uvC3nDyN3YnBj',
    quote:
      '“Integritas bukan sekadar slogan di atas kertas, melainkan keberanian menjaga kejujuran saat tidak ada satu pun mata yang mengawasi.”',
    subDivisions: [
      {
        name: 'Koordinasi 3 Wakil Ketua Umum & 8 Divisi',
        icon: 'account_tree',
        desc: 'Memimpin sinergi strategis antara Wakil Ketua 1–3, Kesekretariatan (Sekretaris 1 & 2), serta Kebendaharaan.',
      },
      {
        name: 'Hubungan Kelembagaan Tinggi',
        icon: 'shield',
        desc: 'Penanggung jawab utama kolaborasi bersama KPK RI, Mahkamah Agung RI, Mabes Polri, dan Rektorat Institut STIAMI.',
      },
    ],
    mandates: [
      'Memimpin arah strategis gerakan antikorupsi SIMAK berdasarkan AD/ART dan Ketetapan MUBES.',
      'Menjaga independensi organisasi serta memimpin kemitraan kelembagaan bersama KPK RI, MA, dan Mabes Polri.',
      'Bertanggung jawab penuh atas keterbukaan informasi dan audit publik nol-selisih (Zero-Discrepancy).',
    ],
  },
  fathan: {
    id: 'fathan',
    roleBadge: 'Wakil Ketua Umum 1',
    fullName: 'Fathan Hendrawan',
    divisionTitle: 'Bidang Program, Kaderisasi & Operasional Lapangan',
    nia: 'NIA.SIMAK.XV.002',
    nim: '2024102014',
    cohort: 'Angkatan XV',
    prodi: 'Manajemen Kebijakan Publik — Institut STIAMI',
    photo: '/pengurus/waketum-1.png',
    quote:
      '“Kaderisasi yang terstruktur dan disiplin lapangan yang tegas adalah kunci melahirkan pejuang antikorupsi yang tangguh.”',
    subDivisions: [
      {
        name: 'Divisi Acara',
        icon: 'event_note',
        desc: 'Merancang konsep acara, kurikulum diklat KOPASUS & PINSUS, susunan acara (rundown) Seminar Nasional HARLAH, dan SIMAK Goes To School.',
      },
      {
        name: 'Divisi Korlap',
        icon: 'campaign',
        desc: 'Koordinator Lapangan — Memimpin ketertiban teknis di lapangan, mobilisasi dan kedisiplinan kader, manajemen waktu kegiatan, serta sterilisasi lokasi acara.',
      },
    ],
    mandates: [
      'Mengoordinasikan Divisi Acara dan Divisi Koordinator Lapangan (Korlap) pada seluruh program kerja SIMAK.',
      'Merancang kurikulum kaderisasi berjenjang (KOPASUS, PINSUS, dan TOT Penegakan Hukum).',
      'Mengawal ketertiban pelaksanaan kegiatan di dalam maupun di luar kampus secara disiplin dan tepat waktu.',
    ],
  },
  dwi: {
    id: 'dwi',
    roleBadge: 'Wakil Ketua Umum 2',
    fullName: 'Dwi Agus Hidayat',
    divisionTitle: 'Bidang Komunikasi, Informasi & Teknologi (KOMINTEK)',
    nia: 'NIA.SIMAK.XV.003',
    nim: '2024102028',
    cohort: 'Angkatan XV',
    prodi: 'Ilmu Komunikasi & Media Publik — Institut STIAMI',
    photo: '/pengurus/waketum-2.png',
    quote:
      '“Visual yang kuat dan dokumentasi yang terarsip rapi adalah wajah kredibilitas gerakan antikorupsi di era digital.”',
    subDivisions: [
      {
        name: 'Divisi Dokumentasi',
        icon: 'photo_camera',
        desc: 'Bertanggung jawab atas peliputan foto & video kegiatan, pengarsipan dokumentasi sejarah 15 angkatan, serta pengelolaan galeri publik SIMAK.',
      },
      {
        name: 'Divisi Desain',
        icon: 'palette',
        desc: 'Merancang identitas visual kampanye antikorupsi, infografis edukasi publik, poster program kerja, serta tata letak piagam & E-Tiket.',
      },
    ],
    mandates: [
      'Membawahi langsung Divisi Dokumentasi dan Divisi Desain dalam produksi media kreatif dan arsip visual SIMAK.',
      'Mengelola portal digital SIMAK, sistem E-Tiket QR Code, dan publikasi kampanye integritas di media sosial.',
      'Menyebarluaskan infografis pendidikan antikorupsi serta laporan dokumentasi setiap program kerja.',
    ],
  },
  putri: {
    id: 'putri',
    roleBadge: 'Wakil Ketua Umum 3',
    fullName: 'Putri Rizki Amelia',
    divisionTitle: 'Bidang Kemandirian, Hubungan Eksternal & Logistik',
    nia: 'NIA.SIMAK.XV.004',
    nim: '2024102039',
    cohort: 'Angkatan XV',
    prodi: 'Administrasi Bisnis & Perpajakan — Institut STIAMI',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2dyHqdowrCjYQQ_YOMuqQpZXqoFRZMh4o5wH_K5XITK_IUhFW-r5kyChfJYE3eVpHZYxvEPxr59_PVb_oZir20LvN_Jey92qAlgC6ac97R1KDQHiLF4k1xOGUoBiYxhvJxumAuXnTuuJCFgNnoytBSAn2jsWZOxhhLJeUNestblwWRqMgvAB-7E5nOPKDHGWVl2WzvNUx_PcKqhOlRb7PDe84aRXTbZFTMjabiRiu',
    quote:
      '“Kemandirian finansial dan jejaring kemitraan yang bersih adalah benteng agar organisasi mahasiswa tetap merdeka.”',
    subDivisions: [
      {
        name: 'Divisi Ekonomi Kreatif',
        icon: 'storefront',
        desc: 'Mengelola kewirausahaan mandiri organisasi, produksi atribut resmi (PDH, lanyard, merchandise integritas), dan pendanaan kreatif bebas gratifikasi.',
      },
      {
        name: 'Divisi Humas',
        icon: 'handshake',
        desc: 'Menjalin komunikasi eksternal dan kemitraan bersama instansi penegak hukum, sekolah mitra, BEM/UKM, alumni, serta masyarakat umum.',
      },
      {
        name: 'Divisi Perlengkapan',
        icon: 'inventory_2',
        desc: 'Menyiapkan kebutuhan sarana-prasarana acara, tata panggung & tata suara auditorium, inventaris sekretariat, serta logistik diklat lapangan.',
      },
      {
        name: 'Divisi Konsumsi',
        icon: 'restaurant',
        desc: 'Mengelola penyediaan dan distribusi konsumsi peserta, jamuan tamu undangan/narasumber, serta paket santunan pada program Ramadhan Integrity.',
      },
    ],
    mandates: [
      'Mengoordinasikan Divisi Ekonomi Kreatif, Divisi Hubungan Masyarakat (Humas), Divisi Perlengkapan, dan Divisi Konsumsi.',
      'Mengembangkan usaha mandiri organisasi yang akuntabel serta bebas dari konflik kepentingan.',
      'Memperluas jejaring kolaborasi antar-kampus, sekolah mitra SIMAK Goes To School, dan lembaga publik.',
      'Memastikan pengadaan barang, sewa perlengkapan, dan konsumsi kegiatan tercatat transparan sesuai standar kuitansi sah.',
    ],
  },
  elvira: {
    id: 'elvira',
    roleBadge: 'Sekretaris Umum 1',
    fullName: 'Elvira Wati Ningsi',
    divisionTitle: 'Administrasi Internal, Persuratan & Buku Induk Kader',
    nia: 'NIA.SIMAK.XV.006',
    nim: '2024102063',
    cohort: 'Angkatan XV',
    prodi: 'Ilmu Administrasi Publik — Institut STIAMI',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATpmoMn5hZ5afcdiY4vFCJg0Q_7rOsoGq0wAGP-KO-di-xUrVQlZSQqde_LKshVx65QjgVGESExmRLZ2xri_bBjHssw5Um2QZdkTTZJKOBCHAz9sxMldEvEW1WASTvgeIkm8wQ8boUq0GGBVGRCecutaxogmqM4X6XXq7kix8z8z0wYTYhjl9W20tnVIlDQ43XNMMshQQGabhzi-qP_qtPQhYlP9qpedx1wzEfyRya',
    quote:
      '“Ketertiban administrasi persuratan dan keabsahan Buku Induk 15 Angkatan adalah fondasi kesinambungan sejarah organisasi.”',
    subDivisions: [
      {
        name: 'Tata Naskah Dinas & Buku Induk',
        icon: 'description',
        desc: 'Penerbitan Surat Keputusan (SK), surat keluar/masuk kelembagaan, serta pemutakhiran Buku Induk Anggota 15 Angkatan.',
      },
    ],
    mandates: [
      'Mengelola tata persuratan resmi kelembagaan (SK Pengurus, Surat Tugas, dan Surat Undangan Instansi).',
      'Memelihara basis data Buku Induk Anggota lintas 15 angkatan dan penomoran Nomor Induk Anggota (NIA).',
      'Berkoordinasi dengan Ketua Umum dan Wakil Ketua dalam penyusunan Laporan Pertanggungjawaban (LPJ) Sekretaris.',
    ],
  },
  nabila: {
    id: 'nabila',
    roleBadge: 'Sekretaris Umum 2',
    fullName: 'Nabila Azzahra Putri',
    divisionTitle: 'Notulensi Rapat, Arsip Dokumen & Registrasi Tamu',
    nia: 'NIA.SIMAK.XV.007',
    nim: '2024102068',
    cohort: 'Angkatan XV',
    prodi: 'Ilmu Administrasi Publik — Institut STIAMI',
    photo:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote:
      '“Setiap keputusan musyawarah dan kehadiran peserta wajib tercatat akurat sebagai wujud tata kelola organisasi yang tertib.”',
    subDivisions: [
      {
        name: 'Notulensi, E-Library & Presensi Tamu',
        icon: 'fact_check',
        desc: 'Penyusunan risalah rapat BPH, pengarsipan modul di E-Library, serta verifikasi presensi dan E-Sertifikat tamu acara HARLAH.',
      },
    ],
    mandates: [
      'Menyusun notulensi/risalah rapat rutin BPH, Rapat Kerja, dan Musyawarah Besar (MUBES).',
      'Mengelola pengarsipan dokumen kajian di E-Library serta penomoran Piagam E-Sertifikat peserta kegiatan.',
      'Mengatur meja registrasi ulang dan buku tamu digital pada acara puncak HARLAH SIMAK (29 Januari).',
    ],
  },
  rusni: {
    id: 'rusni',
    roleBadge: 'Bendahara Umum',
    fullName: 'Rusni Ariantika',
    divisionTitle: 'Akuntabilitas Finansial & Audit Kas Terbuka',
    nia: 'NIA.SIMAK.XV.008',
    nim: '2024102051',
    cohort: 'Angkatan XV',
    prodi: 'Akuntansi Sektor Publik — Institut STIAMI',
    photo:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN8YD7dEid-29HBxxZh3zTUxFRWAewzvmj3Rijn88aeqRsOC25FeQgWyFIJSt23J_EIW1SnAADjXOTcMZX_K3fYiVZfANymi1NX6yBpeGpZKjjXWZ_t53skgMXVUi--ElACQ_QzFjsQ1E6frh3b_kLHC0Fe0jnW9MMviG3uA8Z4ZvpbcldMUQQ9ConTlO_67fT6_bnFF75jw4bbVXiN7PLOjqCOj52iAEKXh7Oi1xX',
    quote:
      '“Setiap rupiah dana kas dan donasi publik wajib memiliki bukti kuitansi sah dan dapat diperiksa oleh siapa saja secara terbuka.”',
    subDivisions: [
      {
        name: 'Pembukuan Kas & Audit Nol-Selisih',
        icon: 'account_balance_wallet',
        desc: 'Pengelolaan Buku Kas Umum (BKU), verifikasi kuitansi pengeluaran divisi, dan publikasi laporan keuangan terbuka.',
      },
    ],
    mandates: [
      'Menyusun dan mempublikasikan Laporan Pertanggungjawaban (LPJ) keuangan secara terbuka di portal Transparansi.',
      'Menjalankan standar pembukuan Zero-Discrepancy (Nol Selisih) pada setiap kepanitiaan proker dan divisi.',
      'Melakukan verifikasi nota dan bukti pengeluaran dari Divisi Acara, Perlengkapan, maupun Konsumsi sebelum pencairan dana.',
    ],
  },
};

interface ProkerDetail {
  id: string;
  code: string;
  title: string;
  category: string;
  statusBadge: string;
  isUpcomingHarlah?: boolean;
  cycleNote: string;
  targetAudience: string;
  location: string;
  image: string;
  summary: string;
  objectives: string[];
  curriculumOrAgenda: string[];
  outputCertification: string;
}

const PROKER_DETAILS: Record<string, ProkerDetail> = {
  kopasus: {
    id: 'kopasus',
    code: 'PROKER-01 • KADERISASI DASAR',
    title: 'Komunikasi Pendidikan Khusus (KOPASUS)',
    category: 'Satu-satunya Gerbang Rekrutmen Anggota Baru SIMAK',
    statusBadge: 'Sudah Terlaksana • Pendaftaran Ditutup',
    cycleNote:
      'Kegiatan KOPASUS periode ini telah selesai dilaksanakan. Pendaftaran anggota baru resmi ditutup dan akan dibuka kembali pada periode kepengurusan selanjutnya.',
    targetAudience: 'Mahasiswa Aktif Institut STIAMI (Semester 1–6)',
    location: 'Kampus Pusat Cempaka Putih & Pusat Diklat Cisarua',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSdd1AR0-zoGoi9ksikfgcRah_guw9NuDGUdgxbbEL1ZbLaoPQT5VjtbfLe3avMM5eSZUvRvRPxXBD0eGVsvY3elNVN_Xzfd0KgtnAxULHSBlWR_6RtHxDVg2Z_NxV2HbFilIdQ6lmSZt9vnJeAHVrmplyPi6Fz2ErVblIGEpBtANAXP45PugSaBZQr20cci697zKabbKowSp9kp9Y-mFNs7gh4FBNbtcE7sC3XB9a',
    summary:
      'KOPASUS merupakan gerbang utama dan satu-satunya jalur rekrutmen anggota baru Spesialisasi Mahasiswa Anti Korupsi (SIMAK) untuk menanamkan nilai integritas, sejarah perjuangan sejak 29 Januari 2011, wawasan kebangsaan, dan etika kepemimpinan mahasiswa.',
    objectives: [
      'Menyaring dan membentuk kader baru yang berintegritas, jujur, disiplin, dan bebas konflik kepentingan.',
      'Menanamkan pemahaman mendalam mengenai 9 Nilai Integritas Antikorupsi (Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, Adil).',
      'Membekali peserta dengan kemampuan analisis kebijakan publik, advokasi mahasiswa, dan kepemimpinan organisasi.',
    ],
    curriculumOrAgenda: [
      'Tahap 01: Seleksi Berkas Akademik & Esai Motivasi Integritas',
      'Tahap 02: Screening & Wawancara Komitmen Moral bersama BPH & Dewan Pembina',
      'Tahap 03: Diklat Lapangan KOPASUS (3 Hari 2 Malam) & Simulasi Investigasi Kasus',
      'Tahap 04: Pengukuhan Sumpah Kader, Penyematan PDH, & Penerbitan Nomor Induk Anggota (NIA)',
    ],
    outputCertification: 'SK Pengukuhan Kader Resmi, Nomor Induk Anggota (NIA), E-KTA Digital SIMAK, & Piagam Lulus Diklat KOPASUS.',
  },
  pinsus: {
    id: 'pinsus',
    code: 'PROKER-02 • PEMBINAAN LANJUTAN',
    title: 'Pendidikan Khusus Kader (PINSUS)',
    category: 'Kaderisasi Tingkat Lanjut & Kepemimpinan Strategis',
    statusBadge: 'Sudah Terlaksana • Khusus Kader Internal',
    cycleNote:
      'Pelaksanaan PINSUS periode ini telah selesai. Program ini dikhususkan bagi kader internal yang telah lulus KOPASUS dan akan dibuka kembali di periode selanjutnya.',
    targetAudience: 'Kader Aktif Lulusan KOPASUS & Pengurus SIMAK',
    location: 'Kampus Pusat Institut STIAMI Jakarta',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAaLFp2EuNFVidMt_8M1VPVEGI6W8pBxGRNFAvsNnetAvxueljTz_LcWJ2ggdWAMoi4v6JMpDD9FV6MTdTqa8AqUjbtu7rIbmaiWIdOxxgJgLJ_fQ545tQvjWWksHtPcAprYVF9iuD0n6gKOVWPqkaMOWaBO8qS0bJqqrXq87AKRw-EwvwiV29Mf4Wgqda7rmrSk2KvxniknKuTlI6jpEjdvtJgYo6P5sbX4oshr8W0',
    summary:
      'PINSUS adalah program pembinaan lanjutan bagi kader yang telah lulus KOPASUS untuk memperdalam kapasitas kepemimpinan strategis, manajemen krisis organisasi, dan keteguhan moral saat menghadapi tekanan publik.',
    objectives: [
      'Mempersiapkan calon pimpinan Badan Pengurus Harian (BPH) dan Ketua Divisi periode berikutnya.',
      'Melatih kecakapan komunikasi publik, negosiasi kelembagaan, dan perumusan naskah kajian strategis.',
      'Memperkuat solidaritas dan loyalitas nilai antikorupsi di tingkat pengurus inti.',
    ],
    curriculumOrAgenda: [
      'Sesi I: Manajemen Strategis Organisasi & Tata Kelola Keuangan Nirlaba Transparan',
      'Sesi II: Komunikasi Krisis, Retorika Publik, & Advokasi Kebijakan Kampus',
      'Sesi III: Bedah Studi Kasus Korupsi Sektor Publik & Penyusunan Policy Brief',
      'Sesi IV: Evaluasi Kinerja Kader & Pemetaan Kepemimpinan Organisasi',
    ],
    outputCertification: 'Sertifikat Kompetensi PINSUS & Kualifikasi Calon Pengurus Inti (BPH) SIMAK.',
  },
  tot: {
    id: 'tot',
    code: 'PROKER-03 • SINERGI PENEGAK HUKUM',
    title: 'Training of Trainer (TOT) Penegakan Hukum',
    category: 'Kemitraan KPK RI, Mahkamah Agung & Mabes Polri',
    statusBadge: 'Sudah Terlaksana • Selesai',
    cycleNote:
      'Kegiatan TOT bersama mitra penegak hukum periode ini telah terlaksana dengan sukses dan akan kembali diselenggarakan pada siklus tahunan berikutnya.',
    targetAudience: 'Delegasi Kader Terpilih & Penyuluh Muda SIMAK',
    location: 'Gedung Merah Putih KPK RI / Auditorium Mitra',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDrxvmPej5B3j40XUmN8CHb3f8OBd9ryGvKiivTEEJ37Rk2iL2bPTjKy8jFn3kjW1Hvs34InHgHRRWp9IeRZ3ATnanXN63AyMaq89ae_twjGFLk8UHMN-rsOQHeoXfZCj-W_1-nUhIEucVCwb4aP0LwmnzKXTavKakDtRU0gOAMzfX9lky1bBgf41xCAuAVWg0b4rn2FfHUCJ4rIRinH3WzdYCCK-CRB1Vq2tuuoSB',
    summary:
      'Program pelatihan intensif bekerja sama dengan Komisi Pemberantasan Korupsi (KPK RI), Mahkamah Agung, dan Mabes Polri untuk mencetak instruktur serta fasilitator penyuluh antikorupsi muda di lingkungan kampus dan masyarakat.',
    objectives: [
      'Memberikan pemahaman hukum acara pidana korupsi dan mekanisme pencegahan korupsi secara langsung dari praktisi penegak hukum.',
      'Mencetak kader fasilitator yang siap diterjunkan pada program edukasi SIMAK Goes To School.',
      'Membangun jejaring kelembagaan antara mahasiswa Institut STIAMI dengan lembaga penegak hukum nasional.',
    ],
    curriculumOrAgenda: [
      'Materi 1: Strategi Trisula Pemberantasan Korupsi (Pendidikan, Pencegahan, Penindakan) bersama KPK RI',
      'Materi 2: Peradilan Tindak Pidana Korupsi (Tipikor) & Integritas Yudikatif bersama Mahkamah Agung',
      'Materi 3: Metodologi Penyuluhan Kreatif & Micro-Teaching Fasilitator Antikorupsi',
      'Materi 4: Kunjungan Kelembagaan & Simulasi Pelaporan Whistleblowing System',
    ],
    outputCertification: 'Sertifikat Fasilitator / Penyuluh Muda Antikorupsi & Modul Resmi TOT.',
  },
  ramadhan: {
    id: 'ramadhan',
    code: 'PROKER-04 • PENGABDIAN KEMANUSIAAN',
    title: 'Ramadhan Integrity & Bakti Sosial Antikorupsi',
    category: 'Implementasi Nilai Peduli & Empati Sosial',
    statusBadge: 'Sudah Terlaksana • Agenda Ramadhan',
    cycleNote:
      'Program Ramadhan Integrity tahun ini telah terlaksana (penyaluran 250 paket santunan & sembako) dan akan kembali hadir pada Bulan Suci Ramadhan berikutnya.',
    targetAudience: 'Anak Yatim Piatu, Kaum Dhuafa, & Masyarakat Sekitar Kampus',
    location: 'DKI Jakarta & Bekasi',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHiBrBGM7unygMJ09G4znGwjboEge7LxoDHZjMe2SkXuGFv1-KWc5DSJe8fCuJzs2IN0IOe1M3JsGNrCPFGkYnAg_qW5bwVNl6bKC6hVmFQhpLMsT5ZS3Wgu8uJmnVwkGMdfZItJQP7teumCNL_luvPgwhrIKGi0QkrLRYMDJ1EYqYQxuKEZIbK2IzhM2heCcmeBOOJCn3yU4ZgI_ixNc43TXabdPUEEwSSamJeyt',
    summary:
      'Wujud nyata nilai "Peduli" dan "Sederhana" dalam 9 Nilai Integritas melalui aksi santunan yatim piatu, pembagian sembako, kultum integritas, dan buka puasa bersama lintas angkatan SIMAK.',
    objectives: [
      'Membuktikan bahwa gerakan antikorupsi berakar pada kepekaan sosial dan empati terhadap hak-hak masyarakat kecil.',
      'Mengelola dana donasi publik secara 100% transparan dengan audit nol-selisih (Zero-Discrepancy).',
      'Mempererat ukhuwah dan solidaritas antar-angkatan SIMAK bersama masyarakat.',
    ],
    curriculumOrAgenda: [
      'Penggalangan Dana Sosial Terbuka & Publikasi Laporan Kas Harian',
      'Penyaluran Paket Sembako & Santunan Pendidikan Anak Yatim Piatu',
      'Dongeng & Edukasi Kejujuran Anak melalui Media Interaktif',
      'Kajian Nuzulul Quran, Refleksi Spiritual Integritas, & Buka Puasa Bersama',
    ],
    outputCertification: 'Laporan Pertanggungjawaban (LPJ) Publik Donasi Sosial Terbuka.',
  },
  harlah: {
    id: 'harlah',
    code: 'PROKER-05 • AGENDA TERDEKAT (29 JANUARI)',
    title: 'Hari Lahir (HARLAH) SIMAK — 29 Januari',
    category: 'Seminar Nasional, Refleksi Pendirian & Temu Lintas Angkatan',
    statusBadge: 'Agenda Terdekat • Registrasi Tamu Dibuka',
    isUpcomingHarlah: true,
    cycleNote:
      'Merupakan agenda terdekat organisasi pada tanggal 29 Januari. Pendaftaran dibuka khusus bagi Tamu Undangan, Mahasiswa Umum, Delegasi UKM/BEM, & Alumni yang ingin menghadiri acara puncak HARLAH.',
    targetAudience: 'Tamu Undangan, Mahasiswa Umum, Delegasi Kampus Mitra, & Keluarga Besar SIMAK',
    location: 'Auditorium Utama Institut STIAMI Jakarta Pusat',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZioie1EvnXlJTsah7hHrLuEccnECLnf7hKd-HcthQvj_MdbY2Hg_0-t4R7NFvihgsLVNXGvHB29iyuKSNL5RjTcv6Jcbkxj2xugNqYyCykOzLT03fk4DcaUec_7b2Y4nH46ZI0rRwJplgxtP1DvYecfNc8BHqkYkeyOTvqnm18cO4nQvMOFOlP1a4ZnyzJps6BKZX4qZZPaseVoXO5ZUdDV_b9LX6yIvq5Twou0uT',
    summary:
      'Momentum tahunan setiap tanggal 29 Januari untuk memperingati kelahiran SIMAK (29 Januari 2011) melalui Seminar Nasional Integritas, diskusi publik isu kebangsaan, apresiasi kader terbaik, dan silaturahmi akbar lintas generasi.',
    objectives: [
      'Merefleksikan perjalanan 15 tahun gerakan moral mahasiswa antikorupsi di Institut STIAMI.',
      'Menghadirkan ruang dialog kebangsaan yang terbuka bagi mahasiswa umum dan tamu undangan.',
      'Memberikan apresiasi tahunan kepada kader dan divisi berprestasi.',
    ],
    curriculumOrAgenda: [
      '08.00 – 08.45 WIB: Registrasi Tamu Undangan (Pemindaian QR E-Tiket Tamu)',
      '09.00 – 11.45 WIB: Seminar Nasional Antikorupsi & Dialog Publik Kebangsaan',
      '12.30 – 13.45 WIB: Seremoni Refleksi Pendirian SIMAK (29 Januari 2011) & Pemotongan Tumpeng',
      '13.45 – 15.00 WIB: Penganugerahan Integrity Award & Ramah Tamah Lintas Angkatan',
    ],
    outputCertification: 'E-Tiket Kursi Tamu Auditorium (Guest Pass) & E-Sertifikat Resmi Seminar Nasional HARLAH.',
  },
  gts: {
    id: 'gts',
    code: 'PROKER-06 • EDUKASI EKSTERNAL',
    title: 'SIMAK Goes To School (Roadshow SMA/SMK)',
    category: 'Pendidikan Karakter & Kejujuran Akademik Pelajar',
    statusBadge: 'Sudah Terlaksana • Selesai',
    cycleNote:
      'Roadshow SIMAK Goes To School ke 12 SMA/SMK periode ini telah selesai terlaksana dan akan kembali dibuka pada periode kepengurusan selanjutnya.',
    targetAudience: 'Siswa-Siswi SMA / SMK / MA Sederajat di Jabodetabek',
    location: '12 Sekolah Menengah Mitra di DKI Jakarta & Jawa Barat',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXzZc6YOSAvGLmDfZ_eM_BQnKrcPvj-PQln_7qJXwncLZtYzw4jl3zSbl2WYlxdpe4rwacGCTsyCJHGV_TiKlhN0Mg993IOAzzhAXib-bqZmf0DGB_5c7smSJpWsnQWCeMAhp5ML4fIvIl6neLP95eYxtNedGA-d9mRemherd12IlvAO5h8vk5JRYB1vLmIX2eN8mbD-u3Vq09KCiY2AhG43wk6zO64QYTlSg38oRN',
    summary:
      'Program pengabdian edukatif di mana kader-kader SIMAK turun langsung mengajar ke sekolah-sekolah menengah (SMA/SMK) untuk menanamkan budaya anti-menyontek, kedisiplinan, dan 9 Nilai Integritas sejak bangku sekolah.',
    objectives: [
      'Membangun kesadaran antikorupsi sejak dini kepada generasi pelajar SMA/SMK.',
      'Menerapkan metode pembelajaran interaktif (Boardgame Antikorupsi, Studi Kasus, & Kuis Integritas).',
      'Menjalin kemitraan edukasi berkelanjutan antara SIMAK STIAMI dengan pihak sekolah.',
    ],
    curriculumOrAgenda: [
      'Sesi 1: Pengenalan "Kenapa Korupsi Dimulai dari Hal Kecil?" (Anti-Menyontek & Kejujuran)',
      'Sesi 2: Permainan Simulasi Kelompok & Bedah 9 Nilai Integritas Pelajar',
      'Sesi 3: Deklarasi Pelajar Berintegritas & Penyerahan Plakat Sekolah Mitra',
    ],
    outputCertification: 'Piagam Kerjasama Sekolah Mitra & Sertifikat Pengabdian Mengajar bagi Kader.',
  },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  myHarlahRegistration,
  onSelectParticipantForTicket,
}) => {
  const [selectedProker, setSelectedProker] = useState<ProkerDetail | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<BphLeaderProfile | null>(null);
  const [prokerFilter, setProkerFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [faqCategory, setFaqCategory] = useState<'all' | 'harlah' | 'kopasus' | 'divisi'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [heroPlaying, setHeroPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  const go = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} id="top" className="w-full bg-surface min-h-[calc(100vh-80px)]">
      <div className="flex flex-col w-full">
        <div className="relative w-full overflow-hidden">

          {/* 2. HERO BANNER */}
          <section className="relative w-full overflow-hidden bg-[#2a0401] text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 85% at 50% -8%, #ff9a5c 0%, #ff521b 24%, #e42f06 44%, #a81504 66%, #4c0801 85%, #140301 100%)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#160301]/60 to-[#0b0201]"
            />

            <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-7xl flex-col px-5 pb-0 pt-8 sm:px-8 lg:px-12 lg:pt-10">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-10">
                <div data-gsap="hero-text" className="lg:col-span-8">
                  <h1 className="font-extrabold leading-[0.82] tracking-[-0.045em] text-[clamp(3.4rem,9.5vw,8.5rem)]">
                    <span className="block">Bersama</span>
                    <span className="block">Membangun</span>
                    <span className="block text-[#ffc3a1]">Dampak</span>
                  </h1>
                </div>
                <div data-gsap="hero-text" className="lg:col-span-4 lg:pt-2">
                  <p className="max-w-xs font-body-lg text-body-lg leading-relaxed text-white/85">
                    SIMAK hadir sebagai wadah untuk belajar, berkolaborasi, dan berkarya demi masa depan yang lebih baik.
                  </p>
                  <span aria-hidden="true" className="mt-6 block h-px w-10 bg-white/45" />
                </div>
              </div>

              <div data-gsap="hero-text" className="mt-2 grid grid-cols-3 items-start gap-4 sm:mt-3">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Organisasi
                  </span>
                  <span className="mt-1 block text-sm font-semibold sm:text-base">SIMAK</span>
                </div>
                <div className="justify-self-center sm:justify-self-start sm:pl-[18%] lg:pl-[22%]">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Tahun
                  </span>
                  <span className="mt-1 block text-sm font-semibold sm:text-base">2025</span>
                </div>
                <div className="justify-self-end text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Lokasi
                  </span>
                  <span className="mt-1 block text-sm font-semibold sm:text-base">Jakarta</span>
                </div>
              </div>

              <div className="relative mt-0 flex flex-1 flex-col items-center justify-end">
                <div
                  data-gsap="hero-media"
                  className="relative flex w-full max-w-[1200px] flex-col items-center justify-end"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-16 bottom-0 top-0 z-0"
                    style={{
                      background:
                        'radial-gradient(58% 62% at 50% 60%, rgba(255, 102, 40, 0.3) 0%, rgba(219, 55, 12, 0.18) 45%, rgba(20, 3, 1, 0) 76%)',
                    }}
                  />
                  <svg
                    aria-hidden="true"
                    data-gsap="parallax"
                    viewBox="0 0 1200 400"
                    className="pointer-events-none relative z-0 block w-full select-none overflow-visible text-[#ffe3ca]/50"
                  >
                    <defs>
                      <path id="simak-hero-arc" d="M -40 338 Q 600 238 1240 338" />
                    </defs>
                    <text
                      fill="currentColor"
                      fontFamily="inherit"
                      fontSize="336"
                      fontWeight="800"
                      letterSpacing="-15"
                      textAnchor="middle"
                    >
                      <textPath href="#simak-hero-arc" startOffset="50%">
                        SIMAK
                      </textPath>
                    </text>
                  </svg>
                  <img
                    src="/hero/simak-group-cutout.png"
                    alt="Keluarga besar SIMAK angkatan 2025 di Jakarta"
                    className={`relative z-10 -mt-[50%] block w-full origin-bottom brightness-[1.08] contrast-[1.03] saturate-[1.04] transition-transform duration-[9000ms] ease-linear ${
                      heroPlaying ? 'scale-[1.025]' : 'scale-100'
                    }`}
                    style={{
                      maskImage: 'linear-gradient(to bottom, #000 94%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, #000 94%, transparent 100%)',
                    }}
                  />
                </div>

                <div className="absolute bottom-5 right-0 z-20 flex flex-col gap-2 sm:bottom-7">
                  <button
                    type="button"
                    onClick={() => setHeroPlaying(true)}
                    aria-label="Putar animasi hero"
                    aria-pressed={heroPlaying}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors sm:h-12 sm:w-12 ${
                      heroPlaying ? 'bg-white text-[#1c0a05]' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroPlaying(false)}
                    aria-label="Jeda animasi hero"
                    aria-pressed={!heroPlaying}
                    className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-colors sm:h-12 sm:w-12 ${
                      !heroPlaying ? 'bg-white text-[#1c0a05]' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">pause</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById('tentang-kami')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    aria-label="Gulir ke bagian Tentang SIMAK"
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:h-12 sm:w-12"
                  >
                    <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION DIVIDER WITH HEROIC EMBLEM */}
          <div className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin my-space-lg flex items-center justify-center">
            <div className="w-full h-[1px] bg-outline-variant/40"></div>
            <div className="px-space-md flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase tracking-widest bg-surface whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              <span>Nilai Luhur &amp; Pengabdian Bangsa</span>
              <span className="material-symbols-outlined text-[18px]">shield</span>
            </div>
            <div className="w-full h-[1px] bg-outline-variant/40"></div>
          </div>

          {/* 3. NILAI LUHUR & LATAR BELAKANG PERJUANGAN */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl" id="tentang-kami">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* Left Editorial Column */}
              <div data-gsap="section-header" className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    Slide Histori &amp; Idealisme
                  </span>
                  <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface mt-1">
                    LATAR BELAKANG PERJUANGAN
                  </h2>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Indonesia masih menghadapi berbagai tantangan dalam mewujudkan tata kelola pemerintahan yang bersih, transparan, dan berintegritas. Praktik korupsi, kolusi, dan nepotisme tidak hanya merugikan keuangan negara, tetapi juga menghambat pembangunan serta mengurangi kepercayaan masyarakat terhadap institusi publik.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Oleh karena itu, diperlukan peran aktif seluruh elemen bangsa, khususnya generasi muda dan mahasiswa, sebagai{' '}
                  <strong className="text-on-surface font-semibold">agen perubahan</strong> yang memiliki kesadaran, keberanian, serta integritas dalam mencegah dan melawan segala bentuk korupsi.
                </p>
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs">
                  <div className="flex items-center gap-space-xs text-tertiary font-bold font-label-md text-label-md uppercase">
                    <span className="material-symbols-outlined text-[18px]">event_note</span>
                    Kilas Sejarah Pendirian
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Berangkat dari semangat pengabdian kepada bangsa dan negara, serta didorong oleh tanggung jawab moral mahasiswa sebagai calon pemimpin masa depan, lahirlah{' '}
                    <strong className="text-primary font-bold">Spesialisasi Mahasiswa Anti Korupsi (SIMAK)</strong> pada tanggal{' '}
                    <strong className="text-on-surface font-semibold">29 Januari 2011 di Institut STIAMI</strong> atas inisiasi <strong>Ariawan</strong> bersama para pengurus awal.
                  </p>
                </div>
              </div>

              {/* Right Content & Vision Callout Column */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div data-gsap="section-header" className="p-space-lg rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col gap-space-sm">
                    <div className="flex items-center gap-space-xs text-tertiary-fixed font-bold font-label-sm text-label-sm uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">format_quote</span>
                      Ikrar &amp; Filosofi Gerakan
                    </div>
                    <blockquote className="font-headline-md text-headline-md font-bold leading-snug">
                      “SIMAK bukan hanya organisasi mahasiswa antikorupsi, melainkan laboratorium kepemimpinan yang membentuk generasi muda berintegritas, berkarakter, dan siap menjadi agen perubahan bagi bangsa.”
                    </blockquote>
                    <div className="flex items-center gap-space-xs pt-space-xs text-on-primary-container font-label-md text-label-md font-semibold">
                      <span className="w-6 h-0.5 bg-tertiary-fixed"></span>
                      Inisiatif Kolektif Mahasiswa SIMAK sejak 2011
                    </div>
                  </div>
                  <svg
                    className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"></path>
                  </svg>
                </div>

                {/* 3 Pilar */}
                <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">balance</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Integritas
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Menanamkan kejujuran, transparansi, dan konsistensi moral dalam menolak segala celah korupsi.
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">groups</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Kepemimpinan
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Membentuk kader mahasiswa yang berwawasan luas, kritis, tegas mengambil sikap, dan inovatif.
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      Pengabdian
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Turun langsung ke masyarakat melalui edukasi dini sekolah dan advokasi sosial berkelanjutan.
                    </p>
                  </div>
                </div>

                {/* Dokumentasi Foto */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="relative rounded-lg overflow-hidden h-36 bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt="Diskusi Akademisi SIMAK"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB17arXL8IhOQahptTqlbA95ytG0WC3x3JQr5p8wVDCkgzTWY5k4ajfMf2FdaM-k_fbSxnCR3Kz87NMV8AffDeHQtD29gBvLzpoOu3tbdWMY4liIse-ddkL0T6YGOexgUorI3yvVGg8vnNnKyUj01H5goX1cNI4fm1OdWSiUSRDnBvurhnQS1aYwWahgRntGs4y_z_l9lP21h7h4hYhpew_ou33LhCgCco6rIZ4M91_"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm">
                      Diskusi Akademisi
                    </span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden h-36 bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt="Delegasi Forum Internasional SIMAK"
                      referrerPolicy="no-referrer"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfBZVtYySUdLCaXDLoyWGprSOfuUd9VrsAU36rDJMQuYatp9u3bwWIyxExca8wns6xEnC63OoHLaIqX5SQkFa74Xz7JTHR6ukVOkkEl8oHfYmUu2ps-dmODUm1NOKy-mp7cFeO14lVILKrEYXcoD9bycWaKFBNtxhIxXjSrbBW6W6gvxMWDoRDFpQPfkCjstcXOYeyoRYYJ60J-n0qzhypu5IBEG-rLsVvkoEGOSuQ"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-label-sm text-label-sm">
                      Delegasi Forum Internasional
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. VISI DAN MISI SIMAK */}
          <section className="w-full bg-surface-container-low py-space-xl" id="visi-dan-misi">
            <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin flex flex-col gap-space-lg">
              <div data-gsap="section-header" className="flex flex-col items-center text-center max-w-3xl mx-auto gap-space-xs">
                <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  Arah &amp; Landasan Konstitusional
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface">
                  VISI DAN MISI SIMAK
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Peta jalan pembinaan kader berkarakter integritas tinggi untuk mengawal keadilan dan kejujuran sosial di seluruh sendi bangsa.
                </p>
              </div>

              {/* Big Vision Card */}
              <div data-gsap="section-header" className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md flex flex-col md:flex-row items-center gap-space-md">
                <div className="w-16 h-16 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[36px]">visibility</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    Visi Pokok Organisasi
                  </span>
                  <p className="font-headline-md text-headline-md font-bold text-on-surface mt-1 leading-snug">
                    “Menjadi organisasi mahasiswa yang melahirkan generasi pemimpin berintegritas, berkarakter, berwawasan kebangsaan, dan menjadi pelopor gerakan anti korupsi di Indonesia.”
                  </p>
                </div>
              </div>

              {/* 6 Misi Modular Cards Grid */}
              <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      01
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Nilai Integritas &amp; Moralitas
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Menanamkan nilai-nilai integritas, kejujuran, dan tanggung jawab moral kepada seluruh anggota sebagai komitmen etis kepemimpinan.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      02
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">co_present</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Kapasitas Kepemimpinan
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Mengembangkan kemampuan kepemimpinan, komunikasi publik, negosiasi, dan manajemen organisasi kemahasiswaan modern.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      03
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Pelatihan Antikorupsi Rutin
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Menyelenggarakan pendidikan dan pelatihan antikorupsi secara berkelanjutan melalui kurikulum kaderisasi komprehensif.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      04
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Pengembangan Intelektual
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Menjadi wadah pengembangan intelektual, riset transparansi anggaran publik, serta karakter mahasiswa yang analitis dan solutif.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      05
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Kolaborasi Multipihak
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Membangun jaringan kerja sama dengan lembaga pemerintah, penegak hukum, sektor swasta, dan jejaring aliansi kemahasiswaan nasional.
                  </p>
                </div>

                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold font-label-md text-label-md flex items-center justify-center">
                      06
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">
                    Partisipasi &amp; Pengawasan
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Mendorong partisipasi aktif mahasiswa dalam mengawal tata kelola pemerintahan yang bersih, akuntabel, dan berkeadilan.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. PROGRAM KERJA UNGGULAN */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl" id="program-kerja">
            <div className="flex flex-col gap-space-lg">
              <div data-gsap="section-header" className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                    Inisiatif Nyata &amp; Siklus Kegiatan SIMAK
                  </span>
                  <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface mt-1">
                    PROGRAM KERJA UNGGULAN
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Setiap program kerja disesuaikan dengan periode pelaksanaannya. Saat ini agenda terdekat yang sedang dibuka adalah <strong>Registrasi Tamu Undangan HARLAH SIMAK (29 Januari)</strong>, sementara 5 program lainnya telah terlaksana.
                  </p>
                </div>

                {/* Filter Tabs for 6 Proker */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-surface-container border border-outline-variant/40 self-start lg:self-auto">
                  <button
                    type="button"
                    onClick={() => setProkerFilter('all')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      prokerFilter === 'all'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">apps</span>
                    <span>Semua Program (6)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProkerFilter('upcoming')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      prokerFilter === 'upcoming'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
                    <span>Agenda Terdekat • Dibuka (1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProkerFilter('completed')}
                    className={`px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      prokerFilter === 'completed'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    <span>Sudah Terlaksana (5)</span>
                  </button>
                </div>
              </div>

              {/* Program Showcase Grid (HARLAH placed #1 so active event is immediately visible) */}
              <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {/* Card 1 (Prioritized): HARI LAHIR SIMAK (ACTIVE UPCOMING EVENT) */}
                {(prokerFilter === 'all' || prokerFilter === 'upcoming') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.harlah)}
                    className={`group rounded-xl bg-surface-container-lowest shadow-xl overflow-hidden flex flex-col border-2 border-primary ring-4 ring-primary/10 cursor-pointer ${
                      prokerFilter === 'upcoming' ? 'md:col-span-2 lg:col-span-3 lg:flex-row' : ''
                    }`}
                  >
                    <div
                      className={`relative bg-surface-container overflow-hidden ${
                        prokerFilter === 'upcoming' ? 'h-64 lg:h-auto lg:w-5/12 shrink-0' : 'h-48'
                      }`}
                    >
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Hari Lahir (HARLAH) SIMAK"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.harlah.image}
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-primary text-on-primary font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
                        Agenda Terdekat • 29 Januari
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 text-primary font-bold font-label-sm text-label-sm uppercase">
                            <span className="material-symbols-outlined text-[18px]">celebration</span>
                            <span>HARLAH Tahunan</span>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                            Terbuka untuk Tamu
                          </span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                          Hari Lahir (HARLAH) SIMAK — 29 Januari
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                          Refleksi perjalanan gerakan sejak 29 Januari 2011, Seminar Nasional Integritas, diskusi publik isu kebangsaan, apresiasi kader berprestasi, dan temu akbar lintas angkatan. Terbuka bagi Mahasiswa Umum, Delegasi BEM/UKM, &amp; Alumni.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-outline-variant/30 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProker(PROKER_DETAILS.harlah);
                          }}
                          className="py-2.5 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                          <span>Rincian Acara</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            go('pendaftaran');
                          }}
                          className="py-2.5 px-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {myHarlahRegistration ? 'verified' : 'confirmation_number'}
                          </span>
                          <span>{myHarlahRegistration ? 'Status Terdaftar' : 'Daftar Tamu'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 2: KOPASUS */}
                {(prokerFilter === 'all' || prokerFilter === 'completed') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.kopasus)}
                    className="group rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl overflow-hidden flex flex-col border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Kaderisasi Dasar KOPASUS"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.kopasus.image}
                      />
                      <span className="absolute top-3 left-3 px-space-xs py-0.5 rounded bg-surface-container-highest/95 text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                        Sudah Terlaksana • Pendaftaran Ditutup
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase">
                          <span className="material-symbols-outlined text-[18px]">badge</span>
                          KOPASUS (Rekrutmen Kader)
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Selesai
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        Komunikasi Pendidikan Khusus
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                        Satu-satunya gerbang rekrutmen anggota baru SIMAK untuk memahami identitas organisasi, 9 Nilai Integritas, sejarah perjuangan, dan dasar kepemimpinan.
                      </p>
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                          Dibuka periode depan
                        </span>
                        <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 3: PINSUS */}
                {(prokerFilter === 'all' || prokerFilter === 'completed') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.pinsus)}
                    className="group rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl overflow-hidden flex flex-col border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Pendidikan Khusus Kader PINSUS"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.pinsus.image}
                      />
                      <span className="absolute top-3 left-3 px-space-xs py-0.5 rounded bg-surface-container-highest/95 text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                        Sudah Terlaksana • Khusus Kader Internal
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase">
                          <span className="material-symbols-outlined text-[18px]">verified_user</span>
                          PINSUS
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Selesai
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        Pendidikan Khusus Kader
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                        Peningkatan kapasitas kader dalam kepemimpinan, komunikasi krisis, manajemen organisasi, dan keteguhan bertindak benar meski menghadapi tekanan publik.
                      </p>
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                          Dibuka periode depan
                        </span>
                        <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 4: TOT */}
                {(prokerFilter === 'all' || prokerFilter === 'completed') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.tot)}
                    className="group rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl overflow-hidden flex flex-col border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Training of Trainer Penegakan Hukum"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.tot.image}
                      />
                      <span className="absolute top-3 left-3 px-space-xs py-0.5 rounded bg-surface-container-highest/95 text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                        Sudah Terlaksana • KPK &amp; MA
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase">
                          <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                          TOT
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Selesai
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        Training of Trainer Penegakan Hukum
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                        Pengembangan anggota lewat pembelajaran langsung dari KPK RI, Mahkamah Agung, dan Mabes Polri untuk mencetak fasilitator &amp; edukator nilai antikorupsi.
                      </p>
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                          Dibuka periode depan
                        </span>
                        <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 5: Ramadhan Integrity */}
                {(prokerFilter === 'all' || prokerFilter === 'completed') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.ramadhan)}
                    className="group rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl overflow-hidden flex flex-col border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Ramadhan Integrity SIMAK"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.ramadhan.image}
                      />
                      <span className="absolute top-3 left-3 px-space-xs py-0.5 rounded bg-surface-container-highest/95 text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                        Sudah Terlaksana • Aksi Sosial
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase">
                          <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                          Bulan Suci
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Selesai
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        Ramadhan Integrity
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                        Implementasi nyata kepedulian sosial melalui santunan yatim piatu, pembagian sembako, dan buka bersama untuk membuktikan integritas berakar pada empati sesama.
                      </p>
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                          Ramadhan berikutnya
                        </span>
                        <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card 6: SIMAK Goes To School */}
                {(prokerFilter === 'all' || prokerFilter === 'completed') && (
                  <div
                    onClick={() => setSelectedProker(PROKER_DETAILS.gts)}
                    className="group rounded-xl bg-surface-container-lowest shadow-md hover:shadow-xl overflow-hidden flex flex-col border border-outline-variant/40 hover:border-primary/40 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 bg-surface-container overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="SIMAK Goes To School"
                        referrerPolicy="no-referrer"
                        src={PROKER_DETAILS.gts.image}
                      />
                      <span className="absolute top-3 left-3 px-space-xs py-0.5 rounded bg-surface-container-highest/95 text-on-surface font-label-sm text-label-sm font-bold shadow-xs">
                        Sudah Terlaksana • Edukasi Dini
                      </span>
                    </div>
                    <div className="p-space-md flex flex-col flex-1 gap-space-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-space-xs text-primary font-bold font-label-sm text-label-sm uppercase">
                          <span className="material-symbols-outlined text-[18px]">cast_for_education</span>
                          Edukasi Publik
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          Selesai
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        SIMAK Goes To School
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-1">
                        Kunjungan edukatif ke sekolah-sekolah menengah untuk menanamkan pemahaman bahaya korupsi, pendidikan karakter, kejujuran akademis, dan tanggung jawab sosial sejak dini.
                      </p>
                      <div className="pt-2 mt-1 border-t border-surface-container flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                        <span className="flex items-center gap-1 text-xs">
                          <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                          Dibuka periode depan
                        </span>
                        <span className="text-xs font-bold text-primary inline-flex items-center gap-0.5">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 6. STRUKTUR KEPEMIMPINAN SIMAK */}
          <section className="w-full bg-surface-container-low py-space-xl" id="struktur-pengurus">
            <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin flex flex-col gap-space-lg">
              <div data-gsap="section-header" className="flex flex-col items-center text-center max-w-2xl mx-auto gap-space-xs">
                <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  Dewan Pimpinan Eksekutif (BPH Periode 2025–2026)
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface">
                  STRUKTUR KEPEMIMPINAN SIMAK
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Tata kelola organisasi yang solid, profesional, dan akuntabel di bawah mandat AD/ART SIMAK. Klik pada kartu pengurus untuk melihat mandat &amp; kutipan integritas.
                </p>
              </div>

              {/* Hierarchy Tree Container */}
              <div data-gsap="org-tree" className="w-full max-w-6xl mx-auto flex flex-col items-center">
                {/* Tier 1: Ketua Umum */}
                <div
                  onClick={() => setSelectedLeader(BPH_LEADERS.venus)}
                  className="group w-full max-w-lg p-space-md rounded-2xl bg-surface-container-lowest border-2 border-primary/30 hover:border-primary shadow-md hover:shadow-xl flex items-center gap-space-md z-10 transition-all cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-container shrink-0 ring-2 ring-primary/20 group-hover:ring-primary transition-all">
                    <img
                      className="w-full h-full object-cover"
                      alt="Venus Sangia Alfarizi - Ketua Umum SIMAK"
                      referrerPolicy="no-referrer"
                      src={BPH_LEADERS.venus.photo}
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        Ketua Umum
                      </span>
                      <span className="font-mono text-[11px] font-bold text-secondary">
                        {BPH_LEADERS.venus.nia}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-1">
                      {BPH_LEADERS.venus.fullName}
                    </h3>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {BPH_LEADERS.venus.divisionTitle}
                    </span>
                    <span className="mt-1.5 text-xs font-bold text-primary inline-flex items-center gap-1">
                      Lihat Mandat &amp; Profil <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    </span>
                  </div>
                </div>

                {/* Architectural Branch Connector: Tier 1 to Tier 2 (3 Wakil Ketua Umum) */}
                <div className="w-0.5 h-6 bg-primary/40"></div>
                <div className="hidden md:block w-full relative h-4">
                  <div className="absolute left-[16.66%] right-[16.66%] top-0 h-0.5 bg-primary/30"></div>
                  <div className="absolute left-[16.66%] top-0 w-0.5 h-4 bg-primary/30"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-primary/30"></div>
                  <div className="absolute right-[16.66%] top-0 w-0.5 h-4 bg-primary/30"></div>
                </div>

                {/* Tier 2: 3 Wakil Ketua Umum (kartu ringkas segaya kartu BPH lain) */}
                <div className="w-full relative grid grid-cols-1 md:grid-cols-3 gap-space-md items-stretch">
                  <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/30"></div>
                  {[
                    BPH_LEADERS.fathan,
                    BPH_LEADERS.dwi,
                    BPH_LEADERS.putri,
                  ].map((leader) => (
                    <div
                      key={leader.id}
                      onClick={() => setSelectedLeader(leader)}
                      className="group relative p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 shadow-sm hover:shadow-lg flex items-center gap-space-sm transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container shrink-0 ring-2 ring-primary/15 group-hover:ring-primary transition-all">
                        <img
                          className="w-full h-full object-cover"
                          alt={`${leader.fullName} - ${leader.roleBadge}`}
                          referrerPolicy="no-referrer"
                          src={leader.photo}
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                            {leader.roleBadge}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-secondary">
                            {leader.nia}
                          </span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-1">
                          {leader.fullName}
                        </h4>
                        <span className="font-label-sm text-label-sm text-on-surface-variant leading-snug">
                          {leader.divisionTitle}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary leading-snug truncate">
                          Membawahi: {leader.subDivisions?.map((sub) => sub.name.replace('Divisi ', '')).join(', ')}
                        </span>
                        <span className="mt-1.5 text-xs font-bold text-primary inline-flex items-center gap-1">
                          Detail <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Architectural Branch Connector: Tier 2 to Tier 3 (2 Sekretaris & 1 Bendahara) */}
                <div className="w-0.5 h-6 bg-primary/40"></div>
                <div className="hidden md:block w-full max-w-5xl relative h-4">
                  <div className="absolute left-[16.66%] right-[16.66%] top-0 h-0.5 bg-primary/30"></div>
                  <div className="absolute left-[16.66%] top-0 w-0.5 h-4 bg-primary/30"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-4 bg-primary/30"></div>
                  <div className="absolute right-[16.66%] top-0 w-0.5 h-4 bg-primary/30"></div>
                </div>

                {/* Tier 3: Kesekretariatan (Sekretaris 1 & 2) & Kebendaharaan (Bendahara Umum) */}
                <div className="w-full max-w-5xl relative grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/30"></div>
                  {[BPH_LEADERS.elvira, BPH_LEADERS.nabila, BPH_LEADERS.rusni].map((leader) => (
                    <div
                      key={leader.id}
                      onClick={() => setSelectedLeader(leader)}
                      className="group relative p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-primary/50 shadow-sm hover:shadow-lg flex items-center gap-space-sm transition-all cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container shrink-0 ring-2 ring-primary/15 group-hover:ring-primary transition-all">
                        <img
                          className="w-full h-full object-cover"
                          alt={`${leader.fullName} - ${leader.roleBadge}`}
                          referrerPolicy="no-referrer"
                          src={leader.photo}
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span
                          className={`font-label-sm text-label-sm uppercase font-bold ${
                            leader.id === 'rusni' ? 'text-tertiary' : 'text-primary'
                          }`}
                        >
                          {leader.roleBadge}
                        </span>
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {leader.fullName}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant line-clamp-1">
                          {leader.divisionTitle}
                        </span>
                        <span className="mt-1 text-[11px] font-bold text-primary inline-flex items-center gap-0.5">
                          Lihat Tupoksi <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-space-lg flex justify-center">
                  <button
                    type="button"
                    onClick={() => go('direktori')}
                    className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">groups</span>
                    <span>Buka Direktori Kader &amp; Buku Induk 15 Angkatan</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 7. MITRA PENEGAK HUKUM & AKADEMISI */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl" id="mitra-kolaborasi">
            <div className="flex flex-col gap-space-md">
              <div data-gsap="section-header" className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Sinergi Institusi
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  MITRA PENEGAK HUKUM &amp; AKADEMISI
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Membangun kolaborasi erat dalam pendidikan antikorupsi, forum advokasi, dan pelatihan instruktur etika kepemimpinan.
                </p>
              </div>
              <div data-gsap="stagger-grid" className="grid grid-cols-2 md:grid-cols-4 gap-space-md pt-space-xs">
                {/* Partner 1: KPK */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center gap-space-xs hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[32px]">shield</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    KPK RI
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Komisi Pemberantasan Korupsi
                  </span>
                </div>

                {/* Partner 2: Mahkamah Agung */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center gap-space-xs hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[32px]">balance</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Mahkamah Agung
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Lembaga Yudikatif Tertinggi
                  </span>
                </div>

                {/* Partner 3: Mabes Polri */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center gap-space-xs hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[32px]">local_police</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Mabes POLRI
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Kepolisian Negara Republik Indonesia
                  </span>
                </div>

                {/* Partner 4: Institut STIAMI */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center gap-space-xs hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[32px]">school</span>
                  </div>
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Institut STIAMI
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Kampus Induk Pendirian (2011)
                  </span>
                </div>
              </div>

              <div className="pt-space-sm flex justify-center">
                <button
                  type="button"
                  onClick={() => go('galeri')}
                  className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg font-bold shadow-sm hover:bg-surface-container transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_library</span>
                  <span>Lihat Galeri &amp; Arsip Dokumentasi 15 Tahun SIMAK</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          {/* 8. SEKSI ALUR SELEKSI KOPASUS */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl" id="alur-seleksi">
            <div className="flex flex-col gap-space-lg">
              {/* Header */}
              <div data-gsap="section-header" className="flex flex-col items-center text-center max-w-3xl mx-auto gap-space-xs">
                <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  GERBANG AWAL MENJADI KADER INTEGRITAS SIMAK
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface">
                  ALUR SELEKSI KOPASUS
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Proses kaderisasi berjenjang yang transparan, adil, objektif, dan terukur untuk membentuk integritas moral serta mental kepemimpinan calon pejuang antikorupsi.
                </p>
              </div>

              {/* 4-Step Stepper Cards */}
              <div data-gsap="stagger-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-xs">
                {/* Step 1 */}
                <div className="relative p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold font-label-md text-label-md flex items-center justify-center shadow-sm">
                      01
                    </span>
                    <span className="material-symbols-outlined text-primary text-[24px]">assignment</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Tahap 01
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Pendaftaran &amp; Berkas
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Pengisian formulir online, esai motivasi integritas singkat, serta unggah dokumen verifikasi akademik (KTM/Transkrip).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold font-label-md text-label-md flex items-center justify-center shadow-sm">
                      02
                    </span>
                    <span className="material-symbols-outlined text-primary text-[24px]">record_voice_over</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Tahap 02
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Screening &amp; Wawancara
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Uji komitmen diri, wawasan kebangsaan, dan penelusuran rekam jejak moral oleh BPH &amp; Dewan Pembina.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold font-label-md text-label-md flex items-center justify-center shadow-sm">
                      03
                    </span>
                    <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    Tahap 03
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Diklat KOPASUS Intensif
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Pelatihan kepemimpinan 3 hari 2 malam, bedah modul nilai antikorupsi, kepribadian berani, dan simulasi investigasi kasus publik.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="w-9 h-9 rounded-full bg-tertiary-container text-white font-bold font-label-md text-label-md flex items-center justify-center shadow-sm">
                      04
                    </span>
                    <span className="material-symbols-outlined text-tertiary text-[24px]">military_tech</span>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary font-bold">
                    Tahap 04
                  </span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Pengukuhan &amp; Sumpah
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Pengucapan Sumpah Kader Integritas, penerbitan NIA SIMAK, serah terima seragam PDH, serta penempatan divisi tugas strategis.
                  </p>
                </div>
              </div>

              {/* Batch Schedule & Eligibility Banner */}
              <div className="p-space-md rounded-xl bg-surface-container-high/60 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">lock_clock</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                      Pendaftaran Anggota Baru Hanya di KOPASUS (Saat Ini Ditutup)
                    </span>
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      KOPASUS sudah terlaksana &amp; akan dibuka kembali di periode selanjutnya
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-xs text-on-surface font-label-sm text-label-sm">
                  <button
                    type="button"
                    onClick={() => go('pendaftaran')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary shadow-sm font-bold hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
                    Daftar Hadir Tamu Acara HARLAH (29 Januari)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 9. SEKSI TANYA JAWAB (FAQ) INTERAKTIF SEPUTAR SIMAK, HARLAH, KOPASUS & 8 DIVISI */}
          <section className="w-full bg-surface-container-low py-space-xl" id="faq-rekrutmen">
            <div className="max-w-5xl mx-auto px-margin-mobile sm:px-margin flex flex-col gap-space-lg">
              <div data-gsap="section-header" className="flex flex-col items-center text-center max-w-2xl mx-auto gap-space-xs">
                <span className="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  PUSAT INFORMASI &amp; PANDUAN RESMI SIMAK
                </span>
                <h2 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl font-bold tracking-tight text-on-surface">
                  TANYA JAWAB INTERAKTIF (FAQ)
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Temukan jawaban lengkap mengenai pendaftaran Tamu Acara HARLAH (29 Januari), siklus rekrutmen KOPASUS, serta cara bergabung ke dalam 8 Divisi SIMAK.
                </p>
              </div>

              {/* Filter Kategori FAQ */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: 'all' as const, label: 'Semua Pertanyaan (6)', icon: 'apps' },
                  { id: 'harlah' as const, label: 'Tamu HARLAH (29 Jan)', icon: 'celebration' },
                  { id: 'kopasus' as const, label: 'Rekrutmen KOPASUS', icon: 'military_tech' },
                  { id: 'divisi' as const, label: '8 Divisi & BPH SIMAK', icon: 'account_tree' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFaqCategory(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      faqCategory === tab.id
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Interactive Accordion List */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: 'faq-1',
                    cat: 'harlah' as const,
                    badge: 'Acara HARLAH • 29 Januari',
                    icon: 'celebration',
                    question:
                      'Siapa saja yang bisa mendaftar pada acara HARLAH SIMAK tanggal 29 Januari?',
                    answer:
                      'Pendaftaran HARLAH SIMAK pada 29 Januari dibuka khusus bagi Tamu Undangan Acara, meliputi mahasiswa umum Institut STIAMI (non-anggota dari seluruh program studi), delegasi BEM/UKM/Himpunan kampus mitra, serta alumni lintas angkatan yang ingin menghadiri Seminar Nasional Antikorupsi & Puncak Tasyakuran HARLAH SIMAK.',
                    ctaLabel: 'Daftar Tamu HARLAH Sekarang',
                    ctaScreen: 'pendaftaran' as ScreenId,
                  },
                  {
                    id: 'faq-2',
                    cat: 'kopasus' as const,
                    badge: 'Rekrutmen Kader • KOPASUS',
                    icon: 'lock_clock',
                    question:
                      'Kapan rekrutmen anggota baru KOPASUS dibuka kembali & bagaimana cara mendaftarnya?',
                    answer:
                      'Penerimaan anggota/kader resmi SIMAK hanya dibuka satu pintu melalui program Komando Pendidikan Khusus (KOPASUS). Karena KOPASUS periode ini telah selesai terlaksana, pendaftaran anggota baru saat ini ditutup sementara dan akan dibuka kembali pada periode selanjutnya. Anda dapat mendaftarkan email/WhatsApp di fitur Waiting List Prioritas pada halaman Pendaftaran agar mendapat notifikasi pertama saat KOPASUS berikutnya dibuka.',
                    ctaLabel: 'Isi Waiting List KOPASUS',
                    ctaScreen: 'pendaftaran' as ScreenId,
                  },
                  {
                    id: 'faq-3',
                    cat: 'divisi' as const,
                    badge: 'Struktur 8 Divisi SIMAK',
                    icon: 'account_tree',
                    question:
                      'Bagaimana cara memilih dan bergabung ke dalam 8 Divisi SIMAK (Acara, Korlap, Dokumentasi, Desain, Ekraf, Humas, Perlengkapan, Konsumsi)?',
                    answer:
                      'Penempatan kader ke dalam 8 Divisi Teknis dilakukan pada Tahap 04 (Pengukuhan & Sumpah Kader) setelah peserta dinyatakan lulus Diklat KOPASUS. Setiap kader baru dapat memilih minat divisi di bawah 3 Wakil Ketua Umum: Waketum 1 (Divisi Acara & Divisi Korlap), Waketum 2 KOMINTEK (Divisi Dokumentasi & Divisi Desain), atau Waketum 3 (Divisi Ekonomi Kreatif, Divisi Humas, Divisi Perlengkapan & Divisi Konsumsi).',
                    ctaLabel: 'Lihat Kader 8 Divisi di Direktori',
                    ctaScreen: 'direktori' as ScreenId,
                  },
                  {
                    id: 'faq-4',
                    cat: 'divisi' as const,
                    badge: 'Tata Kelola BPH & Sekretariat',
                    icon: 'description',
                    question:
                      'Apa perbedaan peran Sekretaris Umum 1 & Sekretaris Umum 2 serta 3 Wakil Ketua Umum di struktur kepemimpinan SIMAK?',
                    answer:
                      'Dalam struktur BPH SIMAK, Ketua Umum dibantu oleh 3 Wakil Ketua Umum: Waketum 1 dan Waketum 2 masing-masing mengoordinasikan 2 divisi teknis, sedangkan Waketum 3 mengoordinasikan 4 divisi (total 8 divisi). Untuk tata kelola administrasi, Sekretaris Umum 1 bertanggung jawab atas SK Kepengurusan, Buku Induk Anggota (NIA), dan dokumen konstitusi AD/ART, sedangkan Sekretaris Umum 2 menangani notulensi rapat pleno, surat-menyurat eksternal, serta presensi kepanitiaan bersama Bendahara Umum yang mengelola audit kas nol-selisih.',
                    ctaLabel: 'Cek Laporan Transparansi BPH',
                    ctaScreen: 'transparansi' as ScreenId,
                  },
                  {
                    id: 'faq-5',
                    cat: 'harlah' as const,
                    badge: 'Fasilitas Tamu & E-Tiket',
                    icon: 'qr_code_2',
                    question:
                      'Apa fasilitas yang didapatkan Tamu Undangan yang mendaftar hadir di HARLAH 29 Januari?',
                    answer:
                      'Setiap tamu terdaftar langsung mendapatkan E-Tiket Kursi Auditorium ber-QR Code (mis. SMK-2026-XXXX), fitur Simpan Pengingat otomatis ke Google Calendar / Kalender HP (.ics), tombol Bagikan Undangan ke WhatsApp, Piagam E-Sertifikat Seminar Nasional HARLAH, serta nama dan ucapannya tampil langsung di Buku Tamu Digital.',
                    ctaLabel: 'Cek Halaman E-Tiket & Piagam',
                    ctaScreen: 'etiket' as ScreenId,
                  },
                  {
                    id: 'faq-6',
                    cat: 'kopasus' as const,
                    badge: 'Bebas Pungutan • 100% Gratis',
                    icon: 'verified_user',
                    question:
                      'Apakah kehadiran Tamu HARLAH maupun seleksi kader KOPASUS dipungut biaya?',
                    answer:
                      'Seluruh rangkaian kegiatan publik SIMAK — baik registrasi Tamu Undangan HARLAH 29 Januari maupun tahapan seleksi kader KOPASUS — 100% GRATIS tanpa pungutan biaya apa pun, selaras dengan nilai integritas dan antikorupsi yang dijunjung tinggi oleh SIMAK.',
                    ctaLabel: 'Pelajari Modul Integritas di E-Library',
                    ctaScreen: 'elibrary' as ScreenId,
                  },
                ]
                  .filter((item) => faqCategory === 'all' || item.cat === faqCategory)
                  .map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl bg-surface-container-lowest transition-all overflow-hidden border ${
                          isOpen
                            ? 'border-primary shadow-md ring-2 ring-primary/10'
                            : 'border-outline-variant/50 hover:border-primary/40 shadow-xs'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                          aria-expanded={isOpen}
                          className="w-full p-space-md text-left flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isOpen
                                  ? 'bg-primary text-on-primary'
                                  : 'bg-surface-container text-primary'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {item.icon}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-[10px] font-extrabold uppercase tracking-wider">
                                {item.badge}
                              </span>
                              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-snug">
                                {item.question}
                              </h3>
                            </div>
                          </div>
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform ${
                              isOpen
                                ? 'bg-primary/10 text-primary rotate-180'
                                : 'bg-surface-container text-secondary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              expand_more
                            </span>
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-space-md pb-space-md pt-1 pl-4 sm:pl-16 space-y-3 border-t border-surface-container">
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {item.answer}
                            </p>
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => go(item.ctaScreen)}
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:underline cursor-pointer"
                              >
                                <span>{item.ctaLabel}</span>
                                <span className="material-symbols-outlined text-[15px]">
                                  arrow_forward
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>

          {/* 10. BANNER CALL TO ACTION (CTA) HARLAH */}
          <section className="w-full max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl">
            <div data-gsap="section-header" className="relative rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary p-space-lg sm:p-space-xl shadow-xl overflow-hidden">
              <svg
                className="absolute right-0 top-0 w-80 h-80 text-white/5 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="4"></circle>
                <path d="M50 15 L50 85 M15 50 L85 50" stroke="currentColor" strokeWidth="2"></path>
              </svg>
              <div className="relative z-10 max-w-3xl flex flex-col gap-space-md">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="px-space-xs py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
                    Registrasi Tamu Undangan • 29 Januari
                  </span>
                  <span className="text-tertiary-fixed-dim font-label-sm text-label-sm">
                    Seminar Nasional &amp; Puncak Hari Lahir (HARLAH) SIMAK
                  </span>
                </div>
                <h2 className="font-display-lg text-display-lg-mobile sm:text-display-lg font-bold leading-tight">
                  Ingin Ikut Serta Meramaikan Acara HARLAH SIMAK?
                </h2>
                <p className="font-body-xl text-body-xl text-on-primary-container font-normal">
                  Pendaftaran anggota baru SIMAK hanya dibuka melalui KOPASUS di periode mendatang. Namun bagi mahasiswa umum, delegasi UKM/BEM, dan tamu undangan yang ingin hadir di acara puncak HARLAH SIMAK pada 29 Januari, silakan daftar sebagai Tamu Acara.
                </p>
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
                  {myHarlahRegistration ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onSelectParticipantForTicket(myHarlahRegistration)}
                        className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-emerald-400 text-emerald-950 font-headline-sm text-headline-sm font-extrabold shadow-md hover:bg-emerald-300 transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                        Anda Sudah Terdaftar • Buka E-Tiket ({myHarlahRegistration.seatNumber})
                      </button>
                      <button
                        type="button"
                        onClick={() => go('pendaftaran')}
                        className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-primary/40 text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">menu_book</span>
                        Lihat Buku Tamu HARLAH
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => go('pendaftaran')}
                        className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-lg bg-surface-container-lowest text-primary font-headline-sm text-headline-sm font-bold shadow-md hover:bg-surface-container transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                        Daftar Sebagai Tamu Acara HARLAH (29 Januari)
                      </button>
                      <a
                        className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3.5 rounded-lg bg-primary/40 text-on-primary font-label-lg text-label-lg font-bold hover:bg-primary transition-all"
                        href="mailto:sekretariat@simak-antikorupsi.or.id"
                      >
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                        Hubungi Panitia HARLAH
                      </a>
                    </>
                  )}
                </div>
                <div className="pt-space-xs flex flex-wrap items-center gap-space-sm text-on-primary-container font-label-md text-label-md">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> E-Tiket Kursi Tamu (QR Code)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> E-Sertifikat Seminar Nasional HARLAH
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Terbuka bagi Mahasiswa Umum &amp; Delegasi
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL PROFIL & MANDAT PENGURUS INTI (BPH) */}
      {selectedLeader && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedLeader(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-xl w-full shadow-2xl border border-outline-variant/40 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedLeader(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedLeader.photo}
                  alt={selectedLeader.fullName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-tertiary-fixed/50 shrink-0 bg-surface-container"
                />
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-extrabold uppercase tracking-wider">
                    {selectedLeader.roleBadge}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {selectedLeader.fullName}
                  </h3>
                  <p className="text-xs text-on-primary-container font-medium">
                    {selectedLeader.divisionTitle}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-tertiary-fixed">
                    <span>{selectedLeader.nia}</span>
                    <span>•</span>
                    <span>NIM: {selectedLeader.nim}</span>
                    <span>•</span>
                    <span>{selectedLeader.cohort}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-primary italic text-sm text-on-surface leading-relaxed">
                {selectedLeader.quote}
              </div>

              {selectedLeader.subDivisions && selectedLeader.subDivisions.length > 0 && (
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">account_tree</span>
                    <span>Divisi &amp; Lingkup Kerja di Bawah Koordinasi</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedLeader.subDivisions.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">{sub.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-extrabold text-on-surface">
                            {sub.name}
                          </span>
                          <span className="text-xs text-on-surface-variant leading-relaxed mt-0.5">
                            {sub.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span>Mandat &amp; Tupoksi Jabatan (AD/ART SIMAK)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                  {selectedLeader.mandates.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-3">
                <span className="text-xs text-secondary">{selectedLeader.prodi}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLeader(null);
                    go('direktori');
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  <span>Lihat di Buku Induk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL PROGRAM KERJA UNGGULAN */}
      {selectedProker && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProker(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-3xl w-full shadow-2xl border border-outline-variant/40 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Banner Header */}
            <div className="relative h-56 bg-surface-container">
              <img
                src={selectedProker.image}
                alt={selectedProker.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      selectedProker.isUpcomingHarlah
                        ? 'bg-primary text-on-primary shadow-md'
                        : 'bg-surface-container-highest/95 text-on-surface'
                    }`}
                  >
                    {selectedProker.statusBadge}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProker(null)}
                    className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-tertiary-fixed">
                    {selectedProker.code}
                  </div>
                  <h2 className="text-headline-md sm:text-headline-lg font-extrabold text-white mt-0.5">
                    {selectedProker.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/85">{selectedProker.category}</p>
                </div>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
              {/* Cycle Status Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  selectedProker.isUpcomingHarlah
                    ? 'bg-primary-fixed/40 border-primary/30 text-on-surface'
                    : 'bg-surface-container-low border-outline-variant/50 text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                  {selectedProker.isUpcomingHarlah ? 'celebration' : 'event_note'}
                </span>
                <div className="text-xs sm:text-sm leading-relaxed">
                  <strong className="text-on-surface block mb-0.5">
                    Status Pelaksanaan Periode Ini:
                  </strong>
                  {selectedProker.cycleNote}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
                  Deskripsi &amp; Filosofi Program
                </h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {selectedProker.summary}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Sasaran Peserta
                  </div>
                  <div className="text-sm font-bold text-on-surface mt-0.5">
                    {selectedProker.targetAudience}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Lokasi Pelaksanaan
                  </div>
                  <div className="text-sm font-bold text-on-surface mt-0.5">
                    {selectedProker.location}
                  </div>
                </div>
              </div>

              {/* Objectives & Agenda */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                    Tujuan Utama
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                    {selectedProker.objectives.map((obj, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">fact_check</span>
                    Rangkaian Materi / Agenda
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
                    {selectedProker.curriculumOrAgenda.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Output Certification */}
              <div className="p-3.5 rounded-xl bg-tertiary-fixed/40 border border-tertiary/20 flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary text-[22px] shrink-0">
                  workspace_premium
                </span>
                <div className="text-xs text-on-tertiary-fixed">
                  <strong>Output &amp; Bukti Kepesertaan:</strong>{' '}
                  {selectedProker.outputCertification}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProker(null);
                    go('program-detail');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-black shadow-sm transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    view_timeline
                  </span>
                  <span>Buka Kanvas &amp; Arsip Day 1–3</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProker(null);
                    go('galeri');
                  }}
                  className="px-3.5 py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    photo_library
                  </span>
                  <span className="hidden sm:inline">Galeri Lengkap</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                {selectedProker.isUpcomingHarlah ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProker(null);
                      go('pendaftaran');
                    }}
                    className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      confirmation_number
                    </span>
                    <span>Daftar Sebagai Tamu HARLAH (29 Januari)</span>
                  </button>
                ) : (
                  <span className="px-3.5 py-2 rounded-lg bg-surface-container-highest text-on-surface-variant text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                    <span>Pendaftaran Dibuka Periode Selanjutnya</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
