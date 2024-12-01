import mongoose from 'mongoose';

const studyPlanSchema = new mongoose.Schema({
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
  goals: [{
    description: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  dailyStudyTime: Number, // in minutes
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  resources: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Paused'],
    default: 'Active'
  }
});

export default mongoose.model('StudyPlan', studyPlanSchema);
