const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', wishlistController.getWishlist);

// @route   POST /api/wishlist
// @desc    Add game to wishlist
// @access  Private
router.post(
  '/',
  [
    check('gameId', 'Game ID is required').isNumeric(),
    check('name', 'Game name is required').notEmpty()
  ],
  wishlistController.addToWishlist
);

// @route   DELETE /api/wishlist/:gameId
// @desc    Remove game from wishlist
// @access  Private
router.delete('/:gameId', wishlistController.removeFromWishlist);

module.exports = router;