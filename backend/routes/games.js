const express = require('express');
const router = express.Router();
const igdbService = require('../middleware/igdbService');

// @route   GET /api/games/trending
// @desc    Get trending games
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const games = await igdbService.getTrendingGames(parseInt(limit));
    res.json(games);
  } catch (error) {
    console.error('Get trending games error:', error);
    res.status(500).json({ message: 'Failed to fetch trending games' });
  }
});

// @route   GET /api/games/search
// @desc    Search games
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const games = await igdbService.searchGames(query, parseInt(limit));
    res.json(games);
  } catch (error) {
    console.error('Search games error:', error);
    res.status(500).json({ message: 'Failed to search games' });
  }
});

// @route   GET /api/games/:id
// @desc    Get game details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    
    const game = await igdbService.getGameDetails(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.json(game);
  } catch (error) {
    console.error('Get game details error:', error);
    res.status(500).json({ message: 'Failed to get game details' });
  }
});

module.exports = router;