//src/api/games.js
import axios from 'axios';
import config from '../config';

//configure axios instance with proper error handling
const gamesApi = axios.create({
  baseURL: config.api.base,
  timeout: 10000, //10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Search for games using the IGDB API
 * @param {string} query - Search query
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of game objects
 */
export const searchGames = async (query, limit = 10) => {
  try {
    console.log(`Searching games with query: ${query} at URL: ${config.api.games.search}`);
    
    const response = await axios.get(config.api.games.search, {
      params: { query, limit }
    });
    
    return response.data.map(game => ({
      id: game.id,
      name: game.name,
      cover: game.cover,
      first_release_date: game.first_release_date,
      rating: game.rating
    }));
  } catch (error) {
    console.error('Error searching games:', error);
    throw new Error(error.response?.data?.message || 'Failed to search games. Please try again later.');
  }
};

/**
 * Get detailed information about a specific game
 * @param {string|number} gameId - ID of the game to fetch
 * @returns {Promise<Object>} Game details object
 */
export const getGameDetails = async (gameId) => {
  try {
    console.log(`Fetching game details for ID: ${gameId} at URL: ${config.api.games.details(gameId)}`);
    
    const response = await axios.get(config.api.games.details(gameId));
    return {
      id: response.data.id,
      name: response.data.name,
      summary: response.data.summary,
      genres: response.data.genres,
      platforms: response.data.platforms,
      cover: response.data.cover,
      screenshots: response.data.screenshots,
      rating: response.data.rating,
      first_release_date: response.data.first_release_date
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch game details. Please try again later.');
  }
};

/**
 * Get trending games
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of trending game objects
 */
export const getTrendingGames = async (limit = 5) => {
  try {
    console.log(`Fetching trending games at URL: ${config.api.games.trending}`);
    
    const response = await axios.get(config.api.games.trending, {
      params: { limit }
    });
    return response.data.map(game => ({
      id: game.id,
      name: game.name,
      cover: game.cover,
      first_release_date: game.first_release_date,
      rating: game.rating
    }));
  } catch (error) {
    console.error('Error fetching trending games:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch trending games. Please try again later.');
  }
};
