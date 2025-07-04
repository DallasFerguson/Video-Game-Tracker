import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { addToLibrary, addToWishlist } from '../../../api';
import Button from '../../ui/Button/Button';
import './GameCard.css';

const GameCard = ({ game, showActions = true }) => {
  const { user } = useContext(AuthContext);

  // Format game cover URL correctly
  const getCoverUrl = (cover) => {
    if (!cover || !cover.url) return null;
    
    // If the URL already starts with http or https, use it as is
    if (cover.url.startsWith('http')) return cover.url;
    
    // If the URL starts with '//', add https:
    if (cover.url.startsWith('//')) return `https:${cover.url}`;
    
    // For IGDB image IDs
    if (cover.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
    }
    
    // Fallback for other URL formats
    return cover.url;
  };

  // Format release date to year only
  const getReleaseYear = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).getFullYear();
  };

  // Format rating to be out of 10
  const formatRating = (rating) => {
    if (!rating) return null;
    
    // IGDB ratings are typically on a scale of 100, so convert to scale of 10
    if (rating > 10) {
      return Math.round(rating / 10);
    }
    
    // If already on a scale of 10 or less, return as is
    return Math.round(rating * 10) / 10;
  };

  const handleAddToLibrary = async (status) => {
    if (!user) return;
    
    try {
      await addToLibrary(user.token, {
        gameId: game.id,
        name: game.name,
        cover: getCoverUrl(game.cover),
        status
      });
      alert(`${game.name} added to your library as ${status.replace('_', ' ')}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return;
    
    try {
      await addToWishlist(user.token, { 
        gameId: game.id,
        name: game.name,
        cover: getCoverUrl(game.cover)
      });
      alert(`${game.name} added to wishlist!`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const coverUrl = getCoverUrl(game.cover);

  return (
    <div className="game-card">
      <div className="game-card-cover">
        {coverUrl ? (
          <img src={coverUrl} alt={game.name} />
        ) : (
          <div className="game-card-no-image">No Image</div>
        )}
      </div>
      
      <div className="game-card-info">
        <h3 className="game-card-title">{game.name}</h3>
        <div className="game-card-meta">
          {game.first_release_date && (
            <span className="game-card-year">
              {getReleaseYear(game.first_release_date)}
            </span>
          )}
          {game.rating && (
            <span className="game-card-rating">
              ★ {formatRating(game.rating)}/10
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