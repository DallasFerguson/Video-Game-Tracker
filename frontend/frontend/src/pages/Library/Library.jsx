import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useLibrary from '../../hooks/useLibrary';
import LibraryFilter from '../../components/library/LibraryFilter/LibraryFilter';
import LibraryItem from '../../components/library/LibraryItem/LibraryItem';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import './Library.css';

const Library = () => {
  const [searchParams] = useSearchParams();
  const { library, loading, error } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');

  // Get filter from URL or default to 'all'
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'recent';

  const filteredGames = library.filter(game => {
    const matchesStatus = statusFilter === 'all' || game.status === statusFilter;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'playtime':
        return b.playtime - a.playtime;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

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
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Game Library</h1>
        <p>{filteredGames.length} games</p>
      </div>

      <LibraryFilter 
        status={statusFilter}
        sort={sortBy}
        search={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="library-grid">
        {sortedGames.length > 0 ? (
          sortedGames.map(game => (
            <LibraryItem 
              key={game.gameId} 
              game={game}
            />
          ))
        ) : (
          <div className="library-empty">
            <p>No games found in your library</p>
            {statusFilter !== 'all' && (
              <a href="?status=all" className="reset-link">
                Clear filters
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;