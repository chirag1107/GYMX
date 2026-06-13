import { createContext, useContext, useState, useEffect } from 'react';
import { useProgress } from './ProgressContext';

const TrackerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTracker = () => {
    return useContext(TrackerContext);
};

export const TrackerProvider = ({ children }) => {
    // --- Water Tracking ---
    const initialWaterIntake = parseInt(localStorage.getItem('gymx_waterIntake')) || 0;
    const [waterIntake, setWaterIntake] = useState(initialWaterIntake);
    const { userProfile } = useProgress();

    // --- Dynamic Goal Calculations based on Profile ---
    const weight = userProfile?.currentWeight || 80;
    const height = userProfile?.height || 175;
    const age = userProfile?.age || 28;
    const gender = userProfile?.gender || 'male';
    const activityLvl = userProfile?.activityLevel || 'moderate';
    const goal = userProfile?.goal || 'fat_loss';

    // Water Goal: ~35ml per kg of body weight
    const waterGoal = Math.round(weight * 35);

    // BMR Calculation (Mifflin-St Jeor)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);

    // TDEE Activity Multipliers
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extra: 1.9
    };
    const tdee = bmr * (multipliers[activityLvl] || 1.55);

    // Goal adjustments
    let dailyCalories = tdee;
    if (goal === 'fat_loss') dailyCalories -= 500;
    if (goal === 'muscle_gain') dailyCalories += 300;

    // --- Macro Tracking ---
    const initialMacros = JSON.parse(localStorage.getItem('gymx_dailyMacros')) || {
        calories: 0, protein: 0, carbs: 0, fats: 0
    };
    const [dailyMacros, setDailyMacros] = useState(initialMacros);

    // Macro Distribution (30% Protein, 40% Carbs, 30% Fats)
    const macroGoals = {
        calories: Math.round(dailyCalories),
        protein: Math.max(Math.round((dailyCalories * 0.3) / 4), 100), // min 100g
        carbs: Math.round((dailyCalories * 0.4) / 4),
        fats: Math.round((dailyCalories * 0.3) / 9)
    };

    // --- Active Workout ---
    const [activeWorkout, setActiveWorkout] = useState(() => {
        const saved = localStorage.getItem('gymx_activeWorkout');
        return saved ? JSON.parse(saved) : null;
    });

    // --- Persist Data to LocalStorage ---
    useEffect(() => {
        localStorage.setItem('gymx_waterIntake', waterIntake.toString());
    }, [waterIntake]);

    useEffect(() => {
        localStorage.setItem('gymx_dailyMacros', JSON.stringify(dailyMacros));
    }, [dailyMacros]);

    useEffect(() => {
        if (activeWorkout) {
            localStorage.setItem('gymx_activeWorkout', JSON.stringify(activeWorkout));
        } else {
            localStorage.removeItem('gymx_activeWorkout');
        }
    }, [activeWorkout]);

    // --- Actions ---
    const addWater = (amount) => {
        setWaterIntake(prev => Math.min(prev + amount, waterGoal * 2)); // cap at 2x goal
    };

    const resetWater = () => {
        setWaterIntake(0);
    };

    const addFood = (macros) => {
        setDailyMacros(prev => ({
            calories: prev.calories + (macros.calories || 0),
            protein: prev.protein + (macros.protein || 0),
            carbs: prev.carbs + (macros.carbs || 0),
            fats: prev.fats + (macros.fats || 0)
        }));
    };

    const resetMacros = () => {
        setDailyMacros({ calories: 0, protein: 0, carbs: 0, fats: 0 });
    };

    const startWorkout = (workoutData) => {
        setActiveWorkout({
            ...workoutData,
            startTime: Date.now(),
            loggedExercises: [],
            isFinished: false
        });
    };

    const logExerciseSet = (exerciseId, setNumber, reps, weight) => {
        setActiveWorkout(prev => {
            if (!prev) return null;

            const logs = [...(prev.loggedExercises || [])];
            const exIndex = logs.findIndex(log => log.exerciseId === exerciseId);

            const newSetData = { setNumber, reps, weight };

            if (exIndex >= 0) {
                // Exercise already has logs, update or add set
                const existingSetIndex = logs[exIndex].sets.findIndex(s => s.setNumber === setNumber);
                if (existingSetIndex >= 0) {
                    logs[exIndex].sets[existingSetIndex] = newSetData;
                } else {
                    logs[exIndex].sets.push(newSetData);
                }
            } else {
                // First log for this exercise
                logs.push({
                    exerciseId,
                    sets: [newSetData]
                });
            }

            return { ...prev, loggedExercises: logs };
        });
    };

    const completeWorkout = () => {
        // Here you would typically sync with ProgressContext to save the completed workout
        setActiveWorkout(null);
        return activeWorkout;
    };

    // Simulate daily reset (for demo purposes we just provide manual resets, 
    // in real app this would check dates on mount)

    const value = {
        // Water
        waterIntake,
        waterGoal,
        addWater,
        resetWater,
        // Macros
        dailyMacros,
        macroGoals,
        addFood,
        resetMacros,
        // Workouts
        activeWorkout,
        startWorkout,
        logExerciseSet,
        completeWorkout
    };

    return (
        <TrackerContext.Provider value={value}>
            {children}
        </TrackerContext.Provider>
    );
};
