# Software Requirements Specification (SRS)

**Produk:** SIMAK – Spesialisasi Mahasiswa Anti Korupsi (Portal Resmi Institut STIAMI) **Versi dokumen:** 1.0 (draf) **Tanggal:** 29 Oktober 2026 **Sumber analisis:** basis kode proyek *Remix SIMAK* dari Google AI Studio (React 19, Vite, Tailwind CSS 4, GSAP, Lucide, Material Symbols)

> **Catatan penting tentang desain.** Seluruh tampilan web (tata letak, warna, tipografi, komponen, animasi, dan salinan teks antarmuka) **dipertahankan persis seperti yang sudah dibuat di Google AI Studio**. SRS ini hanya mendeskripsikan kebutuhan fungsional dan non-fungsional, bukan perubahan visual. Bagian 8 merinci batasan desain tersebut.

## 1. Problem Statement

Organisasi SIMAK di Institut STIAMI menjalankan kaderisasi, edukasi, dan advokasi antikorupsi, tetapi layanannya tersebar dan belum terintegrasi:

1. **Pendaftaran dan administrasi acara** (tamu HARLAH 29 Januari, antrean rekrutmen KOPASUS) bergantung pada proses manual sehingga rawan duplikasi data, antrean di meja registrasi, dan sulit dilacak peserta.
2. **Bukti kehadiran dan ujian** (tiket, kartu ujian, piagam) belum tersedia secara digital dan dapat diverifikasi.
3. **Materi edukasi antikorupsi** (modul diklat, regulasi, white paper, kajian) tidak punya satu katalog yang mudah dicari, dikutip, dan diunduh, serta belum ada jalur resmi bagi mahasiswa untuk mengirim naskah advokasi.
4. **Pelaporan pelanggaran integritas** (pungli, gratifikasi akademik, penyelewengan dana kegiatan) belum punya kanal yang aman, anonim, dan bisa dilacak statusnya, sehingga pelapor enggan melapor.
5. **Transparansi organisasi**: laporan kas dan struktur kepengurusan belum terbuka bagi publik kampus, padahal organisasi antikorupsi seharusnya menjadi teladan keterbukaan.

Akibatnya, kepercayaan sivitas akademika dan efisiensi pengelolaan kegiatan SIMAK belum optimal.

## 2. Goals

| ID | Tujuan | Indikator keberhasilan |
| --- | --- | --- |
| G-01 | Menyediakan satu portal resmi untuk seluruh layanan SIMAK | Semua layanan (pendaftaran, tiket, ujian, library, WBS, transparansi) dapat diakses dari satu navigasi |
| G-02 | Mendigitalkan pendaftaran tamu HARLAH dan antrean KOPASUS | Pendaftar menerima kode E-Tiket dan nomor kursi seketika setelah submit |
| G-03 | Menyediakan bukti digital yang dapat dicetak dan diverifikasi (E-Tiket QR, Kartu Ujian, Piagam) | Dokumen dapat dicetak dari browser tanpa elemen navigasi |
| G-04 | Memusatkan literatur antikorupsi dan membuka kanal kontribusi naskah | Pengguna dapat mencari, memfilter, melihat pratinjau, mengutip, dan mengunduh dokumen |
| G-05 | Menyediakan kanal pengaduan yang aman, anonim, dan dapat dilacak | Pelapor memperoleh kode pelacakan dan dapat melihat progres 4 tahap |
| G-06 | Membuka transparansi keuangan dan struktur organisasi | Buku Kas Umum dan direktori kader dapat dilihat dan difilter publik |
| G-07 | Mempertahankan identitas visual yang sudah disepakati | Tampilan identik dengan prototipe Google AI Studio |

## 3. Target Users

