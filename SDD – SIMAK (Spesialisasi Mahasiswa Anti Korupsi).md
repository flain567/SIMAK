# Software Design Document (SDD)

**Produk:** SIMAK – Spesialisasi Mahasiswa Anti Korupsi (Portal Resmi Institut STIAMI) **Versi dokumen:** 1.0 (draf) **Tanggal:** 29 Oktober 2026 **Dokumen terkait:** SRS SIMAK v1.0 **Sumber analisis:** basis kode proyek *Remix SIMAK* dari Google AI Studio

> **Prinsip utama:** desain visual dari Google AI Studio **tidak diubah**. SDD ini menjelaskan arsitektur, struktur kode, model data, dan rancangan teknis. Bagian 3 menjelaskan kondisi arsitektur saat ini, bagian 4–11 menjelaskan desain rinci, dan bagian 12 menjelaskan arsitektur target untuk produksi yang tetap menjaga keluaran visual identik.

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini menjadi acuan teknis bagi pengembang untuk memahami, memelihara, dan mengembangkan portal SIMAK, serta memetakan setiap kebutuhan SRS ke komponen perangkat lunak.

### 1.2 Ruang lingkup

Portal web satu halaman (SPA) dengan 9 layar: Beranda, Galeri, Direktori, Pendaftaran, E-Tiket, Kartu Ujian, E-Library, Whistleblower, dan Transparansi.

### 1.3 Referensi

- SRS SIMAK v1.0 (kebutuhan fungsional dan non-fungsional)
- Berkas proyek: `package.json`, `src/App.tsx`, `src/types.ts`, `src/data/mockData.ts`, `src/index.css`, `src/hooks/useGsapAnimations.ts`, `src/utils/calendarAndShare.ts`

## 2. Tinjauan Sistem

SIMAK adalah SPA berbahasa Indonesia yang menyatukan layanan organisasi mahasiswa antikorupsi: pendaftaran tamu HARLAH, antrean KOPASUS, E-Tiket dan piagam, kartu ujian dan simulasi, E-Library dan kanal advokasi, kanal pengaduan (WBS), serta transparansi kas dan direktori kader.

### 2.1 Tumpukan teknologi (kondisi saat ini)

| Lapisan | Teknologi | Fungsi |
| --- | --- | --- |
| UI | React 19 + TypeScript | Komponen dan state |
| Build | Vite | Dev server (port 3000) dan bundling |
| Gaya | Tailwind CSS 4 (`@tailwindcss/vite`) dengan token `@theme` | Seluruh desain visual |
| Animasi | GSAP 3 dan paket `motion` | Animasi masuk halaman dan filter grid |
| Ikon dan font | Material Symbols Outlined, Plus Jakarta Sans (Google Fonts) | Identitas visual |
| Pustaka lain | Lucide React, three, @types/three | Terpasang di dependensi |
| Server (terpasang, belum dipakai di layar yang dianalisis) | Express, dotenv, `@google/genai` | Disiapkan oleh template AI Studio |
| Penyimpanan | `localStorage` browser | Persistensi data |

## 3. Arsitektur Saat Ini

### 3.1 Gaya arsitektur

Arsitektur **client-side SPA tanpa router URL**. Perpindahan layar dikendalikan oleh satu state `activeScreen` bertipe `ScreenId` di komponen akar `App`. Tidak ada backend dan tidak ada panggilan API pada layar yang dianalisis.

```
Browser
 └─ index.html → src/main.tsx → <App />
      ├─ Navbar (portal menu, pencarian global, menu mobile)
      ├─ Toast notifikasi pendaftaran (global)
      ├─ <main> → salah satu dari 9 Screen (kondisional)
      ├─ Dock mengambang (E-Tiket Saya, Ke Atas)
      └─ Footer
      
 State (App): activeScreen, participants, activeParticipant,
              myHarlahRegistration, submissions, wbsReports, webToast
      ↓ efek samping
 localStorage: simak_participants_v1, simak_my_harlah_registration_v1,
               simak_submissions_v1, simak_wbs_reports_v1,
               simak_kopasus_waitlist_v1
```

