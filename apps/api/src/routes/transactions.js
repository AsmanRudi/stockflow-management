import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
const router = Router();
const schema = z.object({ productId: z.string().min(1), type: z.enum(['IN','OUT']), quantity: z.coerce.number().int().positive().max(100000000), note: z.string().trim().max(500).optional().nullable() });
router.get('/', async (_req, res, next) => { try { const data = await prisma.stockTransaction.findMany({ include: { product: { select: { id: true, sku: true, name: true } }, user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' }, take: 500 }); res.json({ success: true, data }); } catch(e) { next(e); } });
router.post('/', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Data transaksi tidak valid.', errors: parsed.error.flatten() });
    const { productId, type, quantity, note } = parsed.data;
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) { const error = new Error('Produk tidak ditemukan.'); error.status = 404; throw error; }
      if (type === 'OUT' && product.stock < quantity) { const error = new Error(`Stok tidak cukup. Stok tersedia: ${product.stock}.`); error.status = 409; throw error; }
      const delta = type === 'IN' ? quantity : -quantity;
      const updated = await tx.product.update({ where: { id: productId }, data: { stock: { increment: delta } } });
      const movement = await tx.stockTransaction.create({ data: { productId, userId: req.userId, type, quantity, note: note || null } });
      return { movement, stock: updated.stock };
    }, { isolationLevel: 'Serializable' });
    res.status(201).json({ success: true, data: result });
  } catch(e) { next(e); }
});
export default router;