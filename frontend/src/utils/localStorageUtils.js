// src/utils/localStorageUtils.js

/**
 * Get game library from localStorage
 * @returns {Array} Array of game objects
 */
export const getLibrary = () => {
  try {
    return JSON.parse(localStorage.getItem('gameLibrary')) || [];
  } catch (error) {
    console.error('Error parsing library from localStorage', error);
    return [];
  }
};

/**
 * Save game library to localStorage
 * @param {Array} library - Array of game objects
 */
export const saveLibrary = (library) => {
  try {
    localStorage.setItem('gameLibrary', JSON.stringify(library));
  } catch (error) {
    console.error('Error saving library to localStorage', error);
  }
};

/**
 * Get wishlist from localStorage
 * @returns {Array} Array of game objects
 */
export const getWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('gameWishlist')) || [];
  } catch (error) {
    console.error('Error parsing wishlist from localStorage', error);
    return [];
  }
};

/**
 * Save wishlist to localStorage
 * @param {Array} wishlist - Array of game objects
 */
export const saveWishlist = (wishlist) => {
  try {
    localStorage.setItem('gameWishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to localStorage', error);
  }
};

/**
 * Get reviews from localStorage
 * @returns {Array} Array of review objects
 */
export const getReviews = () => {
  try {
    return JSON.parse(localStorage.getItem('gameReviews')) || [];
  } catch (error) {
    console.error('Error parsing reviews from localStorage', error);
    return [];
  }
};

/**
 * Save reviews to localStorage
 * @param {Array} reviews - Array of review objects
 */
export const saveReviews = (reviews) => {
  try {
    localStorage.setItem('gameReviews', JSON.stringify(reviews));
  } catch (error) {
    console.error('Error saving reviews to localStorage', error);
  }
};

/**
 * Get search history from localStorage
 * @returns {Array} Array of search strings
 */
export const getSearchHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
  } catch (error) {
    console.error('Error parsing search history from localStorage', error);
    return [];
  }
};

/**
 * Save search history to localStorage
 * @param {Array} history - Array of search strings
 */
export const saveSearchHistory = (history) => {
  try {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving search history to localStorage', error);
  }
};

/**
 * Export all data to a JSON file
 */
export const exportData = () => {
  try {
    const data = {
      library: getLibrary(),
      wishlist: getWishlist(),
      reviews: getReviews(),
      searchHistory: getSearchHistory()
    };
    
    return data;
  } catch (error) {
    console.error('Error exporting data', error);
    return null;
  }
};

/**
 * Import data from a JSON file
 * @param {Object} data - Imported data object
 * @returns {boolean} Success status
 */
export const importData = (data) => {
  try {
    if (data.library) saveLibrary(data.library);
    if (data.wishlist) saveWishlist(data.wishlist);
    if (data.reviews) saveReviews(data.reviews);
    if (data.searchHistory) saveSearchHistory(data.searchHistory);
    return true;
  } catch (error) {
    console.error('Error importing data', error);
    return false;
  }
};