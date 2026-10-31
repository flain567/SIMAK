# PRD — Portal SIMAK (Spesialisasi Mahasiswa Anti Korupsi)

Product Requirements Document · Versi 1.0 (Draft) · 29 Oktober 2026 Pemilik produk: SIMAK Institut STIAMI · Sumber analisis: prototipe "Remix SIMAK" dari Google AI Studio

## 1. Ringkasan Produk

Portal SIMAK adalah situs web resmi organisasi SIMAK (Spesialisasi Mahasiswa Anti Korupsi) Institut STIAMI. Portal ini menyatukan satu pintu digital untuk: informasi organisasi dan program kerja, registrasi tamu HARLAH, antrean rekrutmen kader KOPASUS, E-Tiket dan Kartu Ujian, E-Library antikorupsi, kanal pelaporan (whistleblowing), laporan kas yang transparan, serta galeri dan direktori kader.

Prototipe saat ini berjalan sepenuhnya di sisi klien (React 19, Vite, Tailwind CSS 4, GSAP, Lucide, Material Symbols). Data disimpan di `localStorage` dan memakai data contoh (mock). PRD ini mendefinisikan produk yang dituju, sekaligus menandai apa yang sudah ada di prototipe dan apa yang masih perlu dibangun agar siap dipakai sungguhan.

**Prinsip utama PRD ini:** desain dan tampilan web **tidak diubah**. Seluruh kebutuhan di bawah dibangun di atas UI yang sudah ada di Google AI Studio (lihat bagian 8.3).

## 2. Problem Statement

SIMAK mengelola kegiatan yang tersebar dan masih manual, sementara organisasinya bertugas menegakkan integritas, sehingga transparansinya sendiri harus bisa dibuktikan.

- **Pendaftaran dan administrasi acara tersebar.** Registrasi tamu HARLAH (29 Januari), seleksi kader KOPASUS, penerbitan tiket, dan nomor ujian rawan dilakukan lewat kanal terpisah (formulir, chat, spreadsheet). Akibatnya data ganda, tiket tidak terlacak, dan panitia kesulitan memverifikasi kehadiran.
- **Materi antikorupsi sulit diakses.** Modul diklat, white paper, regulasi, dan jurnal integritas tidak punya satu katalog yang bisa dicari, difilter, dan diunduh, sehingga manfaatnya terbatas pada peserta diklat.
- **Mahasiswa takut atau tidak tahu cara melapor.** Pungli, gratifikasi akademik, penyelewengan dana kegiatan, dan konflik kepentingan jarang dilaporkan karena tidak ada kanal yang menjamin kerahasiaan dan menunjukkan perkembangan tindak lanjut.
- **Akuntabilitas keuangan dan kegiatan belum mudah diperiksa publik.** Organisasi antikorupsi perlu menunjukkan arus kas, dokumentasi kegiatan, dan susunan kader secara terbuka agar kredibel.
- **Identitas organisasi dan rekrutmen tidak tersampaikan konsisten.** Calon kader dan mitra tidak punya sumber tunggal untuk profil BPH, program kerja, dan FAQ.

## 3. Goals

### 3.1 Tujuan produk

1. Menyediakan satu portal resmi yang menjadi sumber kebenaran untuk registrasi, tiket, dan informasi SIMAK.
2. Menghilangkan proses manual pada registrasi HARLAH dan antrean KOPASUS lewat alur digital end-to-end, dari daftar sampai bukti kehadiran.
3. Menjadikan materi integritas mudah ditemukan dan diunduh lewat E-Library, serta membuka jalur kontribusi naskah mahasiswa.
4. Menyediakan kanal pelaporan aman dengan opsi anonim dan pelacakan status yang jelas.
5. Membuktikan akuntabilitas SIMAK lewat laporan kas, galeri kegiatan, dan direktori kader yang terbuka.

### 3.2 Indikator keberhasilan (usulan target, perlu disepakati)

