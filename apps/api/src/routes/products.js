import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
const router = Router();
const productSchema = z.object({
  sku: z.string().trim().min(1).max(50), name: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100), description: z.string().trim().max(1000).optional().nullable(),
  price: z.coerce.number().finite().min(0), minimumStock: z.coerce.number().int().min(0).default(5),
  supplierId: z.string().trim().min(1).nullable().optional()
});
router.get('/', async (_req, res, next) => { try { const data = await prisma.product.findMany({ include: { supplier: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }); res.json({ success: true, data }); } catch (e) { next(e); } });
router.get('/:id', async (req, res, next) => { try { const data = await prisma.product.findUnique({ where: { id: req.params.id }, include: { supplier: true } }); if (!data) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' }); res.json({ success: true, data }); } catch (e) { next(e); } });
router.post('/', async (req, res, next) => { try { const parsed = productSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: 'Data produk tidak valid.', errors: parsed.error.flatten() }); const data = await prisma.product.create({ data: { ...parsed.data, stock: 0, description: parsed.data.description || null, supplierId: parsed.data.supplierId || null } }); res.status(201).json({ success: true, data }); } catch (e) { next(e); } });
router.put('/:id', async (req, res, next) => { try { const parsed = productSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ success: false, message: 'Data produk tidak valid.', errors: parsed.error.flatten() }); const data = await prisma.product.update({ where: { id: req.params.id }, data: { ...parsed.data, description: parsed.data.description || null, supplierId: parsed.data.supplierId || null } }); res.json({ success: true, data }); } catch (e) { next(e); } });
router.delete('/:id', async (req, res, next) => { try { const count = await prisma.stockTransaction.count({ where: { productId: req.params.id } }); if (count) return res.status(409).json({ success: false, message: 'Produk memiliki riwayat transaksi dan tidak dapat dihapus.' }); await prisma.product.delete({ where: { id: req.params.id } }); res.json({ success: true, message: 'Produk berhasil dihapus.' }); } catch (e) { next(e); } });
export default router;