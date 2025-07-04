const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//initialize Express
const app = express();

//middleware
// Configure CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

//connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

//routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/library', require('./routes/library'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/reviews'));

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

//define PORT
const PORT = process.env.PORT || 3001;

//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));