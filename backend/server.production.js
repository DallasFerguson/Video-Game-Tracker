const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express
const app = express();

// Environment variables
const PORT = process.env.PORT || 3002;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes - ONLY include the games route for IGDB API
app.use('/api/games', require('./routes/games'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    igdbConfigured: !!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET)
  });
});

// Serve static assets in production
if (NODE_ENV === 'production') {
  // Set static folder
  const staticPath = path.resolve(__dirname, '../frontend/build');
  app.use(express.static(staticPath));
  
  // Any routes not matching API will be redirected to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(staticPath, 'index.html'));
    }
  });
  
  console.log(`Serving static files from: ${staticPath}`);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server Error',
    error: NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log(`CORS allowed origin: ${CORS_ORIGIN}`);
  
  // Log IGDB configuration status
  if (process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET) {
    console.log('IGDB API is configured');
  } else {
    console.warn('WARNING: IGDB API credentials are missing');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, we might want to exit and let the process manager restart
  if (NODE_ENV === 'production') {
    process.exit(1);
  }
});