| Persona | Deskripsi | Kebutuhan utama |
| --- | --- | --- |
| **Tamu HARLAH** | Alumni, delegasi BEM/BLM/UKM, tamu undangan, mahasiswa umum | Mendaftar kehadiran, mendapat E-Tiket, menyimpan pengingat kalender |
| **Calon kader KOPASUS** | Mahasiswa Institut STIAMI yang ingin bergabung | Masuk antrean periode berikutnya, melihat alur seleksi dan FAQ, mencetak kartu ujian, mencoba simulasi soal |
| **Kader / peserta aktif** | Anggota SIMAK berbagai angkatan | Mengambil E-Tiket dan Piagam, mencari profil kader, mengakses modul |
| **Mahasiswa / sivitas akademika** | Pembaca umum | Membaca modul, mengirim naskah advokasi, melihat galeri dan laporan kas |
| **Pelapor (whistleblower)** | Mahasiswa atau staf yang menemukan pelanggaran | Melapor secara anonim, melacak status laporan |
| **Pengurus / BPH SIMAK** | Ketua, sekretaris, bendahara, kepala divisi | Mengelola data peserta, memverifikasi tiket di lokasi, menerbitkan dokumen, menindaklanjuti laporan, menayangkan laporan kas |
| **Satgas Advokasi & Dewan Etik** | Penanganan laporan WBS | Menelaah bukti dan memperbarui status laporan |

## 4. User Stories

### 4.1 Pengunjung umum

- Sebagai pengunjung, saya ingin melihat profil, visi-misi, program kerja, struktur pengurus, mitra, alur seleksi, dan FAQ di beranda agar memahami SIMAK.
- Sebagai pengunjung, saya ingin mencari apa pun lewat pencarian global (layanan, kader, modul, agenda) agar cepat menemukan halaman yang saya butuhkan.
- Sebagai pengunjung, saya ingin menelusuri galeri dokumentasi dengan filter kategori, pencarian, dan urutan agar dapat melihat arsip kegiatan.
- Sebagai pengunjung, saya ingin melihat direktori kader per angkatan beserta filter divisi, sub-divisi, dan status agar mengenal pengurus.

### 4.2 Pendaftaran dan dokumen peserta

- Sebagai tamu, saya ingin mengisi formulir HARLAH (nama, NIM/ID, WhatsApp, email, institusi, kampus, kategori tamu, sesi, motivasi) agar terdaftar hadir.
- Sebagai tamu, saya ingin langsung menerima kode E-Tiket dan nomor kursi beserta notifikasi sukses agar yakin pendaftaran berhasil.
- Sebagai tamu, saya ingin sistem memberi tahu bila data saya sudah pernah terdaftar agar tidak mendaftar ganda.
- Sebagai tamu, saya ingin menyalin kode tiket, membagikan undangan lewat WhatsApp, dan menyimpan acara ke Google Calendar atau file .ics agar tidak lupa hadir.
- Sebagai tamu, saya ingin mengecek status pendaftaran dengan nama, NIM, kode tiket, atau nomor WhatsApp.
- Sebagai calon kader, saya ingin masuk antrean KOPASUS periode berikutnya karena rekrutmen saat ini ditutup.
- Sebagai peserta, saya ingin mencetak E-Tiket (QR Code), Piagam Integritas, dan Kartu Ujian (KTPU) dari browser.
- Sebagai calon kader, saya ingin mengerjakan simulasi soal 9 Nilai Integritas dan melihat skor agar siap menghadapi tes tertulis.

### 4.3 Pengetahuan dan advokasi

- Sebagai mahasiswa, saya ingin mencari dan memfilter dokumen E-Library berdasarkan kategori, topik, tahun, dan kata kunci.
- Sebagai mahasiswa, saya ingin membuka pratinjau dokumen (bab, abstrak, poin penting), menyalin sitasi, dan mengunduh PDF.
- Sebagai mahasiswa, saya ingin mengirim tautan naskah advokasi ke Divisi Riset agar dikurasi dan diterbitkan.

### 4.4 Pelaporan dan transparansi

- Sebagai pelapor, saya ingin memilih melapor anonim atau dengan identitas terverifikasi agar aman.
- Sebagai pelapor, saya ingin memilih kategori pelanggaran, mengisi unit terlapor, tanggal kejadian, uraian, dan tautan bukti.
- Sebagai pelapor, saya ingin menerima kode pelacakan (WBS-2026-xxxx) dan memantau progres laporan dari Diterima sampai Selesai Ditindaklanjuti.
- Sebagai warga kampus, saya ingin melihat Buku Kas Umum (pemasukan, pengeluaran, kode voucher, status audit) dengan filter kategori, dan mengunduh laporannya.

