import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../../contexts/WishlistContext';
import { LibraryContext } from '../../contexts/LibraryContext';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist } = useContext(WishlistContext);
  const { addToLibrary } = useContext(LibraryContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Filter by search term
  const filteredGames = wishlist.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
    }
  });

  const handleRemoveFromWishlist = (gameId) => {
    if (window.confirm('Remove game from wishlist?')) {
      removeFromWishlist(gameId);
    }
  };

  const handleMoveToLibrary = (game) => {
    // First add to library
    addToLibrary({
      gameId: game.gameId,
      name: game.name,
      cover: game.cover,
      status: 'plan_to_play'
    });
    
    // Then remove from wishlist
    removeFromWishlist(game.gameId);
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-error">
        <p>Error loading wishlist: {error}</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}</p>
      </div>

      <div className="wishlist-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search wishlist..."
          className="wishlist-search"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="wishlist-sort"
        >
          <option value="recent">Recently Added</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {sortedGames.length > 0 ? (
        <div className="wishlist-items">
          {sortedGames.map(game => (
            <div key={game.gameId} className="wishlist-item">
              <div className="wishlist-item-cover">
                <img 
                  src={game.cover || '/assets/images/placeholders/game-cover-placeholder.jpg'} 
                  alt={game.name}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '/assets/images/placeholders/game-cover-placeholder.jpg';
                  }}
                />
              </div>
              <div className="wishlist-item-details">
                <Link to={`/games/${game.gameId}`} className="wishlist-item-title">
                  {game.name}
                </Link>
                <div className="wishlist-item-date">
                  Added: {game.addedDate ? new Date(game.addedDate).toLocaleDateString() : 'Unknown'}
                </div>
                <div className="wishlist-item-actions">
                  <Button 
                    variant="primary" 
                    onClick={() => handleMoveToLibrary(game)}
                  >
                    Move to Library
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleRemoveFromWishlist(game.gameId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="wishlist-empty">
          {searchTerm ? (
            <>
              <p>No games found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="wishlist-clear-search"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p>Your wishlist is empty</p>
              <Link to="/search" className="wishlist-browse">
                Browse games to add
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;