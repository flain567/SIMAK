/**
 * programArchiveData.ts
 * Struktur data arsip dokumentasi kegiatan SIMAK lintas tahun dan lintas generasi kepengurusan.
 * Siap dikembangkan untuk kepengurusan tahun 2026, 2027, 2028, dan seterusnya.
 */

export interface ArchivePhoto {
  id: string;
  title: string;
  url: string;
  caption: string;
  tags?: string[];
  isHighlight?: boolean;
}

export interface DayArchive {
  dayNumber: number;
  dayLabel: string;
  title: string;
  date: string;
  description: string;
  photos: ArchivePhoto[];
}

export interface ProgramGenerationArchive {
  id: string;
  programId: 'kopasus' | 'pinsus' | 'tot' | 'ramadhan' | 'harlah' | 'gts';
  batchName: string;
  year: number;
  periodLabel: string;
  theme: string;
  location: string;
  participantCount: number;
  driveFullArchiveUrl?: string;
  days: DayArchive[];
}

export const KOPASUS_GENERATIONS: ProgramGenerationArchive[] = [
  {
    id: 'kopasus-16-2026',
    programId: 'kopasus',
    batchName: 'KOPASUS Batch XVI (2026)',
    year: 2026,
    periodLabel: 'Generasi 2026 • Mandataris Aktif',
    theme: 'Mencetak Kader Mahasiswa Berintegritas Tanpa Kompromi & Bebas KKN',
    location: 'Auditorium STIAMI & Pusat Diklat Cisarua, Bogor',
    participantCount: 42,
    driveFullArchiveUrl: 'https://drive.google.com',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 01',
        title: 'Pembekalan Moral, Wawasan Integritas & Screening Nilai',
        date: 'Hari Pertama',
        description: 'Pembukaan resmi oleh Dewan Pembina, sesi etika kepemimpinan mahasiswa antikorupsi, dan uji komitmen integritas calon kader.',
        photos: [
          {
            id: 'kop-16-d1-1',
            title: 'Upacara Pembukaan Diklat KOPASUS',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4fiUAm-dSgJbLAqfJ9GuwDdlhGOMSqiwMt0P7r24ZBqgSm7GVhezpX9l00auOfDahnZMbsrD2miwQzU2YOxBKAxIwKU2-v7NUT78wrTH42n2ouYDj8adMQXYp79uL0tMu9430hn-27d2AIaJgER7Y1xhkMt1sWrmnaFqClq7yHhpDJkehR4EtivAzveaN54iTFeB21SzmSGwTOFqH75IRi8KbrATDBwSX1AoJyLhnzs28wzcQW2m-pvnzFCFypWGe5wM',
            caption: 'Barisan peserta apel pembukaan Diklat KOPASUS bersama jajaran BPH dan Dewan Pembina.',
            isHighlight: true,
          },
          {
            id: 'kop-16-d1-2',
            title: 'Materi 9 Nilai Integritas KPK',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSdd1AR0-zoGoi9ksikfgcRah_guw9NuDGUdgxbbEL1ZbLaoPQT5VjtbfLe3avMM5eSZUvRvRPxXBD0eGVsvY3elNVN_Xzfd0KgtnAxULHSBlWR_6RtHxDVg2Z_NxV2HbFilIdQ6lmSZt9vnJeAHVrmplyPi6Fz2ErVblIGEpBtANAXP45PugSaBZQr20cci697zKabbKowSp9kp9Y-mFNs7gh4FBNbtcE7sC3XB9a',
            caption: 'Pemaparan materi bedah kasus gratifikasi dan suap di sektor publik bersama narasumber ahli.',
            isHighlight: false,
          },
        ],
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 02',
        title: 'Diklat Lapangan, Simulasi Investigasi & Malam Keakraban',
        date: 'Hari Kedua',
        description: 'Pelatihan ketahanan mental, kerja tim pemecahan investigasi kasus korupsi fiktif, serta refleksi api unggun integritas.',
        photos: [
          {
            id: 'kop-16-d2-1',
            title: 'Simulasi Investigasi Anggaran & Olah TKP',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRHiBrBGM7unygMJ09G4znGwjboEge7LxoDHZjMe2SkXuGFv1-KWc5DSJe8fCuJzs2IN0IOe1M3JsGNrCPFGkYnAg_qW5bwVNl6bKC6hVmFQhpLMsT5ZS3Wgu8uJmnVwkGMdfZItJQP7teumCNL_luvPgwhrIKGi0QkrLRYMDJ1EYqYQxuKEZIbK2IzhM2heCcmeBOOJCn3yU4ZgI_ixNc43TXabdPUEEwSSamJeyt',
            caption: 'Kader memecahkan teka-teki dokumen audit fiktif dalam pos pengujian investigasi lapangan.',
            isHighlight: true,
          },
        ],
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 03',
        title: 'Pengukuhan, Sumpah Kader & Pembagian Pakaian Dinas Harian (PDH)',
        date: 'Hari Ketiga',
        description: 'Puncak upacara sumpah integritas kader SIMAK, penyematan pin kehormatan, dan penerbitan Nomor Induk Anggota (NIA).',
        photos: [
          {
            id: 'kop-16-d3-1',
            title: 'Ikrar Sumpah Integritas Kader SIMAK',
            url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaLFp2EuNFVidMt_8M1VPVEGI6W8pBxGRNFAvsNnetAvxueljTz_LcWJ2ggdWAMoi4v6JMpDD9FV6MTdTqa8AqUjbtu7rIbmaiWIdOxxgJgLJ_fQ545tQvjWWksHtPcAprYVF9iuD0n6gKOVWPqkaMOWaBO8qS0bJqqrXq87AKRw-EwvwiV29Mf4Wgqda7rmrSk2KvxniknKuTlI6jpEjdvtJgYo6P5sbX4oshr8W0',
            caption: 'Pengukuhan resmi kader baru dengan penyematan atribut kebesaran organisasi SIMAK.',
            isHighlight: true,
          },
        ],
      },
    ],
  },
  {
    id: 'kopasus-15-2025',
    programId: 'kopasus',
    batchName: 'KOPASUS Batch XV (2025)',
    year: 2025,
    periodLabel: 'Generasi 2025 • Sukabumi',
    theme: 'Menjaga Api Moralitas dan Kedaulatan Integritas Mahasiswa',
    location: 'Villa Mandiri, Sukabumi',
    participantCount: 38,
    driveFullArchiveUrl: 'https://drive.google.com',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 01',
        title: 'Sesi Integritas & Pembagian Regu',
        date: 'Oktober 2025',
        description: 'Pembentukan regu komando dan pembacaan tata tertib kaderisasi.',
        photos: [],
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 02',
        title: 'Jurit Malam & Pembuktian Fakta',
        date: 'Oktober 2025',
        description: 'Latihan uji mental dan kejujuran di medan alam terbuka.',
        photos: [],
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 03',
        title: 'Pelantikan & Deklarasi Pakta Integritas',
        date: 'Oktober 2025',
        description: 'Pelantikan kader batch XV oleh BPH SIMAK Periode 2025.',
        photos: [],
      },
    ],
  },
  {
    id: 'kopasus-14-2024',
    programId: 'kopasus',
    batchName: 'KOPASUS Batch XIV (2024)',
    year: 2024,
    periodLabel: 'Generasi 2024 • Bogor',
    theme: 'Langkah Awal Gerakan Mahasiswa Anti Korupsi Berkelanjutan',
    location: 'Cibodas, Bogor',
    participantCount: 35,
    driveFullArchiveUrl: 'https://drive.google.com',
    days: [],
  },
];