### 3.2 Struktur direktori

| Jalur | Isi |
| --- | --- |
| `src/main.tsx` | Titik masuk React |
| `src/App.tsx` | Komponen akar: state global, persistensi, pemilihan layar, toast, dock |
| `src/types.ts` | Tipe terpusat: `ScreenId`, `ParticipantRecord`, `LibraryDocument`, `AdvocacySubmission`, `WhistleblowerReport` |
| `src/data/mockData.ts` | Data awal peserta, dokumen E-Library, soal simulasi (`INTEGRITY_QUIZ_QUESTIONS`) |
| `src/components/*Screen.tsx` | Sembilan layar |
| `src/components/Navbar.tsx`, `Footer.tsx` | Kerangka global |
| `src/components/QrCodeGraphic.tsx` | Grafik QR untuk tiket dan kartu ujian |
| `src/hooks/useGsapAnimations.ts` | `useGsapPageAnimations`, `animateFilterGrid` |
| `src/utils/calendarAndShare.ts` | URL Google Calendar, unduhan `.ics`, teks berbagi WhatsApp |
| `src/index.css` | Tailwind dan seluruh token desain |

### 3.3 Aliran data

Data mengalir **satu arah ke bawah** (props) dan **ke atas lewat callback**:

1. `App` memegang state dan meneruskannya sebagai props ke layar.
2. Layar memanggil callback seperti `onRegisterParticipant`, `onAddSubmission`, `onAddReport`, `onNavigate`, `onSelectParticipant`.
3. `App` memperbarui state, lalu `useEffect` menulis ke `localStorage`.
4. Layar yang menyimpan data lokal sendiri (antrean KOPASUS) menulis ke `localStorage` langsung dari `RegistrationScreen`.

## 4. Desain Komponen

### 4.1 Komponen akar `App`

| Tanggung jawab | Rincian |
| --- | --- |
| Navigasi | `activeScreen` (nilai awal `beranda`); `onNavigate` diteruskan ke semua layar |
| State data | `participants`, `activeParticipant`, `myHarlahRegistration`, `submissions`, `wbsReports` |
| Inisialisasi | *Lazy initializer* membaca `localStorage` dengan `try/catch`; jatuh ke data awal bila kosong atau rusak |
| Persistensi | Satu `useEffect` per kunci; `myHarlahRegistration` hanya ditulis bila tidak `null` |
| Handler | `handleRegisterParticipant`, `handleSelectParticipantForTicket`, `handleAddSubmission`, `handleAddWbsReport` |
| UI global | Toast pendaftaran (kanan atas), dock mengambang, tombol "Ke Atas" (muncul saat `scrollY > 380`), pembungkus `print:hidden` |

### 4.2 Katalog layar

| Layar | Props utama | State lokal penting | Hook/util |
| --- | --- | --- | --- |
| `HomeScreen` | `participants`, `documents`, `myHarlahRegistration`, `onNavigate`, `onSelectParticipantForTicket` | FAQ terbuka | `useGsapPageAnimations` |
| `GalleryScreen` | `onNavigate` | kategori, pencarian, urutan, modal, toast | `useGsapPageAnimations` |
| `DirectoryScreen` | `participants`, `onNavigate` | angkatan, pencarian, filter divisi/sub-divisi/status, modal anggota, menu pendiri | `useGsapPageAnimations` |
| `RegistrationScreen` | `participants`, `myHarlahRegistration`, `onRegisterParticipant`, `onNavigate`, `onSelectParticipantForTicket` | mode (`harlah-guest` / `kopasus-closed`), semua kolom formulir, galat, rekaman terbuat, modal sukses, antrean KOPASUS, hitung mundur | `calendarAndShare`, `useGsapPageAnimations` |
| `ETicketScreen` | `participants`, `activeParticipant`, `onSelectParticipant`, `onNavigate` | tab (`ticket`/`certificate`), pencarian, status pencarian, toast pindai | `QrCodeGraphic`, `calendarAndShare`, `window.print` |
| `ExamCardScreen` | sama seperti E-Tiket | modal kuis, jawaban, status kirim | `QrCodeGraphic`, `INTEGRITY_QUIZ_QUESTIONS`, `window.print` |
| `ELibraryScreen` | `documents`, `submissions`, `onAddSubmission` | pencarian, filter topik/tahun/kategori, modal pratinjau, bab aktif, sitasi tersalin, kolom naskah | `animateFilterGrid` |
| `WhistleblowerScreen` | `reports`, `onAddReport`, `onNavigate` | tab (`form`/`track`), mode anonim, kolom laporan, laporan terbuat, pelacakan | `useGsapPageAnimations` |
| `TransparencyScreen` | `onNavigate` | filter kategori, toast | `useGsapPageAnimations` |

