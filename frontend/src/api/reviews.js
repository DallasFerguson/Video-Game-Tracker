// src/api/reviews.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getGameReviews = async (gameId) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews/game/${gameId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const getUserReviews = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews`, getAuthHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
  }
};

export const submitReview = async (token, gameId, { rating, review }) => {
  try {
    const response = await axios.post(
      `${API_BASE}/reviews/game/${gameId}`,
      { rating, review },
      getAuthHeaders(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }
};

export const deleteReview = async (token, gameId) => {
  try {
    await axios.delete(
      `${API_BASE}/reviews/game/${gameId}`,
      getAuthHeaders(token)
    );
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};