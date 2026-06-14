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

const isValidMongoUri = MONGODB_URI && 
    MONGODB_URI !== 'undefined' && 
    MONGODB_URI !== 'null' && 
    (MONGODB_URI.startsWith('mongodb://') || MONGODB_URI.startsWith('mongodb+srv://'));

const isPlaceholder = MONGODB_URI && (
    MONGODB_URI.includes('<username>') || 
    MONGODB_URI.includes('<password>') || 
    MONGODB_URI.includes('<cluster>')
);

if (!isValidMongoUri || isPlaceholder) {
    if (!MONGODB_URI || MONGODB_URI === 'undefined' || MONGODB_URI === 'null') {
        console.warn('WARNING: MONGODB_URI environment variable is not defined.');
    } else if (isPlaceholder) {
        console.warn('WARNING: MONGODB_URI contains placeholder values (<username>, <password>, or <cluster>).');
        console.warn('Please update the .env file in the backend folder with your actual MongoDB credentials.');
    } else {
        console.warn(`WARNING: MONGODB_URI environment variable is invalid (value: "${MONGODB_URI}").`);
        console.warn('It must start with "mongodb://" or "mongodb+srv://".');
    }
    console.log('Backend starting in mock/offline mode. Database connection will not be established.');
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
