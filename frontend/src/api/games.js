import axios from 'axios';

// Fallback to a default if environment variable is not available
const API_BASE = 'http://localhost:3001/api';

console.log('API Base URL being used:', API_BASE);

// Mock data for when the backend is unavailable
const MOCK_GAMES = [
  { 
    id: 1, 
    name: 'The Legend of Zelda: Breath of the Wild', 
    cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg' }, 
    first_release_date: 1488499200, 
    rating: 93 
  },
  { 
    id: 2, 
    name: 'Cyberpunk 2077', 
    cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co2mjs.jpg' }, 
    first_release_date: 1607558400, 
    rating: 85 
  },
  { 
    id: 3, 
    name: 'Red Dead Redemption 2', 
    cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg' }, 
    first_release_date: 1540512000, 
    rating: 94 
  },
  { 
    id: 4, 
    name: 'Elden Ring', 
    cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg' }, 
    first_release_date: 1645747200, 
    rating: 96 
  },
  { 
    id: 5, 
    name: 'Minecraft', 
    cover: { url: '//images.igdb.com/igdb/image/upload/t_cover_big/co49x5.jpg' }, 
    first_release_date: 1321401600, 
    rating: 90 
  }
];

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
    console.error('Search API error:', error);
    console.log('Using mock data instead');
    
    // Filter mock data based on the search query
    return MOCK_GAMES.filter(game => 
      game.name.toLowerCase().includes(query.toLowerCase())
    );
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
    console.error('Game details API error:', error);
    // Return a mock game if the backend is unavailable
    const mockGame = MOCK_GAMES.find(game => game.id === parseInt(gameId));
    
    if (mockGame) {
      return {
        ...mockGame,
        summary: 'This is a placeholder summary for the selected game. The actual game details are not available because the backend server could not be reached.',
        genres: [{ id: 1, name: 'RPG' }, { id: 2, name: 'Action' }],
        platforms: [{ id: 1, name: 'PC' }, { id: 2, name: 'PlayStation 5' }, { id: 3, name: 'Xbox Series X' }],
        screenshots: []
      };
    }
    
    return {
      id: parseInt(gameId),
      name: 'Game Details',
      summary: 'This is a placeholder summary because the backend is unavailable.',
      genres: [{ id: 1, name: 'RPG' }],
      platforms: [{ id: 1, name: 'PC' }],
      cover: { url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg' },
      screenshots: [],
      rating: 90,
      first_release_date: 1609459200
    };
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
    console.error('Trending API error:', error);
    console.log('Using mock data instead');
    return MOCK_GAMES.slice(0, limit);
  }
};