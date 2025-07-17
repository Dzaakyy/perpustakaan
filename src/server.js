import express from 'express';
import cookieParser from 'cookie-parser';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import kategoriRoutes from './routes/kategoriRoutes.js';
import bukuRoutes from './routes/bukuRoutes.js';
import kartuPustakaRoutes from './routes/kartuPustakaRoutes.js';
import peminjamanRoutes from './routes/peminjamanRoutes.js'
import pengembalianRoutes from './routes/pengembalianRoutes.js'
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/dbconfig.js';

dotenv.config();
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Akses untuk origin ini diblokir oleh kebijakan CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads_buku', express.static('uploads_buku'));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


app.use('/api', roleRoutes);
app.use('/api', userRoutes);
app.use('/api', kategoriRoutes);
app.use('/api', bukuRoutes);
app.use('/api', kartuPustakaRoutes);
app.use('/api', peminjamanRoutes);
app.use('/api', pengembalianRoutes
);

app.use((err, req, res, next) => {
  console.error('Error terdeteksi:', err.message);
  res.status(400).json({ error: err.message });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => { 
    try {
        await db.authenticate();
        console.log('Koneksi ke database berhasil.');
        
        await db.sync({ alter: true });
        console.log('Semua model telah disinkronkan.');

    } catch (error) {
        console.error('Tidak dapat terhubung ke database:', error);
    }
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});