import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameList from '../../../components/games/GameList/GameList';
import useDebounce from '../../../hooks/useDebounce';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setSearchParams({ q: debouncedSearchQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearchQuery, setSearchParams]);

  return (
    <div className="search-page">
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for games..."
          className="search-input"
          autoFocus
        />
      </div>

      {debouncedSearchQuery && (
        <div className="search-results">
          <h2>Results for "{debouncedSearchQuery}"</h2>
          <GameList searchQuery={debouncedSearchQuery} />
        </div>
      )}
    </div>
  );
};

export default Search;