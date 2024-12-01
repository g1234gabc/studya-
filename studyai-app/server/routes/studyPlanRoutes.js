import express from 'express';
import StudyPlan from '../models/StudyPlan.js';

const router = express.Router();

// Create a new study plan
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      subject, 
      goals, 
      startDate, 
      endDate, 
      dailyStudyTime, 
      resources 
    } = req.body;

    const studyPlan = new StudyPlan({
      user: req.user._id,
      title,
      subject,
      goals,
      startDate,
      endDate,
      dailyStudyTime,
      resources
    });

    await studyPlan.save();
    res.status(201).json(studyPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all study plans for a user
router.get('/', async (req, res) => {
  try {
    const studyPlans = await StudyPlan.find({ 
      user: req.user._id,
      status: { $ne: 'Completed' }
    }).sort({ startDate: -1 });
    res.json(studyPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update study plan progress
router.patch('/:id/progress', async (req, res) => {
  try {
    const { progress, completedGoals } = req.body;
    const studyPlan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        progress,
        $set: { 
          'goals.$[elem].completed': true 
        },
        status: progress === 100 ? 'Completed' : 'Active'
      },
      { 
        new: true,
        arrayFilters: [{ 'elem._id': { $in: completedGoals } }]
      }
    );

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json(studyPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a study plan
router.delete('/:id', async (req, res) => {
  try {
    const studyPlan = await StudyPlan.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!studyPlan) {
      return res.status(404).json({ message: 'Study plan not found' });
    }

    res.json({ message: 'Study plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
