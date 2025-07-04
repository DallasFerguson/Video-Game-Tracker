import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getWishlist } from '../api/wishlist';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const wishlistData = await getWishlist(user.token);
      setWishlist(wishlistData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback((game) => {
    setWishlist(prev => [...prev, game]);
  }, []);

  const removeFromWishlist = useCallback((gameId) => {
    setWishlist(prev => prev.filter(game => game.gameId !== gameId));
  }, []);

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