import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        // Initialize progress & profile for the registered user
        await Progress.create({
            userId: user._id,
            profile: {
                name: user.name,
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

        if (user) {
            res.status(201).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    membershipTier: user.membershipTier
                },
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter all fields' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    membershipTier: user.membershipTier
                },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/auth/me
// @desc    Get user profile data
// @access  Private
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            membershipTier: req.user.membershipTier
        }
    });
});

// @route   PUT /api/auth/upgrade
// @desc    Upgrade user membership tier
// @access  Private
router.put('/upgrade', protect, async (req, res) => {
    try {
        const { tierId } = req.body;
        
        if (tierId === undefined) {
            return res.status(400).json({ success: false, message: 'Please provide tierId' });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.membershipTier = tierId;
        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                membershipTier: user.membershipTier
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
