import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGameDetails, getUserReviews, submitReview, deleteReview } from '../../../api';
import ReviewForm from '../../../components/reviews/ReviewForm/ReviewForm';
import ReviewList from '../../../components/reviews/ReviewList/ReviewList';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import './Reviews.css';

const Reviews = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gameData, reviewsData] = await Promise.all([
          getGameDetails(gameId),
          getUserReviews(gameId)
        ]);
        setGame(gameData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  const handleSubmitReview = async (reviewData) => {
    try {
      const newReview = await submitReview(user.token, gameId, reviewData);
      
      if (editingReview) {
        setReviews(reviews.map(review => 
          review.userId === user.id ? newReview : review
        ));
      } else {
        setReviews([newReview, ...reviews]);
      }
      
      setEditingReview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(user.token, gameId);
      setReviews(reviews.filter(review => review.userId !== user.id));
      setEditingReview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const currentUserReview = reviews.find(review => review.userId === user?.id);

  if (loading) {
    return (
      <div className="reviews-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-error">
        <p>Error loading reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Reviews for {game?.name}</h1>
        {game?.cover && (
          <img 
            src={`https:${game.cover.url.replace('t_thumb', 't_cover_small')}`} 
            alt={game.name} 
            className="game-cover"
          />
        )}
      </div>

      {user && (
        <div className="user-review-section">
          <h2>{currentUserReview ? 'Your Review' : 'Write a Review'}</h2>
          <ReviewForm
            gameId={gameId}
            initialReview={editingReview || currentUserReview}
            onSuccess={handleSubmitReview}
            onDelete={currentUserReview ? handleDeleteReview : null}
          />
        </div>
      )}

      <div className="all-reviews-section">
        <h2>Community Reviews</h2>
        {reviews.length > 0 ? (
          <ReviewList 
            reviews={reviews.filter(review => review.userId !== user?.id)}
            currentUserReview={currentUserReview}
            onEdit={setEditingReview}
            onDelete={handleDeleteReview}
          />
        ) : (
          <p className="no-reviews">No community reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;