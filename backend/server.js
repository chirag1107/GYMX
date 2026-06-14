import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes imports
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import workoutRoutes from './routes/workout.js';
import nutritionRoutes from './routes/nutrition.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for simplicity or customize to frontend URL
    credentials: true
}));
app.use(express.json());

// API Status Route
app.get('/', (req, res) => {
    res.json({ message: 'GYMX Backend API is running successfully.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI environment variable is not defined.');
    console.log('Backend starting in mock/standalone mode. Database connection will not be established.');
    app.listen(PORT, () => {
        console.log(`Server running in mock/offline mode on port ${PORT}`);
    });
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Successfully connected to MongoDB Database');
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Database connection error:', err);
            process.exit(1);
        });
}
