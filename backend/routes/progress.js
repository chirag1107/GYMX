import express from 'express';
import Progress from '../models/Progress.js';
import Workout from '../models/Workout.js';
import Nutrition from '../models/Nutrition.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user progress & profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id });
        
        if (!progress) {
            // Create default if not exists
            progress = await Progress.create({
                userId: req.user._id,
                profile: {
                    name: req.user.name,
                    startWeight: 85,
                    currentWeight: 80.5,
                    targetWeight: 75,
                    height: 175,
                    age: 28,
                    gender: 'male',
                    activityLevel: 'moderate',
                    goal: 'fat_loss',
                    startDate: new Date()
                },
                weightHistory: [
                    { date: new Date().toISOString().split('T')[0], weight: 80.5 }
                ]
            });
        }
        
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/progress/profile
// @desc    Update user profile settings
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        let progress = await Progress.findOne({ userId: req.user._id });
        
        if (!progress) {
            progress = new Progress({ userId: req.user._id });
        }
        
        // Update profile fields
        progress.profile = {
            ...progress.profile,
            ...req.body
        };

        // If current weight changed, also add/update it in weightHistory for today
        if (req.body.currentWeight !== undefined) {
            const today = new Date().toISOString().split('T')[0];
            const existingIndex = progress.weightHistory.findIndex(entry => entry.date === today);
            
            if (existingIndex >= 0) {
                progress.weightHistory[existingIndex].weight = req.body.currentWeight;
            } else {
                progress.weightHistory.push({ date: today, weight: req.body.currentWeight });
            }
        }
        
        await progress.save();
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/progress/weight
// @desc    Add or update a weight entry
// @access  Private
router.post('/weight', protect, async (req, res) => {
    try {
        const { weight, date } = req.body;
        
        if (weight === undefined) {
            return res.status(400).json({ success: false, message: 'Please provide weight' });
        }
        
        const entryDate = date || new Date().toISOString().split('T')[0];
        let progress = await Progress.findOne({ userId: req.user._id });
        
        if (!progress) {
            progress = new Progress({ userId: req.user._id });
        }
        
        // Update current weight in profile
        progress.profile.currentWeight = weight;
        
        // Check if date already exists
        const existingIndex = progress.weightHistory.findIndex(entry => entry.date === entryDate);
        if (existingIndex >= 0) {
            progress.weightHistory[existingIndex].weight = weight;
        } else {
            progress.weightHistory.push({ date: entryDate, weight });
        }
        
        // Sort weight history by date
        progress.weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        await progress.save();
        res.json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/progress/reset
// @desc    Reset all user progress, workouts, and nutrition logs
// @access  Private
router.delete('/reset', protect, async (req, res) => {
    try {
        // Delete all workouts and nutrition for this user
        await Workout.deleteMany({ userId: req.user._id });
        await Nutrition.deleteMany({ userId: req.user._id });
        
        // Reset progress back to defaults
        let progress = await Progress.findOne({ userId: req.user._id });
        if (progress) {
            progress.profile = {
                name: req.user.name,
                startWeight: 85,
                currentWeight: 85,
                targetWeight: 75,
                height: 175,
                age: 28,
                gender: 'male',
                activityLevel: 'moderate',
                goal: 'fat_loss',
                startDate: new Date()
            };
            progress.weightHistory = [];
            await progress.save();
        }
        
        res.json({ success: true, message: 'All user data has been reset successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
