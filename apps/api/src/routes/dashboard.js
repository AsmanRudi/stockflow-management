import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
const router = Router();
router.get('/', async (_req, res, next) => { try {
  const [totalProducts, stockAggregate, products, lowStockProducts, recentTransactions] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { stock: true, price: true } }),
    prisma.product.findMany({ select: { stock: true, price: true } }),
    prisma.product.findMany({ where: { stock: { lte: 0 } }, orderBy: { stock: 'asc' }, take: 10, select: { id: true, sku: true, name: true, stock: true, minimumStock: true } }),
    prisma.stockTransaction.findMany({ include: { product: { select: { id: true, sku: true, name: true } }, user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' }, take: 6 })
  ]);
  const low = await prisma.product.findMany({ select: { id: true, sku: true, name: true, stock: true, minimumStock: true } });
  const lowStock = low.filter(p => p.stock <= p.minimumStock).sort((a,b)=>a.stock-b.stock).slice(0,10);
  const inventoryValue = products.reduce((sum,p)=>sum + Number(p.price)*p.stock,0);
  res.json({ success: true, data: { totalProducts, totalUnits: stockAggregate._sum.stock || 0, lowStockCount: low.filter(p=>p.stock<=p.minimumStock).length, inventoryValue, lowStockProducts: lowStock, recentTransactions } });
} catch(e) { next(e); } });
export default router;