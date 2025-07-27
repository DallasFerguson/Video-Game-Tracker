// src/components/games/GameCard/GameCard.jsx - Removed library/wishlist buttons
import { Link } from 'react-router-dom';
import GameCover from '../GameCover/GameCover'; 
import './GameCard.css';

const GameCard = ({ game }) => {
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

  return (
    <div className="game-card">
      <Link to={`/game/${game.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="game-card-cover">
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
        </div>
      </Link>
    </div>
  );
};

export default GameCard;
