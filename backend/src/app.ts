import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import { errorHandler, AppError } from './middleware/error.middleware';
import config from './config';

const app = express();

// Middleware
app.use(cors({
  origin: config.nodeEnv === 'development' 
    ? (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow any localhost origin in development
        if (origin.startsWith('http://localhost:')) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      }
    : 'http://localhost:5175', // Production origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

export default app; 