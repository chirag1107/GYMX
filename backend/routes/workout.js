import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/workouts
// @desc    Get all logged workouts for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
        res.json({ success: true, count: workouts.length, data: workouts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/workouts
// @desc    Log a new completed workout
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, duration, calories, exercises, date } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Please provide a workout name' });
        }

        const newWorkout = await Workout.create({
            userId: req.user._id,
            name,
            duration,
            calories,
            exercises,
            date: date || new Date()
        });

        res.status(201).json({ success: true, data: newWorkout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a logged workout
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({ success: false, message: 'Workout not found' });
        }

        // Ensure user owns the workout
        if (workout.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await workout.deleteOne();
        res.json({ success: true, message: 'Workout removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
