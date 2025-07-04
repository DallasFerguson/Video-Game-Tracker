const Review = require('../models/Review');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get reviews for a game
exports.getGameReviews = async (req, res) => {
  const gameId = parseInt(req.params.gameId);

  try {
    const reviews = await Review.find({ gameId })
      .populate('user', 'username')
      .sort({ date: -1 });

    // Format reviews to include username
    const formattedReviews = reviews.map(review => ({
      id: review._id,
      gameId: review.gameId,
      userId: review.user._id,
      username: review.user.username,
      rating: review.rating,
      review: review.review,
      date: review.date
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error('Get game reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit/update review
exports.submitReview = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rating, review } = req.body;
  const gameId = parseInt(req.params.gameId);

  try {
    // Check if review already exists
    let reviewEntry = await Review.findOne({
      user: req.user.id,
      gameId
    });

    if (reviewEntry) {
      // Update existing review
      reviewEntry = await Review.findOneAndUpdate(
        { user: req.user.id, gameId },
        {
          $set: {
            rating,
            review,
            date: Date.now()
          }
        },
        { new: true }
      );
    } else {
      // Create new review
      reviewEntry = new Review({
        user: req.user.id,
        gameId,
        rating,
        review
      });

      await reviewEntry.save();
    }

    // Get user info to include in response
    const user = await User.findById(req.user.id).select('username');

    res.json({
      id: reviewEntry._id,
      gameId: reviewEntry.gameId,
      userId: reviewEntry.user,
      username: user.username,
      rating: reviewEntry.rating,
      review: reviewEntry.review,
      date: reviewEntry.date
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  const gameId = parseInt(req.params.gameId);

  try {
    const result = await Review.findOneAndDelete({
      user: req.user.id,
      gameId
    });

    if (!result) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};