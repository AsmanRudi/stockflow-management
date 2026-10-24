import { PrismaClient } from '@prisma/client';

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
