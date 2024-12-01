import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  totalQuestions: Number,
  passingScore: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Quiz', quizSchema);
