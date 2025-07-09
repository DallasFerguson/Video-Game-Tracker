const LibraryEntry = require('../models/LibraryEntry');
const { validationResult } = require('express-validator');

//get user's library
exports.getUserLibrary = async (req, res) => {
  try {
    const library = await LibraryEntry.find({ user: req.user.id });
    res.json(library);
  } catch (error) {
    console.error('Get library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//add game to library
exports.addToLibrary = async (req, res) => {
  //validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { gameId, name, cover, status = 'plan_to_play' } = req.body;

  try {
    //check if game already exists in library
    let libraryEntry = await LibraryEntry.findOne({
      user: req.user.id,
      gameId
    });

    if (libraryEntry) {
      return res.status(400).json({ message: 'Game already in library' });
    }

    //create new library entry
    libraryEntry = new LibraryEntry({
      user: req.user.id,
      gameId,
      name,
      cover,
      status
    });

    await libraryEntry.save();

    res.status(201).json(libraryEntry);
  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//update library entry
exports.updateLibraryEntry = async (req, res) => {
  //validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { status, rating, playtime } = req.body;
  const gameId = parseInt(req.params.gameId);

  try {
    //build update object
    const updateFields = { lastUpdated: Date.now() };
    if (status) updateFields.status = status;
    if (rating !== undefined) updateFields.rating = rating;
    if (playtime !== undefined) updateFields.playtime = playtime;

    //update library entry
    let libraryEntry = await LibraryEntry.findOneAndUpdate(
      { user: req.user.id, gameId },
      { $set: updateFields },
      { new: true }
    );

    if (!libraryEntry) {
      return res.status(404).json({ message: 'Game not found in library' });
    }

    res.json(libraryEntry);
  } catch (error) {
    console.error('Update library entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//remove from library
exports.removeFromLibrary = async (req, res) => {
  const gameId = parseInt(req.params.gameId);

  try {
    const result = await LibraryEntry.findOneAndDelete({
      user: req.user.id,
      gameId
    });

    if (!result) {
      return res.status(404).json({ message: 'Game not found in library' });
    }

    res.json({ message: 'Game removed from library' });
  } catch (error) {
    console.error('Remove from library error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};