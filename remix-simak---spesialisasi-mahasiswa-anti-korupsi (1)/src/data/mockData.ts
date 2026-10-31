import { ParticipantRecord, LibraryDocument, AdvocacySubmission } from '../types';

export const INITIAL_PARTICIPANTS: ParticipantRecord[] = [
  {
    id: 'guest-harlah-1',
    ticketCode: 'GUEST-HRL-2901',
    examNumber: 'TAMU-HARLAH-29JAN',
    fullName: 'Farhan Syahputra, S.AP.',
    nim: 'ALUMNI-XI-2022',
    whatsapp: '081280091122',
    email: 'farhan.syahputra@alumni.stiami.ac.id',
    programStudi: 'Ikatan Alumni SIMAK Lintas Angkatan',
    campus: 'Kampus Pusat Cempaka Putih',
    semester: 'Alumni SIMAK',
    division: 'Hadir Penuh: Seminar Nasional & Perayaan Puncak HARLAH',
    registrationType: 'Open House SIMAK',
    registeredAt: 'Tamu Terdaftar • HARLAH 29 Januari',
    status: 'TERVERIFIKASI',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    seatNumber: 'VIP-04',
    gate: 'Meja Registrasi Tamu VIP — Auditorium Lt. 4',
    examRoom: 'Auditorium Utama Institut STIAMI',
    examSession: 'Puncak HARLAH SIMAK (08.30 - 15.00 WIB)',
    examDate: '29 Januari',
    motivation: 'Selamat Hari Lahir ke-15 SIMAK Institut STIAMI! Semoga nyala api integritas yang dirintis sejak 29 Januari 2011 terus melahirkan pemimpin muda antikorupsi yang berani dan berkeadilan.'
  },
  {
    id: 'guest-harlah-2',
    ticketCode: 'GUEST-HRL-3418',
    examNumber: 'TAMU-HARLAH-29JAN',
    fullName: 'Aulia Rahma Khairunnisa',
    nim: 'BEM-STIAMI-2026',
    whatsapp: '085711223344',
    email: 'aulia.rahma@student.stiami.ac.id',
    programStudi: 'Delegasi BEM / BLM / UKM Internal STIAMI',
    campus: 'Kampus Pusat Cempaka Putih',
    semester: 'Delegasi Ormawa / Kampus Mitra',
    division: 'Sesi I: Seminar Nasional Integritas & Dialog Kebangsaan',
    registrationType: 'Open House SIMAK',
    registeredAt: 'Tamu Terdaftar • HARLAH 29 Januari',
    status: 'TERVERIFIKASI',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    seatNumber: 'TAMU-12',
    gate: 'Meja Registrasi Tamu VIP — Auditorium Lt. 4',
    examRoom: 'Auditorium Utama Institut STIAMI',
    examSession: 'Puncak HARLAH SIMAK (08.30 - 15.00 WIB)',
    examDate: '29 Januari',
    motivation: 'Mewakili jajaran BEM Institut STIAMI mengucapkan Dirgahayu SIMAK! Siap berkolaborasi mengawal zona integritas kampus yang bebas pungli dan transparan.'
  },
  {
    id: 'part-1',
    ticketCode: 'SMK-2026-OH-0842',
    examNumber: 'KPS-2026-0419',
    fullName: 'Rizky Pratama Wijaya',
    nim: 'CA221110482',
    whatsapp: '081288943210',
    email: 'rizky.wijaya@student.stiami.ac.id',
    programStudi: 'S1 Ilmu Administrasi Publik',
    campus: 'Kampus Pusat Cempaka Putih',
    semester: 'Semester 4',
    division: 'Divisi Advokasi & Kajian Strategis',
    registrationType: 'Kader KOPASUS',
    registeredAt: 'Arsip KOPASUS Periode Lalu',
    status: 'TERVERIFIKASI',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    seatNumber: 'A-14',
    gate: 'Pintu Utama A (Sayap Barat)',
    examRoom: 'Lab Komputer 302 - Gedung B Lt. 3',
    examSession: 'Sesi I (08.30 - 11.30 WIB)',
    examDate: 'Sabtu, 24 Oktober 2026',
    motivation: 'Berkomitmen mendorong transparansi tata kelola kebijakan publik dan edukasi antikorupsi bagi generasi muda.'
  },
  {
    id: 'part-2',
    ticketCode: 'SMK-2026-OH-0915',
    examNumber: 'KPS-2026-0502',
    fullName: 'Nadia Maharani Putri',
    nim: 'CB231120119',
    whatsapp: '085719283746',
    email: 'nadia.putri@student.stiami.ac.id',
    programStudi: 'S1 Ilmu Administrasi Bisnis (Perpajakan)',
    campus: 'Kampus Pusat Cempaka Putih',
    semester: 'Semester 2',
    division: 'Divisi Pendidikan & Litbang Integritas',
    registrationType: 'Kader KOPASUS',
    registeredAt: 'Arsip KOPASUS Periode Lalu',
    status: 'TERVERIFIKASI',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    seatNumber: 'B-07',
    gate: 'Pintu Utama B (Sayap Timur)',
    examRoom: 'Ruang Sidang 204 - Gedung A Lt. 2',
    examSession: 'Sesi II (13.00 - 16.00 WIB)',
    examDate: 'Sabtu, 24 Oktober 2026',
    motivation: 'Ingin mengintegrasikan literasi perpajakan yang bersih dengan gerakan pencegahan korupsi sejak bangku kuliah.'
  }
];

