import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { addToLibrary, addToWishlist } from '../../../api';
import Button from '../../ui/Button/Button';
import './GameCard.css';

const GameCard = ({ game, showActions = true }) => {
  const { user } = useContext(AuthContext);

  const handleAddToLibrary = async (status) => {
    try {
      await addToLibrary(user.token, {
        gameId: game.id,
        name: game.name,
        cover: game.cover?.url,
        status
      });
      alert(`${game.name} added to your library as ${status.replace('_', ' ')}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(user.token, { 
        gameId: game.id,
        name: game.name,
        cover: game.cover?.url
      });
      alert(`${game.name} added to wishlist!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-cover">
  {game.cover && game.cover.url ? (
    <img 
      src={game.cover.url.startsWith('//') ? `https:${game.cover.url}` : game.cover.url} 
      alt={game.name} 
    />
  ) : (
    <div className="game-card-no-image">No Image</div>
  )}
</div>
      
      <div className="game-card-info">
        <h3 className="game-card-title">{game.name}</h3>
        <div className="game-card-meta">
          {game.first_release_date && (
            <span className="game-card-year">
              {new Date(game.first_release_date * 1000).getFullYear()}
            </span>
          )}
          {game.rating && (
            <span className="game-card-rating">
              ★ {Math.round(game.rating / 10)}/10
            </span>
          )}
        </div>
        
        {showActions && user && (
          <div className="game-card-actions">
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => handleAddToLibrary('plan_to_play')}
            >
              Plan to Play
            </Button>
            <Button 
              variant="primary" 
              size="small"
              onClick={handleAddToWishlist}
            >
              Wishlist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;