| Indikator | Target awal |
| --- | --- |
| Registrasi HARLAH yang diselesaikan sampai E-Tiket terbit | ≥ 90% dari yang memulai formulir |
| Pendaftaran ganda (NIM/WA sama) yang lolos | 0 |
| Waktu menyelesaikan registrasi tamu | ≤ 3 menit |
| Laporan WBS yang menerima kode pelacakan | 100% |
| Laporan WBS yang berstatus diperbarui dalam SLA internal | ≥ 90% |
| Unduhan dokumen E-Library per bulan | Naik dibanding baseline bulan pertama |
| Skor Lighthouse (Performance / Accessibility) di perangkat seluler | ≥ 80 / ≥ 90 |

### 3.3 Bukan tujuan (non-goals)

- Bukan sistem akademik kampus atau pengganti SIAKAD.
- Bukan platform e-learning penuh dengan penilaian dan sertifikasi resmi.
- Tidak mengubah identitas visual yang sudah ada.

## 4. Target Users

| Persona | Deskripsi | Kebutuhan utama |
| --- | --- | --- |
| **Tamu HARLAH** | Alumni, delegasi BEM/BLM/UKM, mahasiswa, dan undangan eksternal yang ingin hadir di puncak HARLAH. | Daftar cepat, dapat E-Tiket dan QR, tahu lokasi dan jadwal, bisa menyimpan ke kalender. |
| **Calon Kader KOPASUS** | Mahasiswa yang berminat bergabung di kepengurusan periode berikutnya. | Masuk antrean, memilih divisi, memperoleh kartu ujian dan nomor ujian, melihat simulasi soal. |
| **Kader / Pengurus SIMAK** | Anggota BPH dan divisi (Litbang, Kominfo, Usaha, Operasional). | Tampil di direktori, mengunggah materi, menindaklanjuti laporan, mengelola data peserta. |
| **Mahasiswa dan Sivitas Akademika** | Pembaca umum di lingkungan Institut STIAMI. | Membaca E-Library, mengirim naskah, melapor via WBS, melihat transparansi dan galeri. |
| **Pelapor (Whistleblower)** | Siapa pun yang menyaksikan pungli, gratifikasi, atau penyelewengan dana. | Anonimitas, kemudahan melapor, kode pelacakan, kepastian tindak lanjut. |
| **Admin / Satgas / Dewan Etik** | Pihak yang memverifikasi peserta dan menangani laporan. | Antrean verifikasi, perubahan status, catatan tindak lanjut, ekspor data. |
| **Pimpinan dan Mitra** | Rektorat, biro kemahasiswaan, mitra eksternal. | Melihat profil organisasi, program kerja, dan laporan kas. |

## 5. User Stories

Prioritas: **P0** wajib untuk rilis, **P1** penting, **P2** pelengkap.

### 5.1 Beranda dan Informasi Organisasi

- **US-01 (P0)** Sebagai pengunjung, saya ingin melihat ringkasan SIMAK, hitung mundur HARLAH, dan tombol aksi utama agar langsung paham dan bisa mendaftar.
- **US-02 (P1)** Sebagai pengunjung, saya ingin melihat program kerja dan memfilternya (semua, akan datang, selesai) agar tahu kegiatan SIMAK.
- **US-03 (P1)** Sebagai pengunjung, saya ingin membuka profil pimpinan BPH agar tahu siapa yang memimpin.
- **US-04 (P1)** Sebagai pengunjung, saya ingin membaca FAQ per kategori (HARLAH, KOPASUS, divisi) agar pertanyaan saya terjawab tanpa bertanya manual.

### 5.2 Registrasi dan Tiket

