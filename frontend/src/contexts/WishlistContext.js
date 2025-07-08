import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getWishlist, saveWishlist } from '../utils/localStorageUtils';
import { NotificationContext } from './NotificationContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notify } = useContext(NotificationContext || { notify: () => {} });

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const wishlistData = getWishlist();
      setWishlist(wishlistData);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (notify) notify('Failed to load your wishlist', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback((game) => {
    try {
      // Add timestamp
      const newGame = {
        ...game,
        addedDate: new Date().toISOString()
      };
      
      // Check if game already exists
      if (wishlist.some(item => item.gameId === game.gameId)) {
        if (notify) notify('Game already in your wishlist', 'error');
        return;
      }
      
      const updatedWishlist = [...wishlist, newGame];
      setWishlist(updatedWishlist);
      saveWishlist(updatedWishlist);
      if (notify) notify(`${game.name} added to your wishlist`, 'success');
      return newGame;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (notify) notify('Failed to add game to wishlist', 'error');
    }
  }, [wishlist, notify]);

  const removeFromWishlist = useCallback((gameId) => {
    try {
      const game = wishlist.find(game => game.gameId === gameId);
      if (!game) {
        if (notify) notify('Game not found in your wishlist', 'error');
        return;
      }
      
      const updatedWishlist = wishlist.filter(game => game.gameId !== gameId);
      setWishlist(updatedWishlist);
      saveWishlist(updatedWishlist);
      if (notify) notify(`${game.name} removed from your wishlist`, 'success');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      if (notify) notify('Failed to remove game from wishlist', 'error');
    }
  }, [wishlist, notify]);

  const value = {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default useWishlist;