### 4.3 Kerangka global

- **Navbar:** menu Portal berisi 8 layanan (`PORTAL_ITEMS`), tautan jangkar beranda (`handleSectionClick`), menu mobile, dan modal pencarian global dengan indeks `GLOBAL_SEARCH_INDEX` (kategori: Layanan Portal, Kader & Pengurus, Modul E-Library, Agenda & Arsip). Menutup menu saat klik di luar, mendukung pintasan keyboard.
- **Footer:** tautan navigasi ke semua layar lewat `onNavigate`.
- **QrCodeGraphic:** komponen presentasional murni untuk gambar QR.

### 4.4 Pola yang dipakai ulang

- Modal berlatar buram (`fixed inset-0 ... backdrop-blur`), ditutup lewat tombol atau klik latar.
- Toast sementara dengan `setTimeout` 2,5–4 detik.
- Pola `useRef` kontainer + `useGsapPageAnimations(containerRef)` di setiap layar.
- Penanda animasi lewat atribut `data-gsap` (`hero-media`, `stagger-grid`, `section-header`, `parallax`).

## 5. Desain Data

### 5.1 Model data (dari `types.ts`)

**ParticipantRecord**

| Field | Tipe | Keterangan |
| --- | --- | --- |
| id | string | `guest-<timestamp>` atau `part-n` |
| ticketCode | string | `GUEST-HRL-xxxx` atau `SMK-2026-OH-xxxx` |
| examNumber | string | `TAMU-HARLAH-29JAN` atau `KPS-2026-xxxx` |
| fullName, nim, whatsapp, email | string | Identitas |
| programStudi, campus, semester | string | `semester` dipakai sebagai kategori tamu pada tamu HARLAH |
| division | string | Divisi atau sesi pilihan |
| registrationType | `'Kader KOPASUS'` \| `'Open House SIMAK'` | Jenis |
| registeredAt | string | Label waktu |
| status | `'TERVERIFIKASI'` \| `'MENUNGGU VERIFIKASI'` | Status |
| avatarUrl | string | URL foto |
| seatNumber, gate, examRoom, examSession, examDate | string | Logistik acara |
| motivation | string | Motivasi |

**LibraryDocument:** `id`, `code`, `title`, `subtitle`, `author`, `category` (Modul Diklat, Kajian Strategis, Regulasi & UU, White Paper, Jurnal Integritas), `year`, `pages`, `fileSize`, `downloads`, `coverImage`, `abstract`, `keyTakeaways[]`, `featured?`.

**AdvocacySubmission:** `id`, `title`, `authorName`, `nim`, `category` (Opini Antikorupsi, Policy Brief, Laporan Kajian, Esai Integritas), `submittedAt`, `abstract`, `status` (Diterbitkan, Dalam Kurasi), `readTime`.

**WhistleblowerReport:** `id`, `trackingCode`, `category` (5 nilai), `unitReported`, `incidentDate`, `summary`, `evidenceUrl?`, `isAnonymous`, `reporterIdentity?`, `submittedAt`, `status` (Diterima, Verifikasi Bukti, Investigasi Satgas, Selesai Ditindaklanjuti), `progressStep` (1–4), `resolutionNote`.

