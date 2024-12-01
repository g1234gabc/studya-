import express from 'express';
import Quiz from '../models/Quiz.js';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate a quiz using AI
router.post('/generate', async (req, res) => {
  try {
    const { subject, difficulty, numQuestions } = req.body;

    // Use OpenAI to generate quiz questions
    const prompt = `Generate ${numQuestions} multiple-choice questions about ${subject} at ${difficulty} difficulty. 
    Format each question as:
    Question: [Question text]
    A: [Option A]
    B: [Option B]
    C: [Option C]
    D: [Option D]
    Correct Answer: [Correct option letter]
    Explanation: [Brief explanation of the correct answer]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000
    });

    // Parse the AI-generated quiz content
    const quizContent = completion.choices[0].message.content;
    const questions = parseQuizQuestions(quizContent);

    // Save the quiz
    const quiz = new Quiz({
      user: req.user._id,
      title: `${subject} ${difficulty} Quiz`,
      subject,
      questions,
      difficulty,
      totalQuestions: questions.length,
      passingScore: Math.ceil(questions.length * 0.7)
    });

    await quiz.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to parse quiz questions
function parseQuizQuestions(content) {
  const questionRegex = /Question: (.+)\nA: (.+)\nB: (.+)\nC: (.+)\nD: (.+)\nCorrect Answer: (.+)\nExplanation: (.+)/g;
  const questions = [];
  let match;

  while ((match = questionRegex.exec(content)) !== null) {
    questions.push({
      question: match[1],
      options: [match[2], match[3], match[4], match[5]],
      correctAnswer: match[6],
      explanation: match[7]
    });
  }

  return questions;
}

// Get user's quiz history
router.get('/history', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
