/**
 * programArchiveData.ts
 * Struktur data arsip dokumentasi kegiatan SIMAK lintas tahun dan lintas generasi kepengurusan.
 * Mengintegrasikan foto asli Day 1, Day 2, dan Day 3 KOPASUS Batch XVI.
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
  totalRawFilesCount?: number;
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
    totalRawFilesCount: 448,
    driveFullArchiveUrl: 'https://drive.google.com',
    days: [
      {
            "dayNumber": 1,
            "dayLabel": "Day 01",
            "title": "Pembekalan Wawasan, Screening Integritas & Apel Pembukaan",
            "date": "Oktober 2026",
            "description": "Hari pertama Diklat KOPASUS: apel pembukaan, penyampaian 9 Nilai Integritas KPK, dan tes komitmen moral calon kader.",
            "photos": [
                  {
                        "id": "kop16-day-1-1",
                        "title": "Day 01 \u2022 Dokumentasi #1",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261002-WA0028.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-2",
                        "title": "Day 01 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0175.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia dan Dewan Pembina.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-3",
                        "title": "Day 01 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0182.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-4",
                        "title": "Day 01 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0187.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-5",
                        "title": "Day 01 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0193.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-6",
                        "title": "Day 01 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0198.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-7",
                        "title": "Day 01 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0204.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-8",
                        "title": "Day 01 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0274.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-9",
                        "title": "Day 01 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0123.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-10",
                        "title": "Day 01 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0139.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-11",
                        "title": "Day 01 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0149.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-12",
                        "title": "Day 01 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0163.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-13",
                        "title": "Day 01 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0292.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-14",
                        "title": "Day 01 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0156.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia dan Dewan Pembina.",
                        "isHighlight": false
                  }
            ]
      },
      {
            "dayNumber": 2,
            "dayLabel": "Day 02",
            "title": "Diklat Lapangan, Simulasi Investigasi & Olah TKP",
            "date": "Oktober 2026",
            "description": "Hari kedua: penjelajahan alam terbuka, simulasi penelusuran audit anggaran fiktif, ketahanan fisik, dan refleksi api unggun.",
            "photos": [
                  {
                        "id": "kop16-day-2-1",
                        "title": "Day 02 \u2022 Dokumentasi #1",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0200.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-2",
                        "title": "Day 02 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0228.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-3",
                        "title": "Day 02 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0295.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-4",
                        "title": "Day 02 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0029.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-5",
                        "title": "Day 02 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0039.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-6",
                        "title": "Day 02 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0053.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-7",
                        "title": "Day 02 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0069.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-8",
                        "title": "Day 02 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0153.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-9",
                        "title": "Day 02 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0496.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-10",
                        "title": "Day 02 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0523.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-11",
                        "title": "Day 02 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0555.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-12",
                        "title": "Day 02 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0616.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-13",
                        "title": "Day 02 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0657.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-14",
                        "title": "Day 02 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0675.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran.",
                        "isHighlight": false
                  }
            ]
      },
      {
            "dayNumber": 3,
            "dayLabel": "Day 03",
            "title": "Sumpah Integritas, Pengukuhan Kader & Pembagian PDH",
            "date": "Oktober 2026",
            "description": "Puncak hari ketiga: upacara pembacaan sumpah kader SIMAK, penyematan panji kehormatan, pembagian PDH dan penerbitan NIA.",
            "photos": [
                  {
                        "id": "kop16-day-3-1",
                        "title": "Day 03 \u2022 Dokumentasi #1",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261004-WA0055.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-2",
                        "title": "Day 03 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0332.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-3",
                        "title": "Day 03 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0347.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-4",
                        "title": "Day 03 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0354.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-5",
                        "title": "Day 03 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0363.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-6",
                        "title": "Day 03 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0377.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-7",
                        "title": "Day 03 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0891.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-8",
                        "title": "Day 03 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0912.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-9",
                        "title": "Day 03 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0928.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan.",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-10",
                        "title": "Day 03 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0958.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-11",
                        "title": "Day 03 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0976.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-12",
                        "title": "Day 03 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0998.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-13",
                        "title": "Day 03 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1021.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK.",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-14",
                        "title": "Day 03 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1040.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS.",
                        "isHighlight": false
                  }
            ]
      }
]
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
        photos: []
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 02',
        title: 'Jurit Malam & Pembuktian Fakta',
        date: 'Oktober 2025',
        description: 'Latihan uji mental dan kejujuran di medan alam terbuka.',
        photos: []
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 03',
        title: 'Pelantikan & Deklarasi Pakta Integritas',
        date: 'Oktober 2025',
        description: 'Pelantikan kader batch XV oleh BPH SIMAK Periode 2025.',
        photos: []
      }
    ]
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
    days: []
  }
];
