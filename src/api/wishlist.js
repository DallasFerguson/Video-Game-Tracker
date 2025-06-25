import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getWishlist = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/wishlist`, getAuthHeaders(token));
    return response.data.map(item => ({
      gameId: item.gameId,
      name: item.name,
      cover: item.cover
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
  }
};

export const addToWishlist = async (gameData) => {
  console.log('Adding to wishlist:', gameData);
  return { success: true, game: gameData };
};

export const removeFromWishlist = async (token, gameId) => {
  try {
    await axios.delete(
      `${API_BASE}/wishlist/${gameId}`,
      getAuthHeaders(token)
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
  }
};