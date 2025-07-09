import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LibraryContext } from '../../../contexts/LibraryContext';
import { ReviewContext } from '../../../contexts/ReviewContext';
import GameCover from '../../../components/games/GameCover/GameCover'; // Import the new component
import GameStatus from '../../games/GameStatus/GameStatus';
import Button from '../../ui/Button/Button';
import RatingDisplay from '../../reviews/RatingDisplay/RatingDisplay';
import './LibraryItem.css';

const LibraryItem = ({ game, onUpdate, onRemove }) => {
  const { updateInLibrary, removeFromLibrary } = useContext(LibraryContext);
  const { getGameReviews } = useContext(ReviewContext);
  const [isEditing, setIsEditing] = useState(false);
  const [playtime, setPlaytime] = useState(game.playtime || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState(null);

  // Fetch review for this game
  useEffect(() => {
    if (getGameReviews) {
      const gameReviews = getGameReviews(game.gameId);
      if (gameReviews && gameReviews.length > 0) {
        setReview(gameReviews[0]);
      }
    }
  }, [game.gameId, getGameReviews]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateInLibrary(
        game.gameId, 
        { playtime }
      );
      onUpdate?.();
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove ${game.name} from your library?`)) {
      setIsLoading(true);
      try {
        await removeFromLibrary(game.gameId);
        onRemove?.(game.gameId);
      } catch (error) {
        console.error('Remove failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Determine display text for playtime
  const getPlaytimeDisplay = (hours) => {
    if (hours === 0) return "Not played yet";
    if (hours < 1) return "Less than 1 hour";
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div className="library-item">
      <div className="library-item-cover">
        {/* Replace the img tag with GameCover component */}
        <GameCover 
          cover={game.cover}
          name={game.name}
          size="small"
        />
      </div>

      <div className="library-item-details">
        <h3 className="library-item-title">{game.name}</h3>
        
        <GameStatus 
          gameId={game.gameId} 
          initialStatus={game.status} 
          onUpdate={onUpdate}
        />

        {isEditing ? (
          <div className="library-item-edit">
            <div className="form-group">
              <label>Playtime (hours)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={playtime}
                onChange={(e) => setPlaytime(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="library-item-actions">
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="library-item-info">
            <div className="library-item-stat">
              <span className="stat-label">Playtime:</span>
              <span className="stat-value">{getPlaytimeDisplay(game.playtime || 0)}</span>
            </div>
            
            <div className="library-item-stat">
              <span className="stat-label">Added:</span>
              <span className="stat-value">
                {game.addedDate ? new Date(game.addedDate).toLocaleDateString() : 'Unknown'}
              </span>
            </div>

            {/* Display review if it exists */}
            {review && (
              <div className="library-item-review">
                <h4>Your Review</h4>
                <div className="review-rating">
                  <RatingDisplay value={review.rating} />
                </div>
                <div className="review-content">
                  {review.review}
                </div>
                <Link to={`/games/${game.gameId}/reviews`} className="review-link">
                  <Button variant="outline" size="small">
                    Edit Review
                  </Button>
                </Link>
              </div>
            )}

            {/* Link to write a review if none exists */}
            {!review && (
              <div className="library-item-no-review">
                <Link to={`/games/${game.gameId}/reviews`} className="review-link">
                  <Button variant="outline" size="small">
                    Write Review
                  </Button>
                </Link>
              </div>
            )}

            <div className="library-item-actions">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Log Playtime
              </Button>
              <Button 
                variant="danger" 
                onClick={handleRemove}
                disabled={isLoading}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryItem;