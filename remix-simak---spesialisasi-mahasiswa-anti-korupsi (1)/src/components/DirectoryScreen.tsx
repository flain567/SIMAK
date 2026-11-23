import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, ParticipantRecord } from '../types';
import { useGsapPageAnimations, animateFilterGrid } from '../hooks/useGsapAnimations';
import { fetchCadreMembers } from '../api';

interface DirectoryScreenProps {
  onNavigate: (screen: ScreenId) => void;
  participants?: ParticipantRecord[];
}

type DivisiFilter = 'all' | 'bph' | 'litbang' | 'advokasi' | 'kominfo' | 'usaha' | 'operasional';
type SubDivisiFilter =
  | 'all'
  | 'acara'
  | 'korlap'
  | 'dokumentasi'
  | 'desain'
  | 'ekraf'
  | 'humas'
  | 'perlengkapan'
  | 'konsumsi';
type StatusFilter = 'all' | 'aktif' | 'demisioner' | 'pembina';

interface CadreMember {
  id: string;
  name: string;
  nim: string;
  role: string;
  divisiKey: Exclude<DivisiFilter, 'all'>;
  divisiBadge: string;
  subDivisiKeys?: Exclude<SubDivisiFilter, 'all'>[];
  statusKey: Exclude<StatusFilter, 'all'>;
  statusBadge: string;
  credentialText: string;
  cohortId: string;
  imageUrl: string;
  imageAlt: string;
  isLeader?: boolean;
  trackRecord: string;
}

interface CohortInfo {
  id: string;
  tabLabel: string;
  roman: string;
  name: string;
  yearLabel: string;
  leaderName: string;
  leaderNim: string;
  totalCount: number;
  periodLabel: string;
  motto: string;
  bannerBadge1: string;
  bannerBadge2: string;
  bannerTitle: string;
  bannerDesc: string;
  bannerImg: string;
  isActive?: boolean;
}

const COHORTS: Record<string, CohortInfo> = {
  XV: {
    id: 'XV',
    tabLabel: 'Angkatan XV (2026 - Aktif)',
    roman: 'XV',
    name: 'SATYA ADYATMA',
    yearLabel: '2026',
    leaderName: 'Venus Sangia Alfarizi',
    leaderNim: 'NIM. 2024102001',
    totalCount: 42,
    periodLabel: 'Periode 2026-2027',
    motto: '“Berani Berintegritas, Menolak Kompromi, Mengawal Keadilan Kampus.”',
    bannerBadge1: 'Dokumentasi Sah Angkatan XV',
    bannerBadge2: 'Road to KOPASUS 2026: Pembekalan Kader',
    bannerTitle: 'Momen Sumpah & Pelantikan Terpadu Kader XV',
    bannerDesc:
      'Sebanyak 42 kader resmi menerima panji integritas setelah menyelesaikan tahapan Diklat KOPASUS 2026 dengan bimbingan narasumber pakar hukum dan alumni senior.',
    bannerImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0oMxjmOPQznYC6VSTRSWNQgciFCFQ-0aWFlJzJ8w0duAUY_1SUtRtuLy9XOO_0XhCn003-8LcAiSNQhYAtxhKpH1ID1QDxfHVfrHFAadJ1M2saXc09eNa_10H4uv6Ix7hIvUy2LZ-HxjZzYYjcXeN1xicsPDfS0gDQkbLYM4i5rntM2KIYb-V7DxUSOdvItVTi8Z_t7tX7p5vymeG6zlfa69fpYAastgJI95GYjq2jGrdj6BXw1YtwtyGmaHbp7mYbPo',
    isActive: true,
  },
  XIV: {
    id: 'XIV',
    tabLabel: 'Angkatan XIV (2025)',
    roman: 'XIV',
    name: 'DHARMA CANDRA',
    yearLabel: '2025',
    leaderName: 'Raka Mahendra Putra',
    leaderNim: 'NIM. 2023101018',
    totalCount: 45,
    periodLabel: 'Periode 2025-2026',
    motto: '“Menjaga Marwah Akademik, Menegakkan Kebenaran Tanpa Pandang Bulu.”',
    bannerBadge1: 'Arsip Demisioner Angkatan XIV',
    bannerBadge2: 'KOPASUS XIV • Sukabumi 2025',
    bannerTitle: 'Pelantikan & Dedikasi Pengurus Angkatan XIV',
    bannerDesc:
      'Sebanyak 45 kader Dharma Candra sukses mengawal audit transparansi dana kemahasiswaan dan menyelenggarakan 12 titik SIMAK Goes To School.',
    bannerImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyXxo3xgHbcYXqKh-i6YMsdtVclkcLfthdWfAvaMuwsAAJCbmeIhzqSNP9MxavbYLalPZ9vuc2GOFRsI0V9viVcwj8nzv-O0j47p5E9W5kZLUKJt4I3E_4TshFqztrjtr6_MTk4gsLG0oV1LhAspxkQautBRNw5j_rIUgy8zjfZZxdoa884GLmoGjqFtabfmd8VPNnKNpBCrdClJPgoJuCO0fFdsuzTOb98_ksFAqHU0HOOH7CXjKAjw',
  },
  XIII: {
    id: 'XIII',
    tabLabel: 'Angkatan XIII (2024)',
    roman: 'XIII',
    name: 'WIRA NAYAKA',
    yearLabel: '2024',
    leaderName: 'Bagas Aditya Pratama',
    leaderNim: 'NIM. 2022104009',
    totalCount: 38,
    periodLabel: 'Periode 2024-2025',
    motto: '“Satu Hati, Satu Nyali, Lawan Korupsi Sejak Dini.”',
    bannerBadge1: 'Arsip Demisioner Angkatan XIII',
    bannerBadge2: 'KOPASUS XIII • Bogor 2024',
    bannerTitle: 'Jejak Pengabdian Kader Wira Nayaka XIII',
    bannerDesc:
      'Angkatan XIII mempelopori digitalisasi modul 9 Nilai Integritas KPK RI serta memperluas kolaborasi studi yurisprudensi bersama Mahkamah Agung.',
    bannerImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCydtxCn6tyTckfiKH5CQ-c593_uJFUOSf9Ti5ycD_l_CZ3mP80PfzsdlR5Z6o_Kdy8_aqUgovyjdBLjAeQiSVWzjY0_pKULoFJO-1ICBSajdH43pvpCig4lLroX_mXvdcX1O9R_cvvrVWVlhmpM19BLm9xYdcm-S88r3P42wracJ2khN2YutxI2w96UzEJYT9STkleS7diV_7st46N8D2owz4kxev5SFS8qnA98c7UmPE69s2hgKjSWA',
  },
  XII: {
    id: 'XII',
    tabLabel: 'Angkatan XII (2023)',
    roman: 'XII',
    name: 'KARTIKA PRAJA',
    yearLabel: '2023',
    leaderName: 'Nadia Kusuma Wardhani',
    leaderNim: 'NIM. 2021103044',
    totalCount: 40,
    periodLabel: 'Periode 2023-2024',
    motto: '“Setia Pada Nurani, Tegak Di Atas Integritas Bangsa.”',
    bannerBadge1: 'Arsip Alumni Senior Angkatan XII',
    bannerBadge2: 'KOPASUS XII • 2023',
    bannerTitle: 'Kiprah Kartika Praja Mengawal Transparansi Publik',
    bannerDesc:
      'Angkatan XII melahirkan 40 penyuluh antikorupsi muda tersertifikasi yang aktif mengedukasi pelajar SMA/SMK se-Jabodetabek.',
    bannerImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4C04lRy7Haz6Q4liwlqqaQXcjBpV1ZADkVEdvfsNkQl0kq8mDvYqqAR_wTTgznMGl3er5xCJLc2Q92K_jqFPayKNznYkWFjDrJvo-YTTVF2ncRYzADUDaQnkJXY0QFL5xvK_KxrE5YgDUswVO6IYwjPqWLWyXf-yK89gel3b8Nb0gpGbqZIvtGScsxWosjNsK7oH5cr_mt5M4s6QH8zcef3NtlubIZxd5J7WCKpuD5gZHZEXYcGoKDQ',
  },
  XI: {
    id: 'XI',
    tabLabel: 'Angkatan XI (2022)',
    roman: 'XI',
    name: 'SURYA INTEGRITAS',
    yearLabel: '2022',
    leaderName: 'Farhan Syahputra',
    leaderNim: 'NIM. 2020102012',
    totalCount: 36,
    periodLabel: 'Periode 2022-2023',
    motto: '“Suara Kejujuran Mahasiswa, Cahaya Perubahan Nusantara.”',
    bannerBadge1: 'Arsip Alumni Senior Angkatan XI',
    bannerBadge2: 'KOPASUS XI • 2022',
    bannerTitle: 'Kebangkitan Gerakan Pasca-Pandemi Angkatan XI',
    bannerDesc:
      'Menginisiasi forum diskusi publik antikorupsi hybrid lintas kampus nasional dan menerbitkan jurnal integritas mahasiswa.',
    bannerImg:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD0oMxjmOPQznYC6VSTRSWNQgciFCFQ-0aWFlJzJ8w0duAUY_1SUtRtuLy9XOO_0XhCn003-8LcAiSNQhYAtxhKpH1ID1QDxfHVfrHFAadJ1M2saXc09eNa_10H4uv6Ix7hIvUy2LZ-HxjZzYYjcXeN1xicsPDfS0gDQkbLYM4i5rntM2KIYb-V7DxUSOdvItVTi8Z_t7tX7p5vymeG6zlfa69fpYAastgJI95GYjq2jGrdj6BXw1YtwtyGmaHbp7mYbPo',
  },
};

const CADRE_MEMBERS: CadreMember[] = [
  {
    id: 'mem-1',
    name: 'Venus Sangia Alfarizi',
    nim: '2024102001',
    role: 'Ketua Umum SIMAK',
    divisiKey: 'bph',
    divisiBadge: 'BPH Inti',
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus KOPASUS Batch XIV • Dewan Etik',
    cohortId: 'XV',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCat5Llj3UklJ0tGkRG28Ngoy_tBtsL4kXdlxj35JSE2HAVlrX-kBogJu1K8iP18Mgw5rcFOXpmPkaGlEcNeqTKwZbmyTuOrZiHFAbE5E3awrzuZBUGRCqVCWUvmpL64o0-JI_OJ1fsFamarQNj938V3hS0OQEsW9fegp1q3niNz5na4vENhHcoXSkPS_veq0aKo--_ijO71kMqMtit10QiPGbKIR5WqZIYzXJ9bzIhd8xhr08Ha4foHw',
    imageAlt:
      'Potret formal Venus Sangia Alfarizi, seorang mahasiswa Indonesia berkulit sawo matang mengenakan jas almamater hitam SIMAK dengan pin garuda integritas',
    isLeader: true,
    trackRecord:
      'Mandataris Ketua Umum SIMAK Periode 2026. Lulusan terbaik Diklat KOPASUS Batch XIV, Delegasi TOT KPK RI 2024, dan Ketua Tim Perumus Pakta Integritas Mahasiswa Institut STIAMI.',
  },
  {
    id: 'mem-2',
    name: 'Fathan Hendrawan',
    nim: '2024102014',
    role: 'Wakil Ketua Umum 1',
    divisiKey: 'litbang',
    divisiBadge: 'Acara & Korlap',
    subDivisiKeys: ['acara', 'korlap'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl: '/pengurus/waketum-1.png',
    imageAlt:
      'Potret formal Fathan Hendrawan, pemuda berkemeja putih berdasi merah marun dengan jas almamater hitam SIMAK',
    trackRecord:
      'Wakil Ketua Umum 1 yang membawahi Divisi Acara dan Divisi Koordinator Lapangan (Korlap). Penanggung jawab kurikulum KOPASUS/PINSUS dan SIMAK Goes To School.',
  },
  {
    id: 'mem-3',
    name: 'Dwi Agus Hidayat',
    nim: '2024102035',
    role: 'Wakil Ketua Umum 2',
    divisiKey: 'kominfo',
    divisiBadge: 'KOMINTEK',
    subDivisiKeys: ['dokumentasi', 'desain'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl: '/pengurus/waketum-2.png',
    imageAlt:
      'Foto potret Dwi Agus Hidayat, mahasiswa berkemeja putih dengan lanyard merah dan jas almamater hitam SIMAK',
    trackRecord:
      'Wakil Ketua Umum 2 (KOMINTEK) yang membawahi Divisi Dokumentasi dan Divisi Desain. Memimpin digitalisasi Buku Induk Kader, arsip visual, dan media kreatif antikorupsi.',
  },
  {
    id: 'mem-4',
    name: 'Putri Rizki Amelia',
    nim: '2024102049',
    role: 'Wakil Ketua Umum 3',
    divisiKey: 'usaha',
    divisiBadge: 'Ekraf, Humas & Logistik',
    subDivisiKeys: ['ekraf', 'humas', 'perlengkapan', 'konsumsi'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQOjKfp7csX6zUDZROtFKt1sIPwcIqbCimKE68XSbdocjrbRZBzb30wmbhJzShzUchiOs5FGJoA0OnHlq58ge1EKaW8Oj_MCrIGJCmt0oHZ0CMj_v2FPYmM8OREU3Fq75lsZKrmdPr-c53Q9n7m6GbLViuI8pGeBpAiijtW-dR10AjOhsCo9cCbBIsYsJ71Hh86bdsqPJlIGpvfhmA6ivHFt35pem8vk4mbHWJhkypi_QErBsti7f2PA',
    imageAlt:
      'Foto potret mahasiswi Putri Rizki Amelia berkulit cerah berhijab hitam anggun, mengenakan seragam almamater resmi',
    trackRecord:
      'Wakil Ketua Umum 3 yang membawahi Divisi Ekonomi Kreatif, Divisi Humas, Divisi Perlengkapan, dan Divisi Konsumsi. Mengelola kemandirian finansial organisasi, jejaring kemitraan eksternal, serta kesiapan logistik kegiatan.',
  },
  {
    id: 'mem-6',
    name: 'Elvira Wati Ningsi',
    nim: '2024102063',
    role: 'Sekretaris Umum 1',
    divisiKey: 'bph',
    divisiBadge: 'Sekretariat',
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDO7fWu7C4-KpnDNFksTUpr7gBpOGjZOlouigRjUg1iSoy-gCVtVcSt_rDt2BGxM1sU5lpeCuhAGYva83g5Y-w_hMy9ngGECYcH3UtJIX2jzFbe6xM-5YNz_VBAxMGb8-uGwkAw4VnIhljf-llVtNRyDstd_YrqlYcrGwJMR4TFMUelywrgISEzOk_rCHIZf_agY-AjnJBDKooaEEe5VRNQonT_u94Mem0E2qlcFdGUJGal2d_O7JT4xw',
    imageAlt:
      'Foto potret Elvira Wati Ningsi, mahasiswi Indonesia mengenakan hijab rapi dan blazer almamater hitam',
    trackRecord:
      'Mengawasi tata kelola administrasi persuratan internal, penerbitan Surat Keputusan (SK) & Nomor Induk Anggota (NIA), serta pemutakhiran Buku Induk 15 Angkatan.',
  },
  {
    id: 'mem-8',
    name: 'Nabila Azzahra Putri',
    nim: '2024102068',
    role: 'Sekretaris Umum 2',
    divisiKey: 'bph',
    divisiBadge: 'Sekretariat',
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    imageAlt:
      'Potret Nabila Azzahra Putri, Sekretaris Umum 2 SIMAK',
    trackRecord:
      'Bertanggung jawab atas notulensi rapat BPH, pengarsipan dokumen E-Library, serta manajemen registrasi tamu undangan pada acara puncak HARLAH SIMAK.',
  },
  {
    id: 'mem-5',
    name: 'Rusni Ariantika',
    nim: '2024102051',
    role: 'Bendahara Umum',
    divisiKey: 'bph',
    divisiBadge: 'Keuangan',
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDQwUv8PU5OOKqHZzAD2HBuuAsuVk1coU0HnMhMp2CKOAoJ4IhFcVbD70NxdCvOUsOvPYztHaOMe3K14FBQ6_Ym52zRyB5B7uCueuEegUd30loEmVmfvPX2-5PBYZh1wUQIFME_wA3JGUx4wj3eb7zyFJLf_6R8DKJaay5N19lAptYRB5dToFn4hw6A91Xoae1xCJPaT_k0iCZmtVLieqhOV8hdEPHJx3Fnve3v_FxRo1dP75KMw1BOw',
    imageAlt:
      'Potret mahasiswi Rusni Ariantika, busana muslim almamater hitam SIMAK dengan senyum berwibawa',
    trackRecord:
      'Pelopor sistem Laporan Keuangan Terbuka SIMAK dengan standar audit nol selisih (zero-discrepancy) pada seluruh pendanaan kegiatan tahunan.',
  },
  // KOORDINATOR 8 DIVISI TEKNIS ANGKATAN XV
  {
    id: 'mem-xv-acara',
    name: 'Fikri Haikal Pratama',
    nim: '2024102081',
    role: 'Koordinator Divisi Acara',
    divisiKey: 'litbang',
    divisiBadge: 'Divisi Acara',
    subDivisiKeys: ['acara'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Fikri Haikal Pratama Koordinator Divisi Acara SIMAK',
    trackRecord:
      'Menyusun konsep acara, rundown menit-ke-menit Seminar Nasional HARLAH 29 Januari, serta modul simulasi persidangan pada Diklat KOPASUS.',
  },
  {
    id: 'mem-xv-korlap',
    name: 'Rizky Darmawan Saputra',
    nim: '2024102085',
    role: 'Koordinator Divisi Korlap',
    divisiKey: 'litbang',
    divisiBadge: 'Divisi Korlap',
    subDivisiKeys: ['korlap'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Rizky Darmawan Saputra Koordinator Divisi Korlap SIMAK',
    trackRecord:
      'Memimpin pengamanan jalannya acara, sterilisasi venue Auditorium Lt. 4, manajemen barisan peserta KOPASUS, dan pengendalian alur registrasi tamu.',
  },
  {
    id: 'mem-xv-dok',
    name: 'Zahra Aulia Rahma',
    nim: '2024102089',
    role: 'Koordinator Divisi Dokumentasi',
    divisiKey: 'kominfo',
    divisiBadge: 'Divisi Dokumentasi',
    subDivisiKeys: ['dokumentasi'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Zahra Aulia Rahma Koordinator Divisi Dokumentasi SIMAK',
    trackRecord:
      'Mengelola peliputan fotografi, videografi aftermovie HARLAH & KOPASUS, serta pengarsipan dokumentasi digital 15 angkatan SIMAK.',
  },
  {
    id: 'mem-xv-desain',
    name: 'Kevin Adi Nugroho',
    nim: '2024102092',
    role: 'Koordinator Divisi Desain',
    divisiKey: 'kominfo',
    divisiBadge: 'Divisi Desain',
    subDivisiKeys: ['desain'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Kevin Adi Nugroho Koordinator Divisi Desain SIMAK',
    trackRecord:
      'Merancang grafis kampanye edukasi antikorupsi, infografis kajian publik, tata letak sertifikat piagam integritas, serta dekorasi visual panggung HARLAH.',
  },
  {
    id: 'mem-xv-ekraf',
    name: 'Salsabila Maharani',
    nim: '2024102096',
    role: 'Koordinator Divisi Ekonomi Kreatif',
    divisiKey: 'usaha',
    divisiBadge: 'Divisi Ekraf',
    subDivisiKeys: ['ekraf'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Salsabila Maharani Koordinator Divisi Ekonomi Kreatif SIMAK',
    trackRecord:
      'Menggerakkan unit usaha merchandise resmi SIMAK (PDH, lanyard, totebag integritas) dan bazar kewirausahaan mahasiswa untuk menopang kas mandiri organisasi.',
  },
  {
    id: 'mem-xv-humas',
    name: 'Muhammad Farhan Akbar',
    nim: '2024102101',
    role: 'Koordinator Divisi Humas',
    divisiKey: 'usaha',
    divisiBadge: 'Divisi Humas',
    subDivisiKeys: ['humas'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Muhammad Farhan Akbar Koordinator Divisi Humas SIMAK',
    trackRecord:
      'Menjalin komunikasi protokoler dengan narasumber KPK RI, rektorat, BEM/UKM mitra, serta koordinasi sekolah sasaran SIMAK Goes To School.',
  },
  {
    id: 'mem-xv-perkap',
    name: 'Aldi Pratama Wijaya',
    nim: '2024102105',
    role: 'Koordinator Divisi Perlengkapan',
    divisiKey: 'usaha',
    divisiBadge: 'Divisi Perlengkapan',
    subDivisiKeys: ['perlengkapan'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Aldi Pratama Wijaya Koordinator Divisi Perlengkapan SIMAK',
    trackRecord:
      'Mengelola pengadaan atribut panggung, tata suara, proyektor, peminjaman ruangan kampus, serta pemeliharaan inventaris sekretariat SIMAK.',
  },
  {
    id: 'mem-xv-konsumsi',
    name: 'Annisa Fitriani',
    nim: '2024102109',
    role: 'Koordinator Divisi Konsumsi',
    divisiKey: 'usaha',
    divisiBadge: 'Divisi Konsumsi',
    subDivisiKeys: ['konsumsi'],
    statusKey: 'aktif',
    statusBadge: 'Aktif',
    credentialText: 'Lulus Diklat KOPASUS Batch XV',
    cohortId: 'XV',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Annisa Fitriani Koordinator Divisi Konsumsi SIMAK',
    trackRecord:
      'Mengatur perencanaan menu, higienitas distribusi logistik makanan/minuman peserta KOPASUS, tamu VIP HARLAH, serta paket buka puasa Ramadhan Integrity.',
  },
  // ANGKATAN XIV (2025 - DHARMA CANDRA)
  {
    id: 'mem-xiv-1',
    name: 'Raka Mahendra Putra',
    nim: '2023101018',
    role: 'Ketua Umum Demisioner XIV',
    divisiKey: 'bph',
    divisiBadge: 'BPH Inti',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XIII • PINSUS XIV',
    cohortId: 'XIV',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Raka Mahendra Putra Ketua Angkatan XIV',
    isLeader: true,
    trackRecord:
      'Memimpin Angkatan XIV Dharma Candra (2025-2026), menginisiasi audit keterbukaan dana kemahasiswaan dan memperluas jangkauan SIMAK Goes To School ke 12 SMA/SMK.',
  },
  {
    id: 'mem-xiv-2',
    name: 'Shafira Maharani, S.AP.',
    nim: '2023101042',
    role: 'Sekretaris Jenderal XIV',
    divisiKey: 'bph',
    divisiBadge: 'Sekretariat',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XIV • TOT KPK RI',
    cohortId: 'XIV',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Shafira Maharani Sekretaris Jenderal XIV',
    trackRecord:
      'Menyusun tata naskah dinas elektronik SIMAK dan memimpin tim perumus Modul Saku Antikorupsi Edisi 2025.',
  },
  {
    id: 'mem-xiv-3',
    name: 'Ilham Fajar Ramadhan',
    nim: '2023102088',
    role: 'Kepala Divisi Advokasi XIV',
    divisiKey: 'advokasi',
    divisiBadge: 'Riset & Advokasi',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XIV • Delegasi MA',
    cohortId: 'XIV',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Ilham Fajar Ramadhan Kadiv Advokasi XIV',
    trackRecord:
      'Koordinator Satgas Pencegahan Pungli Kampus periode 2025 dan pembicara mahasiswa pada diskusi publik integritas pemilu raya.',
  },
  {
    id: 'mem-xiv-4',
    name: 'Tiara Anindya Kusuma',
    nim: '2023103019',
    role: 'Kepala Divisi Litbang XIV',
    divisiKey: 'litbang',
    divisiBadge: 'Litbang',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XIV • Instruktur Muda',
    cohortId: 'XIV',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Tiara Anindya Kusuma Kadiv Litbang XIV',
    trackRecord:
      'Merancang metode simulasi studi kasus dilema etika pada Diklat Lapangan KOPASUS di Sukabumi.',
  },
  // ANGKATAN XIII (2024 - WIRA NAYAKA)
  {
    id: 'mem-xiii-1',
    name: 'Bagas Aditya Pratama, S.AP.',
    nim: '2022104009',
    role: 'Ketua Umum Demisioner XIII',
    divisiKey: 'bph',
    divisiBadge: 'BPH Inti',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XII • Dewan Pakar',
    cohortId: 'XIII',
    imageUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Bagas Aditya Pratama Ketua Angkatan XIII',
    isLeader: true,
    trackRecord:
      'Pelopor digitalisasi 9 Nilai Integritas KPK RI ke dalam kurikulum kaderisasi Wira Nayaka serta kolaborasi riset bersama Mahkamah Agung RI.',
  },
  {
    id: 'mem-xiii-2',
    name: 'Dinda Ayu Lestari, S.AB.',
    nim: '2022104055',
    role: 'Bendahara Umum XIII',
    divisiKey: 'bph',
    divisiBadge: 'Keuangan',
    statusKey: 'demisioner',
    statusBadge: 'Demisioner',
    credentialText: 'Lulus KOPASUS XIII • Auditor Internal',
    cohortId: 'XIII',
    imageUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Dinda Ayu Lestari Bendahara XIII',
    trackRecord:
      'Merintis format Buku Kas Umum (BKU) Terbuka yang menjadi standar baku audit nol-selisih SIMAK hingga saat ini.',
  },
  // ANGKATAN XII (2023 - KARTIKA PRAJA)
  {
    id: 'mem-xii-1',
    name: 'Nadia Kusuma Wardhani, S.AP.',
    nim: '2021103044',
    role: 'Ketua Umum Alumni XII',
    divisiKey: 'bph',
    divisiBadge: 'Dewan Alumni',
    statusKey: 'pembina',
    statusBadge: 'Alumni Senior',
    credentialText: 'Lulus KOPASUS XI • Penyuluh Muda KPK',
    cohortId: 'XII',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Nadia Kusuma Wardhani Ketua Angkatan XII',
    isLeader: true,
    trackRecord:
      'Melahirkan 40 penyuluh antikorupsi muda tersertifikasi pada periode 2023-2024 dan kini aktif sebagai mentor di Ikatan Alumni SIMAK.',
  },
  // ANGKATAN XI (2022 - SURYA INTEGRITAS)
  {
    id: 'mem-xi-1',
    name: 'Farhan Syahputra, S.AP.',
    nim: '2020102012',
    role: 'Ketua Umum Alumni XI',
    divisiKey: 'bph',
    divisiBadge: 'Dewan Pembina',
    statusKey: 'pembina',
    statusBadge: 'Alumni Senior',
    credentialText: 'Lulus KOPASUS X • Pendiri Jurnal SIMAK',
    cohortId: 'XI',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Potret Farhan Syahputra Ketua Angkatan XI',
    isLeader: true,
    trackRecord:
      'Menginisiasi kebangkitan gerakan antikorupsi mahasiswa pasca-pandemi dan mendirikan Jurnal Integritas Muda Institut STIAMI.',
  },
];

const FOUNDER_COHORTS = [
  { id: 'I', label: 'Angkatan I (2011) — Perintis Ariawan dkk.' },
  { id: 'II', label: 'Angkatan II (2012) — Garda Reformasi' },
  { id: 'V', label: 'Angkatan V (2015) — Trisula Integritas' },
  { id: 'VIII', label: 'Angkatan VIII (2018) — Lentera Keadilan' },
  { id: 'X', label: 'Angkatan X (2020) — Satu Dekade SIMAK' },
];

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ onNavigate }) => {
  const [selectedCohort, setSelectedCohort] = useState<string>('XV');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisiFilter, setDivisiFilter] = useState<DivisiFilter>('all');
  const [subDivisiFilter, setSubDivisiFilter] = useState<SubDivisiFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [founderMenuOpen, setFounderMenuOpen] = useState(false);
  const [selectedMemberModal, setSelectedMemberModal] = useState<CadreMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cadreList, setCadreList] = useState<CadreMember[]>(CADRE_MEMBERS);

  useEffect(() => {
    fetchCadreMembers()
      .then((members) => {
        if (members && members.length > 0) {
          const dbMapped: CadreMember[] = members.map((m) => ({
            id: m.id,
            name: m.name,
            nim: m.nim,
            role: m.subDivision || m.division,
            divisiKey: (m.division.toLowerCase() in ['bph', 'litbang', 'advokasi', 'kominfo', 'usaha', 'operasional']
              ? m.division.toLowerCase()
              : 'operasional') as any,
            divisiBadge: m.division,
            statusKey: (m.status.toLowerCase() in ['aktif', 'demisioner', 'pembina'] ? m.status.toLowerCase() : 'aktif') as any,
            statusBadge: m.status,
            credentialText: `Sertifikasi Integritas SIMAK • ${m.cohort}`,
            cohortId: m.cohort,
            imageUrl: m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            imageAlt: m.name,
            trackRecord: `Kader aktif SIMAK ${m.cohort} divisi ${m.division}.`,
          }));
          const combined = [...CADRE_MEMBERS];
          dbMapped.forEach((dbM) => {
            if (!combined.some((c) => c.nim === dbM.nim)) {
              combined.push(dbM);
            }
          });
          setCadreList(combined);
        }
      })
      .catch((err) => {
        console.warn('Gagal memuat direktori kader dari API, menggunakan data lokal:', err);
      });
  }, []);

  const currentCohort = COHORTS[selectedCohort] || COHORTS.XV;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const cohortMembers = cadreList.filter((m) => m.cohortId === selectedCohort);

  const filteredMembers = cadreList.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesCohort = q ? true : m.cohortId === selectedCohort;
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.nim.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.divisiBadge.toLowerCase().includes(q);
    const matchesDivisi = divisiFilter === 'all' || m.divisiKey === divisiFilter;
    const matchesSubDivisi =
      subDivisiFilter === 'all' || Boolean(m.subDivisiKeys?.includes(subDivisiFilter));
    const matchesStatus = statusFilter === 'all' || m.statusKey === statusFilter;
    return matchesCohort && matchesSearch && matchesDivisi && matchesSubDivisi && matchesStatus;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGsapPageAnimations(containerRef);

  useEffect(() => {
    animateFilterGrid(gridRef.current);
  }, [selectedCohort, divisiFilter, subDivisiFilter, statusFilter]);

  const go = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-transparent">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-tertiary-fixed-dim text-[22px]">
            verified
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

      {/* Micro Heritage Bar & Hero Header */}
      <section className="relative w-full bg-surface-container-lowest/80 py-space-xl overflow-hidden">
        {/* Subtle Megamendung/Parang Heritage Vector Watermark in Corner */}
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

        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-space-xs mb-space-md text-secondary font-label-md text-label-md">
            <button
              type="button"
              onClick={() => go('beranda')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Beranda
            </button>
            <span className="text-surface-dim">/</span>
            <span className="text-on-surface font-semibold">
              Direktori Anggota &amp; Arsip Angkatan
            </span>
          </nav>

          {/* Main Header Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end">
            <div data-gsap="hero-text" className="lg:col-span-8 flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-space-xs self-start px-3 py-1 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                Buku Induk Digital &amp; Silsilah Kaderisasi
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                Direktori Kader &amp; Buku Induk Angkatan SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary max-w-2xl leading-relaxed">
                Dokumentasi resmi silsilah kaderisasi SIMAK dari masa ke masa. Menampilkan profil kader aktif periode berjalan serta arsip historis para demisioner dan alumni perintis agar jejak perjuangan integritas tetap abadi.
              </p>
            </div>

            {/* Official Brand Emblem & Quick Stat Badge */}
            <div data-gsap="hero-media" className="lg:col-span-4 flex flex-col items-start lg:items-end gap-space-md">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-3">
                <img
                  alt="Logo Resmi SIMAK"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvexmtwUP0qTP00Wdr65Wp6X1A2ZsE4bb_wbLgFYnKvnQ-lqxSRaDMyQTsjCIBKwXkb-6J9yXTHM3f75hvquNduLemgDyit4Uyt3t6_a41tlhp0JhW0yQCyVpbuI1R4nexX3bHB3gojTQHn_RNM4pfwI7QfLwvNsENLTxDDpTRRkPuHISn5jgNuDLsbFtVKJmswzMZ0WjY5oeTJRkxsttj0Uwl6rZ-MLXVR0teih2vyOh7O70ODFPHe8a2Zgg69jkA97E"
                />
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-bold text-primary uppercase">
                    Otoritas Mahasiswa
                  </span>
                  <span className="font-label-md text-label-md text-secondary">
                    Anti Korupsi Terdaftar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Counter Metric Bar */}
          <div data-gsap="stagger-grid" className="mt-space-lg pt-space-md grid grid-cols-2 lg:grid-cols-4 gap-space-md bg-surface-container-low p-space-md rounded-xl shadow-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">history_edu</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="15"
                    className="font-headline-sm text-headline-sm font-extrabold text-on-surface tabular-nums"
                  >
                    15
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    Angkatan
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  2011 – 2026 Terdaftar
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="340"
                    data-suffix="+"
                    className="font-headline-sm text-headline-sm font-extrabold text-on-surface tabular-nums"
                  >
                    340+
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    Kader
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Terarsip Digital
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">verified</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="100"
                    data-suffix="%"
                    className="font-headline-sm text-headline-sm font-extrabold text-on-surface tabular-nums"
                  >
                    100%
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-tertiary">
                    Sah
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Verifikasi Dewan Etik
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">military_tech</span>
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    data-gsap-counter="15"
                    className="font-headline-sm text-headline-sm font-extrabold text-on-surface tabular-nums"
                  >
                    15
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    Tahun
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-secondary uppercase">
                  Dedikasi Integritas
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slim Sticky Cohort Selector Bar */}
      <section className="w-full bg-surface-container-low/95 py-2.5 sticky top-20 z-40 shadow-xs border-b border-outline-variant/30 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          {/* Cohort Pills Tabs */}
          <div className="flex items-center justify-between gap-space-md overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              {Object.values(COHORTS).map((cohort) => {
                const isSelected = selectedCohort === cohort.id;
                return (
                  <button
                    key={cohort.id}
                    type="button"
                    onClick={() => setSelectedCohort(cohort.id)}
                    className={
                      isSelected
                        ? 'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-xs transition-all hover:brightness-110 cursor-pointer whitespace-nowrap'
                        : 'inline-flex items-center px-3.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer whitespace-nowrap'
                    }
                  >
                    {cohort.isActive && (
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    )}
                    {cohort.tabLabel}
                  </button>
                );
              })}
            </div>

            {/* Dropdown for Founder Cohorts (2011 - 2021) */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFounderMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary font-label-md text-label-md font-semibold hover:text-primary transition-colors cursor-pointer whitespace-nowrap border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[17px]">folder_special</span>
                Lihat Angkatan Perintis (2011 – 2021)
                <span className="material-symbols-outlined text-[17px]">
                  {founderMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {founderMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface-container-lowest shadow-xl border border-outline-variant/40 p-2 z-50">
                  <div className="px-3 py-1.5 border-b border-outline-variant/30 mb-1">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      Arsip Angkatan Perintis (2011–2021)
                    </span>
                  </div>
                  {FOUNDER_COHORTS.map((fc) => (
                    <button
                      key={fc.id}
                      type="button"
                      onClick={() => {
                        setFounderMenuOpen(false);
                        triggerToast(`Membuka arsip digital ${fc.label}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      {fc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Angkatan Overview Banner (Cohort Showcase) */}
      <section className="w-full py-space-xl">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          <div data-gsap="section-header" className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12">
            {/* Photo Side */}
            <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[460px] bg-on-background flex flex-col justify-end p-space-lg overflow-hidden group">
              <img
                alt={`Dokumentasi Pelatihan dan Pembekalan Angkatan ${currentCohort.roman} SIMAK`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={currentCohort.bannerImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="relative z-10 flex flex-col gap-2 text-on-primary">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-primary font-label-sm text-label-sm uppercase font-bold tracking-wider text-on-primary">
                    {currentCohort.bannerBadge1}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur font-label-sm text-label-sm text-tertiary-fixed font-semibold">
                    {currentCohort.bannerBadge2}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-primary drop-shadow-sm">
                  {currentCohort.bannerTitle}
                </h3>
                <p className="font-body-md text-body-md text-surface-container-high max-w-xl">
                  {currentCohort.bannerDesc}
                </p>
              </div>
            </div>

            {/* Metadata & Credentials Panel */}
            <div className="lg:col-span-5 p-space-lg sm:p-space-xl flex flex-col justify-between bg-surface-container-lowest">
              <div className="flex flex-col gap-space-md">
                {/* Cohort Header */}
                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm font-bold text-primary uppercase tracking-widest">
                      Identitas Resmi Angkatan
                    </span>
                    <h2 className="font-headline-md text-headline-md font-extrabold text-on-surface">
                      {currentCohort.name}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-headline-sm font-black">
                    {currentCohort.roman}
                  </div>
                </div>

                {/* Cohort Detail Grid */}
                <div className="grid grid-cols-2 gap-space-md">
                  <div className="bg-surface-container-low p-3.5 rounded-lg">
                    <span className="font-label-sm text-label-sm text-secondary uppercase block mb-1">
                      Ketua Angkatan
                    </span>
                    <span className="font-body-md text-body-md font-bold text-on-surface block">
                      {currentCohort.leaderName}
                    </span>
                    <span className="font-label-sm text-label-sm text-primary">
                      {currentCohort.leaderNim}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-3.5 rounded-lg">
                    <span className="font-label-sm text-label-sm text-secondary uppercase block mb-1">
                      Kekuatan Kader
                    </span>
                    <span className="font-body-md text-body-md font-bold text-on-surface block">
                      {currentCohort.totalCount} Kader Aktif
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary">
                      {currentCohort.periodLabel}
                    </span>
                  </div>
                </div>

                {/* Sumpah / Motto Angkatan */}
                <div className="p-space-md bg-surface-container rounded-lg border-l-4 border-primary">
                  <div className="flex items-center gap-1.5 text-primary mb-1">
                    <span className="material-symbols-outlined text-[18px]">format_quote</span>
                    <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider">
                      Motto &amp; Sumpah Angkatan {currentCohort.roman}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface font-semibold">
                    {currentCohort.motto}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Yearbook and Structure */}
              <div className="flex flex-col sm:flex-row gap-space-sm mt-space-lg pt-space-md border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() =>
                    triggerToast(
                      `Mengunduh Buku Kenangan Digital Angkatan ${currentCohort.roman} - ${currentCohort.name}.pdf`
                    )
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg font-bold hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  Unduh Buku Kenangan (PDF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('beranda');
                    setTimeout(() => {
                      document
                        .getElementById('struktur-pengurus')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg font-semibold hover:bg-surface-container-highest transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">account_tree</span>
                  Bagan Struktur
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Directory Photo Cards Grid */}
      <section className="w-full py-space-xl bg-transparent">
        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin">
          {/* Section Title & Counter Display */}
          <div data-gsap="section-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Direktori Kader Angkatan {currentCohort.roman} ({currentCohort.yearLabel})
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Profil resmi BPH Inti, 3 Wakil Ketua Umum, dan Koordinator 8 Divisi Teknis SIMAK.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Menampilkan{' '}
              <strong>
                {filteredMembers.length} dari {currentCohort.totalCount}
              </strong>{' '}
              Anggota Utama
            </div>
          </div>

          {/* KARTU FILTER CEPAT BIDANG, PENCARIAN & 8 DIVISI SIMAK (TERPADU) */}
          <div className="mb-space-lg p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4">
            {/* Integrated Search & Status Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pb-3.5 border-b border-outline-variant/30">
              <div className="md:col-span-8 relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[19px]">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary border border-outline-variant/40"
                  placeholder="Cari nama kader, NIM, jabatan, atau divisi..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:col-span-4 relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer border border-outline-variant/40"
                >
                  <option value="all">Status: Semua Keanggotaan</option>
                  <option value="aktif">Kader Aktif (2026)</option>
                  <option value="demisioner">Demisioner / Purna Bakti</option>
                  <option value="pembina">Dewan Pembina / Alumni</option>
                </select>
                <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[19px]">
                  badge
                </span>
              </div>
            </div>

            {/* Row 1: Filter Bidang Utama (BPH Inti + 3 Bidang Wakil Ketua) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-label-sm text-[11px] uppercase tracking-wider font-extrabold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">account_tree</span>
                  Filter Cepat Bidang Kepengurusan (1-Klik)
                </span>
                {(divisiFilter !== 'all' || subDivisiFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDivisiFilter('all');
                      setSubDivisiFilter('all');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                    Reset Semua Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[
                  {
                    id: 'all' as DivisiFilter,
                    label: 'Semua Bidang',
                    sub: 'BPH & 8 Divisi',
                    icon: 'groups',
                    count: cohortMembers.length,
                  },
                  {
                    id: 'bph' as DivisiFilter,
                    label: 'BPH Inti',
                    sub: 'Ketum, 2 Sekum, Bendum',
                    icon: 'verified_user',
                    count: cohortMembers.filter((m) => m.divisiKey === 'bph').length,
                  },
                  {
                    id: 'litbang' as DivisiFilter,
                    label: 'Waketum 1',
                    sub: 'Acara & Korlap',
                    icon: 'event_note',
                    count: cohortMembers.filter((m) => m.divisiKey === 'litbang').length,
                  },
                  {
                    id: 'kominfo' as DivisiFilter,
                    label: 'Waketum 2',
                    sub: 'Dokumentasi & Desain',
                    icon: 'palette',
                    count: cohortMembers.filter((m) => m.divisiKey === 'kominfo').length,
                  },
                  {
                    id: 'usaha' as DivisiFilter,
                    label: 'Waketum 3',
                    sub: 'Ekraf, Humas & Logistik',
                    icon: 'storefront',
                    count: cohortMembers.filter((m) => m.divisiKey === 'usaha').length,
                  },
                ].map((card) => {
                  const isActive = divisiFilter === card.id && subDivisiFilter === 'all';
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        setDivisiFilter(card.id);
                        setSubDivisiFilter('all');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary shadow-md'
                          : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            isActive ? 'text-tertiary-fixed' : 'text-primary'
                          }`}
                        >
                          {card.icon}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-surface-container-high text-secondary'
                          }`}
                        >
                          {card.count} Kader
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-xs leading-tight">{card.label}</div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isActive ? 'text-on-primary/80' : 'text-secondary'
                          }`}
                        >
                          {card.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Pil Filter Spesifik 8 Divisi Teknis SIMAK */}
            {selectedCohort === 'XV' && (
              <div className="pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-secondary mr-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    tune
                  </span>
                  Pilih Langsung 8 Divisi:
                </span>
                {[
                  { id: 'all' as SubDivisiFilter, label: 'Semua 8 Divisi', icon: 'apps' },
                  { id: 'acara' as SubDivisiFilter, label: 'Divisi Acara', icon: 'event_note' },
                  {
                    id: 'korlap' as SubDivisiFilter,
                    label: 'Divisi Korlap',
                    icon: 'campaign',
                  },
                  {
                    id: 'dokumentasi' as SubDivisiFilter,
                    label: 'Divisi Dokumentasi',
                    icon: 'photo_camera',
                  },
                  { id: 'desain' as SubDivisiFilter, label: 'Divisi Desain', icon: 'palette' },
                  {
                    id: 'ekraf' as SubDivisiFilter,
                    label: 'Divisi Ekonomi Kreatif',
                    icon: 'storefront',
                  },
                  { id: 'humas' as SubDivisiFilter, label: 'Divisi Humas', icon: 'handshake' },
                  {
                    id: 'perlengkapan' as SubDivisiFilter,
                    label: 'Divisi Perlengkapan',
                    icon: 'inventory_2',
                  },
                  {
                    id: 'konsumsi' as SubDivisiFilter,
                    label: 'Divisi Konsumsi',
                    icon: 'restaurant',
                  },
                ].map((pill) => {
                  const activePill = subDivisiFilter === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => {
                        setSubDivisiFilter(pill.id);
                        if (pill.id !== 'all') {
                          setDivisiFilter('all');
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        activePill
                          ? 'bg-primary-container text-on-primary shadow-xs'
                          : 'bg-surface-container-lowest hover:bg-surface-container-high text-on-surface border border-outline-variant/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{pill.icon}</span>
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4-Column Directory Grid */}
          <div ref={gridRef} data-gsap="stagger-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="h-1.5 w-full bg-primary"></div>
                <div className="p-space-md flex flex-col items-center text-center">
                  {/* Profile Avatar with Integrity Pin Ring */}
                  <div
                    className={`relative w-28 h-28 rounded-full p-1 shadow-inner mb-space-sm ${
                      member.isLeader
                        ? 'bg-gradient-to-tr from-primary via-primary-container to-flame'
                        : 'bg-surface-container-high'
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover rounded-full"
                      alt={member.imageAlt}
                      referrerPolicy="no-referrer"
                      src={member.imageUrl}
                    />
                    {member.isLeader && (
                      <span
                        className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-[12px] shadow"
                        title="Ketua Umum"
                      >
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                      </span>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-label-sm text-[11px] font-bold">
                      {member.statusBadge}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-[11px] font-semibold">
                      {member.divisiBadge}
                    </span>
                  </div>

                  {/* Names & Credential */}
                  <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                    {member.name}
                  </h4>
                  <span className="font-mono text-xs text-secondary mt-0.5">
                    NIM: {member.nim}
                  </span>
                  <div className="mt-1.5 text-primary font-label-md text-label-md font-extrabold">
                    {member.role}
                  </div>
                  <p className="mt-2 text-secondary font-label-sm text-[11px] bg-surface-container-low px-2.5 py-1 rounded-lg w-full">
                    {member.credentialText}
                  </p>
                </div>

                <div className="p-space-sm bg-surface-container-low mt-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedMemberModal(member)}
                    className="w-full py-2 px-3 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Lihat Rekam Jejak
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More / Full List Action */}
          <div className="mt-space-lg flex justify-center">
            <button
              type="button"
              onClick={() => {
                setDivisiFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
                triggerToast(
                  `Menampilkan seluruh berkas terverifikasi Kader Angkatan ${currentCohort.roman}`
                );
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg font-bold transition-colors cursor-pointer"
            >
              <span>Tampilkan 34 Kader Angkatan {currentCohort.roman} Lainnya</span>
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
          </div>
        </div>
      </section>

      {/* Member Track Record Modal */}
      {selectedMemberModal && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedMemberModal(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary via-primary-container to-flame p-6 text-on-primary flex items-center gap-4 relative">
              <img
                src={selectedMemberModal.imageUrl}
                alt={selectedMemberModal.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-white/80 shrink-0"
              />
              <div>
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase font-bold">
                  {selectedMemberModal.divisiBadge} • {selectedMemberModal.statusBadge}
                </span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-white mt-1">
                  {selectedMemberModal.name}
                </h3>
                <p className="font-label-md text-label-md text-on-primary-container">
                  NIM: {selectedMemberModal.nim} • {selectedMemberModal.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMemberModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold mb-1">
                  Sertifikasi &amp; Kredensial Kader
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    verified
                  </span>
                  {selectedMemberModal.credentialText}
                </div>
              </div>
              <div>
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold mb-1">
                  Rekam Jejak &amp; Portofolio Pengabdian
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {selectedMemberModal.trackRecord}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                    Nomor Induk Anggota (NIA Buku Induk)
                  </div>
                  <div className="font-mono text-xs font-extrabold text-primary mt-0.5">
                    NIA-SIMAK/{selectedMemberModal.cohortId}/{selectedMemberModal.nim}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    triggerToast(
                      `Kode kredensial NIA-SIMAK/${selectedMemberModal.cohortId}/${selectedMemberModal.nim} berhasil disalin!`
                    )
                  }
                  className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Salin NIA</span>
                </button>
              </div>
              <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    shield
                  </span>
                  Terverifikasi Buku Induk SIMAK
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMemberModal(null)}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Tutup Profil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Showcase Fitur Arsip Angkatan Abadi (Perpetual Cohort Archiving System) */}
      <section className="w-full py-space-xl bg-surface-container-low/60 relative overflow-hidden">
        {/* Subtle Watermark Shield in Background */}
        <div className="absolute -left-12 -bottom-12 w-64 h-64 text-surface-container-high opacity-40 pointer-events-none">
          <span className="material-symbols-outlined text-[240px]">history_toggle_off</span>
        </div>

        <div className="max-w-[1280px] mx-auto px-margin-mobile sm:px-margin relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Explanation Info Card */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold uppercase self-start">
                <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                Arsip Abadi &amp; Hall of Fame
              </div>
              <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface leading-tight">
                Sistem Regenerasi &amp; Arsip Abadi SIMAK
              </h2>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                SIMAK menganut asas <em>‘Kader Boleh Purna, Jejak Pengabdian Abadi’</em>. Setiap regenerasi pada Musyawarah Besar (MUBES), seluruh data kader aktif akan ditransisikan secara otomatis ke lemari arsip digital tahunan.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    lock_clock
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">
                    <strong>Tidak Ada Data Terhapus:</strong> Rekam jejak diklat, piagam KOPASUS, dan jabatan historis tersimpan terenkripsi permanen.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                    verified_user
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">
                    <strong>Verifikasi Kredensial Publik:</strong> Alumni SIMAK dapat menggunakan tautan portofolio ini saat melamar kerja atau beasiswa integritas publik.
                  </p>
                </div>
              </div>
            </div>

            {/* Archiving Interactive Carousel / Mini Shelves Preview */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-lg text-label-lg font-bold text-on-surface uppercase tracking-wide">
                  Galeri Rak Angkatan Terdahulu
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-secondary">
                    Pilih angkatan untuk membuka arsip
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    arrow_forward
                  </span>
                </div>
              </div>

              <div data-gsap="stagger-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                {/* Archived Cohort XIV (2025) */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-32 rounded-lg overflow-hidden relative mb-space-sm bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        alt="Foto dokumentasi kelompok mahasiswa Angkatan XIV SIMAK"
                        referrerPolicy="no-referrer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyXxo3xgHbcYXqKh-i6YMsdtVclkcLfthdWfAvaMuwsAAJCbmeIhzqSNP9MxavbYLalPZ9vuc2GOFRsI0V9viVcwj8nzv-O0j47p5E9W5kZLUKJt4I3E_4TshFqztrjtr6_MTk4gsLG0oV1LhAspxkQautBRNw5j_rIUgy8zjfZZxdoa884GLmoGjqFtabfmd8VPNnKNpBCrdClJPgoJuCO0fFdsuzTOb98_ksFAqHU0HOOH7CXjKAjw"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded font-label-sm text-label-sm">
                        Tahun 2025
                      </span>
                    </div>
                    <div className="font-label-sm text-label-sm font-bold text-primary uppercase">
                      Angkatan XIV
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      DHARMA CANDRA
                    </h4>
                    <p className="font-body-md text-body-md text-secondary text-[13px] mt-1">
                      45 Kader • Demisioner
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('XIV');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="mt-space-md w-full py-1.5 px-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-secondary font-label-md text-label-md rounded font-semibold transition-colors text-center cursor-pointer"
                  >
                    Buka Arsip 2025
                  </button>
                </div>

                {/* Archived Cohort XIII (2024) */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-32 rounded-lg overflow-hidden relative mb-space-sm bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        alt="Dokumentasi pelantikan kader Angkatan XIII SIMAK tahun 2024"
                        referrerPolicy="no-referrer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCydtxCn6tyTckfiKH5CQ-c593_uJFUOSf9Ti5ycD_l_CZ3mP80PfzsdlR5Z6o_Kdy8_aqUgovyjdBLjAeQiSVWzjY0_pKULoFJO-1ICBSajdH43pvpCig4lLroX_mXvdcX1O9R_cvvrVWVlhmpM19BLm9xYdcm-S88r3P42wracJ2khN2YutxI2w96UzEJYT9STkleS7diV_7st46N8D2owz4kxev5SFS8qnA98c7UmPE69s2hgKjSWA"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded font-label-sm text-label-sm">
                        Tahun 2024
                      </span>
                    </div>
                    <div className="font-label-sm text-label-sm font-bold text-primary uppercase">
                      Angkatan XIII
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      WIRA NAYAKA
                    </h4>
                    <p className="font-body-md text-body-md text-secondary text-[13px] mt-1">
                      38 Kader • Demisioner
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('XIII');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="mt-space-md w-full py-1.5 px-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-secondary font-label-md text-label-md rounded font-semibold transition-colors text-center cursor-pointer"
                  >
                    Buka Arsip 2024
                  </button>
                </div>

                {/* Archived Cohort XII (2023) */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                  <div>
                    <div className="h-32 rounded-lg overflow-hidden relative mb-space-sm bg-surface-container-high">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        alt="Foto dokumentasi sejarah Kader Angkatan XII SIMAK tahun 2023"
                        referrerPolicy="no-referrer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4C04lRy7Haz6Q4liwlqqaQXcjBpV1ZADkVEdvfsNkQl0kq8mDvYqqAR_wTTgznMGl3er5xCJLc2Q92K_jqFPayKNznYkWFjDrJvo-YTTVF2ncRYzADUDaQnkJXY0QFL5xvK_KxrE5YgDUswVO6IYwjPqWLWyXf-yK89gel3b8Nb0gpGbqZIvtGScsxWosjNsK7oH5cr_mt5M4s6QH8zcef3NtlubIZxd5J7WCKpuD5gZHZEXYcGoKDQ"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white rounded font-label-sm text-label-sm">
                        Tahun 2023
                      </span>
                    </div>
                    <div className="font-label-sm text-label-sm font-bold text-primary uppercase">
                      Angkatan XII
                    </div>
                    <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      KARTIKA PRAJA
                    </h4>
                    <p className="font-body-md text-body-md text-secondary text-[13px] mt-1">
                      40 Kader • Alumni Senior
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCohort('XII');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="mt-space-md w-full py-1.5 px-2 bg-surface-container-low hover:bg-primary hover:text-on-primary text-secondary font-label-md text-label-md rounded font-semibold transition-colors text-center cursor-pointer"
                  >
                    Buka Arsip 2023
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
