import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// Routes
import participantsRouter from './routes/participants';
import waitlistRouter from './routes/waitlist';
import authRouter from './routes/auth';
import wbsRouter from './routes/wbs';
import libraryRouter from './routes/library';
import ledgerRouter from './routes/ledger';
import galleryRouter from './routes/gallery';
import cadresRouter from './routes/cadres';

// Admin routes
import adminParticipantsRouter from './routes/admin/participants';
import adminWbsRouter from './routes/admin/wbs';
import adminAuditRouter from './routes/admin/auditLog';
import adminAttendanceRouter from './routes/admin/attendance';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly fallback
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Public routes ───────────────────────────────────────────
app.use('/api/participants', participantsRouter);
app.use('/api/waitlist', waitlistRouter);
app.use('/api/auth', authRouter);
app.use('/api/wbs', wbsRouter);
app.use('/api/library', libraryRouter);
app.use('/api/ledger', ledgerRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/cadres', cadresRouter);

// ─── Admin routes (protected) ────────────────────────────────
app.use('/api/admin/participants', adminParticipantsRouter);
app.use('/api/admin/wbs', adminWbsRouter);
app.use('/api/admin/audit-log', adminAuditRouter);
app.use('/api/admin/attendance', adminAttendanceRouter);

// ─── 404 handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// ─── Global error handler ────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan internal server' });
});

app.listen(PORT, () => {
  console.log(`✅ Server SIMAK berjalan di http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