**Model lokal di layar (belum di `types.ts`):** `KopasusWaitlistEntry` (di `RegistrationScreen`), `LedgerRow` (di `TransparencyScreen`), `CadreMember` (di `DirectoryScreen`), `SearchableEntry` (di `Navbar`), dan katalog `CATALOG_DOCS` (di `ELibraryScreen`).

### 5.2 Penyimpanan lokal

| Kunci `localStorage` | Isi | Penulis |
| --- | --- | --- |
| `simak_participants_v1` | `ParticipantRecord[]` | `App` |
| `simak_my_harlah_registration_v1` | `ParticipantRecord` milik pengguna | `App` |
| `simak_submissions_v1` | `AdvocacySubmission[]` | `App` |
| `simak_wbs_reports_v1` | `WhistleblowerReport[]` | `App` |
| `simak_kopasus_waitlist_v1` | `KopasusWaitlistEntry[]` | `RegistrationScreen` |

Semua pembacaan dan penulisan dibungkus `try/catch` agar kegagalan kuota atau mode privat tidak merusak aplikasi. Akhiran `_v1` disiapkan untuk migrasi skema.

### 5.3 Temuan desain data

- Beberapa layar memiliki data statis sendiri (kader, galeri, buku kas, katalog); data ini belum lewat `types.ts` atau `mockData.ts`, sehingga sulit diganti dengan API.
- `ParticipantRecord.semester` dipakai ganda (semester mahasiswa dan kategori tamu); sebaiknya dipisah menjadi `guestCategory` pada versi server.
- `submittedAt` dan `registeredAt` berupa string bebas, bukan tanggal ISO.

## 6. Desain Alur Utama

### 6.1 Pendaftaran tamu HARLAH

1. Pengguna mengisi formulir pada `RegistrationScreen` (mode `harlah-guest`).
2. `useMemo` `existingMatchedGuest` mencocokkan NIM (≥ 5 karakter), WhatsApp (≥ 9), atau nama (≥ 5) dengan tamu yang ada, untuk peringatan duplikasi; kolom cek status memakai kata kunci ≥ 3 karakter.
3. `handleSubmit` memvalidasi nama, NIM, WhatsApp, email, dan persetujuan. Bila gagal, `errorMessage` diisi dan proses berhenti.
4. Bila lolos, dibuat `ParticipantRecord` dengan `ticketCode = GUEST-HRL-<angka 1100–9899>`, `seatNumber = TAMU-<10–69>`, status `TERVERIFIKASI`, dan nilai lokasi tetap.
5. `onRegisterParticipant` di `App` menambah rekaman ke depan daftar, menjadikannya `activeParticipant` dan `myHarlahRegistration`, serta memunculkan `webToast`.
6. Modal sukses tampil; efek `localStorage` menyimpan data.
7. Pengguna dapat membuka E-Tiket, menyalin kode, membagikan ke WhatsApp, atau menyimpan kalender.

### 6.2 Antrean KOPASUS

`handleWaitlistSubmit` memvalidasi nama, NIM, WhatsApp, email; membuat kode `WL-KPS-NEXT-<urutan>`; menambah entri ke depan antrean lokal; mengosongkan kolom.

### 6.3 E-Tiket, Piagam, dan Kartu Ujian

- `activeParticipant` menentukan peserta yang ditampilkan di E-Tiket dan Kartu Ujian; `onSelectParticipant` mengubahnya.
- Pencetakan memakai `window.print()`; elemen pembungkus diberi `print:hidden`, sedangkan area dokumen memakai gaya `print:*`.
- Simulasi kuis: `selectedAnswers: Record<number, number>`; `calculateScore` membandingkan dengan `correctIndex` dan mengembalikan persen bulat; setelah `quizSubmitted`, jawaban terkunci.

### 6.4 Pengaduan WBS

