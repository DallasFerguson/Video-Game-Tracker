import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchGames } from '../../../api/games';
import GameCard from '../../../components/games/GameCard/GameCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../../components/ui/Button/Button';
import { getSearchHistory, saveSearchHistory } from '../../../utils/localStorageUtils';
import useDebounce from '../../../hooks/useDebounce';
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
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  //load recent searches only once on component mount
  useEffect(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  //update URL when debounced search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setSearchParams({ q: debouncedSearchQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchQuery, setSearchParams]);

  //fetch search results when debounced query changes
  useEffect(() => {
    //skip the initial mount to prevent unnecessary API calls
    if (isInitialMount.current) {
      isInitialMount.current = false;
      //but still perform search if there's an initial query from URL
      if (!debouncedSearchQuery) return;
    }

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
        
        // Only add text searches to search history
        if (results.length > 0) {
          const searchExists = recentSearches.some(
            item => item.toLowerCase() === debouncedSearchQuery.toLowerCase()
          );
          
          if (!searchExists) {
            const updatedSearches = [debouncedSearchQuery, ...recentSearches].slice(0, 5);
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
    saveSearchHistory([]);
  };

  //handle retry search on error
  const handleRetry = () => {
    if (debouncedSearchQuery) {
      //force a re-render to trigger the useEffect again
      setError(null);
      setLoading(true);
      
      searchGames(debouncedSearchQuery)
        .then(results => {
          setGames(results);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to search games. Please try again.');
          setLoading(false);
        });
    }
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
      </div>

      {debouncedSearchQuery && (
        <div className="search-results">
          <div className="results-header">
            <h2>Results for "{debouncedSearchQuery}"</h2>
            <div className="results-count">
              {!loading && !error ? `${games.length} games found` : ''}
            </div>
          </div>
          
          {loading ? (
            <div className="search-loading">
              <LoadingSpinner />
              <p>Searching the universe of games...</p>
            </div>
          ) : error ? (
            <div className="search-error">
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
                  to={`/games/${game.id}`}
                  className="game-card-link"
                >
                  <GameCard game={game} showActions={false} />
                </Link>
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