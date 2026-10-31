import React, { useState } from 'react';
import { ScreenId } from '../types';
import { KOPASUS_GENERATIONS, ArchivePhoto, ProgramGenerationArchive } from '../data/programArchiveData';

interface ProgramCanvasScreenProps {
  initialProgramId?: string;
  onNavigate: (screen: ScreenId) => void;
  onSelectProgram?: (programId: string) => void;
}

interface ProgramConfig {
  id: string;
  code: string;
  title: string;
  shortName: string;
  category: string;
  statusBadge: string;
  statusType: 'closed' | 'open' | 'internal' | 'done';
  icon: string;
  heroImage: string;
  theme: string;
  location: string;
  targetAudience: string;
  kpkValues: { name: string; desc: string; icon: string }[];
  summary: string;
  agendaOrRoadmap: { phase: string; title: string; desc: string }[];
  outputAndCerts: string[];
  ctaLabel: string;
  ctaAction: 'register' | 'waitlist' | 'library' | 'transparency';
}

const PROGRAMS_CONFIG: Record<string, ProgramConfig> = {
  kopasus: {
    id: 'kopasus',
    code: 'PROKER-01 • KADERISASI UTAMA',
    title: 'Komando Pendidikan Khusus (KOPASUS)',
    shortName: 'KOPASUS',
    category: 'Gerbang Tunggal Rekrutmen & Pembentukan Karakter Antikorupsi',
    statusBadge: 'Sudah Terlaksana • Pendaftaran Batch XVI Ditutup',
    statusType: 'closed',
    icon: 'military_tech',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSdd1AR0-zoGoi9ksikfgcRah_guw9NuDGUdgxbbEL1ZbLaoPQT5VjtbfLe3avMM5eSZUvRvRPxXBD0eGVsvY3elNVN_Xzfd0KgtnAxULHSBlWR_6RtHxDVg2Z_NxV2HbFilIdQ6lmSZt9vnJeAHVrmplyPi6Fz2ErVblIGEpBtANAXP45PugSaBZQr20cci697zKabbKowSp9kp9Y-mFNs7gh4FBNbtcE7sC3XB9a',
    theme: 'Mencetak Kader Mahasiswa Berintegritas Tanpa Kompromi & Bebas Konflik Kepentingan',
    location: 'Kampus Pusat Institut STIAMI & Pusat Diklat Cisarua, Bogor',
    targetAudience: 'Mahasiswa Aktif Institut STIAMI (Semester 1–6)',
    kpkValues: [
      { name: 'Jujur', desc: 'Konsistensi antara perkataan, fakta, dan perbuatan dalam kehidupan kampus.', icon: 'verified' },
      { name: 'Berani', desc: 'Berani menolak gratifikasi, menentang kecurangan, dan bersuara lantang demi kebenaran.', icon: 'local_fire_department' },
      { name: 'Tanggung Jawab', desc: 'Menjalankan amanah kemahasiswaan dengan akuntabilitas mutlak.', icon: 'assignment_turned_in' },
      { name: 'Disiplin', desc: 'Kepatuhan terhadap norma hukum, etika akademik, dan tata tertib organisasi.', icon: 'timer' },
    ],
    summary:
      'KOPASUS adalah program kaderisasi dasar wajib yang menjadi satu-satunya pintu gerbang rekrutmen anggota resmi SIMAK sejak 29 Januari 2011. Peserta digembleng selama 3 hari 2 malam dengan simulasi investigasi dokumen anggaran fiktif, bedah delik tipikor, latihan fisik pembentuk ketahanan mental, serta ditutup dengan sumpah integritas pengukuhan Nomor Induk Anggota (NIA).',
    agendaOrRoadmap: [
      { phase: 'Tahap 01', title: 'Screening Berkas & Esai Moral Integritas', desc: 'Seleksi administrasi akademik, verifikasi bebas pelanggaran etik, dan penulisan naskah komitmen moral antikorupsi.' },
      { phase: 'Tahap 02', title: 'Wawancara Komitmen bersama BPH & Dewan Pembina', desc: 'Pengujian ketahanan mental menghadapi tekanan, pemetaan kompetensi minat 8 divisi, dan pakta integritas.' },
      { phase: 'Tahap 03', title: 'Diklat Lapangan & Simulasi Investigasi (Day 1 – 3)', desc: 'Pelatihan ketahanan alam terbuka di Cisarua, investigasi lapangan, olah TKP korupsi fiktif, serta api unggun refleksi perjuangan.' },
      { phase: 'Tahap 04', title: 'Sumpah Kader, Pembagian PDH & Penerbitan NIA', desc: 'Upacara sakral pengukuhan anggota resmi, penyematan panji SIMAK, dan penerbitan Surat Keputusan (SK) Mandataris.' },
    ],
    outputAndCerts: [
      'Surat Keputusan (SK) Pengukuhan Kader Resmi SIMAK',
      'Nomor Induk Anggota (NIA) Terdaftar di Database Nasional',
      'Pakaian Dinas Harian (PDH) & Brevet Integritas KOPASUS',
      'Piagam Kelulusan Diklat Dasar KOPASUS',
    ],
    ctaLabel: 'Isi Waiting List KOPASUS Batch XVII',
    ctaAction: 'waitlist',
  },
  pinsus: {
    id: 'pinsus',
    code: 'PROKER-02 • PEMBINAAN LANJUTAN',
    title: 'Pendidikan Khusus Kader (PINSUS)',
    shortName: 'PINSUS',
    category: 'Kaderisasi Tingkat Lanjut & Sekolah Kepemimpinan Strategis',
    statusBadge: 'Khusus Kader Internal • Selesai Terlaksana',
    statusType: 'internal',
    icon: 'school',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAaLFp2EuNFVidMt_8M1VPVEGI6W8pBxGRNFAvsNnetAvxueljTz_LcWJ2ggdWAMoi4v6JMpDD9FV6MTdTqa8AqUjbtu7rIbmaiWIdOxxgJgLJ_fQ545tQvjWWksHtPcAprYVF9iuD0n6gKOVWPqkaMOWaBO8qS0bJqqrXq87AKRw-EwvwiV29Mf4Wgqda7rmrSk2KvxniknKuTlI6jpEjdvtJgYo6P5sbX4oshr8W0',
    theme: 'Mempersiapkan Pemimpin Organisasi Berintegritas & Manajer Krisis Publik',
    location: 'Institut STIAMI Jakarta Pusat',
    targetAudience: 'Kader Lulusan KOPASUS & Calon Pengurus BPH',
    kpkValues: [
      { name: 'Adil', desc: 'Menempatkan kebenaran dan hak publik di atas kepentingan pribadi/golongan.', icon: 'balance' },
      { name: 'Kerja Keras', desc: 'Dedikasi tinggi menuntaskan program kerja berstandar keunggulan.', icon: 'fitness_center' },
      { name: 'Mandiri', desc: 'Kemandirian finansial dan independensi berpikir organisasi nirlaba.', icon: 'self_improvement' },
      { name: 'Peduli', desc: 'Peka terhadap ketimpangan sosial dan aspirasi mahasiswa tertindas.', icon: 'favorite' },
    ],
    summary:
      'Pendidikan Khusus (PINSUS) adalah sekolah kepemimpinan strategis bagi kader internal SIMAK. Di program ini, para alumni KOPASUS digembleng dalam perumusan naskah advokasi kebijakan publik (Policy Brief), tata kelola keuangan organisasi tanpa selisih (Zero-Discrepancy), retorika komunikasi krisis, serta manajemen investigasi kelembagaan.',
    agendaOrRoadmap: [
      { phase: 'Sesi I', title: 'Tata Kelola Keuangan Nirlaba Transparan & Audit Mandiri', desc: 'Prinsip akuntansi organisasi nirlaba dan penyusunan LPJ real-time.' },
      { phase: 'Sesi II', title: 'Komunikasi Krisis, Negosiasi & Retorika Publik', desc: 'Teknik menghadapi sanggahan pers, negosiasi kemitraan, dan diplomasi kelembagaan.' },
      { phase: 'Sesi III', title: 'Penyusunan Policy Brief & Riset Kebijakan Publik', desc: 'Metodologi perumusan naskah akademik rekomendasi perbaikan tata kelola birokrasi kampus.' },
      { phase: 'Sesi IV', title: 'Uji Kelayakan Calon Pengurus Inti (BPH)', desc: 'Penilaian kelayakan calon Ketua Umum, Sekretaris Jenderal, dan 4 Wakil Ketua Umum.' },
    ],
    outputAndCerts: [
      'Sertifikat Kelulusan PINSUS Tingkat Lanjut',
      'Portofolio Naskah Kajian Policy Brief Ber-ISBN/Terdaftar',
      'Kualifikasi Resmi Syarat Maju BPH SIMAK',
    ],
    ctaLabel: 'Lihat Modul PINSUS di E-Library',
    ctaAction: 'library',
  },
  tot: {
    id: 'tot',
    code: 'PROKER-03 • SINERGI PENEGAK HUKUM',
    title: 'Training of Trainer (TOT) Penegak Hukum',
    shortName: 'TOT KPK & MA',
    category: 'Pelatihan Instruktur Muda Antikorupsi Bersama Lembaga Negara',
    statusBadge: 'Kemitraan KPK, MA & Polri • Selesai',
    statusType: 'done',
    icon: 'gavel',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDrxvmPej5B3j40XUmN8CHb3f8OBd9ryGvKiivTEEJ37Rk2iL2bPTjKy8jFn3kjW1Hvs34InHgHRRWp9IeRZ3ATnanXN63AyMaq89ae_twjGFLk8UHMN-rsOQHeoXfZCj-W_1-nUhIEucVCwb4aP0LwmnzKXTavKakDtRU0gOAMzfX9lky1bBgf41xCAuAVWg0b4rn2FfHUCJ4rIRinH3WzdYCCK-CRB1Vq2tuuoSB',
    theme: 'Mencetak Penyuluh Antikorupsi Tersertifikasi untuk Mengawal Reformasi Hukum',
    location: 'ACLC KPK RI Kuningan & Pengadilan Tipikor Jakarta',
    targetAudience: 'Delegasi Terpilih Kader SIMAK & Dosen Pendamping',
    kpkValues: [
      { name: 'Jujur', desc: 'Menyajikan data hukum secara objektif tanpa manipulasi.', icon: 'verified' },
      { name: 'Adil', desc: 'Menegakkan kepastian hukum tanpa pandang bulu dan intervensi kekuasaan.', icon: 'balance' },
      { name: 'Berani', desc: 'Berani menjadi saksi dan pelapor tindak pidana korupsi terlindungi.', icon: 'shield' },
      { name: 'Tanggung Jawab', desc: 'Tanggung jawab moril mencerdaskan masyarakat sadar hukum.', icon: 'policy' },
    ],
    summary:
      'Program kemitraan strategis dengan Komisi Pemberantasan Korupsi (KPK RI), Mahkamah Agung, dan Kepolisian RI. Kader pilihan dilatih langsung oleh penyidik senior dan penyuluh antikorupsi nasional untuk menguasai delik suap, gratifikasi, tindak pidana pencucian uang (TPPU), serta metodologi penyuluhan interaktif ke sekolah dan masyarakat.',
    agendaOrRoadmap: [
      { phase: 'Modul 1', title: 'Trisula Pemberantasan Korupsi (Pendidikan, Pencegahan, Penindakan)', desc: 'Studi mendalam bersama Direktorat Sosialisasi & Kampanye Antikorupsi KPK RI.' },
      { phase: 'Modul 2', title: 'Hukum Acara Tipikor & Peradilan Bersih bersama Mahkamah Agung', desc: 'Bedah yurisprudensi kasus korupsi dan peran peradilan independen.' },
      { phase: 'Modul 3', title: 'Micro-Teaching & Media Penyuluhan Kreatif', desc: 'Praktik mengajar materi integritas menggunakan media board game, komik moral, dan studi kasus.' },
      { phase: 'Modul 4', title: 'Kunjungan Lapangan & Uji Sertifikasi Fasilitator', desc: 'Simulasi pelaporan WBS dan uji kelayakan penyuluh muda antikorupsi.' },
    ],
    outputAndCerts: [
      'Sertifikat Fasilitator / Penyuluh Muda Antikorupsi KPK RI',
      'Buku Saku Panduan Delik Korupsi Sektor Publik',
      'KTA Fasilitator Resmi SIMAK Goes To School',
    ],
    ctaLabel: 'Pelajari Dokumen TOT di E-Library',
    ctaAction: 'library',
  },
  ramadhan: {
    id: 'ramadhan',
    code: 'PROKER-04 • BAKTI SOSIAL & KEMANUSIAAN',
    title: 'Ramadhan Integrity & Aksi Kemanusiaan',
    shortName: 'Ramadhan Integrity',
    category: 'Implementasi Nilai Peduli & Sederhana Melalui Gerakan Donasi Transparan',
    statusBadge: 'Agenda Tahunan • Terlaksana 250+ Paket',
    statusType: 'done',
    icon: 'volunteer_activism',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHiBrBGM7unygMJ09G4znGwjboEge7LxoDHZjMe2SkXuGFv1-KWc5DSJe8fCuJzs2IN0IOe1M3JsGNrCPFGkYnAg_qW5bwVNl6bKC6hVmFQhpLMsT5ZS3Wgu8uJmnVwkGMdfZItJQP7teumCNL_luvPgwhrIKGi0QkrLRYMDJ1EYqYQxuKEZIbK2IzhM2heCcmeBOOJCn3yU4ZgI_ixNc43TXabdPUEEwSSamJeyt',
    theme: 'Menyemai Empati Sosial dan Kejujuran Pengelolaan Donasi Publik Terbuka',
    location: 'Yayasan Yatim Piatu & Lingkungan Sekitar Kampus Jabodetabek',
    targetAudience: 'Masyarakat Membutuhkan, Anak Yatim, dan Civitas Akademika',
    kpkValues: [
      { name: 'Peduli', desc: 'Menghadirkan kepedulian nyata bagi masyarakat kurang mampu.', icon: 'favorite' },
      { name: 'Sederhana', desc: 'Menolak gaya hidup hedonisme dan mengutamakan kebermanfaatan bersama.', icon: 'spa' },
      { name: 'Jujur', desc: 'Pelaporan dana donasi kas keluar-masuk dipublikasikan harian secara transparan.', icon: 'receipt_long' },
      { name: 'Tanggung Jawab', desc: 'Menyalurkan bantuan 100% tepat sasaran tanpa potongan biaya.', icon: 'task_alt' },
    ],
    summary:
      'Wujud pengabdian masyarakat berbasis nilai integritas. Selama bulan suci Ramadhan, SIMAK menghimpun dan menyalurkan donasi publik dengan sistem pembukuan terbuka (Zero-Discrepancy audit harian), pembagian sembako, santunan pendidikan anak yatim, edukasi kejujuran melalui dongeng moral, serta buka puasa bersama keluarga besar alumni.',
    agendaOrRoadmap: [
      { phase: 'Tahap 1', title: 'Open Donasi Transparan & Laporan Kas Harian Terbuka', desc: 'Penggalangan dana melalui rekening resmi SIMAK dengan pembaruan mutasi per 24 jam.' },
      { phase: 'Tahap 2', title: 'Penyaluran Paket Sembako & Santunan Anak Yatim', desc: 'Distribusi door-to-door dan penyerahan santunan tunai langsung kepada penerima manfaat.' },
      { phase: 'Tahap 3', title: 'Dongeng & Kelas Karakter Kejujuran Anak', desc: 'Fasilitator SIMAK mendongeng kisah keteladanan kejujuran bagi anak-anak panti asuhan.' },
      { phase: 'Tahap 4', title: 'Buka Puasa Bersama & Refleksi Integritas Lintas Angkatan', desc: 'Silaturahmi akbar kader, pengurus, alumni senior, dan dewan pembina.' },
    ],
    outputAndCerts: [
      'Laporan Keuangan Donasi Publik (Audit Terbuka)',
      'Dokumentasi Berita Acara Serah Terima Donasi',
      'Piagam Penghargaan Relawan Kemanusiaan SIMAK',
    ],
    ctaLabel: 'Cek Laporan Transparansi Donasi',
    ctaAction: 'transparency',
  },
  harlah: {
    id: 'harlah',
    code: 'PROKER-05 • AGENDA TERBESAR TAHUNAN',
    title: 'Hari Lahir (HARLAH) 16 SIMAK — 29 Januari',
    shortName: 'HARLAH 16',
    category: 'Seminar Nasional, Refleksi Gerakan 15 Tahun & Temu Akbar Mahasiswa',
    statusBadge: 'Agenda Terdekat • Registrasi Tamu Dibuka',
    statusType: 'open',
    icon: 'celebration',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZioie1EvnXlJTsah7hHrLuEccnECLnf7hKd-HcthQvj_MdbY2Hg_0-t4R7NFvihgsLVNXGvHB29iyuKSNL5RjTcv6Jcbkxj2xugNqYyCykOzLT03fk4DcaUec_7b2Y4nH46ZI0rRwJplgxtP1DvYecfNc8BHqkYkeyOTvqnm18cO4nQvMOFOlP1a4ZnyzJps6BKZX4qZZPaseVoXO5ZUdDV_b9LX6yIvq5Twou0uT',
    theme: '15 Tahun Konsistensi Menjaga Integritas, Menolak Diam di Tengah Ketidakadilan',
    location: 'Auditorium Utama Institut STIAMI Jakarta Pusat (Kapasitas 350 Kursi)',
    targetAudience: 'Tamu Undangan, Delegasi BEM/UKM Kampus Mitra, Tokoh Publik & Alumni',
    kpkValues: [
      { name: 'Berani', desc: 'Meneguhkan tekad pergerakan mahasiswa sebagai benteng moral bangsa.', icon: 'local_fire_department' },
      { name: 'Jujur', desc: 'Transparansi total dalam setiap penyelenggaraan agenda kemahasiswaan.', icon: 'verified' },
      { name: 'Adil', desc: 'Membuka ruang dialektika yang setara bagi seluruh civitas akademika.', icon: 'balance' },
      { name: 'Tanggung Jawab', desc: 'Menuntaskan amanah peringatan hari lahir dengan standar kesempurnaan.', icon: 'military_tech' },
    ],
    summary:
      'Momentum sakral setiap tanggal 29 Januari memperingati pendirian SIMAK (29 Januari 2011). Peringatan HARLAH ke-16 memadukan Seminar Nasional Integritas, peluncuran sistem digital presensi QR berbasis cloud, pemotongan tumpeng refleksi, penganugerahan Integrity Award bagi kader & divisi terbaik, serta silaturahmi akbar lintas generasi.',
    agendaOrRoadmap: [
      { phase: '08.00 - 08.45', title: 'Gate In: Registrasi Digital & Pemindaian QR E-Tiket Tamu', desc: 'Pengecekan nomor kursi tamu, pembagian starter kit seminar, dan verifikasi barcode.' },
      { phase: '09.00 - 11.45', title: 'Seminar Nasional Antikorupsi & Dialog Publik Kebangsaan', desc: 'Sesi narasumber pakar hukum, akademisi, dan praktisi pencegahan korupsi KPK.' },
      { phase: '12.30 - 13.45', title: 'Seremoni Refleksi 15 Tahun SIMAK & Pemotongan Tumpeng', desc: 'Kilap kilas sejarah perjuangan SIMAK sejak 29 Januari 2011 dan doa bersama.' },
      { phase: '13.45 - 15.00', title: 'Penganugerahan SIMAK Integrity Award & Ramah Tamah', desc: 'Pemberian plakat penghargaan kepada kader terdisiplin, divisi terbaik, dan foto bersama alumni.' },
    ],
    outputAndCerts: [
      'E-Tiket Resmi Tamu Undangan dengan Barcode Unik & Nomor Kursi',
      'E-Sertifikat Nasional Seminar Integritas HARLAH 16 (Ber-SKP)',
      'Paket Goodie Bag & Merchandise Eksklusif HARLAH SIMAK',
    ],
    ctaLabel: 'Daftar Tamu Undangan HARLAH Sekarang',
    ctaAction: 'register',
  },
  gts: {
    id: 'gts',
    code: 'PROKER-06 • EDUKASI PELAJAR',
    title: 'SIMAK Goes To School (GTS)',
    shortName: 'Goes To School',
    category: 'Penyuluhan Integritas & Pembiasaan Karakter Kejujuran Siswa SMA/SMK',
    statusBadge: 'Edukasi Lapangan • 350+ Siswa Terjangkau',
    statusType: 'done',
    icon: 'co_present',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmKwOAbKxzWuDa0NuiOARrSOnlfHwNJVSLBA_SAzzRhs-fnNmF3EXvuRPfC30iD1zJdkzTZyp4Xmn1jMfE-qKfQH_kHgRBFhpHF6fyg_rmLU7kAPPNhfoOtvzG5r_zu6kiFKa5pm42uzSrjZDBr1ken_U0eNCiabgVZdYGPc9R7MPcNC0ZLHj9BjLfxt3t24h94t7z8WBN_7xwyRHldECeOny7AuRDaoVeqOso1x6eWbN8CApL7RcqhQ',
    theme: 'Menanamkan Budaya Anticontek, Tolak Pungli Sekolah, & Kantin Kejujuran',
    location: 'SMA & SMK Negeri/Swasta di Wilayah DKI Jakarta & Bekasi',
    targetAudience: 'Siswa-Siswi SMA/SMK Kelas X – XII dan Pengurus OSIS',
    kpkValues: [
      { name: 'Jujur', desc: 'Menolak budaya menyontek dan membiasakan jujur saat ujian.', icon: 'verified' },
      { name: 'Disiplin', desc: 'Tepat waktu, taat aturan sekolah, dan menghormati hak sesama teman.', icon: 'timer' },
      { name: 'Mandiri', desc: 'Mengerjakan tugas dengan kemampuan sendiri tanpa plagiasi.', icon: 'psychology' },
      { name: 'Berani', desc: 'Berani melaporkan bullying atau pungli di lingkungan sekolah.', icon: 'campaign' },
    ],
    summary:
      'Program roadshow edukatif yang digerakkan oleh para fasilitator muda lulusan TOT SIMAK ke sekolah-sekolah menengah. Melalui metode interaktif seperti roleplay persidangan tipikor mini, studi kasus kantin kejujuran, kuis berhadiah, dan ikrar pelajar antikorupsi, program ini sukses menyentuh ratusan siswa setiap tahunnya.',
    agendaOrRoadmap: [
      { phase: 'Sesi 1', title: 'Ice Breaking & Pengenalan 9 Nilai Antikorupsi Pelajar', desc: 'Games interaktif pemantik fokus dan pemahaman dasar kejujuran.' },
      { phase: 'Sesi 2', title: 'Studi Kasus: Bahaya Gratifikasi Kecil & Budaya Curang', desc: 'Analisis fenomena tips ilegal, titip presensi, dan mencontek.' },
      { phase: 'Sesi 3', title: 'Simulasi Peradilan Mini Kejujuran & Deklarasi OSIS', desc: 'Siswa memainkan peran hakim, jaksa, dan pembela dalam kasus integritas sekolah.' },
      { phase: 'Sesi 4', title: 'Penyerahan Piagam Sekolah Berintegritas & Foto Bersama', desc: 'Penyerahan plakat penghargaan kepada kepala sekolah dan pengukuhan Duta Kejujuran Siswa.' },
    ],
    outputAndCerts: [
      'Piagam Apresiasi Sekolah Sahabat Integritas SIMAK',
      'Sertifikat Peserta Edukasi Karakter Antikorupsi Siswa',
      'Modul Panduan Pembentukan Kantin Kejujuran Sekolah',
    ],
    ctaLabel: 'Unduh Silabus Edukasi GTS di E-Library',
    ctaAction: 'library',
  },
};

