//main API exports
export * from './auth';
export * from './games';
export * from './library';
export * from './wishlist';
export * from './reviews';
export const getUserReviews = async (gameId) => {
  try {
    const response = await axios.get(`${API_BASE}/games/${gameId}/reviews`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};
