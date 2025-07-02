const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  review: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//create a compound index to ensure a user can only have one review per game
reviewSchema.index({ user: 1, gameId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;