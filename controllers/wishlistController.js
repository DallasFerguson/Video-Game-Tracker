const WishlistItem = require('../models/WishlistItem');
const { validationResult } = require('express-validator');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await WishlistItem.find({ user: req.user.id });
    res.json(wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { gameId, name, cover } = req.body;

  try {
    // Check if game already exists in wishlist
    let wishlistItem = await WishlistItem.findOne({
      user: req.user.id,
      gameId
    });

    if (wishlistItem) {
      return res.status(400).json({ message: 'Game already in wishlist' });
    }

    // Create new wishlist item
    wishlistItem = new WishlistItem({
      user: req.user.id,
      gameId,
      name,
      cover
    });

    await wishlistItem.save();

    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  const gameId = parseInt(req.params.gameId);

  try {
    const result = await WishlistItem.findOneAndDelete({
      user: req.user.id,
      gameId
    });

    if (!result) {
      return res.status(404).json({ message: 'Game not found in wishlist' });
    }

    res.json({ message: 'Game removed from wishlist' });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};