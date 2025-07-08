import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameDetails } from '../../api/games';
import { ReviewContext } from '../../contexts/ReviewContext';
import ReviewForm from '../../components/reviews/ReviewForm/ReviewForm';
import ReviewList from '../../components/reviews/ReviewList/ReviewList';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../components/ui/Button/Button';
import './Reviews.css';

const Reviews = () => {
  const { id: gameId } = useParams();
  const { reviews, getGameReviews, addReview, deleteReview } = useContext(ReviewContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get reviews for this specific game
  const gameReviews = getGameReviews ? getGameReviews(parseInt(gameId)) : [];
  
  // In a personal tracker, there's only one review per game (your own)
  const personalReview = gameReviews.length > 0 ? gameReviews[0] : null;

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(gameId);
        setGame(gameData);
      } catch (err) {
        setError(err.message || 'Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const handleSubmitReview = (reviewData) => {
    try {
      addReview(parseInt(gameId), {
        rating: reviewData.rating,
        review: reviewData.content
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const handleDeleteReview = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        deleteReview(parseInt(gameId));
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

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
        <p>Error: {error}</p>
        <Link to={`/games/${gameId}`}>
          <Button variant="primary">Back to Game</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <Link to={`/games/${gameId}`} className="back-link">
          <Button variant="outline">Back to Game</Button>
        </Link>
        <h1>Review for {game?.name}</h1>
        {game?.cover && (
          <img 
            src={`https:${game.cover.url.replace('t_thumb', 't_cover_small')}`} 
            alt={game.name} 
            className="game-cover"
          />
        )}
      </div>

      {isEditing || !personalReview ? (
        <div className="review-form-section">
          <h2>{personalReview ? 'Edit Your Review' : 'Write a Review'}</h2>
          <ReviewForm
            gameId={parseInt(gameId)}
            initialReview={personalReview}
            onSuccess={handleSubmitReview}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="personal-review-section">
          <div className="section-header">
            <h2>Your Review</h2>
            <div className="review-actions">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button 
                variant="danger"
                onClick={handleDeleteReview}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="review-content">
            <div className="review-meta">
              <div className="review-rating">Rating: {personalReview.rating}/10</div>
              <div className="review-date">
                {new Date(personalReview.date).toLocaleDateString()}
              </div>
            </div>
            <div className="review-text">{personalReview.review}</div>
          </div>
        </div>
      )}

      <div className="game-info-section">
        <h2>About the Game</h2>
        <div className="game-info">
          {game?.summary ? (
            <p className="game-summary">{game.summary}</p>
          ) : (
            <p className="no-info">No description available.</p>
          )}
          
          <div className="game-meta-info">
            {game?.genres && game.genres.length > 0 && (
              <div className="info-item">
                <span className="info-label">Genres:</span>
                <span className="info-value">{game.genres.map(g => g.name).join(', ')}</span>
              </div>
            )}
            
            {game?.platforms && game.platforms.length > 0 && (
              <div className="info-item">
                <span className="info-label">Platforms:</span>
                <span className="info-value">{game.platforms.map(p => p.name).join(', ')}</span>
              </div>
            )}
            
            {game?.first_release_date && (
              <div className="info-item">
                <span className="info-label">Release Date:</span>
                <span className="info-value">
                  {new Date(game.first_release_date * 1000).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;