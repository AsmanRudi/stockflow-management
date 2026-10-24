import jwt from 'jsonwebtoken';
const cookieName = 'stockflow_session';
export function createSessionCookie(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters.');
  const token = jwt.sign({ sub: userId }, secret, { expiresIn: '12h', issuer: 'stockflow' });
  return { name: cookieName, token };
}
export function authRequired(req, res, next) {
  const token = req.cookies?.[cookieName];
  const secret = process.env.JWT_SECRET;
  if (!token || !secret || secret.length < 32) return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  try {
    const payload = jwt.verify(token, secret, { issuer: 'stockflow' });
    req.userId = payload.sub;
    next();
  } catch {
    res.clearCookie(cookieName, cookieOptions());
    return res.status(401).json({ success: false, message: 'Sesi tidak valid atau sudah berakhir.' });
  }
}
export function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  return {
    httpOnly: true,
    secure: isProd || process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60 * 1000,
  };
}
export { cookieName };