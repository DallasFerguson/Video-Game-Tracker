import { useState } from 'react';
import { updateLibraryEntry, removeFromLibrary } from '../../../api/library';
import GameStatus from '../../games/GameStatus/GameStatus';
import Button from '../../ui/Button/Button';
import './LibraryItem.css';

const LibraryItem = ({ game, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [playtime, setPlaytime] = useState(game.playtime || 0);
  const [rating, setRating] = useState(game.rating || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateLibraryEntry(
        localStorage.getItem('token'),
        game.gameId, 
        { playtime, rating }
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
        await removeFromLibrary(
          localStorage.getItem('token'),
          game.gameId
        );
        onRemove?.(game.gameId);
      } catch (error) {
        console.error('Remove failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="library-item">
      <div className="library-item-cover">
        <img 
          src={game.cover || '/assets/images/placeholders/game-cover-placeholder.jpg'} 
          alt={game.name} 
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
                value={playtime}
                onChange={(e) => setPlaytime(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label>Rating (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value) || 0)}
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
              <span className="stat-value">{playtime} hours</span>
            </div>
            <div className="library-item-stat">
              <span className="stat-label">Rating:</span>
              <span className="stat-value">{rating}/10</span>
            </div>

            <div className="library-item-actions">
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit
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