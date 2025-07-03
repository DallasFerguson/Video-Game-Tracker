import './LibraryFilter.css';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Games' },
  { value: 'playing', label: 'Currently Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'plan_to_play', label: 'Plan to Play' }
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'playtime', label: 'Playtime' },
  { value: 'rating', label: 'Rating' }
];

const LibraryFilter = ({ filters, onFilterChange }) => {
  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ ...filters, sort: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  return (
    <div className="library-filter">
      <div className="filter-group">
        <label htmlFor="search">Search:</label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Filter by name..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={filters.status}
          onChange={handleStatusChange}
        >
          {STATUS_FILTERS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By:</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LibraryFilter;