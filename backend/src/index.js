import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET'
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import queueRoutes from './routes/queue.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Hospital Appointment and Queue Management System (HAQMS) Backend API',
    status: 'Running',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error('[CRITICAL-ERROR]:', err);
 res.status(500).json({
   message:
   "Internal Server Error"
});
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`   HAQMS BACKEND SERVER IS RUNNING ON PORT ${PORT}`);
  console.log(`   ENVIRONMENT: ${process.env.NODE_ENV}`);
  console.log(`===================================================`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});
