const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create upload directories
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Make sure MongoDB is running or use MongoDB Atlas URI in .env');
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/prescription', require('./routes/prescription'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Smart Medical Report API', endpoints: ['/api/auth', '/api/reports', '/api/chat', '/api/prescription', '/api/health'] });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Medical API is running', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
});
