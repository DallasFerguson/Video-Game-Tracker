// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3002;

// CORS configuration - allow frontend
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS headers manually as backup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Middleware
app.use(express.json());

// IGDB API Token management
let igdbToken = null;
let tokenExpiration = null;

// Function to get a new IGDB API token
async function getIGDBToken() {
  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: process.env.IGDB_CLIENT_ID,
          client_secret: process.env.IGDB_CLIENT_SECRET,
          grant_type: 'client_credentials'
        }
      }
    );
    
    igdbToken = response.data.access_token;
    tokenExpiration = Date.now() + (response.data.expires_in - 3600) * 1000;
    
    console.log('IGDB token acquired successfully');
    return igdbToken;
  } catch (error) {
    console.error('Error getting IGDB token:', error.message);
    throw new Error('Failed to authenticate with IGDB API');
  }
}

// Ensure valid token
async function ensureValidToken() {
  if (!igdbToken || !tokenExpiration || Date.now() >= tokenExpiration) {
    return getIGDBToken();
  }
  return igdbToken;
}

// IGDB API request function
async function queryIGDB(endpoint, query) {
  const token = await ensureValidToken();
  
  const response = await axios({
    url: `https://api.igdb.com/v4/${endpoint}`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': process.env.IGDB_CLIENT_ID,
      'Authorization': `Bearer ${token}`
    },
    data: query
  });
  
  return response.data;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date().toISOString(),
    igdbConfigured: !!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET)
  });
});

// Search games endpoint
app.get('/api/games/search', async (req, res) => {
  try {
    const query = req.query.query || '';
    const limit = parseInt(req.query.limit) || 10;
    
    const igdbQuery = `
      search "${query}";
      fields name, cover.image_id, first_release_date, rating;
      where version_parent = null;
      limit ${limit};
    `;
    
    const games = await queryIGDB('games', igdbQuery);
    res.json(games);
  } catch (error) {
    console.error('Error searching games:', error.message);
    res.status(500).json({ message: 'Failed to search games: ' + error.message });
  }
});

// Trending games endpoint
app.get('/api/games/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const igdbQuery = `
      fields name, cover.image_id, first_release_date, rating;
      where rating > 75;
      sort rating desc;
      limit ${limit};
    `;
    
    const games = await queryIGDB('games', igdbQuery);
    res.json(games);
  } catch (error) {
    console.error('Error fetching trending games:', error.message);
    res.status(500).json({ message: 'Failed to fetch trending games: ' + error.message });
  }
});

// Game details endpoint
app.get('/api/games/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    
    const igdbQuery = `
      fields name, summary, genres.name, platforms.name, cover.image_id, screenshots.image_id, rating, first_release_date;
      where id = ${gameId};
    `;
    
    const games = await queryIGDB('games', igdbQuery);
    
    if (games && games.length > 0) {
      res.json(games[0]);
    } else {
      res.status(404).json({ message: 'Game not found' });
    }
  } catch (error) {
    console.error('Error fetching game details:', error.message);
    res.status(500).json({ message: 'Failed to fetch game details: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`IGDB API configuration: ${!!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET)}`);
});
