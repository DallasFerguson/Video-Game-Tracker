import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const searchGames = async (query, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE}/games/search`, {
      params: { query, limit }
    });
    return response.data.map(game => ({
      id: game.id,
      name: game.name,
      cover: game.cover,
      release_date: game.first_release_date,
      rating: game.rating
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Game search failed');
  }
};

export const getGameDetails = async (gameId) => {
  try {
    const response = await axios.get(`${API_BASE}/games/${gameId}`);
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
    throw new Error(error.response?.data?.message || 'Failed to get game details');
  }
};

export const getTrendingGames = async (limit = 5) => {
  try {
    const response = await axios.get(`${API_BASE}/games/trending`, {
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
    throw new Error(error.response?.data?.message || 'Failed to fetch trending games');
  }
};