### 4.5 Pengurus

- Sebagai pengurus, saya ingin memverifikasi E-Tiket tamu lewat pemindaian QR di meja registrasi.
- Sebagai pengurus, saya ingin mengelola data peserta, antrean, laporan WBS, dokumen E-Library, dan Buku Kas dari satu panel admin (lihat bagian 9).

## 5. Functional Requirements

Prioritas: **M** = Must, **S** = Should, **C** = Could. Kolom *Status* menunjukkan kondisi di kode saat ini: **Ada** (UI dan logika sisi klien sudah berjalan), **Sebagian** (UI ada, perilaku masih simulasi), **Belum** (perlu dibangun).

### 5.1 Navigasi dan Layout Global

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-NAV-01 | Sistem menyediakan 9 layar: Beranda, Galeri, Direktori, Pendaftaran, E-Tiket, Kartu Ujian, E-Library, Whistleblower, Transparansi, dengan perpindahan layar tanpa reload halaman | M | Ada |
| FR-NAV-02 | Navbar tetap di atas, memuat menu Portal (dropdown berisi 8 layanan beserta deskripsi) dan tautan jangkar beranda (Tentang Kami, Visi & Misi, Program Kerja, Struktur Pengurus, Mitra, Alur Seleksi, FAQ) | M | Ada |
| FR-NAV-03 | Pencarian global berupa modal yang mengindeks Layanan Portal, Kader & Pengurus, Modul E-Library, dan Agenda & Arsip, dan membuka layar terkait saat hasil dipilih | M | Ada |
| FR-NAV-04 | Menu mobile (hamburger) untuk layar sempit | M | Ada |
| FR-NAV-05 | Footer dengan tautan navigasi ke seluruh layar | M | Ada |
| FR-NAV-06 | Tombol mengambang "Ke Atas" muncul setelah scroll melebihi 380 px, dan pintasan "E-Tiket Saya" muncul bila pengguna sudah terdaftar HARLAH | S | Ada |
| FR-NAV-07 | Navbar, tombol mengambang, dan notifikasi disembunyikan saat mencetak | M | Ada |

### 5.2 Beranda

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-HOME-01 | Menampilkan hero, ringkasan statistik, dan tombol aksi ke layanan utama | M | Ada |
| FR-HOME-02 | Menampilkan seksi Tentang Kami, Visi & Misi, Program Kerja, Struktur Pengurus, Mitra Kolaborasi, Alur Seleksi, dan FAQ Rekrutmen (FAQ dapat dibuka-tutup) | M | Ada |
| FR-HOME-03 | Menampilkan cuplikan peserta/tamu terdaftar dan dokumen E-Library unggulan | S | Ada |

### 5.3 Pendaftaran Tamu HARLAH dan Antrean KOPASUS

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-REG-01 | Layar memiliki dua mode: **Tamu HARLAH** (aktif) dan **KOPASUS** (ditutup, hanya antrean) | M | Ada |
| FR-REG-02 | Formulir HARLAH memuat: kategori tamu, nama lengkap, NIM/ID, WhatsApp, email, institusi/prodi, kampus, pilihan sesi, motivasi (opsional), dan persetujuan kehadiran | M | Ada |
| FR-REG-03 | Validasi: nama, NIM/ID, WhatsApp, dan email wajib diisi; persetujuan wajib dicentang; pesan galat ditampilkan dalam bahasa Indonesia | M | Ada |
| FR-REG-04 | Saat submit, sistem membuat rekaman peserta dengan kode tiket `GUEST-HRL-xxxx`, nomor kursi `TAMU-xx`, status TERVERIFIKASI, lokasi (Auditorium Utama Lt. 4), dan sesi (08.30–15.00 WIB) | M | Sebagian (kode dan kursi dibuat acak di sisi klien) |
| FR-REG-05 | Setelah submit, tampil modal bukti pendaftaran dan notifikasi web global dengan tombol "Buka E-Tiket Saya" | M | Ada |
| FR-REG-06 | Deteksi duplikasi langsung berdasarkan NIM, nomor WhatsApp, atau nama yang diketik | S | Ada |
| FR-REG-07 | Cek status pendaftaran dengan kata kunci minimal 3 karakter (nama, NIM, kode tiket, WhatsApp) | M | Ada |
| FR-REG-08 | Tombol salin kode tiket, salin teks undangan WhatsApp, unduh file .ics, dan tautan Google Calendar (29 Januari, 08.30–15.00 WIB, zona Asia/Jakarta) | M | Ada |
| FR-REG-09 | Hitung mundur langsung menuju HARLAH 29 Januari berikutnya (hari, jam, menit, detik) | S | Ada |
| FR-REG-10 | Daftar tamu terdaftar dengan filter kategori | S | Ada |
| FR-REG-11 | Formulir antrean KOPASUS: nama, NIM, prodi, semester, WhatsApp, email (wajib kecuali prodi, semester, dan alasan), divisi pilihan, alasan; menghasilkan kode antrean `WL-KPS-NEXT-nnn` | M | Ada |
| FR-REG-12 | Tombol isi otomatis data demo untuk kedua formulir | C | Ada |
| FR-REG-13 | Data pendaftaran disimpan di server dan tidak hanya di browser, dengan kode tiket unik yang dijamin tidak bentrok | M | Belum |
| FR-REG-14 | Pengiriman konfirmasi ke email atau WhatsApp pendaftar | S | Belum |

