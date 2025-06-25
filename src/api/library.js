import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserLibrary = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/library`, getAuthHeaders(token));
    return response.data.map(item => ({
      gameId: item.gameId,
      status: item.status,
      rating: item.rating,
      playtime: item.playtime
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch library');
  }
};

export const addToLibrary = async (gameData) => {
  console.log('Adding to library:', gameData);
  return { success: true, game: gameData };
};

export const updateLibraryEntry = async (token, gameId, { status, rating, playtime }) => {
  try {
    const response = await axios.put(
      `${API_BASE}/library/${gameId}`,
      { status, rating, playtime },
      getAuthHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update library entry');
  }
};

export const removeFromLibrary = async (token, gameId) => {
  try {
    await axios.delete(
      `${API_BASE}/library/${gameId}`,
      getAuthHeaders(token)
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove from library');
  }
};