1. Pelapor memilih mode anonim (nilai awal `true`), kategori, unit, tanggal, uraian, dan bukti.
2. `handleSubmit` berhenti diam-diam bila unit atau uraian kosong.
3. Dibuat `WBS-2026-<1000–9999>` dengan status awal `Verifikasi Bukti` dan `progressStep = 2`.
4. `onAddReport` menambahkan ke state; kode otomatis masuk ke kolom pelacakan.
5. `handleTrackSearch` mencari kode persis atau kecocokan sebagian pada unit dan kategori.

### 6.5 Pengiriman naskah E-Library

`handleFormSubmit` mensyaratkan nama penulis dan tautan; membuat `AdvocacySubmission` berstatus `Dalam Kurasi`; menampilkan toast; mengosongkan kolom.

### 6.6 Kalender dan berbagi

`calendarAndShare.ts`:

- `getNextJan29Year()` menentukan tahun 29 Januari berikutnya (lewat pukul 15.00 → tahun depan).
- `getGoogleCalendarHarlahUrl()` membangun URL `calendar.google.com/calendar/render?action=TEMPLATE` dengan zona `Asia/Jakarta`, 08.30–15.00 WIB.
- `downloadHarlahIcsFile()` membuat berkas `.ics` (UTC 01.30–08.00) dan memicu unduhan.
- `getWhatsAppShareText()` menyusun teks undangan.

## 7. Desain Antarmuka dan Sistem Desain (Dipertahankan)

Bagian ini adalah **kontrak desain yang tidak boleh diubah**.

### 7.1 Token warna (`@theme`)

| Peran | Token | Nilai |
| --- | --- | --- |
| Utama | `primary` / `primary-container` / `on-primary` | `#760009` / `#991b1b` / `#ffffff` |
| Sekunder | `secondary` / `secondary-container` | `#565e74` / `#dae2fd` |
| Tersier | `tertiary` / `tertiary-container` | `#572c00` / `#793f00` |
| Latar | `surface` / `surface-container-lowest` / `-low` / `-high` | `#f7f9fb` / `#ffffff` / `#f2f4f6` / `#e6e8ea` |
| Teks | `on-surface` / `on-surface-variant` | `#191c1e` / `#59413e` |
| Garis | `outline` / `outline-variant` | `#8d706d` / `#e1bfbb` |
| Galat | `error` / `error-container` | `#ba1a1a` / `#ffdad6` |
| Permukaan terbalik | `inverse-surface` / `inverse-on-surface` | `#2d3133` / `#eff1f3` |
| Status sukses | Palet `emerald` bawaan Tailwind | dipakai langsung di kelas |

### 7.2 Tipografi dan spasi

- Satu keluarga font: **Plus Jakarta Sans** (400, 500, 600, 700, 800) untuk semua gaya (`label-sm/md/lg`, `body-md/lg/xl`, `headline-sm/md/lg/xl`, `display-lg`, serta varian mobile).
- Ukuran label kecil: 11 px / tinggi baris 14 px / jarak huruf 0,06em / bobot 700.
- Spasi: `space-xs` 0,25rem, `space-sm` 0,5rem, `space-md` 1rem, `space-lg` 1,5rem, `space-xl` 2,5rem, `margin` 3rem, `margin-mobile` 1,25rem, `gutter` 1,5rem, `gutter-mobile` 1rem.
- Ikon: Material Symbols Outlined.

### 7.3 Pola tata letak

- Konten utama: `max-w-7xl`, padding `px-margin-mobile sm:px-margin`.
- Navbar tetap (`fixed`, `z-50`, blur latar) dan `<main>` memakai `pt-20`.
- Grid 12 kolom pada layar besar (`lg:col-span-5/7/4/8`).
- Kartu berpola `rounded-xl` atau `rounded-2xl`, bayangan lembut, latar `surface-container-lowest`.
- Lapisan: navbar `z-50`, toast global `z-50`, dock `z-40`.

### 7.4 Gaya cetak

Bagian non-dokumen memakai `print:hidden`; tiket dan piagam memakai `print:border-2 print:border-primary print:shadow-none`; `<main>` memakai `print:pt-0`.

