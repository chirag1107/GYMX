import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
    setNumber: Number,
    reps: Number,
    weight: Number
});

const exerciseLogSchema = new mongoose.Schema({
    exerciseId: String,
    name: String,
    sets: [setSchema]
});

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in seconds or minutes (matching frontend)
        default: 0
    },
    calories: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    exercises: [exerciseLogSchema]
});

const Workout = mongoose.model('Workout', workoutSchema);
export default Workout;