### 5.4 E-Tiket dan Piagam Integritas

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-TKT-01 | Layar memiliki dua tab: **E-Tiket** dan **Piagam** | M | Ada |
| FR-TKT-02 | Pencarian peserta berdasarkan nama/NIM/kode; menampilkan status ditemukan atau tidak ditemukan | M | Ada |
| FR-TKT-03 | E-Tiket menampilkan foto, nama, NIM, prodi, kampus, kode tiket, nomor kursi, pintu masuk, ruang, sesi, tanggal, dan QR Code | M | Ada |
| FR-TKT-04 | Pengguna dapat mencetak tiket dan piagam melalui dialog cetak browser dengan tata letak khusus cetak | M | Ada |
| FR-TKT-05 | Bar pengingat kalender, salin teks WhatsApp, dan unduh .ics tersedia di kedua tab | S | Ada |
| FR-TKT-06 | Simulasi pemindaian QR menampilkan notifikasi verifikasi berhasil | C | Sebagian (simulasi) |
| FR-TKT-07 | Verifikasi QR sungguhan: kode QR memuat identitas tiket yang divalidasi terhadap data server | M | Belum |
| FR-TKT-08 | Piagam memuat nama peserta, tanggal, nomor dokumen, dan kode otentikasi | M | Sebagian |

### 5.5 Kartu Ujian (KTPU) dan Simulasi

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-EXM-01 | Menampilkan KTPU peserta terpilih: foto, nomor ujian, ruang, sesi, tanggal, kursi, pintu, dan QR Code | M | Ada |
| FR-EXM-02 | Pengguna dapat memilih peserta dari daftar dan mencetak KTPU | M | Ada |
| FR-EXM-03 | Modal simulasi soal: pilihan ganda, jawaban tersimpan per soal, kirim satu kali, lalu skor dihitung dalam persen | M | Ada |
| FR-EXM-04 | Setelah dikirim, jawaban terkunci dan pembahasan dapat dilihat | S | Ada |

### 5.6 Direktori Kader dan Buku Induk

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-DIR-01 | Pemilih angkatan (silsilah 15 angkatan, default angkatan XV) dengan profil angkatan | M | Ada |
| FR-DIR-02 | Pencarian kader serta filter divisi, sub-divisi, dan status | M | Ada |
| FR-DIR-03 | Kartu kader dan modal profil detail | M | Ada |
| FR-DIR-04 | Menu pendiri/arsip dan unduhan Buku Induk (dengan notifikasi toast) | S | Sebagian |

### 5.7 Galeri dan Dokumentasi

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-GAL-01 | Daftar arsip kegiatan dengan filter kategori, pencarian, dan urutan (terbaru, terlama, jumlah peserta) | M | Ada |
| FR-GAL-02 | Modal detail kegiatan dan aksi unduh dokumentasi (notifikasi toast) | S | Sebagian |
| FR-GAL-03 | Ringkasan statistik kegiatan dan seksi liputan pers | S | Ada |

