import express from 'express';
import Nutrition from '../models/Nutrition.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to get or create nutrition for a specific date
async function getOrCreateNutrition(userId, dateStr) {
    let nutrition = await Nutrition.findOne({ userId, date: dateStr });
    if (!nutrition) {
        try {
            nutrition = await Nutrition.create({
                userId,
                date: dateStr,
                waterIntake: 0,
                dailyMacros: { calories: 0, protein: 0, carbs: 0, fats: 0 }
            });
        } catch (err) {
            // In case of parallel creations causing duplicate key error, fetch again
            nutrition = await Nutrition.findOne({ userId, date: dateStr });
        }
    }
    return nutrition;
}

// @route   GET /api/nutrition/:date
// @desc    Get nutrition data for a specific date (YYYY-MM-DD)
// @access  Private
router.get('/:date', protect, async (req, res) => {
    try {
        const dateStr = req.params.date;
        const nutrition = await getOrCreateNutrition(req.user._id, dateStr);
        res.json({ success: true, data: nutrition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/nutrition/:date/water
// @desc    Add water intake
// @access  Private
router.put('/:date/water', protect, async (req, res) => {
    try {
        const { amount } = req.body;
        const dateStr = req.params.date;

        if (amount === undefined) {
            return res.status(400).json({ success: false, message: 'Please provide water amount' });
        }

        const nutrition = await getOrCreateNutrition(req.user._id, dateStr);
        
        if (amount === 0) {
            nutrition.waterIntake = 0; // Reset
        } else {
            nutrition.waterIntake += amount;
        }

        await nutrition.save();
        res.json({ success: true, data: nutrition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/nutrition/:date/macros
// @desc    Add food macros to the daily log
// @access  Private
router.put('/:date/macros', protect, async (req, res) => {
    try {
        const { calories, protein, carbs, fats, reset } = req.body;
        const dateStr = req.params.date;

        const nutrition = await getOrCreateNutrition(req.user._id, dateStr);

        if (reset) {
            nutrition.dailyMacros = { calories: 0, protein: 0, carbs: 0, fats: 0 };
        } else {
            nutrition.dailyMacros.calories += (calories || 0);
            nutrition.dailyMacros.protein += (protein || 0);
            nutrition.dailyMacros.carbs += (carbs || 0);
            nutrition.dailyMacros.fats += (fats || 0);
        }

        await nutrition.save();
        res.json({ success: true, data: nutrition });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
