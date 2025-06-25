import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getUserReviews = async (token) => {
  try {
    const response = await axios.get(`${API_BASE}/reviews`, getAuthHeaders(token));
    return response.data.map(review => ({
      gameId: review.gameId,
      rating: review.rating,
      review: review.review,
      date: review.date
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

export const submitReview = async (token, gameId, { rating, review }) => {
  try {
    const response = await axios.post(
      `${API_BASE}/reviews/${gameId}`,
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
      `${API_BASE}/reviews/${gameId}`,
      getAuthHeaders(token)
    );
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete review');
  }
};

export const getRecentActivity = async (token, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE}/activity`, {
      ...getAuthHeaders(token),
      params: { limit }
    });
    return response.data.map(activity => ({
      type: activity.type,
      gameId: activity.gameId,
      date: activity.date
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch activity');
  }
};