- **US-05 (P0)** Sebagai tamu HARLAH, saya ingin mengisi formulir (kategori tamu, nama, NIM/ID, WhatsApp, email, institusi, kampus, sesi, motivasi) dan menyetujui pernyataan kehadiran agar terdaftar.
- **US-06 (P0)** Sebagai tamu, saya ingin sistem memberi tahu bila NIM/WhatsApp/nama saya sudah terdaftar agar tidak mendaftar ganda.
- **US-07 (P0)** Sebagai tamu, saya ingin langsung menerima notifikasi, kode E-Tiket, dan nomor kursi setelah mendaftar agar yakin pendaftaran berhasil.
- **US-08 (P0)** Sebagai tamu, saya ingin membuka E-Tiket berQR dan mencetaknya agar bisa ditunjukkan di meja registrasi.
- **US-09 (P1)** Sebagai tamu, saya ingin menyimpan acara ke Google Calendar atau berkas .ics dan menyalin teks undangan WhatsApp agar tidak lupa hadir.
- **US-10 (P1)** Sebagai tamu, saya ingin mencari status pendaftaran dengan nama, NIM, kode tiket, atau nomor WhatsApp agar bisa mengambil tiket kembali.
- **US-11 (P1)** Sebagai tamu, saya ingin mengakses piagam integritas elektronik agar punya bukti keikutsertaan.
- **US-12 (P0)** Sebagai calon kader, saya ingin masuk antrean KOPASUS dengan memilih divisi dan menulis alasan agar diprioritaskan pada periode berikutnya, dan mendapat kode antrean.
- **US-13 (P1)** Sebagai calon kader, saya ingin melihat Kartu Ujian (KTPU) berisi nomor ujian, ruang, sesi, dan kursi, serta mencobanya sebagai simulasi soal.

### 5.3 E-Library dan Kontribusi

- **US-14 (P0)** Sebagai mahasiswa, saya ingin menelusuri dokumen berdasarkan kategori (Modul Diklat, Kajian Strategis, Regulasi & UU, White Paper, Jurnal Integritas), topik, dan tahun agar cepat menemukan referensi.
- **US-15 (P0)** Sebagai mahasiswa, saya ingin pratinjau abstrak dan poin penting sebelum mengunduh PDF agar tahu dokumen itu relevan.
- **US-16 (P1)** Sebagai mahasiswa, saya ingin mengirim tautan naskah opini, policy brief, atau esai agar dikurasi dan diterbitkan SIMAK.
- **US-17 (P2)** Sebagai pembaca, saya ingin melihat tanda tangan elektronik pada dokumen resmi agar yakin keasliannya.

### 5.4 Whistleblowing

- **US-18 (P0)** Sebagai pelapor, saya ingin melapor secara anonim penuh agar identitas saya terlindungi.
- **US-19 (P0)** Sebagai pelapor, saya ingin memilih kategori (pungli, gratifikasi dan suap akademik, penyelewengan dana kegiatan, konflik kepentingan, pelanggaran etik kader), menuliskan unit terlapor, tanggal kejadian, ringkasan, dan tautan bukti.
- **US-20 (P0)** Sebagai pelapor, saya ingin menerima kode pelacakan dan memantau 4 tahap proses (diterima, verifikasi bukti, investigasi satgas, selesai ditindaklanjuti).
- **US-21 (P1)** Sebagai pelapor yang bersedia, saya ingin melapor dengan identitas yang dirahasiakan Dewan Etik agar laporan lebih mudah diverifikasi.

### 5.5 Transparansi, Galeri, dan Direktori

- **US-22 (P0)** Sebagai publik, saya ingin melihat buku kas (pemasukan dan pengeluaran, kode voucher, status audit) dan memfilternya per kategori agar bisa menilai pengelolaan dana.
- **US-23 (P1)** Sebagai publik, saya ingin menelusuri galeri agenda terdokumentasi dengan filter kategori dan urutan (terbaru, terlama, jumlah peserta).
- **US-24 (P1)** Sebagai publik, saya ingin melihat direktori kader per angkatan, difilter divisi, sub-divisi, dan status, serta membuka detail anggota.

### 5.6 Admin

- **US-25 (P0)** Sebagai admin, saya ingin memverifikasi peserta dan mengubah status (menunggu verifikasi, terverifikasi) agar data kehadiran akurat.
- **US-26 (P0)** Sebagai Satgas/Dewan Etik, saya ingin melihat laporan WBS, mengubah tahap, dan menulis catatan tindak lanjut agar pelapor melihat perkembangan.
- **US-27 (P1)** Sebagai admin, saya ingin memindai QR E-Tiket saat acara untuk mencatat kehadiran.
- **US-28 (P1)** Sebagai admin, saya ingin mengelola konten (dokumen E-Library, galeri, kas, direktori, program kerja) tanpa mengubah kode.