### 7.5 Animasi

`useGsapPageAnimations(containerRef)` menjalankan animasi masuk yang menyasar atribut `data-gsap`; `animateFilterGrid` menganimasikan ulang grid saat filter E-Library berubah; `fadeIn` dan `animate-ping` didefinisikan sebagai animasi kelas Tailwind.

## 8. Desain Keamanan

### 8.1 Kondisi saat ini

- Tidak ada autentikasi dan data hanya ada di browser pengguna.
- React menghindari XSS pada keluaran teks; tautan bukti dan naskah belum divalidasi skema.
- Kunci API tidak dipakai di klien pada layar yang dianalisis.

### 8.2 Kontrol yang diperlukan untuk produksi

| Risiko | Kontrol desain |
| --- | --- |
| Identitas pelapor anonim terlacak | Tidak menyimpan IP, user-agent, atau cap waktu presisi; kode pelacakan acak sisi server; identitas bermode terverifikasi dienkripsi terpisah dari isi laporan |
| Tebakan laporan lewat kata kunci | Pelacakan hanya dengan kode persis (kecocokan penuh), dengan pembatasan laju |
| Kebocoran data pribadi tamu | Antarmuka publik hanya menampilkan nama dan kategori; WhatsApp dan email hanya untuk pengurus |
| Pemalsuan tiket | Kode QR memuat token bertanda tangan (mis. HMAC) yang divalidasi server |
| Spam formulir | Rate limit per IP, CAPTCHA, honeypot |
| Akses admin | Autentikasi dan RBAC (publik, peserta, pengurus, Satgas/Dewan Etik, admin) |
| Skema URL berbahaya | Validasi `http(s)` saja pada tautan bukti dan naskah |
| Rahasia | `GEMINI_API_KEY` dan rahasia lain hanya di environment server |

### 8.3 Klaim "SHA-256"

Label "SHA-256" dan "anonim terenkripsi" saat ini adalah teks antarmuka. Desain target: server menghitung hash dokumen (piagam, modul) dan menyimpannya sebagai nilai verifikasi; identitas WBS dienkripsi dengan kunci server (AES-GCM). Teks antarmuka tetap sama, sehingga desain visual tidak berubah.

## 9. Desain Kinerja

| Topik | Kondisi | Rancangan |
| --- | --- | --- |
| Ukuran berkas | `HomeScreen` ≈ 144 KB, `RegistrationScreen` ≈ 111 KB, `DirectoryScreen` ≈ 80 KB, `ELibraryScreen` ≈ 72 KB, `GalleryScreen` ≈ 62 KB (sumber) | Pecah dengan `React.lazy` per layar dan `Suspense` yang menampilkan kerangka kosong tanpa mengubah tampilan akhir |
| Gambar | URL Unsplash langsung | `loading="lazy"`, `width`/`height` eksplisit, ukuran responsif via parameter `w=` |
| Re-render | `participants` memicu render ulang banyak layar | Memoisasi turunan (`useMemo`), `React.memo` pada kartu daftar |
| Penulisan storage | Efek menulis seluruh array tiap perubahan | *Debounce* penulisan atau pindah ke API |
| Animasi | GSAP per layar | Bersihkan konteks GSAP di `useEffect` cleanup |

## 10. Desain Pengujian

| Level | Cakupan | Alat yang disarankan |
| --- | --- | --- |
| Statis | Tipe dan lint | `npm run lint` (`tsc --noEmit`) |
| Unit | `calculateScore`, pembentuk kode tiket/WBS/antrean, `calendarAndShare`, fungsi filter | Vitest |
| Komponen | Validasi formulir, modal, filter, tab | React Testing Library |
| Regresi visual | Setiap layar pada 3 lebar (375, 768, 1280 px) terhadap tangkapan acuan dari AI Studio | Playwright + snapshot |
| E2E | Daftar HARLAH → E-Tiket → cetak; kirim WBS → lacak; kirim naskah | Playwright |
| Cetak | Pratinjau cetak A4 untuk tiket, piagam, KTPU | Playwright `page.pdf()` |
| Aksesibilitas | Kontras, label ARIA, fokus keyboard | axe-core |

