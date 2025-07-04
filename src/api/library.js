import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserLibrary = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/library`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch library');
  }
};

export const addToLibrary = async (token, gameData) => {
  try {
    const response = await axios.post(
      `${API_BASE}/library`,
      gameData,
      getAuthHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add to library');
  }
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
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove from library');
  }
};