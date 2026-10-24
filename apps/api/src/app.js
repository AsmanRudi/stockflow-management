import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import productsRouter from './routes/products.js';
import suppliersRouter from './routes/suppliers.js';
import transactionsRouter from './routes/transactions.js';
import dashboardRouter from './routes/dashboard.js';
import { authRequired } from './middleware/auth.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());


const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((value) => value.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use((req, res, next) => {
  const requestOrigin = req.get('origin');
  const requestHost = req.get('host');
  const forwardedProto = req.get('x-forwarded-proto');
  const protocol = forwardedProto
    ? forwardedProto.split(',')[0].trim()
    : req.protocol;

  const sameOrigin =
    Boolean(requestOrigin) &&
    requestOrigin === `${protocol}://${requestHost}`;

  cors({
    origin(origin, callback) {
      if (
        !origin ||
        sameOrigin ||
        allowedOrigins.includes(origin.replace(/\/$/, ''))
      ) {
        return callback(null, true);
      }

      console.error('[CORS DEBUG]', {
        requestOrigin: origin,
        allowedOrigins
      });

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true
  })(req, res, next);
});


app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); return callback(new Error('Origin not allowed by CORS')); }, credentials: true }));
app.get('/api/health', (_req,res)=>res.status(200).json({ success:true, message:'StockFlow API is running', timestamp:new Date().toISOString() }));
app.use('/api/auth', authRouter);
app.use('/api', authRequired);
app.use('/api/products', productsRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use((req,res)=>res.status(404).json({ success:false, message:'Endpoint tidak ditemukan.' }));
app.use((error,_req,res,_next)=>{
  console.error('[StockFlow API]', error);
  if (error?.code === 'P2002') return res.status(409).json({ success:false, message:'Data unik sudah digunakan (misalnya SKU atau email).' });
  if (error?.code === 'P2025') return res.status(404).json({ success:false, message:'Data tidak ditemukan.' });
  if (error?.code === 'P2034') return res.status(409).json({ success:false, message:'Konflik transaksi database. Silakan ulangi.' });
  const status = Number.isInteger(error?.status) ? error.status : 500;
  return res.status(status).json({ success:false, message:status < 500 ? error.message : 'Terjadi kesalahan pada server.' });
});
export default app;