## 6. Functional Requirements

Kolom keterangan: **Ada** = sudah berjalan di prototipe (sisi klien); **Perlu backend** = logika ada tetapi perlu penyimpanan dan validasi server agar siap produksi; **Baru** = belum ada.

### 6.1 Navigasi dan Kerangka Halaman

- **FR-01 (P0)** Portal memiliki 9 layar: Beranda, Galeri, Direktori, Pendaftaran, E-Tiket, Kartu Ujian, E-Library, Whistleblower, Transparansi. *(Ada)*
- **FR-02 (P0)** Navbar tetap di atas halaman dengan tautan bagian beranda dan menu portal (Registrasi Tamu HARLAH, E-Tiket & Piagam, Kartu Ujian, Direktori, Galeri, E-Library, WBS, Transparansi). *(Ada)*
- **FR-03 (P1)** Footer menyediakan tautan cepat ke seluruh layar. *(Ada)*
- **FR-04 (P1)** Tombol "Ke Atas" muncul setelah gulir jauh, dan pintasan "E-Tiket Saya" muncul bila pengguna sudah terdaftar HARLAH. *(Ada)*
- **FR-05 (P2)** Setiap layar punya URL yang bisa dibagikan dan dibuka langsung (deep link), bukan hanya state internal. *(Baru)*

### 6.2 Beranda

- **FR-06 (P0)** Hero dengan hitung mundur ke HARLAH berikutnya dan tombol aksi menuju pendaftaran. *(Ada)*
- **FR-07 (P1)** Daftar program kerja dengan filter semua / akan datang / selesai dan modal detail. *(Ada)*
- **FR-08 (P1)** Profil pimpinan BPH dengan modal detail. *(Ada)*
- **FR-09 (P1)** FAQ akordeon dengan filter kategori. *(Ada)*

### 6.3 Registrasi Tamu HARLAH

- **FR-10 (P0)** Formulir berisi: kategori tamu, nama lengkap, NIM/ID, nomor WhatsApp, email, institusi/prodi, kampus, pilihan sesi, motivasi (opsional), dan centang pernyataan kehadiran. *(Ada)*
- **FR-11 (P0)** Validasi wajib untuk nama, NIM/ID, WhatsApp, email, dan persetujuan pernyataan, dengan pesan kesalahan berbahasa Indonesia. *(Ada)*
- **FR-12 (P0)** Format email dan nomor WhatsApp divalidasi, bukan hanya diperiksa terisi. *(Baru)*
- **FR-13 (P0)** Deteksi pendaftaran ganda secara langsung berdasarkan NIM, WhatsApp, atau nama, dan menawarkan membuka tiket yang sudah ada. *(Ada; perlu backend untuk pengecekan lintas perangkat)*
- **FR-14 (P0)** Setelah berhasil: modal bukti pendaftaran, toast notifikasi global, kode E-Tiket, dan nomor kursi. Kode tiket dan kursi unik serta dibuat oleh server. *(Ada; saat ini acak di klien, perlu backend)*
- **FR-15 (P1)** Aksi pasca-daftar: salin kode tiket, salin teks undangan WhatsApp, unduh .ics, tambah ke Google Calendar. *(Ada)*
- **FR-16 (P1)** Kolom cek status pendaftaran (min. 3 karakter) berdasarkan nama, NIM, kode tiket, atau WhatsApp. *(Ada)*
- **FR-17 (P1)** Pengiriman email konfirmasi berisi E-Tiket. *(Baru)*
- **FR-18 (P1)** Kuota sesi/kursi dan penutupan pendaftaran otomatis saat penuh atau melewati batas waktu. *(Baru)*

### 6.4 Antrean Rekrutmen KOPASUS

