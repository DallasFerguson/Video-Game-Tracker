// GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './GameCard.css'; // Update path if needed

const GameCard = ({ game }) => {
  // Function to safely get cover image URL
  const getCoverUrl = (cover) => {
    if (!cover || !cover.image_id) {
      return 'https://via.placeholder.com/200x280?text=No+Cover';
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  };

  return (
    <div className="game-card">
      <Link to={`/game/${game.id}`} className="game-card-link">
        <div className="game-card-image">
          <img src={getCoverUrl(game.cover)} alt={game.name} />
        </div>
        <div className="game-card-content">
          <h3 className="game-card-title">{game.name}</h3>
          {game.rating && (
            <div className="game-card-rating">
              Rating: {Math.round(game.rating)}%
            </div>
          )}
        </div>
      </Link>
      {/* Remove buttons for adding to library, wishlist, or reviewing */}
    </div>
  );
};

export default GameCard;
