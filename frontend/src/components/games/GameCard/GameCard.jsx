import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LibraryContext } from '../../../contexts/LibraryContext';
import { WishlistContext } from '../../../contexts/WishlistContext';
import GameCover from '../GameCover/GameCover'; 
import Button from '../../ui/Button/Button';
import './GameCard.css';

const GameCard = ({ game, showActions = true }) => {
  const { addToLibrary } = useContext(LibraryContext);
  const { addToWishlist } = useContext(WishlistContext);

  //format game cover URL correctly for adding to library/wishlist
  const getCoverUrl = (cover) => {
    if (!cover || !cover.url) return null;
    
    //if the URL already starts with http or https, use it as is
    if (cover.url.startsWith('http')) return cover.url;
    
    //if the URL starts with '//', add https:
    if (cover.url.startsWith('//')) return `https:${cover.url}`;
    
    //for IGDB image IDs
    if (cover.image_id) {
      return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
    }
    
    //fallback for other URL formats
    return `https:${cover.url.replace('t_thumb', 't_cover_big')}`;
  };

  // Format release date to year only
  const getReleaseYear = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).getFullYear();
  };

  //format rating to be out of 10
  const formatRating = (rating) => {
    if (!rating) return null;
    
    //IGDB ratings are typically on a scale of 100, so convert to scale of 10
    if (rating > 10) {
      return Math.round(rating / 10);
    }
    
    //if already on a scale of 10 or less, return as is
    return Math.round(rating * 10) / 10;
  };

  const handleAddToLibrary = (status) => {
    try {
      addToLibrary({
        gameId: game.id,
        name: game.name,
        cover: getCoverUrl(game.cover),
        status
      });
    } catch (error) {
      console.error('Failed to add to library:', error);
    }
  };

  const handleAddToWishlist = () => {
    try {
      addToWishlist({ 
        gameId: game.id,
        name: game.name,
        cover: getCoverUrl(game.cover)
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-cover">
        {/* Replace the existing img tag with GameCover component */}
        <GameCover 
          cover={game.cover}
          name={game.name}
          size="small"
        />
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
        
        {showActions && (
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