### 5.8 E-Library Integritas dan Kanal Advokasi

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-LIB-01 | Katalog dokumen dengan kategori (Modul Diklat, Kajian Strategis, Regulasi & UU, White Paper, Jurnal Integritas) | M | Ada |
| FR-LIB-02 | Pencarian teks pada judul, deskripsi, label, dan divisi penulis, dikombinasikan dengan filter kategori, topik, dan tahun | M | Ada |
| FR-LIB-03 | Modal pratinjau: sampul, abstrak, bab, poin penting, sitasi yang dapat disalin, dan tombol unduh | M | Ada |
| FR-LIB-04 | Formulir pengiriman naskah (nama penulis, kategori, tautan naskah; ketiganya wajib kecuali kategori yang punya nilai bawaan) menghasilkan entri status "Dalam Kurasi" dan toast konfirmasi (tinjau 3 hari kerja) | M | Ada |
| FR-LIB-05 | Daftar naskah advokasi yang dikirim ditampilkan dengan status Diterbitkan atau Dalam Kurasi | S | Ada |
| FR-LIB-06 | Unggah berkas PDF sungguhan, penyimpanan di server, dan hitungan unduhan nyata | S | Belum |
| FR-LIB-07 | Alur kurasi oleh admin (setujui, tolak, terbitkan) | S | Belum |

### 5.9 Whistleblowing System (WBS)

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-WBS-01 | Dua tab: **Buat Laporan** dan **Lacak Laporan** | M | Ada |
| FR-WBS-02 | Pelapor memilih mode **Anonim** atau **Identitas Terverifikasi**; bila tidak anonim, kolom identitas ditampilkan | M | Ada |
| FR-WBS-03 | Kategori laporan: Pungutan Liar (Pungli); Gratifikasi & Suap Akademik; Penyelewengan Dana Kegiatan; Konflik Kepentingan; Pelanggaran Etik Kader | M | Ada |
| FR-WBS-04 | Kolom: unit/pihak terlapor (wajib), tanggal kejadian, uraian (wajib), tautan bukti (opsional) | M | Ada |
| FR-WBS-05 | Setelah submit, sistem menerbitkan kode `WBS-2026-nnnn` dan menampilkan status awal "Verifikasi Bukti" | M | Sebagian (kode acak sisi klien) |
| FR-WBS-06 | Pelacakan berdasarkan kode (atau kata kunci unit/kategori); bila tidak ditemukan tampil pesan tidak ditemukan | M | Ada |
| FR-WBS-07 | Visualisasi progres 4 tahap: Diterima → Verifikasi Bukti → Investigasi Satgas → Selesai Ditindaklanjuti, beserta catatan tindak lanjut | M | Ada |
| FR-WBS-08 | Anonimitas yang nyata: identitas pelapor anonim tidak pernah disimpan atau dapat ditelusuri; label "SHA-256" pada antarmuka harus didukung enkripsi atau hashing sungguhan di server | M | Belum |
| FR-WBS-09 | Panel Satgas/Dewan Etik untuk memperbarui status laporan dan catatan tindak lanjut | M | Belum |
| FR-WBS-10 | Pencarian pelacakan hanya boleh cocok persis dengan kode laporan di versi produksi, agar laporan orang lain tidak dapat ditebak lewat kata kunci | M | Belum |

### 5.10 Transparansi dan Laporan Kas

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-TRN-01 | Tabel Buku Kas Umum: kode voucher, tanggal, program, kategori, jenis (pemasukan/pengeluaran), nominal, dan status auditor | M | Ada |
| FR-TRN-02 | Filter kategori: KOPASUS & Kaderisasi, Sosial & Ramadhan, Goes To School, Riset & Operasional | M | Ada |
| FR-TRN-03 | Tombol unduh laporan kas dengan toast konfirmasi | S | Sebagian |
| FR-TRN-04 | Ringkasan total pemasukan, pengeluaran, dan saldo dihitung dari data buku kas | S | Sebagian |
| FR-TRN-05 | Bendahara dapat menambah, mengubah, dan memverifikasi entri kas dengan jejak audit | S | Belum |

