const mongoose = require('mongoose');

const libraryEntrySchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['playing', 'completed', 'plan_to_play', 'dropped'],
    default: 'plan_to_play'
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  playtime: {
    type: Number,
    default: 0
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

//create a compound index to ensure a user can only have one entry per game
libraryEntrySchema.index({ user: 1, gameId: 1 }, { unique: true });

const LibraryEntry = mongoose.model('LibraryEntry', libraryEntrySchema);

module.exports = LibraryEntry;