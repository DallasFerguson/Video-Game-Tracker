// backend/server.api.js
// API-only server that uses IGDB API with no mock data
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for frontend
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API server is running',
    timestamp: new Date().toISOString(),
    igdbConfigured: !!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET)
  });
});

// IGDB API Token management
let igdbToken = null;
let tokenExpiration = null;

// Function to get a new IGDB API token
async function getIGDBToken() {
  try {
    console.log('Getting new IGDB token...');
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
    // Set expiration to 1 hour before actual expiration for safety
    tokenExpiration = Date.now() + (response.data.expires_in - 3600) * 1000;
    
    console.log('IGDB token acquired successfully');
    return igdbToken;
  } catch (error) {
    console.error('Error getting IGDB token:', error.message);
    throw new Error('Failed to authenticate with IGDB API');
  }
}

// Function to ensure we have a valid token
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
      where rating > 75 & first_release_date > ${Math.floor(Date.now() / 1000) - 15552000};
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

// Catch-all for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    availableEndpoints: [
      "/api/health",
      "/api/games/trending",
      "/api/games/search",
      "/api/games/:id"
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log(`CORS: Allowing all origins for testing`);
  console.log(`IGDB API configuration: ${!!(process.env.IGDB_CLIENT_ID && process.env.IGDB_CLIENT_SECRET)}`);
});