- **FR-19 (P0)** Pendaftaran KOPASUS ditampilkan sebagai antrean periode berikutnya, dengan formulir: nama, NIM, prodi, semester, WhatsApp, email, divisi pilihan, alasan. *(Ada)*
- **FR-20 (P0)** Validasi wajib nama, NIM, WhatsApp, email; kode antrean berformat `WL-KPS-NEXT-xxx` diterbitkan setelah kirim. *(Ada; perlu backend untuk nomor urut yang konsisten)*
- **FR-21 (P1)** Admin dapat membuka, menutup, dan mengekspor antrean per periode. *(Baru)*

### 6.5 E-Tiket dan Piagam Integritas

- **FR-22 (P0)** Layar E-Tiket menampilkan data peserta aktif: nama, NIM/ID, kategori, sesi, lokasi, meja registrasi, kursi, status, dan QR. *(Ada)*
- **FR-23 (P0)** Dua tab dokumen: Tiket dan Piagam (sertifikat elektronik). *(Ada)*
- **FR-24 (P0)** Pencarian peserta dengan status ditemukan / tidak ditemukan. *(Ada)*
- **FR-25 (P0)** Cetak lewat `window.print()` dengan gaya cetak yang menyembunyikan navigasi. *(Ada)*
- **FR-26 (P1)** Simulasi pindai QR pada prototipe diganti pemindaian sungguhan oleh panitia, dan hasilnya mencatat kehadiran. *(Baru)*
- **FR-27 (P1)** Piagam hanya terbit untuk peserta yang tercatat hadir. *(Baru)*

### 6.6 Kartu Ujian (KTPU) dan Simulasi

- **FR-28 (P1)** Kartu Ujian memuat nomor ujian, ruang, sesi, tanggal, gerbang, dan kursi peserta, serta tanda tangan elektronik. *(Ada)*
- **FR-29 (P1)** Simulasi soal pilihan ganda dengan pemilihan jawaban. *(Ada)*
- **FR-30 (P1)** Cetak Kartu Ujian. *(Ada)*

### 6.7 E-Library dan Kurasi Naskah

- **FR-31 (P0)** Katalog dokumen dengan filter kategori, topik, dan tahun (termasuk arsip). *(Ada)*
- **FR-32 (P0)** Kartu dokumen menampilkan kode, judul, subjudul, penulis, tahun, jumlah halaman, ukuran berkas, dan jumlah unduhan. *(Ada)*
- **FR-33 (P0)** Modal pratinjau dengan abstrak, poin penting, dan navigasi bab. *(Ada)*
- **FR-34 (P0)** Unduh PDF sungguhan dari penyimpanan berkas dan penghitungan unduhan di server. *(Perlu backend; saat ini tombol demonstrasi)*
- **FR-35 (P1)** Kirim naskah (nama penulis, kategori, tautan) dengan status awal "Dalam Kurasi" dan notifikasi konfirmasi. *(Ada; perlu backend)*
- **FR-36 (P1)** Admin mengubah status naskah menjadi "Diterbitkan" dan menampilkannya di daftar publikasi. *(Baru)*

### 6.8 Whistleblowing (WBS)

- **FR-37 (P0)** Dua tab: Formulir Laporan dan Lacak Laporan. *(Ada)*
- **FR-38 (P0)** Formulir: kategori (5 pilihan), unit terlapor (wajib), tanggal kejadian, ringkasan (wajib), tautan bukti (opsional), dan toggle anonim (bawaan: anonim). *(Ada)*
- **FR-39 (P0)** Bila tidak anonim, kolom identitas pelapor ditampilkan dan dirahasiakan dari publik. *(Ada)*
- **FR-40 (P0)** Setelah kirim, terbit kode pelacakan `WBS-2026-xxxx` dan laporan masuk tahap 2 (Verifikasi Bukti). *(Ada)*
- **FR-41 (P0)** Pelacakan menampilkan 4 tahap berurutan: Diterima, Verifikasi Bukti, Investigasi Satgas, Selesai Ditindaklanjuti, beserta catatan tindak lanjut. *(Ada)*
- **FR-42 (P0)** Pelacakan menemukan laporan lewat kode (pencocokan persis). Pencarian bebas berdasarkan unit atau kategori **tidak boleh** membuka laporan orang lain; harus dibatasi pada kode pelacakan. *(Perubahan perilaku; lihat bagian 8.4)*
- **FR-43 (P0)** Perlindungan anonimitas sungguhan: identitas anonim tidak disimpan, tidak mencatat IP, dan isi laporan dienkripsi di server. Label "SHA-256" di UI harus sesuai dengan mekanisme yang benar-benar dipakai. *(Baru)*
- **FR-44 (P1)** Satgas/Dewan Etik memperbarui tahap dan catatan lewat panel admin. *(Baru)*

