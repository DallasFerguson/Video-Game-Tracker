const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// @route   GET /api/reviews/game/:gameId
// @desc    Get reviews for a game
// @access  Public
router.get('/game/:gameId', reviewController.getGameReviews);

//apply auth middleware to protected routes
router.use(auth);

// @route   GET /api/reviews
// @desc    Get user's reviews
// @access  Private
router.get('/', reviewController.getUserReviews);

// @route   POST /api/reviews/game/:gameId
// @desc    Submit/update review
// @access  Private
router.post(
  '/game/:gameId',
  [
    check('rating', 'Rating must be between 1 and 10').isInt({ min: 1, max: 10 }),
    check('review', 'Review text is required').isLength({ min: 10, max: 2000 })
  ],
  reviewController.submitReview
);

// @route   DELETE /api/reviews/game/:gameId
// @desc    Delete review
// @access  Private
router.delete('/game/:gameId', reviewController.deleteReview);

module.exports = router;