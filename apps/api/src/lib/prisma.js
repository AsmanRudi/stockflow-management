import { PrismaClient } from '@prisma/client';

function sanitizeDatabaseUrl(url) {
  if (!url) return undefined;
  let clean = String(url).trim();
  // Hapus tanda kutip jika ikut ter-copy
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  // Hapus jika ter-copy bersama key "DATABASE_URL="
  if (clean.startsWith('DATABASE_URL=')) {
    clean = clean.replace(/^DATABASE_URL=/, '').trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
  }
  // Hapus jika ter-copy bersama perintah psql
  if (clean.startsWith('psql ')) {
    clean = clean.replace(/^psql\s+/, '').trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
  }
  return clean;
}

const cleanedDatabaseUrl = sanitizeDatabaseUrl(process.env.DATABASE_URL);
if (cleanedDatabaseUrl) {
  process.env.DATABASE_URL = cleanedDatabaseUrl;
}

if (!process.env.DATABASE_URL) {
  console.error('[StockFlow API] PERINGATAN: DATABASE_URL belum diatur di environment variable! Pastikan sudah ditambahkan di Vercel.');
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__stockflowPrisma ||
  new PrismaClient({
    ...(process.env.DATABASE_URL ? { datasourceUrl: process.env.DATABASE_URL } : {}),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.__stockflowPrisma = prisma;