### 5.11 Penyimpanan Data dan Integrasi

| ID | Kebutuhan | Prioritas | Status |
| --- | --- | --- | --- |
| FR-DAT-01 | Data peserta, pendaftaran saya, naskah advokasi, laporan WBS, dan antrean KOPASUS bertahan setelah muat ulang halaman | M | Ada (localStorage, kunci `simak_*_v1`) |
| FR-DAT-02 | Bila penyimpanan lokal gagal atau penuh, aplikasi tetap berjalan menggunakan data awal | M | Ada |
| FR-DAT-03 | Migrasi data dari localStorage ke basis data server melalui API | M | Belum |
| FR-DAT-04 | Autentikasi dan otorisasi berbasis peran (publik, peserta, pengurus, Satgas/Dewan Etik, admin) | M | Belum |

## 6. Non-Functional Requirements

### 6.1 Desain dan Pengalaman Pengguna

| ID | Kebutuhan |
| --- | --- |
| NFR-UX-01 | Tampilan, tata letak, warna, tipografi, ikon, animasi, dan salinan teks **tidak diubah** dari prototipe Google AI Studio (lihat bagian 8) |
| NFR-UX-02 | Antarmuka berbahasa Indonesia (`lang="id"`) |
| NFR-UX-03 | Responsif: pengalaman utuh dari layar ponsel hingga desktop (ada menu mobile, grid adaptif, breakpoint `sm`, `lg`, `xl`) |
| NFR-UX-04 | Umpan balik tindakan melalui toast, modal, dan status yang jelas pada setiap aksi penting |

### 6.2 Kinerja

| ID | Kebutuhan |
| --- | --- |
| NFR-PRF-01 | Pindah layar terasa instan (< 300 ms) karena tanpa reload |
| NFR-PRF-02 | Largest Contentful Paint target ≤ 2,5 detik pada jaringan 4G |
| NFR-PRF-03 | Pencarian dan filter pada katalog, direktori, dan galeri merespons ≤ 200 ms untuk ≤ 1.000 entri |
| NFR-PRF-04 | Gambar dimuat lambat (lazy) dan dioptimalkan; animasi GSAP tidak mengganggu interaksi |
| NFR-PRF-05 | Layar berat (HomeScreen, RegistrationScreen, dll.) dipecah dengan code-splitting agar bundel awal lebih kecil |

### 6.3 Keamanan dan Privasi

| ID | Kebutuhan |
| --- | --- |
| NFR-SEC-01 | Seluruh lalu lintas melalui HTTPS |
| NFR-SEC-02 | Kanal WBS menjamin kerahasiaan pelapor: tidak mencatat IP atau metadata yang dapat mengidentifikasi pelapor anonim; data laporan terenkripsi saat disimpan |
| NFR-SEC-03 | Data pribadi (NIM, WhatsApp, email) dilindungi sesuai UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022); hanya data yang diperlukan yang dikumpulkan, dan ada pemberitahuan penggunaan data |
| NFR-SEC-04 | Masukan pengguna divalidasi dan disanitasi untuk mencegah XSS dan injeksi; tautan bukti dan naskah divalidasi skema URL |
| NFR-SEC-05 | Akses panel pengurus dibatasi autentikasi dan peran; kunci API (mis. `GEMINI_API_KEY`) hanya berada di sisi server, tidak pernah di bundel klien |
| NFR-SEC-06 | Daftar tamu publik tidak menampilkan data kontak pribadi (WhatsApp dan email) kepada pengunjung lain |
| NFR-SEC-07 | Pembatasan laju (rate limiting) dan perlindungan spam/bot pada formulir pendaftaran, antrean, WBS, dan pengiriman naskah |

### 6.4 Keandalan dan Ketersediaan

| ID | Kebutuhan |
| --- | --- |
| NFR-REL-01 | Ketersediaan target ≥ 99% terutama pada pekan menjelang dan saat HARLAH |
| NFR-REL-02 | Pencadangan basis data harian dan pemulihan terdokumentasi |
| NFR-REL-03 | Kegagalan penyimpanan atau jaringan tidak membuat aplikasi crash (penanganan galat dengan nilai bawaan) |

