// backend/server.api.js
// Extremely simplified API server - just to test CORS
const express = require('express');
const cors = require('cors');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3002;

// CORS configuration with all possible settings
app.use(cors({
  origin: '*', // Allow all origins
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Log every request
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} from ${req.headers.origin || 'unknown origin'}`);
  next();
});

// Explicitly handle OPTIONS requests
app.options('*', cors());

// Add CORS headers manually as well
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Middleware
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Simplified API server is running',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Trending games endpoint with hardcoded data
app.get('/api/games/trending', (req, res) => {
  console.log('Trending games requested');
  
  // Send hardcoded data
  res.json([
    {
      id: 1,
      name: "The Legend of Zelda",
      cover: {
        id: 1,
        image_id: "co1rcb"
      },
      first_release_date: 1552608000,
      rating: 92
    },
    {
      id: 2,
      name: "Super Mario Odyssey",
      cover: {
        id: 2,
        image_id: "co1rcb"
      },
      first_release_date: 1509062400,
      rating: 97
    },
    {
      id: 3,
      name: "God of War",
      cover: {
        id: 3,
        image_id: "co1rcb"
      },
      first_release_date: 1524182400,
      rating: 94
    },
    {
      id: 4,
      name: "Red Dead Redemption 2",
      cover: {
        id: 4,
        image_id: "co1rcb"
      },
      first_release_date: 1540512000,
      rating: 97
    },
    {
      id: 5,
      name: "The Last of Us Part II",
      cover: {
        id: 5,
        image_id: "co1rcb"
      },
      first_release_date: 1592524800,
      rating: 93
    }
  ]);
});

// Search endpoint with hardcoded data
app.get('/api/games/search', (req, res) => {
  const query = req.query.query || '';
  const limit = parseInt(req.query.limit) || 10;
  
  console.log(`Search requested: ${query} (limit: ${limit})`);
  
  // Generate search results based on query
  const results = [];
  for (let i = 1; i <= limit; i++) {
    results.push({
      id: 100 + i,
      name: `${query} Game ${i}`,
      cover: {
        id: 100 + i,
        image_id: "co1rcb"
      },
      first_release_date: Math.floor(Date.now() / 1000) - (i * 2592000),
      rating: 70 + Math.floor(Math.random() * 25)
    });
  }
  
  res.json(results);
});

// Game details endpoint with hardcoded data
app.get('/api/games/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Game details requested: ${id}`);
  
  res.json({
    id: parseInt(id),
    name: `Game ${id}`,
    summary: "This is a test game description.",
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" }
    ],
    platforms: [
      { id: 1, name: "PC" },
      { id: 2, name: "PlayStation 5" }
    ],
    cover: {
      id: parseInt(id),
      image_id: "co1rcb"
    },
    screenshots: [
      { id: 1, image_id: "sc8gj0" },
      { id: 2, image_id: "sc8gj1" }
    ],
    rating: 85,
    first_release_date: Math.floor(Date.now() / 1000) - 7776000
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`Unknown route requested: ${req.originalUrl}`);
  res.status(404).json({
    error: "Route not found",
    requested: req.originalUrl,
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
  console.log(`Simplified API server running on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log(`CORS: Allowing all origins`);
  console.log(`Time: ${new Date().toISOString()}`);
});
