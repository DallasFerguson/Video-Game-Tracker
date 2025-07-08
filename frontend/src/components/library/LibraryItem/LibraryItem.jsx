import { useState, useContext } from 'react';
import { LibraryContext } from '../../../contexts/LibraryContext';
import GameStatus from '../../games/GameStatus/GameStatus';
import Button from '../../ui/Button/Button';
import './LibraryItem.css';

const LibraryItem = ({ game, onUpdate, onRemove }) => {
  const { updateInLibrary, removeFromLibrary } = useContext(LibraryContext);
  const [isEditing, setIsEditing] = useState(false);
  const [playtime, setPlaytime] = useState(game.playtime || 0);
  const [rating, setRating] = useState(game.rating || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateInLibrary(
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
        await removeFromLibrary(game.gameId);
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
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/assets/images/placeholders/game-cover-placeholder.jpg';
          }}
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
                min="0"
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
              <span className="stat-value">{game.playtime || 0} hours</span>
            </div>
            <div className="library-item-stat">
              <span className="stat-label">Rating:</span>
              <span className="stat-value">{game.rating || 0}/10</span>
            </div>
            <div className="library-item-stat">
              <span className="stat-label">Added:</span>
              <span className="stat-value">
                {game.addedDate ? new Date(game.addedDate).toLocaleDateString() : 'Unknown'}
              </span>
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