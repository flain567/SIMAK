import rateLimit from 'express-rate-limit';

/** Rate limiter untuk endpoint registrasi: max 10 req/menit per IP */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 menit
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
});

/** Rate limiter untuk endpoint auth: max 5 req/menit per IP */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 1 menit.' },
});

/** Rate limiter umum: max 100 req/menit per IP */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan.' },
});
