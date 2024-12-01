import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import User from './models/User.js';
import StudySession from './models/StudySession.js';
import Note from './models/Note.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import studyPlanRoutes from './routes/studyPlanRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyai')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication to specific routes
app.use('/api/flashcards', authenticateUser, flashcardRoutes);
app.use('/api/quizzes', authenticateUser, quizRoutes);
app.use('/api/study-plans', authenticateUser, studyPlanRoutes);

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Helper function to generate subject-specific prompts
function generatePrompt(subject, question) {
  const prompts = {
    Mathematics: `As a math tutor, help solve and explain this problem step by step: ${question}`,
    Physics: `As a physics expert, explain this concept or solve this problem with detailed explanations: ${question}`,
    Chemistry: `As a chemistry teacher, explain this concept or solve this problem with detailed explanations: ${question}`,
    Biology: `As a biology expert, explain this concept in detail: ${question}`,
    History: `As a history expert, provide a detailed explanation of: ${question}`,
    Literature: `As a literature expert, analyze and explain: ${question}`,
    'Computer Science': `As a computer science tutor, explain this concept or solve this problem: ${question}`,
    General: `As a knowledgeable tutor, help answer this question with detailed explanations: ${question}`
  };
  
  return prompts[subject] || prompts.General;
}

// Study routes
app.post('/api/ask', authenticateUser, async (req, res) => {
  try {
    const { subject, question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = generatePrompt(subject, question);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful and knowledgeable tutor. Provide clear, step-by-step explanations and always encourage understanding rather than just giving answers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const answer = completion.choices[0].message.content;

    // Save study session
    const studySession = new StudySession({
      user: req.user._id,
      subject,
      question,
      answer
    });
    await studySession.save();

    // Update user's study history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { studyHistory: studySession._id }
    });

    res.json({ 
      answer,
      sessionId: studySession._id,
      usage: completion.usage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message 
    });
  }
});

// Note routes
app.post('/api/notes', authenticateUser, async (req, res) => {
  try {
    const { title, content, tags, studySessionId } = req.body;
    const note = new Note({
      user: req.user._id,
      studySession: studySessionId,
      title,
      content,
      tags
    });
    await note.save();

    if (studySessionId) {
      await StudySession.findByIdAndUpdate(studySessionId, {
        $push: { notes: note._id }
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $push: { notes: note._id }
    });

    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/notes', authenticateUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .populate('studySession');
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/study-history', authenticateUser, async (req, res) => {
  try {
    const history = await StudySession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('notes');
    res.json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
