// src/api/index.js
import axios from 'axios';

//export API functions
export * from './auth';
export * from './games';
export * from './library';
export * from './wishlist';
export * from './reviews';

//define API_BASE or import it
const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const getUserReviews = async (gameId) => {
  try {
    const response = await axios.get(`${API_BASE}/games/${gameId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};