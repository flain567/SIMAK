/**
 * programArchiveData.ts
 * Struktur data arsip dokumentasi kegiatan SIMAK lintas tahun dan lintas generasi kepengurusan.
 * Berisi SELURUH 306 foto asli Day 1, Day 2, dan Day 3 KOPASUS Batch XVI.
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
            "description": "Hari pertama Diklat KOPASUS: apel pembukaan, penyampaian 9 Nilai Integritas KPK, tes komitmen moral calon kader, dan pembagian regu.",
            "photos": [
                  {
                        "id": "kop16-day-1-1",
                        "title": "Day 01 \u2022 Dokumentasi #1",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261002-WA0028.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261002-WA0028.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-2",
                        "title": "Day 01 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261002-WA0045.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261002-WA0045.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-3",
                        "title": "Day 01 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261002-WA0047.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261002-WA0047.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-4",
                        "title": "Day 01 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0173.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261004-WA0173.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-5",
                        "title": "Day 01 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0174.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261004-WA0174.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-6",
                        "title": "Day 01 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0175.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261004-WA0175.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-7",
                        "title": "Day 01 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0176.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261004-WA0176.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-8",
                        "title": "Day 01 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0179.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261004-WA0179.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-9",
                        "title": "Day 01 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0180.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261004-WA0180.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-10",
                        "title": "Day 01 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0181.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261004-WA0181.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-11",
                        "title": "Day 01 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0182.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261004-WA0182.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-12",
                        "title": "Day 01 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0183.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261004-WA0183.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-13",
                        "title": "Day 01 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0184.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261004-WA0184.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-14",
                        "title": "Day 01 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0185.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261004-WA0185.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-15",
                        "title": "Day 01 \u2022 Dokumentasi #15",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0186.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261004-WA0186.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-16",
                        "title": "Day 01 \u2022 Dokumentasi #16",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0187.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261004-WA0187.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-17",
                        "title": "Day 01 \u2022 Dokumentasi #17",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0188.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261004-WA0188.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-18",
                        "title": "Day 01 \u2022 Dokumentasi #18",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0189.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261004-WA0189.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-19",
                        "title": "Day 01 \u2022 Dokumentasi #19",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0190.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261004-WA0190.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-20",
                        "title": "Day 01 \u2022 Dokumentasi #20",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0191.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261004-WA0191.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-21",
                        "title": "Day 01 \u2022 Dokumentasi #21",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0193.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261004-WA0193.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-22",
                        "title": "Day 01 \u2022 Dokumentasi #22",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0194.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261004-WA0194.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-23",
                        "title": "Day 01 \u2022 Dokumentasi #23",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0195.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261004-WA0195.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-24",
                        "title": "Day 01 \u2022 Dokumentasi #24",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0196.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261004-WA0196.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-25",
                        "title": "Day 01 \u2022 Dokumentasi #25",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0197.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261004-WA0197.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-26",
                        "title": "Day 01 \u2022 Dokumentasi #26",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0198.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261004-WA0198.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-27",
                        "title": "Day 01 \u2022 Dokumentasi #27",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0199.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261004-WA0199.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-28",
                        "title": "Day 01 \u2022 Dokumentasi #28",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0200.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261004-WA0200.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-29",
                        "title": "Day 01 \u2022 Dokumentasi #29",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0201.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261004-WA0201.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-30",
                        "title": "Day 01 \u2022 Dokumentasi #30",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0202.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261004-WA0202.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-31",
                        "title": "Day 01 \u2022 Dokumentasi #31",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0204.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261004-WA0204.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-32",
                        "title": "Day 01 \u2022 Dokumentasi #32",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0213.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261004-WA0213.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-33",
                        "title": "Day 01 \u2022 Dokumentasi #33",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0254.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261004-WA0254.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-34",
                        "title": "Day 01 \u2022 Dokumentasi #34",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0261.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261004-WA0261.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-35",
                        "title": "Day 01 \u2022 Dokumentasi #35",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0268.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261004-WA0268.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-36",
                        "title": "Day 01 \u2022 Dokumentasi #36",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0274.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261004-WA0274.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-37",
                        "title": "Day 01 \u2022 Dokumentasi #37",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0279.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261004-WA0279.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-38",
                        "title": "Day 01 \u2022 Dokumentasi #38",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261004-WA0282.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261004-WA0282.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-39",
                        "title": "Day 01 \u2022 Dokumentasi #39",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0056.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261005-WA0056.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-40",
                        "title": "Day 01 \u2022 Dokumentasi #40",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0121.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261005-WA0121.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-41",
                        "title": "Day 01 \u2022 Dokumentasi #41",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0123.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261005-WA0123.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-42",
                        "title": "Day 01 \u2022 Dokumentasi #42",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0125.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261005-WA0125.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-43",
                        "title": "Day 01 \u2022 Dokumentasi #43",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0127.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261005-WA0127.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-44",
                        "title": "Day 01 \u2022 Dokumentasi #44",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0129.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261005-WA0129.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-45",
                        "title": "Day 01 \u2022 Dokumentasi #45",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0137.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261005-WA0137.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-46",
                        "title": "Day 01 \u2022 Dokumentasi #46",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0139.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261005-WA0139.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-47",
                        "title": "Day 01 \u2022 Dokumentasi #47",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0141.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261005-WA0141.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-48",
                        "title": "Day 01 \u2022 Dokumentasi #48",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0143.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261005-WA0143.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-49",
                        "title": "Day 01 \u2022 Dokumentasi #49",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0145.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261005-WA0145.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-50",
                        "title": "Day 01 \u2022 Dokumentasi #50",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0147.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261005-WA0147.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-51",
                        "title": "Day 01 \u2022 Dokumentasi #51",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0149.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261005-WA0149.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-52",
                        "title": "Day 01 \u2022 Dokumentasi #52",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0153.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261005-WA0153.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-53",
                        "title": "Day 01 \u2022 Dokumentasi #53",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0155.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261005-WA0155.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-54",
                        "title": "Day 01 \u2022 Dokumentasi #54",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0159.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261005-WA0159.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-55",
                        "title": "Day 01 \u2022 Dokumentasi #55",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0161.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261005-WA0161.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-56",
                        "title": "Day 01 \u2022 Dokumentasi #56",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0163.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261005-WA0163.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-57",
                        "title": "Day 01 \u2022 Dokumentasi #57",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0165.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261005-WA0165.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-58",
                        "title": "Day 01 \u2022 Dokumentasi #58",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0271.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261005-WA0271.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-59",
                        "title": "Day 01 \u2022 Dokumentasi #59",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0272.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261005-WA0272.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-60",
                        "title": "Day 01 \u2022 Dokumentasi #60",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0289.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261005-WA0289.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-61",
                        "title": "Day 01 \u2022 Dokumentasi #61",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0292.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261005-WA0292.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-62",
                        "title": "Day 01 \u2022 Dokumentasi #62",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0294.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261005-WA0294.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-63",
                        "title": "Day 01 \u2022 Dokumentasi #63",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0300.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261005-WA0300.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-64",
                        "title": "Day 01 \u2022 Dokumentasi #64",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261005-WA0302.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261005-WA0302.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-65",
                        "title": "Day 01 \u2022 Dokumentasi #65",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0152.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261006-WA0152.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-66",
                        "title": "Day 01 \u2022 Dokumentasi #66",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0156.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261006-WA0156.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-67",
                        "title": "Day 01 \u2022 Dokumentasi #67",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0158.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261006-WA0158.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-68",
                        "title": "Day 01 \u2022 Dokumentasi #68",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0160.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261006-WA0160.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-69",
                        "title": "Day 01 \u2022 Dokumentasi #69",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0164.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261006-WA0164.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-70",
                        "title": "Day 01 \u2022 Dokumentasi #70",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0168.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261006-WA0168.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-71",
                        "title": "Day 01 \u2022 Dokumentasi #71",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0170.jpg",
                        "caption": "Foto dokumentasi regu calon kader Day 01. (IMG-20261006-WA0170.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-72",
                        "title": "Day 01 \u2022 Dokumentasi #72",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0178.jpg",
                        "caption": "Sesi konsolidasi internal pengurus panitia pelaksana. (IMG-20261006-WA0178.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-73",
                        "title": "Day 01 \u2022 Dokumentasi #73",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0183.jpg",
                        "caption": "Apel barisan pembukaan Diklat KOPASUS Batch XVI. (IMG-20261006-WA0183.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-74",
                        "title": "Day 01 \u2022 Dokumentasi #74",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0186.jpg",
                        "caption": "Pemberian pengarahan disiplin oleh panitia pelaksana. (IMG-20261006-WA0186.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-75",
                        "title": "Day 01 \u2022 Dokumentasi #75",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0211.jpg",
                        "caption": "Sesi pemaparan materi 9 Nilai Integritas Antikorupsi KPK. (IMG-20261006-WA0211.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-76",
                        "title": "Day 01 \u2022 Dokumentasi #76",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0232.jpg",
                        "caption": "Calon kader menyimak pemaparan sejarah perjuangan SIMAK. (IMG-20261006-WA0232.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-77",
                        "title": "Day 01 \u2022 Dokumentasi #77",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0241.jpg",
                        "caption": "Uji komitmen moral dan screening integritas calon kader. (IMG-20261006-WA0241.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-78",
                        "title": "Day 01 \u2022 Dokumentasi #78",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0244.jpg",
                        "caption": "Diskusi kelompok perumusan pakta integritas mahasiswa. (IMG-20261006-WA0244.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-79",
                        "title": "Day 01 \u2022 Dokumentasi #79",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0249.jpg",
                        "caption": "Ice breaking dan pembentukan solidaritas regu komando. (IMG-20261006-WA0249.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-80",
                        "title": "Day 01 \u2022 Dokumentasi #80",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0251.jpg",
                        "caption": "Pemberian tanda peserta dan buku panduan diklat dasar. (IMG-20261006-WA0251.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-1-81",
                        "title": "Day 01 \u2022 Dokumentasi #81",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0291.jpg",
                        "caption": "Sesi tanya jawab interaktif seputar delik korupsi kampus. (IMG-20261006-WA0291.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-1-82",
                        "title": "Day 01 \u2022 Dokumentasi #82",
                        "url": "/archives/kopasus/2026-batch-16/day-1/IMG-20261006-WA0293.jpg",
                        "caption": "Apel penutupan rangkaian agenda pembekalan Day 01. (IMG-20261006-WA0293.jpg)",
                        "isHighlight": false
                  }
            ]
      },
      {
            "dayNumber": 2,
            "dayLabel": "Day 02",
            "title": "Diklat Lapangan, Simulasi Investigasi & Olah TKP",
            "date": "Oktober 2026",
            "description": "Hari kedua: penjelajahan alam terbuka, simulasi penelusuran audit anggaran fiktif, ketahanan fisik, dan refleksi api unggun integritas.",
            "photos": [
                  {
                        "id": "kop16-day-2-1",
                        "title": "Day 02 \u2022 Dokumentasi #1",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0200.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261005-WA0200.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-2",
                        "title": "Day 02 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0207.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261005-WA0207.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-3",
                        "title": "Day 02 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0210.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261005-WA0210.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-4",
                        "title": "Day 02 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0217.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261005-WA0217.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-5",
                        "title": "Day 02 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0219.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261005-WA0219.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-6",
                        "title": "Day 02 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0223.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261005-WA0223.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-7",
                        "title": "Day 02 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0224.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261005-WA0224.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-8",
                        "title": "Day 02 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0225.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261005-WA0225.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-9",
                        "title": "Day 02 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0226.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261005-WA0226.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-10",
                        "title": "Day 02 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0228.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261005-WA0228.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-11",
                        "title": "Day 02 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0231.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261005-WA0231.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-12",
                        "title": "Day 02 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0232.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261005-WA0232.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-13",
                        "title": "Day 02 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0259.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261005-WA0259.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-14",
                        "title": "Day 02 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0261.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261005-WA0261.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-15",
                        "title": "Day 02 \u2022 Dokumentasi #15",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0279.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261005-WA0279.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-16",
                        "title": "Day 02 \u2022 Dokumentasi #16",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0288.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261005-WA0288.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-17",
                        "title": "Day 02 \u2022 Dokumentasi #17",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0291.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261005-WA0291.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-18",
                        "title": "Day 02 \u2022 Dokumentasi #18",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0293.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261005-WA0293.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-19",
                        "title": "Day 02 \u2022 Dokumentasi #19",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0295.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261005-WA0295.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-20",
                        "title": "Day 02 \u2022 Dokumentasi #20",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0313.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261005-WA0313.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-21",
                        "title": "Day 02 \u2022 Dokumentasi #21",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0315.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261005-WA0315.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-22",
                        "title": "Day 02 \u2022 Dokumentasi #22",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0324.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261005-WA0324.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-23",
                        "title": "Day 02 \u2022 Dokumentasi #23",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0328.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261005-WA0328.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-24",
                        "title": "Day 02 \u2022 Dokumentasi #24",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0329.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261005-WA0329.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-25",
                        "title": "Day 02 \u2022 Dokumentasi #25",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0330.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261005-WA0330.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-26",
                        "title": "Day 02 \u2022 Dokumentasi #26",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261005-WA0331.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261005-WA0331.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-27",
                        "title": "Day 02 \u2022 Dokumentasi #27",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0028.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0028.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-28",
                        "title": "Day 02 \u2022 Dokumentasi #28",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0029.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0029.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-29",
                        "title": "Day 02 \u2022 Dokumentasi #29",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0030.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0030.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-30",
                        "title": "Day 02 \u2022 Dokumentasi #30",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0031.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0031.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-31",
                        "title": "Day 02 \u2022 Dokumentasi #31",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0032.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0032.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-32",
                        "title": "Day 02 \u2022 Dokumentasi #32",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0033.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0033.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-33",
                        "title": "Day 02 \u2022 Dokumentasi #33",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0034.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0034.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-34",
                        "title": "Day 02 \u2022 Dokumentasi #34",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0035.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0035.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-35",
                        "title": "Day 02 \u2022 Dokumentasi #35",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0036.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0036.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-36",
                        "title": "Day 02 \u2022 Dokumentasi #36",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0037.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0037.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-37",
                        "title": "Day 02 \u2022 Dokumentasi #37",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0039.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0039.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-38",
                        "title": "Day 02 \u2022 Dokumentasi #38",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0041.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0041.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-39",
                        "title": "Day 02 \u2022 Dokumentasi #39",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0044.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0044.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-40",
                        "title": "Day 02 \u2022 Dokumentasi #40",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0045.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0045.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-41",
                        "title": "Day 02 \u2022 Dokumentasi #41",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0046.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0046.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-42",
                        "title": "Day 02 \u2022 Dokumentasi #42",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0047.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0047.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-43",
                        "title": "Day 02 \u2022 Dokumentasi #43",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0048.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0048.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-44",
                        "title": "Day 02 \u2022 Dokumentasi #44",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0050.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0050.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-45",
                        "title": "Day 02 \u2022 Dokumentasi #45",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0052.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0052.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-46",
                        "title": "Day 02 \u2022 Dokumentasi #46",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0053.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0053.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-47",
                        "title": "Day 02 \u2022 Dokumentasi #47",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0054.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0054.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-48",
                        "title": "Day 02 \u2022 Dokumentasi #48",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0061.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0061.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-49",
                        "title": "Day 02 \u2022 Dokumentasi #49",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0062.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0062.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-50",
                        "title": "Day 02 \u2022 Dokumentasi #50",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0063.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0063.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-51",
                        "title": "Day 02 \u2022 Dokumentasi #51",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0064.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0064.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-52",
                        "title": "Day 02 \u2022 Dokumentasi #52",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0065.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0065.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-53",
                        "title": "Day 02 \u2022 Dokumentasi #53",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0066.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0066.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-54",
                        "title": "Day 02 \u2022 Dokumentasi #54",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0067.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0067.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-55",
                        "title": "Day 02 \u2022 Dokumentasi #55",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0069.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0069.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-56",
                        "title": "Day 02 \u2022 Dokumentasi #56",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0139.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0139.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-57",
                        "title": "Day 02 \u2022 Dokumentasi #57",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0142.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0142.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-58",
                        "title": "Day 02 \u2022 Dokumentasi #58",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0143.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0143.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-59",
                        "title": "Day 02 \u2022 Dokumentasi #59",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0144.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0144.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-60",
                        "title": "Day 02 \u2022 Dokumentasi #60",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0145.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0145.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-61",
                        "title": "Day 02 \u2022 Dokumentasi #61",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0146.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0146.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-62",
                        "title": "Day 02 \u2022 Dokumentasi #62",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0147.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0147.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-63",
                        "title": "Day 02 \u2022 Dokumentasi #63",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0148.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0148.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-64",
                        "title": "Day 02 \u2022 Dokumentasi #64",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0153.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0153.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-65",
                        "title": "Day 02 \u2022 Dokumentasi #65",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0155.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0155.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-66",
                        "title": "Day 02 \u2022 Dokumentasi #66",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0487.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0487.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-67",
                        "title": "Day 02 \u2022 Dokumentasi #67",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0488.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0488.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-68",
                        "title": "Day 02 \u2022 Dokumentasi #68",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0489.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0489.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-69",
                        "title": "Day 02 \u2022 Dokumentasi #69",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0491.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0491.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-70",
                        "title": "Day 02 \u2022 Dokumentasi #70",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0492.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0492.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-71",
                        "title": "Day 02 \u2022 Dokumentasi #71",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0493.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0493.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-72",
                        "title": "Day 02 \u2022 Dokumentasi #72",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0495.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0495.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-73",
                        "title": "Day 02 \u2022 Dokumentasi #73",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0496.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0496.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-74",
                        "title": "Day 02 \u2022 Dokumentasi #74",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0500.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0500.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-75",
                        "title": "Day 02 \u2022 Dokumentasi #75",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0508.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0508.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-76",
                        "title": "Day 02 \u2022 Dokumentasi #76",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0509.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0509.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-77",
                        "title": "Day 02 \u2022 Dokumentasi #77",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0511.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0511.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-78",
                        "title": "Day 02 \u2022 Dokumentasi #78",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0513.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0513.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-79",
                        "title": "Day 02 \u2022 Dokumentasi #79",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0517.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0517.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-80",
                        "title": "Day 02 \u2022 Dokumentasi #80",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0519.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0519.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-81",
                        "title": "Day 02 \u2022 Dokumentasi #81",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0521.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0521.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-82",
                        "title": "Day 02 \u2022 Dokumentasi #82",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0523.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0523.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-83",
                        "title": "Day 02 \u2022 Dokumentasi #83",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0527.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0527.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-84",
                        "title": "Day 02 \u2022 Dokumentasi #84",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0530.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0530.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-85",
                        "title": "Day 02 \u2022 Dokumentasi #85",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0532.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0532.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-86",
                        "title": "Day 02 \u2022 Dokumentasi #86",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0533.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0533.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-87",
                        "title": "Day 02 \u2022 Dokumentasi #87",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0536.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0536.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-88",
                        "title": "Day 02 \u2022 Dokumentasi #88",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0537.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0537.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-89",
                        "title": "Day 02 \u2022 Dokumentasi #89",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0542.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0542.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-90",
                        "title": "Day 02 \u2022 Dokumentasi #90",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0550.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0550.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-91",
                        "title": "Day 02 \u2022 Dokumentasi #91",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0555.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0555.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-92",
                        "title": "Day 02 \u2022 Dokumentasi #92",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0556.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0556.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-93",
                        "title": "Day 02 \u2022 Dokumentasi #93",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0557.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0557.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-94",
                        "title": "Day 02 \u2022 Dokumentasi #94",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0565.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0565.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-95",
                        "title": "Day 02 \u2022 Dokumentasi #95",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0582.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0582.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-96",
                        "title": "Day 02 \u2022 Dokumentasi #96",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0585.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0585.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-97",
                        "title": "Day 02 \u2022 Dokumentasi #97",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0592.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0592.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-98",
                        "title": "Day 02 \u2022 Dokumentasi #98",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0609.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0609.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-99",
                        "title": "Day 02 \u2022 Dokumentasi #99",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0614.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0614.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-100",
                        "title": "Day 02 \u2022 Dokumentasi #100",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0616.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0616.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-101",
                        "title": "Day 02 \u2022 Dokumentasi #101",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0638.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0638.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-102",
                        "title": "Day 02 \u2022 Dokumentasi #102",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0640.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0640.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-103",
                        "title": "Day 02 \u2022 Dokumentasi #103",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0643.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0643.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-104",
                        "title": "Day 02 \u2022 Dokumentasi #104",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0647.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0647.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-105",
                        "title": "Day 02 \u2022 Dokumentasi #105",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0651.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0651.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-106",
                        "title": "Day 02 \u2022 Dokumentasi #106",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0652.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0652.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-107",
                        "title": "Day 02 \u2022 Dokumentasi #107",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0655.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0655.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-108",
                        "title": "Day 02 \u2022 Dokumentasi #108",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0656.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0656.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-109",
                        "title": "Day 02 \u2022 Dokumentasi #109",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0657.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0657.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-110",
                        "title": "Day 02 \u2022 Dokumentasi #110",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0659.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0659.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-111",
                        "title": "Day 02 \u2022 Dokumentasi #111",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0660.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0660.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-112",
                        "title": "Day 02 \u2022 Dokumentasi #112",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0663.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0663.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-113",
                        "title": "Day 02 \u2022 Dokumentasi #113",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0665.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0665.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-114",
                        "title": "Day 02 \u2022 Dokumentasi #114",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0666.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0666.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-115",
                        "title": "Day 02 \u2022 Dokumentasi #115",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0668.jpg",
                        "caption": "Momen kebersamaan santap siang beralaskan daun pisang. (IMG-20261006-WA0668.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-116",
                        "title": "Day 02 \u2022 Dokumentasi #116",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0670.jpg",
                        "caption": "Evaluasi taktis bersama instruktur lapangan senior. (IMG-20261006-WA0670.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-117",
                        "title": "Day 02 \u2022 Dokumentasi #117",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0674.jpg",
                        "caption": "Upacara penyalaan api unggun integritas di tengah malam. (IMG-20261006-WA0674.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-118",
                        "title": "Day 02 \u2022 Dokumentasi #118",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0675.jpg",
                        "caption": "Refleksi moral dan perenungan komitmen perjuangan mahasiswa. (IMG-20261006-WA0675.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-119",
                        "title": "Day 02 \u2022 Dokumentasi #119",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0677.jpg",
                        "caption": "Renungan suci penguatan tekad gerakan antikorupsi. (IMG-20261006-WA0677.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-120",
                        "title": "Day 02 \u2022 Dokumentasi #120",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0678.jpg",
                        "caption": "Foto regu di posko lapangan diklat alam terbuka. (IMG-20261006-WA0678.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-121",
                        "title": "Day 02 \u2022 Dokumentasi #121",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0680.jpg",
                        "caption": "Apel pagi persiapan penjelajahan medan alam terbuka. (IMG-20261006-WA0680.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-2-122",
                        "title": "Day 02 \u2022 Dokumentasi #122",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0683.jpg",
                        "caption": "Simulasi penelusuran pos investigasi audit anggaran. (IMG-20261006-WA0683.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-123",
                        "title": "Day 02 \u2022 Dokumentasi #123",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0685.jpg",
                        "caption": "Kerja sama regu memecahkan teka-teki dokumen tipikor fiktif. (IMG-20261006-WA0685.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-124",
                        "title": "Day 02 \u2022 Dokumentasi #124",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0687.jpg",
                        "caption": "Latihan ketahanan fisik dan kedisiplinan mental lapangan. (IMG-20261006-WA0687.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-125",
                        "title": "Day 02 \u2022 Dokumentasi #125",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0688.jpg",
                        "caption": "Pemeriksaan barang bukti dalam pos olah TKP kasus integritas. (IMG-20261006-WA0688.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-2-126",
                        "title": "Day 02 \u2022 Dokumentasi #126",
                        "url": "/archives/kopasus/2026-batch-16/day-2/IMG-20261006-WA0691.jpg",
                        "caption": "Rembuk strategi regu menghadapi rintangan medan terbuka. (IMG-20261006-WA0691.jpg)",
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
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261004-WA0055.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-2",
                        "title": "Day 03 \u2022 Dokumentasi #2",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261004-WA0086.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261004-WA0086.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-3",
                        "title": "Day 03 \u2022 Dokumentasi #3",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261004-WA0089.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261004-WA0089.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-4",
                        "title": "Day 03 \u2022 Dokumentasi #4",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261004-WA0092.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261004-WA0092.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-5",
                        "title": "Day 03 \u2022 Dokumentasi #5",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0328.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0328.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-6",
                        "title": "Day 03 \u2022 Dokumentasi #6",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0329.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0329.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-7",
                        "title": "Day 03 \u2022 Dokumentasi #7",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0330.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0330.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-8",
                        "title": "Day 03 \u2022 Dokumentasi #8",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0332.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0332.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-9",
                        "title": "Day 03 \u2022 Dokumentasi #9",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0333.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0333.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-10",
                        "title": "Day 03 \u2022 Dokumentasi #10",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0335.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0335.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-11",
                        "title": "Day 03 \u2022 Dokumentasi #11",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0336.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0336.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-12",
                        "title": "Day 03 \u2022 Dokumentasi #12",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0337.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0337.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-13",
                        "title": "Day 03 \u2022 Dokumentasi #13",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0341.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0341.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-14",
                        "title": "Day 03 \u2022 Dokumentasi #14",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0343.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0343.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-15",
                        "title": "Day 03 \u2022 Dokumentasi #15",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0347.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0347.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-16",
                        "title": "Day 03 \u2022 Dokumentasi #16",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0348.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0348.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-17",
                        "title": "Day 03 \u2022 Dokumentasi #17",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0349.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0349.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-18",
                        "title": "Day 03 \u2022 Dokumentasi #18",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0350.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0350.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-19",
                        "title": "Day 03 \u2022 Dokumentasi #19",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0351.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0351.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-20",
                        "title": "Day 03 \u2022 Dokumentasi #20",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0352.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0352.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-21",
                        "title": "Day 03 \u2022 Dokumentasi #21",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0353.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0353.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-22",
                        "title": "Day 03 \u2022 Dokumentasi #22",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0354.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0354.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-23",
                        "title": "Day 03 \u2022 Dokumentasi #23",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0355.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0355.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-24",
                        "title": "Day 03 \u2022 Dokumentasi #24",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0357.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0357.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-25",
                        "title": "Day 03 \u2022 Dokumentasi #25",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0358.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0358.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-26",
                        "title": "Day 03 \u2022 Dokumentasi #26",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0359.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0359.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-27",
                        "title": "Day 03 \u2022 Dokumentasi #27",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0361.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0361.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-28",
                        "title": "Day 03 \u2022 Dokumentasi #28",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0362.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0362.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-29",
                        "title": "Day 03 \u2022 Dokumentasi #29",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0363.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0363.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-30",
                        "title": "Day 03 \u2022 Dokumentasi #30",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0365.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0365.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-31",
                        "title": "Day 03 \u2022 Dokumentasi #31",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0367.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0367.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-32",
                        "title": "Day 03 \u2022 Dokumentasi #32",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0369.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0369.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-33",
                        "title": "Day 03 \u2022 Dokumentasi #33",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0371.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0371.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-34",
                        "title": "Day 03 \u2022 Dokumentasi #34",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0373.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0373.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-35",
                        "title": "Day 03 \u2022 Dokumentasi #35",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0375.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0375.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-36",
                        "title": "Day 03 \u2022 Dokumentasi #36",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0377.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0377.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-37",
                        "title": "Day 03 \u2022 Dokumentasi #37",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0379.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0379.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-38",
                        "title": "Day 03 \u2022 Dokumentasi #38",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0853.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0853.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-39",
                        "title": "Day 03 \u2022 Dokumentasi #39",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0865.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0865.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-40",
                        "title": "Day 03 \u2022 Dokumentasi #40",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0881.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0881.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-41",
                        "title": "Day 03 \u2022 Dokumentasi #41",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0886.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0886.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-42",
                        "title": "Day 03 \u2022 Dokumentasi #42",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0889.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0889.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-43",
                        "title": "Day 03 \u2022 Dokumentasi #43",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0891.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0891.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-44",
                        "title": "Day 03 \u2022 Dokumentasi #44",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0893.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0893.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-45",
                        "title": "Day 03 \u2022 Dokumentasi #45",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0897.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0897.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-46",
                        "title": "Day 03 \u2022 Dokumentasi #46",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0899.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0899.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-47",
                        "title": "Day 03 \u2022 Dokumentasi #47",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0903.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0903.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-48",
                        "title": "Day 03 \u2022 Dokumentasi #48",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0906.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0906.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-49",
                        "title": "Day 03 \u2022 Dokumentasi #49",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0908.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0908.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-50",
                        "title": "Day 03 \u2022 Dokumentasi #50",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0912.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0912.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-51",
                        "title": "Day 03 \u2022 Dokumentasi #51",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0914.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0914.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-52",
                        "title": "Day 03 \u2022 Dokumentasi #52",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0917.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0917.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-53",
                        "title": "Day 03 \u2022 Dokumentasi #53",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0920.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0920.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-54",
                        "title": "Day 03 \u2022 Dokumentasi #54",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0922.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0922.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-55",
                        "title": "Day 03 \u2022 Dokumentasi #55",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0924.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0924.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-56",
                        "title": "Day 03 \u2022 Dokumentasi #56",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0927.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0927.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-57",
                        "title": "Day 03 \u2022 Dokumentasi #57",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0928.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0928.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-58",
                        "title": "Day 03 \u2022 Dokumentasi #58",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0936.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0936.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-59",
                        "title": "Day 03 \u2022 Dokumentasi #59",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0939.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0939.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-60",
                        "title": "Day 03 \u2022 Dokumentasi #60",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0942.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0942.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-61",
                        "title": "Day 03 \u2022 Dokumentasi #61",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0945.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0945.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-62",
                        "title": "Day 03 \u2022 Dokumentasi #62",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0947.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0947.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-63",
                        "title": "Day 03 \u2022 Dokumentasi #63",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0949.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0949.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-64",
                        "title": "Day 03 \u2022 Dokumentasi #64",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0958.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0958.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-65",
                        "title": "Day 03 \u2022 Dokumentasi #65",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0960.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0960.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-66",
                        "title": "Day 03 \u2022 Dokumentasi #66",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0965.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0965.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-67",
                        "title": "Day 03 \u2022 Dokumentasi #67",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0967.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0967.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-68",
                        "title": "Day 03 \u2022 Dokumentasi #68",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0969.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA0969.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-69",
                        "title": "Day 03 \u2022 Dokumentasi #69",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0971.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA0971.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-70",
                        "title": "Day 03 \u2022 Dokumentasi #70",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0974.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA0974.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-71",
                        "title": "Day 03 \u2022 Dokumentasi #71",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0976.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA0976.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-72",
                        "title": "Day 03 \u2022 Dokumentasi #72",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0977.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA0977.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-73",
                        "title": "Day 03 \u2022 Dokumentasi #73",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0979.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA0979.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-74",
                        "title": "Day 03 \u2022 Dokumentasi #74",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0982.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA0982.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-75",
                        "title": "Day 03 \u2022 Dokumentasi #75",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0984.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA0984.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-76",
                        "title": "Day 03 \u2022 Dokumentasi #76",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0986.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA0986.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-77",
                        "title": "Day 03 \u2022 Dokumentasi #77",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0997.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA0997.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-78",
                        "title": "Day 03 \u2022 Dokumentasi #78",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0998.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA0998.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-79",
                        "title": "Day 03 \u2022 Dokumentasi #79",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA0999.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA0999.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-80",
                        "title": "Day 03 \u2022 Dokumentasi #80",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1012.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA1012.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-81",
                        "title": "Day 03 \u2022 Dokumentasi #81",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1013.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA1013.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-82",
                        "title": "Day 03 \u2022 Dokumentasi #82",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1014.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA1014.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-83",
                        "title": "Day 03 \u2022 Dokumentasi #83",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1017.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA1017.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-84",
                        "title": "Day 03 \u2022 Dokumentasi #84",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1020.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA1020.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-85",
                        "title": "Day 03 \u2022 Dokumentasi #85",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1021.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA1021.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-86",
                        "title": "Day 03 \u2022 Dokumentasi #86",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1022.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA1022.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-87",
                        "title": "Day 03 \u2022 Dokumentasi #87",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1024.jpg",
                        "caption": "Penyerahan Pakaian Dinas Harian (PDH) resmi kepada kader baru. (IMG-20261006-WA1024.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-88",
                        "title": "Day 03 \u2022 Dokumentasi #88",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1027.jpg",
                        "caption": "Pemberian Surat Keputusan (SK) kelulusan dan Nomor Induk Anggota. (IMG-20261006-WA1027.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-89",
                        "title": "Day 03 \u2022 Dokumentasi #89",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1030.jpg",
                        "caption": "Ucapan selamat dan jabat tangan kehormatan bersama Dewan Pembina. (IMG-20261006-WA1030.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-90",
                        "title": "Day 03 \u2022 Dokumentasi #90",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1032.jpg",
                        "caption": "Foto bersama seluruh kader baru KOPASUS Batch XVI dan BPH. (IMG-20261006-WA1032.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-91",
                        "title": "Day 03 \u2022 Dokumentasi #91",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1038.jpg",
                        "caption": "Yel-yel semangat integritas membahana di akhir upacara. (IMG-20261006-WA1038.jpg)",
                        "isHighlight": true
                  },
                  {
                        "id": "kop16-day-3-92",
                        "title": "Day 03 \u2022 Dokumentasi #92",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1040.jpg",
                        "caption": "Tangis haru dan rasa bangga usai tuntas menyelesaikan diklat. (IMG-20261006-WA1040.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-93",
                        "title": "Day 03 \u2022 Dokumentasi #93",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1041.jpg",
                        "caption": "Penyerahan panji kepengurusan kepada perwakilan angkatan. (IMG-20261006-WA1041.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-94",
                        "title": "Day 03 \u2022 Dokumentasi #94",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1042.jpg",
                        "caption": "Momen ramah tamah persaudaraan keluarga besar SIMAK. (IMG-20261006-WA1042.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-95",
                        "title": "Day 03 \u2022 Dokumentasi #95",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1044.jpg",
                        "caption": "Foto formasi angkatan kader resmi SIMAK Batch XVI. (IMG-20261006-WA1044.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-96",
                        "title": "Day 03 \u2022 Dokumentasi #96",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1045.jpg",
                        "caption": "Penutupan resmi seluruh rangkaian Diklat KOPASUS. (IMG-20261006-WA1045.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-97",
                        "title": "Day 03 \u2022 Dokumentasi #97",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1047.jpg",
                        "caption": "Upacara khidmat pembacaan ikrar sumpah kader SIMAK. (IMG-20261006-WA1047.jpg)",
                        "isHighlight": false
                  },
                  {
                        "id": "kop16-day-3-98",
                        "title": "Day 03 \u2022 Dokumentasi #98",
                        "url": "/archives/kopasus/2026-batch-16/day-3/IMG-20261006-WA1049.jpg",
                        "caption": "Penyematan lencana dan baret kehormatan KOPASUS. (IMG-20261006-WA1049.jpg)",
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