### 6.9 Transparansi

- **FR-45 (P0)** Tabel buku kas: kode voucher, tanggal, program, kategori, jenis (pemasukan/pengeluaran), nominal, dan status auditor. *(Ada)*
- **FR-46 (P0)** Filter kategori: KOPASUS & Kaderisasi, Sosial & Ramadhan, Goes To School, Riset & Operasional. *(Ada)*
- **FR-47 (P1)** Unduh laporan kas (PDF/CSV) yang menghasilkan berkas sungguhan. *(Perlu backend/generator)*
- **FR-48 (P1)** Ringkasan saldo dan total per kategori konsisten dengan baris yang ditampilkan. *(Baru untuk verifikasi otomatis)*

### 6.10 Galeri dan Direktori

- **FR-49 (P1)** Galeri agenda dengan filter kategori, urutan (terbaru, terlama, peserta terbanyak), modal detail, dan penghitung "x dari 48". *(Ada)*
- **FR-50 (P1)** Direktori kader per angkatan (bawaan angkatan XV) dengan filter divisi (BPH, Litbang, Kominfo, Usaha, Operasional), sub-divisi, dan status, serta modal profil anggota. *(Ada)*
- **FR-51 (P1)** Unduh Buku Induk/arsip bila tersedia. *(Perlu backend)*

### 6.11 Administrasi dan Data

- **FR-52 (P0)** Autentikasi admin (login, peran: Admin, Panitia, Satgas/Dewan Etik) untuk semua aksi di bagian 5.6. *(Baru)*
- **FR-53 (P0)** Basis data server menggantikan `localStorage` untuk peserta, antrean, naskah, laporan WBS, dokumen, dan kas. *(Baru)*
- **FR-54 (P1)** Ekspor data peserta dan antrean (CSV) untuk panitia. *(Baru)*
- **FR-55 (P2)** Log audit untuk setiap perubahan status dan data sensitif. *(Baru)*

## 7. Non-Functional Requirements

### 7.1 Kinerja

- **NFR-01** Halaman utama memuat konten bermakna ≤ 3 detik pada jaringan 4G rata-rata.
- **NFR-02** Komponen layar yang besar (Beranda, Registrasi, E-Library, Direktori, Galeri) dipecah per rute (code splitting dan lazy loading) agar bundel awal kecil.
- **NFR-03** Gambar dimuat malas dan dioptimalkan; gambar eksternal (Unsplash) diganti aset milik SIMAK atau dihosting sendiri sebelum produksi.
- **NFR-04** Animasi GSAP tidak menghambat interaksi dan dinonaktifkan otomatis bila pengguna memilih `prefers-reduced-motion` (perilaku ini sudah ada).

### 7.2 Keamanan dan Privasi

- **NFR-05** Seluruh lalu lintas lewat HTTPS; header keamanan standar (CSP, HSTS, X-Content-Type-Options).
- **NFR-06** Data pribadi (nama, NIM, WhatsApp, email, identitas pelapor) dikelola sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi: ada pemberitahuan tujuan, persetujuan, batas retensi, dan mekanisme hapus data.
- **NFR-07** Data WBS diperlakukan paling sensitif: enkripsi saat disimpan, akses berbasis peran, dan tidak menampilkan data pelapor di antarmuka publik.
- **NFR-08** Perlindungan terhadap spam dan penyalahgunaan formulir (rate limiting, CAPTCHA atau mekanisme setara) tanpa mengubah tampilan formulir yang ada.
- **NFR-09** Rahasia seperti kunci API tidak disimpan di kode klien; panggilan ke layanan pihak ketiga lewat server.
- **NFR-10** Kode tiket dan kode pelacakan tidak dapat ditebak secara berurutan (entropi cukup dan dibuat di server).

