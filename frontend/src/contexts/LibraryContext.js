// LibraryContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const LibraryContext = createContext(); // Add "export" here

// Create a provider component
export const LibraryProvider = ({ children }) => {
  // State for library games
  const [library, setLibrary] = useState([]);
  
  // State for wishlist games
  const [wishlist, setWishlist] = useState([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLibrary = localStorage.getItem('library');
      const storedWishlist = localStorage.getItem('wishlist');
      
      if (storedLibrary) setLibrary(JSON.parse(storedLibrary));
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);
  
  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('library', JSON.stringify(library));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [library, wishlist]);
  
  // Add a game to library
  const addToLibrary = (game) => {
    if (!library.some(item => item.id === game.id)) {
      setLibrary([...library, game]);
    }
  };
  
  // Remove a game from library
  const removeFromLibrary = (gameId) => {
    setLibrary(library.filter(game => game.id !== gameId));
  };
  
  // Add a game to wishlist
  const addToWishlist = (game) => {
    if (!wishlist.some(item => item.id === game.id)) {
      setWishlist([...wishlist, game]);
    }
  };
  
  // Remove a game from wishlist
  const removeFromWishlist = (gameId) => {
    setWishlist(wishlist.filter(game => game.id !== gameId));
  };
  
  // Check if a game is in library
  const isInLibrary = (gameId) => {
    return library.some(game => game.id === gameId);
  };
  
  // Check if a game is in wishlist
  const isInWishlist = (gameId) => {
    return wishlist.some(game => game.id === gameId);
  };
  
  // Create a notification function that does nothing
  // This is to satisfy components that expect this function
  const notify = () => {};
  
  // Value object to be provided
  const value = {
    library,
    wishlist,
    addToLibrary,
    removeFromLibrary,
    addToWishlist,
    removeFromWishlist,
    isInLibrary,
    isInWishlist,
    notify // Add this to fix the destructuring error
  };
  
  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

// Custom hook to use the library context
export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
