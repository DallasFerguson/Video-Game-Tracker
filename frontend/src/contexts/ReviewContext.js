import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getReviews, saveReviews } from '../utils/localStorageUtils';
import { NotificationContext } from './NotificationContext';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useContext(NotificationContext || { notify: () => {} });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const reviewsData = getReviews();
      setReviews(reviewsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (notify) notify('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const getGameReviews = useCallback((gameId) => {
    return reviews.filter(review => review.gameId === parseInt(gameId));
  }, [reviews]);

  const addReview = useCallback((gameId, reviewData) => {
    try {
      // Generate a unique ID for the review
      const reviewId = Date.now().toString();
      
      // Create new review object
      const newReview = {
        id: reviewId,
        gameId: parseInt(gameId),
        username: 'Me',  // For personal use app
        userId: 'personal',  // Static ID for personal use
        rating: reviewData.rating,
        review: reviewData.review || reviewData.content,
        date: new Date().toISOString()
      };
      
      // Check if a review for this game already exists
      const existingReviewIndex = reviews.findIndex(r => r.gameId === parseInt(gameId));
      
      let updatedReviews;
      if (existingReviewIndex !== -1) {
        // Update existing review
        updatedReviews = [...reviews];
        updatedReviews[existingReviewIndex] = newReview;
      } else {
        // Add new review
        updatedReviews = [...reviews, newReview];
      }
      
      setReviews(updatedReviews);
      saveReviews(updatedReviews);
      if (notify) notify('Review saved successfully', 'success');
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      if (notify) notify('Failed to save review', 'error');
    }
  }, [reviews, notify]);

  const deleteReview = useCallback((gameId) => {
    try {
      const reviewExists = reviews.some(r => r.gameId === parseInt(gameId));
      
      if (!reviewExists) {
        if (notify) notify('Review not found', 'error');
        return false;
      }
      
      const updatedReviews = reviews.filter(r => r.gameId !== parseInt(gameId));
      setReviews(updatedReviews);
      saveReviews(updatedReviews);
      if (notify) notify('Review deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      if (notify) notify('Failed to delete review', 'error');
      return false;
    }
  }, [reviews, notify]);

  const value = {
    reviews,
    loading,
    error,
    fetchReviews,
    getGameReviews,
    addReview,
    deleteReview
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}

export default useReviews;