export const ProgramCanvasScreen: React.FC<ProgramCanvasScreenProps> = ({
  initialProgramId = 'kopasus',
  onNavigate,
  onSelectProgram,
}) => {
  const [activeProgramId, setActiveProgramId] = useState<string>(initialProgramId);

  // State khusus KOPASUS Multi-Year & Multi-Day
  const [selectedBatchYear, setSelectedBatchYear] = useState<number>(2026);
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<ArchivePhoto | null>(null);

  const currentProgram = PROGRAMS_CONFIG[activeProgramId] || PROGRAMS_CONFIG.kopasus;
  const currentBatchArchive: ProgramGenerationArchive | undefined = KOPASUS_GENERATIONS.find(
    (g) => g.year === selectedBatchYear
  ) || KOPASUS_GENERATIONS[0];

  const handleSwitchProgram = (id: string) => {
    setActiveProgramId(id);
    if (onSelectProgram) onSelectProgram(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = (action: string) => {
    if (action === 'register') {
      onNavigate('pendaftaran');
    } else if (action === 'waitlist') {
      onNavigate('pendaftaran');
    } else if (action === 'library') {
      onNavigate('elibrary');
    } else if (action === 'transparency') {
      onNavigate('transparansi');
    }
  };

  // Filter foto untuk KOPASUS
  const displayedPhotos: ArchivePhoto[] = [];
  if (currentBatchArchive && currentBatchArchive.days) {
    currentBatchArchive.days.forEach((day) => {
      if (selectedDayFilter === 'all' || selectedDayFilter === day.dayNumber) {
        day.photos.forEach((photo) => {
          displayedPhotos.push(photo);
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* ─── STICKY PROGRAM BAR SWITCHER ─── */}
      <div className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-secondary uppercase tracking-wider mr-2 hidden md:flex">
              <span className="material-symbols-outlined text-[18px] text-primary">view_timeline</span>
              <span>Kanvas Program:</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {Object.values(PROGRAMS_CONFIG).map((p) => {
                const isActive = p.id === activeProgramId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSwitchProgram(p.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-md scale-102 ring-2 ring-primary/30'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{p.icon}</span>
                    <span>{p.shortName}</span>
                    {p.statusType === 'open' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {/* ─── HERO BANNER ─── */}
        <section className="relative rounded-3xl overflow-hidden border border-outline-variant/40 bg-surface-container-lowest shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Left Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 z-10 bg-linear-to-r from-surface-container-lowest via-surface-container-lowest/95 to-transparent">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-wider">
                    {currentProgram.code}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      currentProgram.statusType === 'open'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-surface-container-high text-secondary border border-outline-variant/40'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        currentProgram.statusType === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-secondary'
                      }`}
                    />
                    {currentProgram.statusBadge}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
                  {currentProgram.title}
                </h1>

                <p className="text-sm sm:text-base font-semibold text-primary">
                  {currentProgram.theme}
                </p>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed pt-1">
                  {currentProgram.summary}
                </p>
              </div>

              {/* Meta Info Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-outline-variant/30 text-xs">
                <div className="flex items-center gap-2.5 text-secondary">
                  <span className="material-symbols-outlined text-[20px] text-primary">pin_drop</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline">Lokasi Kegiatan</span>
                    <p className="font-semibold text-on-surface">{currentProgram.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-secondary">
                  <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline">Sasaran Peserta</span>
                    <p className="font-semibold text-on-surface">{currentProgram.targetAudience}</p>
                  </div>
                </div>
              </div>

              {/* CTA Action Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCtaClick(currentProgram.ctaAction)}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-black text-sm tracking-wide shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {currentProgram.ctaAction === 'register' ? 'how_to_reg' : 'arrow_forward'}
                  </span>
                  <span>{currentProgram.ctaLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('beranda')}
                  className="px-4 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden">
              <img
                src={currentProgram.heroImage}
                alt={currentProgram.title}
                className="w-full h-full object-cover object-center filter saturate-110"
              />
              <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-surface-container-lowest via-transparent to-black/30 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ─── PEMETAAN 9 NILAI INTEGRITAS KPK ─── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
              <div>
                <h2 className="text-lg font-black text-on-surface tracking-tight">
                  Internalisasi Nilai Integritas Antikorupsi
                </h2>
                <p className="text-xs text-secondary">
                  Nilai-nilai utama yang ditempa secara ketat sepanjang pelaksanaan {currentProgram.shortName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentProgram.kpkValues.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 transition-all hover:-translate-y-0.5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">{val.icon}</span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-outline">
                    Nilai 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-on-surface">{val.name}</h3>
                <p className="text-xs text-secondary leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ROADMAP & AGENDA / TAHAPAN ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Tahapan Pelaksanaan */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">alt_route</span>
              <div>
                <h2 className="text-lg font-black text-on-surface tracking-tight">
                  Tahapan & Kurikulum Pelaksanaan
                </h2>
                <p className="text-xs text-secondary">Rangkaian fase kegiatan dari persiapan hingga kelulusan</p>
              </div>
            </div>

            <div className="space-y-3">
              {currentProgram.agendaOrRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-4 hover:bg-surface-container transition-colors"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary text-on-primary font-black text-xs flex flex-col items-center justify-center shadow-md">
                    <span className="text-[10px] opacity-80 uppercase">Fase</span>
                    <span className="text-sm font-black">0{idx + 1}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                        {item.phase}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-on-surface">{item.title}</h3>
                    <p className="text-xs text-secondary leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Output & Sertifikasi Resmi */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
              <div>
                <h2 className="text-lg font-black text-on-surface tracking-tight">
                  Output & Legalitas Kelulusan
                </h2>
                <p className="text-xs text-secondary">Atribut dan dokumen resmi yang diperoleh peserta</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-linear-to-br from-surface-container-low to-surface-container border border-outline-variant/40 shadow-md space-y-5">
              <div className="space-y-3">
                {currentProgram.outputAndCerts.map((out, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-[20px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs font-semibold text-on-surface leading-snug">{out}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Tervalidasi & Ditandatangani Mandataris Resmi SIMAK</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCtaClick(currentProgram.ctaAction)}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>Aksi Terkait: {currentProgram.ctaLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── DOKUMENTASI MULTI-TAHUN & MULTI-DAY (KHUSUS KOPASUS) ─── */}
        {activeProgramId === 'kopasus' && (
          <section className="space-y-6 pt-4 border-t border-outline-variant/30">
            {/* Header Dokumentasi */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">photo_library</span>
                  <h2 className="text-xl font-black text-on-surface tracking-tight">
                    Arsip Foto Kegiatan KOPASUS (Lintas Angkatan & Day 1–3)
                  </h2>
                </div>
                <p className="text-xs text-secondary">
                  Struktur arsip berjenjang per tahun kepengurusan dan tahapan hari diklat lapangan
                </p>
              </div>

              {/* Selector Angkatan / Tahun */}
              <div className="flex items-center gap-2 bg-surface-container p-1 rounded-2xl border border-outline-variant/40 shrink-0">
                <span className="text-xs font-bold text-secondary px-2">Angkatan:</span>
                {KOPASUS_GENERATIONS.map((gen) => (
                  <button
                    key={gen.id}
                    type="button"
                    onClick={() => setSelectedBatchYear(gen.year)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedBatchYear === gen.year
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {gen.year} (Batch {gen.batchName.split(' ')[1]})
                  </button>
                ))}
              </div>
            </div>

            {/* Info Angkatan Terpilih */}
            {currentBatchArchive && (
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                      {currentBatchArchive.periodLabel}
                    </span>
                    <span className="text-xs text-secondary">• {currentBatchArchive.location}</span>
                  </div>
                  <h3 className="text-base font-black text-on-surface">{currentBatchArchive.batchName}</h3>
                  <p className="text-xs text-secondary italic">"{currentBatchArchive.theme}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {currentBatchArchive.driveFullArchiveUrl && (
                    <a
                      href={currentBatchArchive.driveFullArchiveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-amber-500">folder</span>
                      <span>Arsip Lengkap Google Drive</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Filter Hari (Day 1, Day 2, Day 3) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => setSelectedDayFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedDayFilter === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-secondary hover:text-on-surface'
                }`}
              >
                Semua Momen
              </button>
              {currentBatchArchive?.days.map((day) => (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayFilter(day.dayNumber)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    selectedDayFilter === day.dayNumber
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-secondary hover:text-on-surface'
                  }`}
                >
                  <span>{day.dayLabel}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({day.title.slice(0, 20)}...)</span>
                </button>
              ))}
            </div>

            {/* Grid Foto Dokumentasi */}
            {displayedPhotos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setLightboxPhoto(photo)}
                    className="group relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-4/3 overflow-hidden bg-surface-container-high">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-on-surface line-clamp-1">{photo.title}</h4>
                        {photo.isHighlight && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            Highlight
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-secondary line-clamp-2">{photo.caption}</p>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-xl bg-white/90 text-black text-xs font-bold flex items-center gap-1 shadow-lg">
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                        Perbesar Foto
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 rounded-2xl bg-surface-container-low border border-dashed border-outline-variant/50 text-center space-y-3">
                <span className="material-symbols-outlined text-[48px] text-outline">add_photo_alternate</span>
                <div className="space-y-1 max-w-md mx-auto">
                  <h4 className="text-sm font-black text-on-surface">Folder Siap Diisi Foto</h4>
                  <p className="text-xs text-secondary">
                    Struktur folder untuk <strong>{currentBatchArchive?.batchName}</strong> sudah dibuat di:
                    <br />
                    <code className="px-2 py-1 rounded-md bg-surface-container font-mono text-[11px] text-primary mt-1 inline-block">
                      public/archives/kopasus/{selectedBatchYear}-batch-16/
                    </code>
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ─── LIGHTBOX MODAL PERBESAR FOTO ─── */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-surface-container-lowest">
              <h3 className="text-base sm:text-lg font-black text-on-surface">{lightboxPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-secondary">{lightboxPhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
