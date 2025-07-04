const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    ME: `${API_BASE}/users/me`
  },
  GAMES: {
    SEARCH: `${API_BASE}/games/search`,
    DETAILS: `${API_BASE}/games`,
    TRENDING: `${API_BASE}/games/trending`
  },
  LIBRARY: {
    BASE: `${API_BASE}/library`,
    ENTRY: (gameId) => `${API_BASE}/library/${gameId}`
  },
  WISHLIST: {
    BASE: `${API_BASE}/wishlist`,
    ENTRY: (gameId) => `${API_BASE}/wishlist/${gameId}`
  },
  REVIEWS: {
    BASE: `${API_BASE}/reviews`,
    GAME: (gameId) => `${API_BASE}/reviews/${gameId}`
  }
};

export const IGDB_ENDPOINTS = {
  BASE: 'https://api.igdb.com/v4',
  GAMES: '/games',
  COVERS: '/covers'
};

export const getIgdbImageUrl = (imageId, size = 'cover_big') => {
  return imageId ? `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg` : null;
};