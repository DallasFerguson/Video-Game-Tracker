// src/pages/Library/Library.jsx
import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LibraryContext } from '../../contexts/LibraryContext';
import { ReviewContext } from '../../contexts/ReviewContext';
import LibraryItem from '../../components/library/LibraryItem/LibraryItem';
import LibraryFilter from '../../components/library/LibraryFilter/LibraryFilter';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../components/ui/Button/Button';
import './Library.css';

const Library = () => {
  const [searchParams] = useSearchParams();
  const { library, loading, error, fetchLibrary } = useContext(LibraryContext);
  const { fetchReviews } = useContext(ReviewContext);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    sort: searchParams.get('sort') || 'recent',
    search: ''
  });

  // Fetch library and reviews on component mount
  useEffect(() => {
    fetchLibrary();
    if (fetchReviews) {
      fetchReviews();
    }
  }, [fetchLibrary, fetchReviews]);

  // Filter games by current filters
  const filteredGames = library.filter(game => {
    const matchesStatus = filters.status === 'all' || game.status === filters.status;
    const matchesSearch = game.name.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort filtered games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (filters.sort) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'playtime':
        return (b.playtime || 0) - (a.playtime || 0);
      case 'recent':
      default:
        return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
    }
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (loading) {
    return (
      <div className="library-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="library-error">
        <p>Error loading your library: {error}</p>
        <Button onClick={fetchLibrary}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <div className="library-title">
          <h1>My Game Library</h1>
          <p>{filteredGames.length} games</p>
        </div>
      </div>

      <LibraryFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {sortedGames.length > 0 ? (
        <div className="library-list">
          {sortedGames.map(game => (
            <LibraryItem 
              key={game.gameId} 
              game={game}
              onUpdate={() => {
                fetchLibrary();
                if (fetchReviews) fetchReviews();
              }}
              onRemove={fetchLibrary}
            />
          ))}
        </div>
      ) : (
        <div className="library-empty">
          <p>No games found in your library</p>
          {filters.status !== 'all' || filters.search !== '' ? (
            <Button variant="outline" onClick={() => setFilters({ status: 'all', sort: 'recent', search: '' })}>
              Clear Filters
            </Button>
          ) : (
            <p>Start by adding games from the search page.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Library;