export const LIBRARY_DOCUMENTS: LibraryDocument[] = [
  {
    id: 'doc-1',
    code: 'MOD-SIMAK-2026-01',
    title: 'Modul Pendidikan Antikorupsi & 9 Nilai Integritas Mahasiswa',
    subtitle: 'Kurikulum Wajib Diklat Dasar Kader KOPASUS Institut STIAMI Edisi Revisi 2026',
    author: 'Tim Litbang SIMAK & Pusat Kajian Integritas STIAMI',
    category: 'Modul Diklat',
    year: '2026',
    pages: 128,
    fileSize: '4.8 MB',
    downloads: 1420,
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80',
    abstract: 'Modul komprehensif yang membedah anatomi tindak pidana korupsi, sejarah pemberantasan korupsi di Indonesia, serta internalisasi 9 Nilai Antikorupsi (Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, Adil) dalam ekosistem akademik.',
    keyTakeaways: [
      'Pemetaan 7 bentuk tindak pidana korupsi berdasarkan UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001.',
      'Strategi Trisula Pemberantasan Korupsi: Pendidikan, Pencegahan, dan Penindakan.',
      'Studi kasus pencegahan plagiarisme, manipulasi anggaran organisasi kemahasiswaan, dan gratifikasi akademik.'
    ],
    featured: true
  },
  {
    id: 'doc-2',
    code: 'WP-SIMAK-2026-04',
    title: 'White Paper: Indeks Integritas Tata Kelola Organisasi Kemahasiswaan 2026',
    subtitle: 'Evaluasi Transparansi Anggaran dan Akuntabilitas Program Kerja di Lingkungan Kampus',
    author: 'Divisi Advokasi & Kajian Strategis KOPASUS',
    category: 'White Paper',
    year: '2026',
    pages: 64,
    fileSize: '3.1 MB',
    downloads: 895,
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    abstract: 'Laporan riset tahunan SIMAK yang mengukur tingkat keterbukaan informasi, standar pelaporan LPJ keuangan, serta mekanisme audit internal pada kegiatan kemahasiswaan sebagai laboratorium kepemimpinan publik.',
    keyTakeaways: [
      '87% responden mahasiswa mendukung publikasi terbuka laporan pertanggungjawaban dana kegiatan.',
      'Kerangka kerja e-Budgeting sederhana untuk UKM dan Himpunan Mahasiswa.',
      'Rekomendasi pakta integritas bagi seluruh fungsionaris lembaga kemahasiswaan.'
    ]
  },
  {
    id: 'doc-3',
    code: 'REG-TIPIKOR-2025-02',
    title: 'Buku Saku Kader: Membedakan Suap, Gratifikasi, dan Pemerasan dalam Layanan Publik',
    subtitle: 'Panduan Praktis Hukum Pidana Korupsi & Saluran Pelaporan Whistleblowing System',
    author: 'Dewan Pakar Hukum & Advokasi SIMAK',
    category: 'Regulasi & UU',
    year: '2025',
    pages: 52,
    fileSize: '2.4 MB',
    downloads: 2130,
    coverImage: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
    abstract: 'Panduan saku berformat visual yang memudahkan kader KOPASUS dan masyarakat umum mengidentifikasi delik suap-menyuap, kewajiban pelaporan gratifikasi dalam 30 hari kerja, serta perlindungan hukum bagi saksi dan pelapor.',
    keyTakeaways: [
      'Perbedaan unsur kesepakatan transaksional (meeting of minds) pada suap dibanding pemerasan.',
      'Daftar pengecualian gratifikasi (negative list) sesuai Peraturan KPK terbaru.',
      'Prosedur pelaporan aman melalui kanal pengaduan berintegritas.'
    ]
  },
  {
    id: 'doc-4',
    code: 'KAJ-SIMAK-2026-09',
    title: 'Kajian Strategis: Pengawasan Partisipatif Mahasiswa terhadap Pengadaan Barang & Jasa',
    subtitle: 'Metodologi Audit Sosial dan Analisis Red Flag Anggaran Daerah',
    author: 'Kelompok Kerja Riset Kebijakan Publik STIAMI',
    category: 'Kajian Strategis',
    year: '2026',
    pages: 86,
    fileSize: '5.2 MB',
    downloads: 640,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    abstract: 'Menyajikan instrumen analisis keterbukaan data pengadaan publik bagi mahasiswa Ilmu Administrasi Publik untuk mendeteksi potensi mark-up, pemecahan paket, dan konflik kepentingan.',
    keyTakeaways: [
      '10 indikator red flag dalam dokumen perencanaan dan spesifikasi teknis pengadaan.',
      'Pemanfaatan portal keterbukaan informasi publik untuk riset skripsi dan advokasi.',
      'Etika dan objektivitas dalam penyusunan policy brief berbasis bukti (evidence-based policy).'
    ]
  },
  {
    id: 'doc-5',
    code: 'JUR-INT-2025-11',
    title: 'Jurnal Integritas Muda Vol. 4: Digitalisasi Perpajakan sebagai Instrumen Pencegahan Korupsi',
    subtitle: 'Kumpulan Artikel Ilmiah Mahasiswa Spesialisasi Anti Korupsi Institut STIAMI',
    author: 'Redaksi Jurnal SIMAK Institut STIAMI',
    category: 'Jurnal Integritas',
    year: '2025',
    pages: 110,
    fileSize: '6.0 MB',
    downloads: 1105,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    abstract: 'Kumpulan 8 artikel ilmiah terpilih karya kader SIMAK yang menyoroti peran reformasi birokrasi, sistem Core Tax, dan pengawasan pelayanan terpadu satu pintu dalam menekan celah pungutan liar.',
    keyTakeaways: [
      'Reduksi interaksi tatap muka langsung menurunkan risiko negosiasi transaksional hingga 68%.',
      'Peran literasi pajak bagi UMKM dalam membangun budaya kepatuhan sukarela.',
      'Model kolaborasi perguruan tinggi dengan lembaga pengawas eksternal.'
    ]
  },
  {
    id: 'doc-6',
    code: 'MOD-SIMAK-2024-07',
    title: 'Pedoman Kampanye Kreatif & Public Speaking Penyuluh Antikorupsi Muda',
    subtitle: 'Teknik Komunikasi Persuasif untuk Edukasi Siswa SMA/SMK dan Komunitas Warga',
    author: 'Divisi Kampanye & Media Kreatif SIMAK',
    category: 'Modul Diklat',
    year: '2024',
    pages: 74,
    fileSize: '3.7 MB',
    downloads: 980,
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    abstract: 'Panduan praktis merancang modul permainan edukatif (boardgame integritas), teknik bercerita (storytelling), serta fasilitasi diskusi kelompok terarah saat terjun ke sekolah dan masyarakat.',
    keyTakeaways: [
      'Struktur presentasi 15 menit yang memikat audiens pelajar Gen-Z.',
      'Simulasi dilema etika sehari-hari untuk memicu refleksi kritis peserta.',
      'Panduan produksi konten mikro-edukasi untuk media sosial.'
    ]
  }
];