### 6.5 Kompatibilitas

| ID | Kebutuhan |
| --- | --- |
| NFR-CMP-01 | Mendukung dua versi mayor terbaru Chrome, Edge, Firefox, dan Safari, termasuk Chrome Android dan Safari iOS |
| NFR-CMP-02 | Cetak (`window.print`) menghasilkan dokumen rapi untuk E-Tiket, Piagam, dan KTPU di ukuran A4 |
| NFR-CMP-03 | File .ics yang diunduh dapat dibuka di Google Calendar, Apple Calendar, dan Outlook |

### 6.6 Aksesibilitas

| ID | Kebutuhan |
| --- | --- |
| NFR-ACC-01 | Mengacu pada WCAG 2.1 level AA tanpa mengubah identitas visual: label ARIA pada tombol ikon, fokus keyboard terlihat, kontras teks memadai |
| NFR-ACC-02 | Semua modal dapat ditutup dengan tombol dan tombol Esc; pencarian global dapat dibuka dengan keyboard |
| NFR-ACC-03 | Gambar bermakna memiliki teks alternatif |

### 6.7 Kemudahan Pemeliharaan

| ID | Kebutuhan |
| --- | --- |
| NFR-MNT-01 | Kode TypeScript dengan tipe terpusat (`types.ts`), lolos `tsc --noEmit` tanpa galat |
| NFR-MNT-02 | Data statis dipisahkan dari komponen (mis. `mockData.ts`) agar mudah diganti dengan sumber API |
| NFR-MNT-03 | Komponen besar (beberapa berkas lebih dari 50 KB) dipecah menjadi subkomponen tanpa mengubah keluaran visual |
| NFR-MNT-04 | Token desain dipusatkan di `@theme` pada `index.css` |

### 6.8 Penerapan (Deployment)

| ID | Kebutuhan |
| --- | --- |
| NFR-DEP-01 | Dapat dijalankan lokal dengan `npm install` dan `npm run dev` (port 3000) dan dibangun dengan `npm run build` |
| NFR-DEP-02 | Variabel lingkungan `GEMINI_API_KEY` dan `APP_URL` dikonfigurasi melalui environment, bukan dikode keras |

## 7. Scope

### 7.1 In Scope (rilis ini)

- Portal web satu halaman (SPA) berbahasa Indonesia dengan 9 layar: Beranda, Galeri, Direktori, Pendaftaran, E-Tiket, Kartu Ujian, E-Library, Whistleblower, Transparansi.
- Pendaftaran tamu HARLAH 29 Januari, antrean KOPASUS periode berikutnya, E-Tiket, Piagam, KTPU, dan simulasi soal 9 Nilai Integritas.
- E-Library (katalog, pratinjau, sitasi, unduh) dan kanal pengiriman naskah advokasi.
- WBS (laporan anonim atau terverifikasi, pelacakan 4 tahap).
- Transparansi Buku Kas Umum dan direktori kader per angkatan.
- Penyimpanan data, autentikasi peran, dan panel admin pada tahap produksi (lihat bagian 9).

### 7.2 Out of Scope

- Perubahan tampilan, tema, tata letak, atau salinan antarmuka dari prototipe Google AI Studio.
- Aplikasi mobile native (iOS/Android).
- Pembayaran online, penjualan tiket berbayar, atau integrasi payment gateway.
- Platform pembelajaran penuh (LMS), forum, dan obrolan langsung.
- Penegakan disiplin atau proses hukum atas laporan WBS (portal hanya menerima, mencatat, dan melacak).
- Penerapan sertifikat atau tanda tangan digital berlisensi pihak ketiga (di luar penandaan hash internal).
- Dukungan multibahasa selain Indonesia.

### 7.3 Asumsi dan Ketergantungan

- Pengguna memiliki browser modern dan koneksi internet.
- Sumber foto dan font berasal dari layanan eksternal (Unsplash, Google Fonts); bila perlu dapat dihosting mandiri tanpa mengubah tampilan.
- Pengurus SIMAK menyediakan konten resmi (dokumen, laporan kas, profil kader) dan menanggung keabsahannya.
- Kerangka kerja saat ini: React 19, Vite, Tailwind CSS 4, GSAP, Motion, Lucide, dan Material Symbols.

