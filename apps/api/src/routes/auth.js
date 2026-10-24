import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authRequired, createSessionCookie, cookieOptions, cookieName } from '../middleware/auth.js';
const router = Router();
const loginSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(200) });
router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Email atau password tidak valid.' });
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
    if (!valid) return res.status(401).json({ success: false, message: 'Email atau password salah.' });
    const session = createSessionCookie(user.id);
    res.cookie(session.name, session.token, cookieOptions());
    return res.json({ success: true, data: { id: user.id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});
router.post('/logout', (_req, res) => { res.clearCookie(cookieName, cookieOptions()); res.json({ success: true, message: 'Berhasil keluar.' }); });
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, name: true, email: true } });
    if (!user) return res.status(401).json({ success: false, message: 'Akun tidak ditemukan.' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
});
export default router;