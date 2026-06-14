import mongoose from 'mongoose';

const weightEntrySchema = new mongoose.Schema({
    date: {
        type: String, // format: YYYY-MM-DD
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
});

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    profile: {
        name: { type: String, default: 'User' },
        startWeight: { type: Number, default: 85 },
        currentWeight: { type: Number, default: 80.5 },
        targetWeight: { type: Number, default: 75 },
        height: { type: Number, default: 175 },
        age: { type: Number, default: 28 },
        gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
        activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'extra'], default: 'moderate' },
        goal: { type: String, enum: ['fat_loss', 'maintain', 'muscle_gain'], default: 'fat_loss' },
        startDate: { type: Date, default: Date.now }
    },
    weightHistory: [weightEntrySchema]
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
