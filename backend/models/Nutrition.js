import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // format: YYYY-MM-DD, to easily query by day
        required: true
    },
    waterIntake: {
        type: Number,
        default: 0
    },
    dailyMacros: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fats: { type: Number, default: 0 }
    }
});

// Compound index to ensure a unique entry per user per day
nutritionSchema.index({ userId: 1, date: 1 }, { unique: true });

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;
