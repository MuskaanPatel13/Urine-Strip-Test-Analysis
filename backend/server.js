const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedData');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Auto-seed initial demo data if database is empty
  seedDatabase();
});

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded strip image files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Urine Test Strip Reader using Colorimetry (KJS-HC-03)',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  KJS-HC-03 URINE TEST STRIP READER BACKEND API     `);
  console.log(`  Server running on http://localhost:${PORT}         `);
  console.log(`====================================================`);
});