### 7.3 Ketersediaan dan Keandalan

- **NFR-11** Ketersediaan ≥ 99,5% per bulan, dan ≥ 99,9% pada pekan HARLAH.
- **NFR-12** Sistem mampu menangani lonjakan pendaftaran menjelang acara (target awal ≥ 500 pengguna bersamaan).
- **NFR-13** Pencadangan basis data harian dengan uji pemulihan berkala.
- **NFR-14** Bila penyimpanan gagal, formulir menampilkan pesan yang jelas dan tidak menghapus isian pengguna.

### 7.4 Kompatibilitas dan Responsivitas

- **NFR-15** Mobile-first; berfungsi baik pada lebar 360 px hingga layar desktop lebar.
- **NFR-16** Mendukung dua versi terakhir Chrome, Edge, Safari, dan Firefox, termasuk Safari iOS dan Chrome Android.
- **NFR-17** Gaya cetak (print) untuk E-Tiket, Piagam, dan Kartu Ujian tetap berfungsi: navigasi dan elemen melayang tersembunyi saat dicetak (perilaku ini sudah ada).

### 7.5 Aksesibilitas dan Bahasa

- **NFR-18** Mengacu pada WCAG 2.1 AA: kontras warna, urutan fokus, label pada tombol ikon (`aria-label`), dan navigasi keyboard pada modal dan akordeon.
- **NFR-19** Bahasa antarmuka Bahasa Indonesia (`lang="id"`), zona waktu Asia/Jakarta (WIB) untuk semua tanggal dan jadwal.

### 7.6 Maintainability dan Operasional

- **NFR-20** Kode TypeScript strict dengan `tsc --noEmit` lulus pada CI; tipe data bersama di `types.ts` menjadi kontrak antara UI dan API.
- **NFR-21** Konten statis (program kerja, FAQ, dokumen, galeri, direktori, kas) dipisahkan dari komponen UI agar dapat diperbarui lewat CMS/API tanpa mengubah tampilan.
- **NFR-22** Pemantauan galat dan analitik dasar (tanpa melacak identitas pelapor WBS).

## 8. Scope

### 8.1 In Scope

- Seluruh 9 layar yang ada di prototipe Google AI Studio, dengan perilaku sesuai bagian 6.
- Backend dan basis data untuk registrasi HARLAH, antrean KOPASUS, naskah E-Library, laporan WBS, dokumen, dan buku kas.
- Panel admin sederhana untuk verifikasi peserta, pemindaian kehadiran, tindak lanjut WBS, dan pengelolaan konten.
- Notifikasi email konfirmasi pendaftaran.
- Penguatan keamanan, privasi, dan aksesibilitas tanpa mengubah tampilan.

### 8.2 Out of Scope (rilis ini)

- Redesain, penggantian tema, warna, tipografi, tata letak, atau komponen visual apa pun.
- Integrasi dengan SIAKAD atau sistem akademik kampus.
- Pembayaran atau tiket berbayar.
- Aplikasi seluler native.
- Sistem sertifikasi resmi dengan penilaian otomatis; simulasi soal hanya latihan.
- Forum, komentar, atau fitur media sosial.
- Dukungan multibahasa selain Bahasa Indonesia.

### 8.3 Batasan Desain dan Tampilan (wajib dipatuhi)

Desain web **tidak boleh diubah** dan harus tetap sama persis dengan yang ada di Google AI Studio. Artinya:

- **Token desain dipertahankan:** palet warna Material (misalnya `primary #760009`, `primary-container #991b1b`, `surface #f7f9fb`, `tertiary #572c00`, `error #ba1a1a`), skala spasi (`gutter`, `margin`, `space-*`), dan skala tipografi (`label-sm` hingga `display-lg`) di `src/index.css`.
- **Tipografi dan ikon:** font Plus Jakarta Sans dan Material Symbols Outlined tetap dipakai.
- **Komponen dan tata letak:** struktur Navbar, Footer, kartu, modal, toast, akordeon, tombol melayang, dan seluruh susunan halaman tidak diubah.
- **Animasi:** perilaku GSAP dan transisi yang ada dipertahankan.
- **Cara kerja perubahan:** setiap pekerjaan baru (backend, validasi, admin) harus menyambung ke UI yang sudah ada. Bila fitur baru memerlukan elemen tampilan baru, misalnya halaman login admin, elemen itu memakai token dan komponen yang sama dan harus disetujui pemilik produk terlebih dahulu.
- **Pengujian:** tiap rilis dibandingkan secara visual dengan versi AI Studio (screenshot regresi) pada lebar seluler, tablet, dan desktop.

