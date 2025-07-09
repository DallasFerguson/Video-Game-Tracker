import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getReviews, saveReviews } from '../utils/localStorageUtils';
import { NotificationContext } from './NotificationContext';
import { LibraryContext } from './LibraryContext';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useContext(NotificationContext || { notify: () => {} });
  const { library, addToLibrary } = useContext(LibraryContext || { library: [], addToLibrary: () => {} });

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

  const addReview = useCallback((gameId, reviewData, gameDetails = null) => {
    try {
      //generate a unique ID for the review
      const reviewId = Date.now().toString();
      const parsedGameId = parseInt(gameId);
      
      //create new review object
      const newReview = {
        id: reviewId,
        gameId: parsedGameId,
        username: 'Me',  //for personal use app
        userId: 'personal',  //static ID for personal use
        rating: reviewData.rating,
        review: reviewData.review || reviewData.content,
        date: new Date().toISOString()
      };
      
      //check if a review for this game already exists
      const existingReviewIndex = reviews.findIndex(r => r.gameId === parsedGameId);
      
      let updatedReviews;
      if (existingReviewIndex !== -1) {
        //update existing review
        updatedReviews = [...reviews];
        updatedReviews[existingReviewIndex] = newReview;
      } else {
        //add new review
        updatedReviews = [...reviews, newReview];
        
        //check if game is in library, if not, add it
        const isInLibrary = library.some(game => game.gameId === parsedGameId);
        
        if (!isInLibrary && gameDetails) {
          //add game to library with 'playing' status
          addToLibrary({
            gameId: parsedGameId,
            name: gameDetails.name,
            cover: gameDetails.cover?.url 
              ? `https:${gameDetails.cover.url.replace('t_thumb', 't_cover_big')}` 
              : null,
            status: 'playing'
          });
          if (notify) notify(`${gameDetails.name} added to your library`, 'success');
        }
      }
      
      setReviews(updatedReviews);
      saveReviews(updatedReviews);
      if (notify) notify('Review saved successfully', 'success');
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      if (notify) notify('Failed to save review', 'error');
    }
  }, [reviews, library, addToLibrary, notify]);

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