Kriteria kunci: uji regresi visual wajib lulus pada setiap perubahan, sebagai penjaga kebijakan "desain tidak berubah".

## 11. Penerapan (Deployment)

- **Pengembangan:** `npm install`, lalu `npm run dev` (Vite, `--port=3000 --host=0.0.0.0`).
- **Build:** `npm run build` menghasilkan `dist/`; `npm run preview` untuk uji hasil build.
- **Variabel lingkungan:** `GEMINI_API_KEY`, `APP_URL` (lihat `.env.example`).
- **Hosting AI Studio/Cloud Run:** `APP_URL` diisi otomatis oleh platform.
- **Tahap produksi:** SPA statis di CDN, API di layanan terkelola, basis data dengan pencadangan harian, HTTPS wajib.

## 12. Arsitektur Target (Produksi)

### 12.1 Prinsip

Frontend **tetap React dengan komponen yang sama**; yang berubah hanya sumber data (dari `localStorage` ke API) dan penambahan fitur admin. Tidak ada perubahan kelas Tailwind atau struktur DOM yang terlihat.

```
Browser (SPA React, tampilan identik)
   │  HTTPS / JSON
   ▼
API Gateway (Express)  ── autentikasi, RBAC, rate limit
   ├─ Modul Pendaftaran  (tamu HARLAH, antrean KOPASUS, tiket)
   ├─ Modul Dokumen      (QR bertanda tangan, piagam, KTPU)
   ├─ Modul E-Library    (katalog, unggah, kurasi)
   ├─ Modul WBS          (laporan terenkripsi, pelacakan, tindak lanjut)
   ├─ Modul Transparansi (buku kas)
   └─ Modul Direktori & Galeri
   ▼
Basis data relasional + penyimpanan objek (PDF, gambar)
```

### 12.2 Lapisan akses data di frontend

Buat modul `src/api/` dengan antarmuka yang sama dengan state saat ini (mis. `registerParticipant`, `listParticipants`, `submitWbsReport`, `trackWbsReport`). `App` memakai *adapter* dengan dua implementasi: `localStorageAdapter` (kondisi saat ini) dan `httpAdapter` (produksi). Komponen layar tidak berubah.

### 12.3 Skema basis data (rancangan)

| Tabel | Kolom utama |
| --- | --- |
| `participants` | id, ticket\_code (unik), exam\_number, full\_name, nim, whatsapp, email, program\_studi, campus, guest\_category, session, registration\_type, status, seat\_number, created\_at |
| `waitlist` | id, queue\_code (unik), full\_name, nim, program\_studi, semester, whatsapp, email, preferred\_division, reason, created\_at |
| `library_documents` | id, code (unik), title, category, year, pages, file\_url, abstract, takeaways (JSON), downloads, featured |
| `submissions` | id, author\_name, category, link\_url, status, submitted\_at, reviewed\_by |
| `wbs_reports` | id, tracking\_code (unik), category, unit\_reported, incident\_date, summary\_enc, evidence\_url\_enc, is\_anonymous, reporter\_identity\_enc, status, progress\_step, resolution\_note, created\_at, updated\_at |
| `ledger_entries` | id, voucher\_code (unik), date, program, category, type, amount, auditor\_status, created\_by |
| `cadre_members` | id, cohort, name, nim, division, sub\_division, status, photo\_url |
| `gallery_items` | id, title, category, date, participants\_count, image\_url |
| `users` | id, email, role, password\_hash |
| `audit_log` | id, actor, action, entity, entity\_id, at |

### 12.4 Endpoint API (rancangan)

