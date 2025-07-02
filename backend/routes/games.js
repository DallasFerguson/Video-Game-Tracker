const express = require('express');
const router = express.Router();
const gamesController = require('../controllers/gamesController');

// @route   GET /api/games/trending
// @desc    Get trending games
// @access  Public
router.get('/trending', gamesController.getTrendingGames);

// @route   GET /api/games/search
// @desc    Search games
// @access  Public
router.get('/search', gamesController.searchGames);

// @route   GET /api/games/:id
// @desc    Get game details
// @access  Public
router.get('/:id', gamesController.getGameDetails);

module.exports = router;