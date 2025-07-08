import { useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LibraryContext } from '../../contexts/LibraryContext';
import LibraryItem from '../../components/library/LibraryItem/LibraryItem';
import LibraryFilter from '../../components/library/LibraryFilter/LibraryFilter';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';
import Button from '../../components/ui/Button/Button';
import { exportData, importData } from '../../utils/localStorageUtils';
import './Library.css';

const Library = () => {
  const [searchParams] = useSearchParams();
  const { library, loading, error, fetchLibrary } = useContext(LibraryContext);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    sort: searchParams.get('sort') || 'recent',
    search: ''
  });
  const [showImport, setShowImport] = useState(false);
  const [importValue, setImportValue] = useState('');

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
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'recent':
      default:
        return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
    }
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-tracker-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importValue);
      importData(data);
      fetchLibrary(); // Refresh the library data
      setShowImport(false);
      setImportValue('');
    } catch (err) {
      console.error('Failed to import data:', err);
      alert('Invalid data format. Please check your JSON file.');
    }
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
        <div className="library-actions">
          <Button variant="outline" onClick={handleExport}>
            Export Data
          </Button>
          <Button variant="outline" onClick={() => setShowImport(!showImport)}>
            {showImport ? 'Cancel Import' : 'Import Data'}
          </Button>
        </div>
      </div>

      {showImport && (
        <div className="import-container">
          <h3>Import Data</h3>
          <p>Paste your JSON backup below:</p>
          <textarea 
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
            className="import-textarea"
            rows={5}
          />
          <Button onClick={handleImport}>Import</Button>
        </div>
      )}

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
              onUpdate={fetchLibrary}
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