## 8. Batasan Desain (Wajib Mengikuti Google AI Studio)

Bagian ini mengikat seluruh tahap pengembangan. Tidak boleh ada perubahan visual selama implementasi kebutuhan di atas.

| Aspek | Ketentuan yang dipertahankan |
| --- | --- |
| Font | Plus Jakarta Sans (400–800) untuk semua gaya teks; ikon Material Symbols Outlined |
| Warna utama | Primary `#760009`, primary container `#991b1b`, on-primary `#ffffff`; surface `#f7f9fb`; secondary `#565e74`; tertiary `#572c00`; error `#ba1a1a`; aksen status sukses memakai emerald |
| Token | Seluruh token `@theme` di `src/index.css` (warna, spasi `space-xs` sampai `space-xl`, `margin`, `gutter`, ukuran teks label, body, headline, display) |
| Komponen | Kartu `rounded-2xl`, tombol `font-bold` berwarna primary, modal dengan latar buram, toast di kanan bawah, notifikasi web di kanan atas |
| Animasi | Animasi GSAP per halaman (`useGsapAnimations`), `fadeIn`, ping pada indikator status |
| Tata letak | Navbar tetap `pt-20` pada konten utama, lebar maksimum `max-w-7xl`, grid 12 kolom pada layar besar |
| Cetak | Elemen navigasi dan interaksi disembunyikan dengan `print:hidden`; tiket dan piagam memakai gaya cetak yang sudah ada |
| Salinan | Judul, label, dan teks bahasa Indonesia mengikuti prototipe |

**Aturan perubahan:** refaktor, penambahan backend, atau perbaikan performa hanya boleh dilakukan bila keluaran visual identik. Setiap perubahan yang berdampak ke tampilan harus disetujui pemilik produk terlebih dahulu.

## 9. Kesenjangan Prototipe terhadap Produksi

Hasil pembacaan kode menunjukkan prototipe saat ini berjalan sepenuhnya di sisi klien. Hal-hal berikut perlu dibangun agar sesuai SRS, tanpa mengubah tampilan:

1. **Tidak ada backend.** Semua data hidup di `localStorage` per browser sehingga pendaftaran satu orang tidak terlihat oleh pengurus atau pengguna lain.
2. **Kode tiket, kursi, dan kode WBS dibuat dengan `Math.random()`** sehingga berpotensi bentrok dan tidak dapat diverifikasi.
3. **Label "SHA-256" dan "anonim terenkripsi"** pada WBS, piagam, dan E-Library adalah teks antarmuka; belum ada proses hashing atau enkripsi yang terlihat di kode layar yang dibaca. Klaim ini harus diwujudkan atau diredam sebelum rilis publik.
4. **Pelacakan WBS** mencocokkan sebagian teks pada unit dan kategori, bukan hanya kode laporan, sehingga laporan orang lain dapat ditemukan dengan kata kunci umum.
5. **Simulasi pemindaian QR**, unduhan Buku Induk, unduhan galeri, dan unduhan laporan kas hanya memunculkan notifikasi.
6. **Tanggal pengiriman WBS** ditulis tetap ("18 Oktober 2026") dan bukan tanggal saat laporan dikirim.
7. **Daftar tamu** memuat WhatsApp dan email di data yang bisa dilihat siapa saja, sehingga perlu pembatasan tampilan.
8. **Tidak ada autentikasi** untuk pengurus, Satgas, dan Dewan Etik.

## 10. Kriteria Penerimaan Ringkas

- Seluruh layar tampil identik dengan prototipe Google AI Studio (perbandingan visual per layar).
- Pendaftaran HARLAH yang valid menghasilkan kode tiket unik tersimpan di server dan dapat dicari ulang oleh pengguna lain.
- Laporan WBS anonim tidak memuat data yang dapat mengidentifikasi pelapor, dan hanya dapat dilacak lewat kode laporan.
- E-Tiket, Piagam, dan KTPU tercetak rapi pada A4 tanpa navbar atau tombol.
- `npm run lint` dan `npm run build` selesai tanpa galat.
