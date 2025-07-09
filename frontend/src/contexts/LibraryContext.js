import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getLibrary, saveLibrary } from '../utils/localStorageUtils';
import { NotificationContext } from './NotificationContext';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useContext(NotificationContext || { notify: () => {} });

  const fetchLibrary = useCallback(async () => {
    try {
      setLoading(true);
      const libraryData = getLibrary();
      setLibrary(libraryData);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (notify) notify('Failed to load your library', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const addToLibrary = useCallback((game) => {
    try {
      // Add timestamp and default values
      const newGame = {
        ...game,
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status: game.status || 'plan_to_play',
        playtime: game.playtime || 0
      };
      
      // Check if game already exists
      if (library.some(item => item.gameId === game.gameId)) {
        if (notify) notify('Game already in your library', 'error');
        return;
      }
      
      const updatedLibrary = [...library, newGame];
      setLibrary(updatedLibrary);
      saveLibrary(updatedLibrary);
      if (notify) notify(`${game.name} added to your library`, 'success');
      return newGame;
    } catch (error) {
      console.error('Error adding to library:', error);
      if (notify) notify('Failed to add game to library', 'error');
    }
  }, [library, notify]);

  const removeFromLibrary = useCallback((gameId) => {
    try {
      const game = library.find(game => game.gameId === gameId);
      if (!game) {
        if (notify) notify('Game not found in your library', 'error');
        return;
      }
      
      const updatedLibrary = library.filter(game => game.gameId !== gameId);
      setLibrary(updatedLibrary);
      saveLibrary(updatedLibrary);
      if (notify) notify(`${game.name} removed from your library`, 'success');
    } catch (error) {
      console.error('Error removing from library:', error);
      if (notify) notify('Failed to remove game from library', 'error');
    }
  }, [library, notify]);

  const updateInLibrary = useCallback((gameId, updates) => {
    try {
      const gameIndex = library.findIndex(game => game.gameId === gameId);
      if (gameIndex === -1) {
        if (notify) notify('Game not found in your library', 'error');
        return;
      }
      
      const updatedGame = {
        ...library[gameIndex],
        ...updates,
        lastUpdated: new Date().toISOString()
      };
      
      const updatedLibrary = [...library];
      updatedLibrary[gameIndex] = updatedGame;
      
      setLibrary(updatedLibrary);
      saveLibrary(updatedLibrary);
      if (notify) notify('Game updated successfully', 'success');
      return updatedGame;
    } catch (error) {
      console.error('Error updating library:', error);
      if (notify) notify('Failed to update game', 'error');
    }
  }, [library, notify]);

  const value = {
    library,
    loading,
    error,
    fetchLibrary,
    addToLibrary,
    removeFromLibrary,
    updateInLibrary
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}

export default useLibrary;