import { createContext, useState, useEffect, useCallback } from 'react';
import { getUserLibrary } from '../api/library';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchLibrary = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const libraryData = await getUserLibrary(user.token);
      setLibrary(libraryData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const addToLibrary = useCallback((game) => {
    setLibrary(prev => [...prev, game]);
  }, []);

  const removeFromLibrary = useCallback((gameId) => {
    setLibrary(prev => prev.filter(game => game.gameId !== gameId));
  }, []);

  const updateInLibrary = useCallback((gameId, updates) => {
    setLibrary(prev => prev.map(game => 
      game.gameId === gameId ? { ...game, ...updates } : game
    ));
  }, []);

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