const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const libraryController = require('../controllers/libraryController');
const auth = require('../middleware/auth');

//apply auth middleware to all routes
router.use(auth);

// @route   GET /api/library
// @desc    Get user's library
// @access  Private
router.get('/', libraryController.getUserLibrary);

// @route   POST /api/library
// @desc    Add game to library
// @access  Private
router.post(
  '/',
  [
    check('gameId', 'Game ID is required').isNumeric(),
    check('name', 'Game name is required').notEmpty(),
    check('status').optional().isIn(['playing', 'completed', 'plan_to_play', 'dropped'])
  ],
  libraryController.addToLibrary
);

// @route   PUT /api/library/:gameId
// @desc    Update library entry
// @access  Private
router.put(
  '/:gameId',
  [
    check('status').optional().isIn(['playing', 'completed', 'plan_to_play', 'dropped']),
    check('rating').optional().isNumeric().isInt({ min: 0, max: 10 }),
    check('playtime').optional().isNumeric().isInt({ min: 0 })
  ],
  libraryController.updateLibraryEntry
);

// @route   DELETE /api/library/:gameId
// @desc    Remove game from library
// @access  Private
router.delete('/:gameId', libraryController.removeFromLibrary);

module.exports = router;