| Metode | Jalur | Fungsi | Akses |
| --- | --- | --- | --- |
| POST | `/api/participants` | Daftar tamu HARLAH, mengembalikan tiket | Publik |
| GET | `/api/participants/lookup?q=` | Cek status (hasil minimal) | Publik |
| GET | `/api/tickets/:code` | Data E-Tiket | Pemilik kode |
| POST | `/api/tickets/verify` | Verifikasi token QR di meja registrasi | Pengurus |
| POST | `/api/waitlist` | Masuk antrean KOPASUS | Publik |
| GET | `/api/library` | Katalog dengan filter | Publik |
| POST | `/api/library/submissions` | Kirim naskah | Publik |
| PATCH | `/api/library/submissions/:id` | Kurasi | Pengurus |
| POST | `/api/wbs/reports` | Kirim laporan | Publik |
| GET | `/api/wbs/reports/:code` | Lacak (kecocokan penuh) | Publik |
| PATCH | `/api/wbs/reports/:id` | Ubah status dan catatan | Satgas/Dewan Etik |
| GET | `/api/ledger` | Buku kas | Publik |
| POST/PATCH | `/api/ledger` | Kelola entri | Bendahara |
| GET | `/api/cadres?cohort=` | Direktori kader | Publik |

### 12.5 Migrasi dari kondisi saat ini

1. Pindahkan data statis layar (kader, galeri, buku kas, katalog) ke `types.ts` dan berkas data tersendiri.
2. Perkenalkan lapisan `src/api/` dengan `localStorageAdapter`.
3. Bangun API dan basis data; aktifkan `httpAdapter` lewat variabel lingkungan.
4. Ganti pembuatan kode acak sisi klien dengan kode dari server.
5. Tambahkan autentikasi dan layar admin (di jalur terpisah agar tampilan publik tidak berubah).
6. Jalankan uji regresi visual pada setiap langkah.

## 13. Keterlacakan SRS → Desain

| Area SRS | Komponen utama | Berkas |
| --- | --- | --- |
| FR-NAV | `Navbar`, `Footer`, dock di `App` | `Navbar.tsx`, `Footer.tsx`, `App.tsx` |
| FR-HOME | `HomeScreen` | `HomeScreen.tsx` |
| FR-REG | `RegistrationScreen`, `calendarAndShare` | `RegistrationScreen.tsx`, `calendarAndShare.ts` |
| FR-TKT | `ETicketScreen`, `QrCodeGraphic` | `ETicketScreen.tsx`, `QrCodeGraphic.tsx` |
| FR-EXM | `ExamCardScreen`, `INTEGRITY_QUIZ_QUESTIONS` | `ExamCardScreen.tsx`, `mockData.ts` |
| FR-DIR | `DirectoryScreen` | `DirectoryScreen.tsx` |
| FR-GAL | `GalleryScreen` | `GalleryScreen.tsx` |
| FR-LIB | `ELibraryScreen`, `onAddSubmission` | `ELibraryScreen.tsx` |
| FR-WBS | `WhistleblowerScreen`, `onAddReport` | `WhistleblowerScreen.tsx`, `App.tsx` |
| FR-TRN | `TransparencyScreen`, `LEDGER_ITEMS` | `TransparencyScreen.tsx` |
| FR-DAT | State dan efek di `App`, adapter data (target) | `App.tsx`, `src/api/` (baru) |
| NFR-UX-01 | Token `@theme`, kelas Tailwind | `index.css` |

## 14. Risiko Desain dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Komponen sangat besar (hingga ≈ 144 KB) sulit dirawat | Regresi saat pemecahan | Pecah bertahap, dilindungi uji regresi visual |
| State global berat di `App` | Render ulang berlebihan | Pindah ke Context atau store ringan setelah adapter data siap |
| Tanpa router URL | Tautan langsung dan tombol kembali browser tidak berfungsi | Opsional: sinkronkan `activeScreen` dengan hash `#nama-layar` tanpa mengubah tampilan |
| Data pribadi di `localStorage` | Terbaca di perangkat bersama | Hapus saat keluar; pindah ke server |
| Ketergantungan font dan gambar eksternal | Gagal muat di jaringan terbatas | Hosting mandiri aset tanpa mengubah rupa |
