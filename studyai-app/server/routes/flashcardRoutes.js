import express from 'express';
import Flashcard from '../models/Flashcard.js';
import FlashcardDeck from '../models/FlashcardDeck.js';

const router = express.Router();

// Create a new flashcard deck
router.post('/decks', async (req, res) => {
  try {
    const { name, description, subject, tags, isPublic } = req.body;
    const deck = new FlashcardDeck({
      user: req.user._id,
      name,
      description,
      subject,
      tags,
      isPublic
    });
    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add flashcards to a deck
router.post('/decks/:deckId/cards', async (req, res) => {
  try {
    const { front, back, difficulty } = req.body;
    const deck = await FlashcardDeck.findById(req.params.deckId);
    
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const flashcard = new Flashcard({
      user: req.user._id,
      deck: deck._id,
      front,
      back,
      difficulty
    });

    await flashcard.save();
    deck.cardCount += 1;
    await deck.save();

    res.status(201).json(flashcard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all decks for a user
router.get('/decks', async (req, res) => {
  try {
    const decks = await FlashcardDeck.find({ 
      $or: [
        { user: req.user._id },
        { isPublic: true }
      ]
    });
    res.json(decks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get flashcards in a deck
router.get('/decks/:deckId/cards', async (req, res) => {
  try {
    const cards = await Flashcard.find({ 
      deck: req.params.deckId,
      $or: [
        { user: req.user._id },
        { 'deck.isPublic': true }
      ]
    });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
