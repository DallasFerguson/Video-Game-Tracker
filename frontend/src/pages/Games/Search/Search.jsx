import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchGames } from '../../../api/games';
import GameCard from '../../../components/games/GameCard/GameCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../../components/ui/Button/Button';
import useDebounce from '../../../hooks/useDebounce';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const searchInputRef = useRef(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update URL when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setSearchParams({ q: debouncedSearchQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchQuery, setSearchParams]);

  // Fetch search results
  useEffect(() => {
    const fetchGames = async () => {
      if (!debouncedSearchQuery) {
        setGames([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await searchGames(debouncedSearchQuery);
        setGames(results);
        
        // Save to recent searches if query is new
        if (debouncedSearchQuery && results.length > 0) {
          setRecentSearches(prev => {
            // Remove duplicate if exists
            const filtered = prev.filter(item => item !== debouncedSearchQuery);
            // Add to beginning of array and limit to 5 items
            const updated = [debouncedSearchQuery, ...filtered].slice(0, 5);
            // Save to localStorage
            localStorage.setItem('recentSearches', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [debouncedSearchQuery]);

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
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">Find Your Next Adventure</h1>
        
        <div className="search-input-container">
          <div className="search-input-wrapper">
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
          <div className="search-icon">🔍</div>
        </div>
        
        {/* Recent searches */}
        {!debouncedSearchQuery && recentSearches.length > 0 && (
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
        
        {/* Popular categories (static) */}
        {!debouncedSearchQuery && (
          <div className="search-categories">
            <h3>Popular Categories</h3>
            <div className="category-buttons">
              <Button
                variant="outline"
                onClick={() => handleRecentSearch('RPG')}
              >
                RPG
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRecentSearch('Action')}
              >
                Action
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRecentSearch('Adventure')}
              >
                Adventure
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRecentSearch('Shooter')}
              >
                Shooter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRecentSearch('Strategy')}
              >
                Strategy
              </Button>
            </div>
          </div>
        )}
      </div>

      {debouncedSearchQuery && (
        <div className="search-results">
          <div className="results-header">
            <h2>Results for "{debouncedSearchQuery}"</h2>
            <div className="results-count">
              {games.length} games found
            </div>
          </div>
          
          {loading ? (
            <div className="search-loading">
              <LoadingSpinner />
              <p>Searching the universe of games...</p>
            </div>
          ) : error ? (
            <div className="search-error">
              <p>Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : games.length > 0 ? (
            <div className="games-grid">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🎮</div>
              <h3>No games found</h3>
              <p>Try a different search term or browse trending games</p>
              <Link to="/trending">
                <Button variant="primary">See Trending Games</Button>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Decorative elements */}
      <div className="search-decoration search-decoration-1">🎮</div>
      <div className="search-decoration search-decoration-2">🎲</div>
      <div className="search-decoration search-decoration-3">🏆</div>
    </div>
  );
};

export default Search;
