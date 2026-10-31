# Portal SIMAK — Panduan Setup & Deployment

> **Spesialisasi Mahasiswa Anti Korupsi (SIMAK) Institut STIAMI**  
> Portal resmi pendaftaran HARLAH, WBS terenkripsi, dan transparansi keuangan.

---

## Arsitektur

```
HARLAH SIMAK 16/
├── remix-simak---spesialisasi-mahasiswa-anti-korupsi (1)/   ← Frontend (React 19 + Vite)
│   ├── src/
│   │   ├── api/            ← Layer adapter (backend ↔ localStorage fallback)
│   │   ├── components/     ← UI screens (IDENTIK dengan prototipe AI Studio)
│   │   └── App.tsx
│   └── .env.local          ← VITE_API_URL (kosong = mode offline)
│
└── server/                                                   ← Backend (Express + Prisma)
    ├── src/
    │   ├── routes/         ← REST API endpoints
    │   ├── services/       ← Enkripsi, QR, ticket generation
    │   └── middleware/     ← JWT auth, rate limiting
    ├── prisma/
    │   ├── schema.prisma   ← 10 tabel PostgreSQL
    │   └── seed.ts         ← Data awal
    └── .env                ← Kredensial database & secrets
```

---

## Mode Offline (Tanpa Backend)

Frontend **langsung berfungsi** tanpa database atau backend. Semua data tersimpan di `localStorage` browser.

```bash
cd "remix-simak---spesialisasi-mahasiswa-anti-korupsi (1)"
npm install --legacy-peer-deps
npm run dev
```

Buka: **http://localhost:5173**

---

## Mode Produksi (Dengan Backend PostgreSQL)

### 1. Setup Database PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE simak_db;"
```

### 2. Konfigurasi Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/simak_db"
JWT_SECRET="minimal-32-karakter-acak-aman"
WBS_ENCRYPTION_KEY="generate-dengan-node-crypto-32-bytes-hex"
QR_HMAC_SECRET="generate-dengan-node-crypto-32-bytes-hex"
```

Generate keys yang aman:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Migrasi & Seed Database

```bash
cd server
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Jalankan Backend

```bash
cd server
npm run dev
```

Backend berjalan di: **http://localhost:3001**

### 5. Hubungkan Frontend ke Backend

```bash
cd "remix-simak---spesialisasi-mahasiswa-anti-korupsi (1)"
# .env.local sudah ada dengan VITE_API_URL kosong
# Vite proxy otomatis teruskan /api/* ke :3001
npm run dev
```

---

## Fitur Keamanan

| Fitur | Implementasi |
|---|---|
| Enkripsi laporan WBS | AES-256-GCM (server-side) |
| Verifikasi absensi QR | HMAC-SHA256 signed payload |
| Duplikasi pendaftaran | Unique constraint NIM di DB |
| Admin panel | JWT Bearer token (8 jam) |
| Rate limiting | 5/menit (auth), 3/menit (registrasi) |
| Audit log | Semua aksi admin tercatat |

---

## API Endpoints

### Publik
| Method | Path | Deskripsi |
|---|---|---|
| POST | /api/participants | Daftar peserta HARLAH |
| GET | /api/participants/ticket/:code | Cek tiket |
| POST | /api/waitlist | Daftar antrean KOPASUS |
| POST | /api/wbs | Kirim laporan WBS |
| GET | /api/wbs/track/:code | Lacak laporan WBS |
| GET | /api/library | Daftar dokumen e-library |
| GET | /api/ledger | Buku besar keuangan publik |

### Admin
| Method | Path | Deskripsi |
|---|---|---|
| POST | /api/auth/login | Login admin |
| GET | /api/admin/participants | Daftar semua peserta |
| GET | /api/admin/wbs | Baca laporan WBS (dekripsi) |
| POST | /api/admin/attendance/check-in | Scan QR absensi |

---

## Akun Admin Default (setelah seed)

```
Email   : admin@simak.ac.id
Password: SimakAdmin2026!
```

**Ganti password segera di production!**
