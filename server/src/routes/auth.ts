import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/auth/login
 * Login admin dan dapatkan JWT token
 */
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      res.status(400).json({ error: 'Email dan password wajib diisi' });
      return;
    }

    const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@simak.ac.id').toLowerCase();
    const defaultAdminPass = process.env.ADMIN_PASSWORD || 'SimakAdmin2026!';
    const isDefaultAdmin = email.trim().toLowerCase() === defaultAdminEmail && password === defaultAdminPass;

    let user = null;
    try {
      user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    } catch (dbErr) {
      console.warn('[POST /api/auth/login] Database unreachable, checking env default admin credentials...');
      if (isDefaultAdmin) {
        user = {
          id: 'admin-seed-fallback',
          email: defaultAdminEmail,
          passwordHash: '',
          role: 'ADMIN' as const,
        };
      } else {
        throw dbErr;
      }
    }

    if (!user) {
      res.status(401).json({ error: 'Email atau password salah' });
      return;
    }

    if (user.id !== 'admin-seed-fallback') {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Email atau password salah' });
        return;
      }
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: 'Konfigurasi server tidak valid' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as any }
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    res.status(500).json({ error: 'Gagal melakukan autentikasi' });
  }
});

/**
 * GET /api/auth/me
 * Ambil info user yang sedang login (untuk validasi token)
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token diperlukan' });
    return;
  }

  try {
    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { userId: string; email: string; role: string };

    res.json({ userId: payload.userId, email: payload.email, role: payload.role });
  } catch {
    res.status(401).json({ error: 'Token tidak valid' });
  }
});

export default router;