### 8.4 Catatan Temuan pada Prototipe

Temuan berikut berasal dari pembacaan kode dan perlu diputuskan sebelum produksi. Semuanya dapat diselesaikan tanpa mengubah tampilan.

1. **Data hanya di perangkat pengguna.** Peserta, laporan WBS, dan naskah disimpan di `localStorage`, sehingga tidak terlihat oleh admin dan hilang bila data peramban dibersihkan.
2. **Kode tiket dan kursi dibuat acak di klien**, sehingga bisa bentrok dan tidak bisa diverifikasi saat acara.
3. **Label keamanan WBS bersifat visual.** Teks "Anonim Terenkripsi (SHA-256)" dan "SHA-256 Vault" belum disertai enkripsi atau penyimpanan aman yang sesungguhnya. Klaim ini harus dibuktikan atau teksnya disesuaikan agar tidak menyesatkan pelapor.
4. **Pelacakan WBS terlalu longgar.** Pencarian juga mencocokkan unit dan kategori, sehingga pengguna bisa membuka laporan orang lain. Pencarian harus dibatasi pada kode pelacakan.
5. **Pendaftaran HARLAH menandai peserta langsung "TERVERIFIKASI"** tanpa proses verifikasi nyata.
6. **Tanggal pengiriman WBS dan naskah ditulis tetap** (teks statis), bukan waktu server.
7. **Foto peserta dan gambar katalog memakai tautan Unsplash**, perlu diganti aset resmi.
8. **Sebagian tombol unduh bersifat demonstrasi** (Unduh PDF, laporan kas, arsip galeri) dan belum menghasilkan berkas.

### 8.5 Asumsi dan Ketergantungan

- Tanggal puncak HARLAH tetap 29 Januari, pukul 08.30 sampai 15.00 WIB, di Auditorium Utama Lt. 4, Kampus Pusat Institut STIAMI, Cempaka Putih.
- Pimpinan SIMAK menetapkan kebijakan retensi data dan SLA penanganan laporan WBS.
- Tersedia layanan email transaksional dan hosting (penyedia perlu dipilih).
- Konten resmi (dokumen, foto, data kas, direktori kader) disediakan dan disahkan oleh pengurus.

### 8.6 Tahapan Rilis (usulan)

| Fase | Cakupan |
| --- | --- |
| **Fase 1 — Fondasi** | Backend dan basis data; registrasi HARLAH, antrean KOPASUS, E-Tiket dengan kode dari server; login admin dan verifikasi peserta. |
| **Fase 2 — Kepercayaan** | WBS aman (enkripsi, pelacakan ketat, panel Satgas), unduhan dokumen dan laporan kas sungguhan, email konfirmasi. |
| **Fase 3 — Operasional acara** | Pemindaian QR kehadiran, piagam bagi yang hadir, ekspor data, log audit. |
| **Fase 4 — Penyempurnaan** | Deep link per layar, manajemen konten oleh admin, analitik, optimasi kinerja. |

### 8.7 Pertanyaan Terbuka

- Siapa pemilik data dan siapa yang berwenang menutup atau membuka pendaftaran?
- Berapa kuota tamu HARLAH dan batas waktu pendaftaran?
- Apa SLA tindak lanjut untuk setiap tahap WBS, dan siapa anggota Satgas/Dewan Etik?
- Apakah laporan kas ditampilkan apa adanya atau melalui persetujuan bendahara dan auditor terlebih dahulu?
- Platform hosting dan penyedia email apa yang akan dipakai?
