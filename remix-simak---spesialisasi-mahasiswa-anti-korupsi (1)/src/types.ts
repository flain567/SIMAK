export type ScreenId =
  | 'beranda'
  | 'galeri'
  | 'direktori'
  | 'pendaftaran'
  | 'etiket'
  | 'kartu-ujian'
  | 'elibrary'
  | 'whistleblower'
  | 'transparansi'
  | 'admin'
  | 'merchandise'
  | 'program-detail';

export interface ParticipantRecord {
  id: string;
  ticketCode: string;
  examNumber: string;
  fullName: string;
  nim: string;
  whatsapp: string;
  email: string;
  programStudi: string;
  campus: string;
  semester: string;
  division: string;
  registrationType: 'Kader KOPASUS' | 'Open House SIMAK';
  registeredAt: string;
  status: 'TERVERIFIKASI' | 'MENUNGGU VERIFIKASI' | 'HADIR' | 'TIDAK HADIR';
  avatarUrl: string;
  seatNumber: string;
  gate: string;
  examRoom: string;
  examSession: string;
  examDate: string;
  motivation: string;
  // Fields tambahan dari backend (opsional untuk kompatibilitas offline)
  guestCategory?: string;
  session?: string;
  qrPayload?: string;
  checkedInAt?: string | null;
  verifiedAt?: string | null;
}

export interface LibraryDocument {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  author: string;
  category: 'Modul Diklat' | 'Kajian Strategis' | 'Regulasi & UU' | 'White Paper' | 'Jurnal Integritas';
  year: string;
  pages: number;
  fileSize: string;
  downloads: number;
  coverImage: string;
  abstract: string;
  keyTakeaways: string[];
  featured?: boolean;
}

export interface AdvocacySubmission {
  id: string;
  title: string;
  authorName: string;
  nim: string;
  category: 'Opini Antikorupsi' | 'Policy Brief' | 'Laporan Kajian' | 'Esai Integritas';
  submittedAt: string;
  abstract: string;
  status: 'Diterbitkan' | 'Dalam Kurasi';
  readTime: string;
}

export interface WhistleblowerReport {
  id: string;
  trackingCode: string;
  category:
    | 'Pungutan Liar (Pungli)'
    | 'Gratifikasi & Suap Akademik'
    | 'Penyelewengan Dana Kegiatan'
    | 'Konflik Kepentingan'
    | 'Pelanggaran Etik Kader';
  unitReported: string;
  incidentDate: string;
  summary: string;
  evidenceUrl?: string;
  isAnonymous: boolean;
  reporterIdentity?: string;
  submittedAt: string;
  status: 'Diterima' | 'Verifikasi Bukti' | 'Investigasi Satgas' | 'Selesai Ditindaklanjuti';
  progressStep: 1 | 2 | 3 | 4;
  resolutionNote: string;
  /** Ciphertext AES-256-GCM (base64 iv+payload); isi asli hanya terbuka dengan kode lacak. */
  encryptedPayload?: string;
  cryptoSalt?: string;
}

// ============================================================
// MERCHANDISE / DANUS HARLAH
// ============================================================

export type MerchandiseCategory = 'Semua' | 'Apparel' | 'Aksesoris' | 'Paket Bundle' | 'Stationery';

export interface MerchandiseProduct {
  id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Aksesoris' | 'Paket Bundle' | 'Stationery';
  imageUrl: string;
  badge?: string;
  description: string;
  options?: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL']
  stock: number;
  preOrder?: boolean;
}

export interface CartItem {
  product: MerchandiseProduct;
  selectedOption?: string;
  quantity: number;
}

export interface DanusOrder {
  orderId: string;
  customerName: string;
  nim: string;
  whatsapp: string;
  items: CartItem[];
  totalAmount: number;
  pickupMethod: 'Booth HARLAH 29 Jan' | 'Sekretariat SIMAK' | 'COD Kampus Pusat';
  paymentMethod: 'QRIS' | 'Transfer Bank' | 'Bayar di Tempat (COD)';
  status: 'Menunggu Konfirmasi' | 'Dibayar' | 'Selesai';
  orderedAt: string;
  notes?: string;
}
