import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useWishlist from '../../hooks/useWishlist';
import GameList from '../../components/games/GameList/GameList';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Wishlist.css';

const Wishlist = () => {
  const [searchParams] = useSearchParams();
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const sortBy = searchParams.get('sort') || 'recent';

  // Filter by search term
  const filteredGames = wishlist.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'release':
        return (b.first_release_date || 0) - (a.first_release_date || 0);
      case 'recent':
      default:
        return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

  const handleRemoveFromWishlist = async (gameId) => {
    try {
      await removeFromWishlist(gameId);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
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
          onChange={(e) => searchParams.set('sort', e.target.value)}
          className="wishlist-sort"
        >
          <option value="recent">Recently Added</option>
          <option value="name">Name (A-Z)</option>
          <option value="rating">Highest Rated</option>
          <option value="release">Release Date</option>
        </select>
      </div>

      {sortedGames.length > 0 ? (
        <GameList 
          games={sortedGames} 
          showActions={true}
          onRemoveFromWishlist={handleRemoveFromWishlist}
        />
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
              <a href="/search" className="wishlist-browse">
                Browse games to add
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;