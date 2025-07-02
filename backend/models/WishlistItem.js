const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cover: {
    type: String
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
});

//create a compound index to ensure a user can only have one entry per game
wishlistItemSchema.index({ user: 1, gameId: 1 }, { unique: true });

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

module.exports = WishlistItem;