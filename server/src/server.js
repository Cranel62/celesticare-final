import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/db.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import outfitRoutes from './routes/outfitRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { saveUndertone, getRecentTarot } from './controllers/userController.js';
import { verifyToken } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(helmet());

const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : [];

const dynamicCorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isExplicitlyAllowed = envAllowedOrigins.includes(origin);

    if (isExplicitlyAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy rejection: Origin ${origin} not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(dynamicCorsOptions));
app.set('trust proxy', 1);

// Unauthenticated health-check route (bypasses rate limiters for external pinging)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/v1/users', userRoutes);

app.use('/api/outfits', outfitRoutes);
app.use('/api/v1/outfits', outfitRoutes);

app.use('/api/orders', orderRoutes);
app.use('/api/v1/orders', orderRoutes);

// Additional legacy compatibility routes
app.post('/api/undertone/save', verifyToken, saveUndertone);
app.get('/api/tarot/recent', verifyToken, getRecentTarot);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be configured.');
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[Server]: CelestiCare API operational on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(`[Server Startup Error]: ${error.message}`);
  process.exit(1);
});