const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// IGDB API credentials
const clientId = process.env.IGDB_CLIENT_ID;
const clientSecret = process.env.IGDB_CLIENT_SECRET;
let accessToken = null;
let tokenExpiry = null;

// Get access token
const getAccessToken = async () => {
  // Check if token exists and is not expired
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );

    accessToken = response.data.access_token;
    // Set expiry to slightly before actual expiry to ensure token is always valid
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;

    return accessToken;
  } catch (error) {
    console.error('IGDB token error:', error);
    throw new Error('Failed to get IGDB access token');
  }
};

// Make API request to IGDB
const igdbRequest = async (endpoint, body) => {
  const cacheKey = `${endpoint}:${body}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const token = await getAccessToken();

  try {
    const response = await axios({
      url: `https://api.igdb.com/v4${endpoint}`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`
      },
      data: body
    });

    // Cache the response
    cache.set(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    console.error('IGDB API error:', error);
    throw new Error('IGDB API request failed');
  }
};

// Search games
exports.searchGames = async (query, limit = 10) => {
  const body = `
    search "${query}";
    fields name, cover.url, first_release_date, rating;
    limit ${limit};
  `;

  return igdbRequest('/games', body);
};

// Get game details
exports.getGameDetails = async (gameId) => {
  const body = `
    fields name, summary, storyline, cover.url, screenshots.url, 
           genres.name, platforms.name, first_release_date, rating;
    where id = ${gameId};
  `;

  const games = await igdbRequest('/games', body);
  return games[0];
};

// Get trending games
exports.getTrendingGames = async (limit = 5) => {
  const body = `
    fields name, cover.url, first_release_date, rating;
    sort rating desc;
    where rating != null & first_release_date > ${Math.floor(Date.now() / 1000) - 15552000};
    limit ${limit};
  `;

  return igdbRequest('/games', body);
};