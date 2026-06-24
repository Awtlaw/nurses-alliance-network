import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',') 
  : ['http://localhost:4000', 'http://localhost:4001', 'http://localhost:4002', 'http://127.0.0.1:4000', 'http://127.0.0.1:4001', 'http://127.0.0.1:4002'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';

// Apply rate limiting to all API routes
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: (req) => {
    return req.cookies && req.cookies.auth_token ? 600 : 60;
  },
  keyGenerator: (req) => {
    return req.cookies && req.cookies.auth_token ? req.cookies.auth_token : req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', apiLimiter);

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base API health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nurses Alliance Network Express Backend Running' });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React routing, return all unmatched requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
