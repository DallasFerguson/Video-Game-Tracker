// src/pages/Games/Search/Search.jsx - Without library/wishlist references
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchGames } from '../../../api/games';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../../components/ui/Button/Button';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const isInitialMount = useRef(true);
  
  // Get search history from localStorage directly
  useEffect(() => {
    try {
      const storedSearches = JSON.parse(localStorage.getItem('searchHistory')) || [];
      setRecentSearches(storedSearches);
    } catch (error) {
      console.error('Error loading search history:', error);
      setRecentSearches([]);
    }
  }, []);

  // Save to localStorage directly
  const saveSearchHistory = (history) => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Categories for quick filtering
  const gameCategories = [
    "Action", "Adventure", "RPG", "Strategy", 
    "Shooter", "Sports", "Racing", "Puzzle"
  ];

  // Simplified debounce function directly in component
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setSearchParams({ q: searchQuery });
        performSearch(searchQuery);
      } else {
        setSearchParams({});
        setGames([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  const performSearch = async (query) => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await searchGames(query);
      setGames(results);
      
      // Only add text searches to search history
      if (results.length > 0) {
        const searchExists = recentSearches.some(
          item => item.toLowerCase() === query.toLowerCase()
        );
        
        if (!searchExists) {
          const updatedSearches = [query, ...recentSearches].slice(0, 5);
          setRecentSearches(updatedSearches);
          saveSearchHistory(updatedSearches);
        }
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.message || 'Failed to search games. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleRecentSearch = (query) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    saveSearchHistory([]);
  };

  const handleRetry = () => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  };
  
  // Format image URL for game covers
  const getGameCoverUrl = (cover) => {
    if (!cover || !cover.image_id) {
      return null;
    }
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  };
  
  return (
    <div className="search-page" style={{ backgroundColor: '#f8f8f8', color: '#333' }}>
      <div className="floating-controller">🎮</div>
      <div className="floating-controller">🎲</div>
      <div className="floating-controller">🏆</div>
      
      <h1 className="search-title">Discover Your Next Adventure</h1>
      <p className="subtitle">Search across thousands of games to find your next obsession</p>
      
      <div className="search-container">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for games..."
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={handleClear}>
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Categories - display only when not searching */}
        {!searchQuery && (
          <div className="search-categories">
            <h3>Popular Categories</h3>
            <div className="category-buttons">
              {gameCategories.map((category, index) => (
                <button
                  key={index}
                  className="button"
                  onClick={() => setSearchQuery(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-searches-header">
              <h3>Recent Searches</h3>
              <button className="clear-recent" onClick={clearRecentSearches}>
                Clear All
              </button>
            </div>
            <div className="recent-search-tags">
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  className="recent-search-tag"
                  onClick={() => handleRecentSearch(query)}
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {searchQuery && (
        <div className="search-results">
          <div className="results-header">
            <h2>Results for "{searchQuery}"</h2>
            <div className="results-count">
              {!loading && !error ? `${games.length} games found` : ''}
            </div>
          </div>
          
          {loading ? (
            <div className="game-list-loading">
              <LoadingSpinner />
              <p>Searching the universe of games...</p>
            </div>
          ) : error ? (
            <div className="game-list-error">
              <p>{error}</p>
              <p className="error-details">
                This might be due to a connection issue with the IGDB API.
              </p>
              <div className="error-actions">
                <Button onClick={handleRetry}>Try Again</Button>
                <Button variant="secondary" onClick={() => window.location.reload()}>
                  Reload Page
                </Button>
              </div>
            </div>
          ) : games.length > 0 ? (
            <div className="games-grid">
              {games.map(game => (
                <Link 
                  key={game.id} 
                  to={`/game/${game.id}`}
                  className="game-card-link"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="game-card" style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div className="game-card-cover" style={{
                      height: '300px',
                      backgroundColor: '#f0f0f0',
                      position: 'relative'
                    }}>
                      {game.cover && game.cover.image_id ? (
                        <img 
                          src={getGameCoverUrl(game.cover)}
                          alt={game.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#666',
                          textAlign: 'center',
                          padding: '10px'
                        }}>
                          No Cover Available
                        </div>
                      )}
                    </div>
                    <div className="game-card-info" style={{
                      padding: '15px',
                      flexGrow: 1
                    }}>
                      <h3 className="game-card-title" style={{
                        margin: '0 0 10px 0',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {game.name}
                      </h3>
                      <div className="game-card-meta" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#666',
                        fontSize: '0.9rem'
                      }}>
                        {game.first_release_date && (
                          <span className="game-card-year">
                            {new Date(game.first_release_date * 1000).getFullYear()}
                          </span>
                        )}
                        {game.rating && (
                          <span className="game-card-rating" style={{
                            color: '#ffcb05',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ★ {Math.round(game.rating / 10)}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="game-list-empty" style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              margin: '40px auto',
              maxWidth: '600px'
            }}>
              <div className="no-results-icon" style={{ fontSize: '4rem', marginBottom: '20px' }}>🎮</div>
              <h3>No games found</h3>
              <p>Try a different search term or browse trending games</p>
              <Link to="/trending">
                <Button variant="primary">See Trending Games</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
