// backend/middleware/igdbService.js
const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// IGDB API credentials from environment variables
const clientId = process.env.IGDB_CLIENT_ID;
const clientSecret = process.env.IGDB_CLIENT_SECRET;
let accessToken = null;
let tokenExpiry = null;

/**
 * Get access token from Twitch for IGDB API
 * @returns {Promise<string>} Access token
 */
const getAccessToken = async () => {
  // Check if token exists and is not expired
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!clientId || !clientSecret) {
    throw new Error('IGDB API credentials are missing. Check your environment variables.');
  }

  try {
    console.log('Fetching new IGDB access token...');
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );

    accessToken = response.data.access_token;
    // Set expiry to slightly before actual expiry to ensure token is always valid
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    console.log('Successfully obtained IGDB access token');

    return accessToken;
  } catch (error) {
    console.error('IGDB token error:', error.response?.data || error.message);
    throw new Error('Failed to get IGDB access token');
  }
};

/**
 * Make API request to IGDB
 * @param {string} endpoint - IGDB API endpoint
 * @param {string} body - IGDB API query
 * @returns {Promise<Array>} IGDB API response
 */
const igdbRequest = async (endpoint, body) => {
  const cacheKey = `${endpoint}:${body}`;
  
  // Check cache first
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedData;
  }

  try {
    const token = await getAccessToken();

    console.log(`Making IGDB request to ${endpoint}`);
    console.log(`Query: ${body}`);

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
    console.log(`Cached response for ${cacheKey}`);
    
    return response.data;
  } catch (error) {
    console.error('IGDB API error:', error.response?.data || error.message);
    throw new Error(`IGDB API request failed: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Search games in IGDB
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of game objects
 */
exports.searchGames = async (query, limit = 10) => {
  const body = `
    search "${query}";
    fields name, cover.url, cover.image_id, first_release_date, rating, genres.name, genres.id, platforms.name;
    limit ${limit};
  `;

  return igdbRequest('/games', body);
};

/**
 * Search games by genre
 * @param {number} genreId - Genre ID to filter by
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of game objects
 */
exports.searchGamesByGenre = async (genreId, limit = 10) => {
  const body = `
    fields name, cover.url, cover.image_id, first_release_date, rating, genres.name, genres.id, platforms.name;
    where genres = (${genreId});
    limit ${limit};
  `;

  return igdbRequest('/games', body);
};

/**
 * Get game details from IGDB
 * @param {number} gameId - Game ID
 * @returns {Promise<Object>} Game details
 */
exports.getGameDetails = async (gameId) => {
  const body = `
    fields name, summary, storyline, cover.url, cover.image_id, screenshots.url, screenshots.image_id,
           genres.name, genres.id, platforms.name, first_release_date, rating,
           videos.video_id, websites.url, websites.category;
    where id = ${gameId};
  `;

  const games = await igdbRequest('/games', body);
  return games[0] || null;
};

/**
 * Get trending games from IGDB
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of trending game objects
 */
exports.getTrendingGames = async (limit = 5) => {
  // Get games from the last 6 months with highest ratings
  const sixMonthsAgo = Math.floor(Date.now() / 1000) - 15552000;
  
  const body = `
    fields name, cover.url, cover.image_id, first_release_date, rating, genres.name, genres.id;
    sort rating desc;
    where rating != null & first_release_date > ${sixMonthsAgo};
    limit ${limit};
  `;

  return igdbRequest('/games', body);
};

// For debugging
exports.testConnection = async () => {
  try {
    const token = await getAccessToken();
    return { success: true, token_obtained: !!token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};