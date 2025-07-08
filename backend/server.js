const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes - only using the games route for IGDB API access
app.use('/api/games', require('./routes/games'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Define PORT - using 3002 to avoid conflicts
const PORT = process.env.PORT || 3002;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));