export const INITIAL_ADVOCACY_SUBMISSIONS: AdvocacySubmission[] = [
  {
    id: 'adv-1',
    title: 'Urgensi Pakta Integritas Digital dalam Pemilihan Raya Mahasiswa',
    authorName: 'Rizky Pratama Wijaya',
    nim: 'CA221110482',
    category: 'Opini Antikorupsi',
    submittedAt: '12 Oktober 2026',
    abstract: 'Politik uang skala mikro dalam kontestasi kampus adalah bibit permisif terhadap korupsi publik. Artikel ini menawarkan mekanisme pelaporan dana kampanye real-time.',
    status: 'Diterbitkan',
    readTime: '5 Menit Baca'
  },
  {
    id: 'adv-2',
    title: 'Policy Brief: Standarisasi Layanan Administrasi Akademik Bebas Gratifikasi',
    authorName: 'Nadia Maharani Putri',
    nim: 'CB231120119',
    category: 'Policy Brief',
    submittedAt: '15 Oktober 2026',
    abstract: 'Rekomendasi kebijakan penguatan zona integritas di lingkungan perguruan tinggi melalui deklarasi tolak tanda terima kasih berbentuk barang pada sidang tugas akhir.',
    status: 'Diterbitkan',
    readTime: '7 Menit Baca'
  },
  {
    id: 'adv-3',
    title: 'Audit Sosial Keterbukaan Informasi Beasiswa Pendidikan Daerah',
    authorName: 'Fajar Siddiq Al-Farizi',
    nim: 'CA211110094',
    category: 'Laporan Kajian',
    submittedAt: '16 Oktober 2026',
    abstract: 'Evaluasi indikator seleksi dan publikasi kuota penerima bantuan pendidikan daerah guna mencegah nepotisme dan penyaluran tidak tepat sasaran.',
    status: 'Dalam Kurasi',
    readTime: '9 Menit Baca'
  }
];

