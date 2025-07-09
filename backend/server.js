const express = require('express');
const cors = require('cors');
require('dotenv').config();

//initialize Express
const app = express();

//middleware
app.use(cors({
  origin: 'http://localhost:3000', //my frontend URL
  credentials: true
}));
app.use(express.json());

//simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

//routes - only using the games route for IGDB API access
app.use('/api/games', require('./routes/games'));

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

//define PORT - using 3002 to avoid conflicts
const PORT = process.env.PORT || 3002;

//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));