export const RECRUITMENT_TIMELINE = [
  {
    step: '01',
    phase: 'Pendaftaran Online & Seleksi Berkas',
    date: '10 – 21 Oktober 2026',
    desc: 'Pengisian formulir pendaftaran Kader KOPASUS Batch VIII & Open House melalui portal resmi SIMAK serta penerbitan E-Tiket instan.',
    status: 'SEDANG BERLANGSUNG'
  },
  {
    step: '02',
    phase: 'Open House & Seminar Integritas',
    date: 'Kamis, 22 Oktober 2026',
    desc: 'Pengenalan visi-misi SIMAK Institut STIAMI, bedah 4 divisi utama KOPASUS, dan talkshow bersama praktisi antikorupsi.',
    status: 'AGENDA TERDEKAT'
  },
  {
    step: '03',
    phase: 'Ujian Tertulis & Wawancara Integritas',
    date: 'Sabtu, 24 Oktober 2026',
    desc: 'Pelaksanaan tes wawasan kebangsaan, pengetahuan dasar antikorupsi, serta asesmen studi kasus dilema etika.',
    status: 'TERJADWAL'
  },
  {
    step: '04',
    phase: 'Diklat Dasar & Pelantikan Kader KOPASUS',
    date: '31 Oktober – 1 November 2026',
    desc: 'Pendidikan dan latihan kepemimpinan berintegritas, simulasi advokasi kebijakan, serta pengukuhan resmi Kader KOPASUS.',
    status: 'TERJADWAL'
  }
];

export const INTEGRITY_QUIZ_QUESTIONS = [
  {
    question: 'Manakah di bawah ini yang termasuk dalam 9 Nilai Integritas Antikorupsi yang dirumuskan oleh KPK untuk pendidikan tinggi?',
    options: [
      'Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, Adil',
      'Jujur, Loyal, Patuh, Cekatan, Kompetitif, Eksklusif, Tegas, Pragmatis, Adil',
      'Transparan, Birokratis, Hierarkis, Mandiri, Disiplin, Cepat, Tepat, Berani, Makmur',
      'Peduli, Dermawan, Kompromistis, Tanggung Jawab, Kerja Keras, Fleksibel, Berani, Adil'
    ],
    correctIndex: 0,
    explanation: '9 Nilai Integritas (Jumat Bersepeda KK) terdiri dari: Jujur, Mandiri, Tanggung Jawab, Berani, Sederhana, Peduli, Disiplin, Adil, dan Kerja Keras.'
  },
  {
    question: 'Berapa batas waktu maksimal bagi penyelenggara negara atau pegawai negeri untuk melaporkan penerimaan gratifikasi kepada KPK agar terhindar dari ancaman pidana?',
    options: [
      '7 Hari Kerja sejak tanggal penerimaan',
      '14 Hari Kalender sejak tanggal penerimaan',
      '30 Hari Kerja sejak tanggal penerimaan',
      '60 Hari Kerja sejak tanggal penerimaan'
    ],
    correctIndex: 2,
    explanation: 'Sesuai Pasal 12C UU No. 20 Tahun 2001, ketentuan pidana gratifikasi tidak berlaku jika penerima melaporkan gratifikasi yang diterimanya kepada KPK paling lambat 30 hari kerja.'
  },
  {
    question: 'Apa fokus utama dari strategi "Trisula Pemberantasan Korupsi" yang dijalankan secara simultan?',
    options: [
      'Investigasi, Interogasi, dan Eksekusi',
      'Pendidikan, Pencegahan, dan Penindakan',
      'Sosialisasi, Mediasi, dan Rehabilitasi',
      'Regulasi, Deregulasi, dan Privatisasi'
    ],
    correctIndex: 1,
    explanation: 'Trisula Pemberantasan Korupsi meliputi: Pendidikan (membangun nilai agar tidak ingin korupsi), Pencegahan (perbaikan sistem agar tidak bisa korupsi), dan Penindakan (efek jera agar takut korupsi).'
  }
];
