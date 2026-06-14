import { createContext, useContext, useState, useEffect } from 'react';
import { useProgress } from './ProgressContext';
import { useAuth } from './AuthContext';
import { API_URL, apiFetch } from '../utils/api';

const TrackerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTracker = () => {
    return useContext(TrackerContext);
};

const getTodayStr = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export const TrackerProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { userProfile, logWorkout } = useProgress();

    // --- Water Tracking ---
    const initialWaterIntake = parseInt(localStorage.getItem('gymx_waterIntake')) || 0;
    const [waterIntake, setWaterIntake] = useState(initialWaterIntake);

    // --- Macro Tracking ---
    const initialMacros = JSON.parse(localStorage.getItem('gymx_dailyMacros')) || {
        calories: 0, protein: 0, carbs: 0, fats: 0
    };
    const [dailyMacros, setDailyMacros] = useState(initialMacros);

    // --- Active Workout ---
    const [activeWorkout, setActiveWorkout] = useState(() => {
        const saved = localStorage.getItem('gymx_activeWorkout');
        return saved ? JSON.parse(saved) : null;
    });

    // --- Fetch Daily Nutrition from Backend ---
    useEffect(() => {
        const fetchDailyNutrition = async () => {
            if (API_URL && isAuthenticated) {
                try {
                    const todayStr = getTodayStr();
                    const res = await apiFetch(`/api/nutrition/${todayStr}`);
                    if (res.success && res.data) {
                        setWaterIntake(res.data.waterIntake || 0);
                        setDailyMacros(res.data.dailyMacros || { calories: 0, protein: 0, carbs: 0, fats: 0 });
                    }
                } catch (err) {
                    console.error('Error fetching nutrition data:', err);
                }
            }
        };

        fetchDailyNutrition();
    }, [isAuthenticated]);

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

    // Macro Distribution (30% Protein, 40% Carbs, 30% Fats)
    const macroGoals = {
        calories: Math.round(dailyCalories),
        protein: Math.max(Math.round((dailyCalories * 0.3) / 4), 100), // min 100g
        carbs: Math.round((dailyCalories * 0.4) / 4),
        fats: Math.round((dailyCalories * 0.3) / 9)
    };

    // --- Persist Data to LocalStorage (Fallback / Cache) ---
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
    const addWater = async (amount) => {
        if (API_URL && isAuthenticated) {
            try {
                const todayStr = getTodayStr();
                const res = await apiFetch(`/api/nutrition/${todayStr}/water`, {
                    method: 'PUT',
                    body: JSON.stringify({ amount })
                });
                if (res.success) {
                    setWaterIntake(res.data.waterIntake);
                    return;
                }
            } catch (err) {
                console.error('Error logging water to backend:', err);
            }
        }

        // Fallback
        setWaterIntake(prev => Math.min(prev + amount, waterGoal * 2));
    };

    const resetWater = async () => {
        if (API_URL && isAuthenticated) {
            try {
                const todayStr = getTodayStr();
                const res = await apiFetch(`/api/nutrition/${todayStr}/water`, {
                    method: 'PUT',
                    body: JSON.stringify({ amount: 0 })
                });
                if (res.success) {
                    setWaterIntake(0);
                    return;
                }
            } catch (err) {
                console.error('Error resetting water in backend:', err);
            }
        }

        // Fallback
        setWaterIntake(0);
    };

    const addFood = async (macros) => {
        if (API_URL && isAuthenticated) {
            try {
                const todayStr = getTodayStr();
                const res = await apiFetch(`/api/nutrition/${todayStr}/macros`, {
                    method: 'PUT',
                    body: JSON.stringify(macros)
                });
                if (res.success) {
                    setDailyMacros(res.data.dailyMacros);
                    return;
                }
            } catch (err) {
                console.error('Error logging food to backend:', err);
            }
        }

        // Fallback
        setDailyMacros(prev => ({
            calories: prev.calories + (macros.calories || 0),
            protein: prev.protein + (macros.protein || 0),
            carbs: prev.carbs + (macros.carbs || 0),
            fats: prev.fats + (macros.fats || 0)
        }));
    };

    const resetMacros = async () => {
        if (API_URL && isAuthenticated) {
            try {
                const todayStr = getTodayStr();
                const res = await apiFetch(`/api/nutrition/${todayStr}/macros`, {
                    method: 'PUT',
                    body: JSON.stringify({ reset: true })
                });
                if (res.success) {
                    setDailyMacros({ calories: 0, protein: 0, carbs: 0, fats: 0 });
                    return;
                }
            } catch (err) {
                console.error('Error resetting macros in backend:', err);
            }
        }

        // Fallback
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
                const existingSetIndex = logs[exIndex].sets.findIndex(s => s.setNumber === setNumber);
                if (existingSetIndex >= 0) {
                    logs[exIndex].sets[existingSetIndex] = newSetData;
                } else {
                    logs[exIndex].sets.push(newSetData);
                }
            } else {
                const exerciseName = activeWorkout.exercises[exerciseId]?.name || `Exercise ${exerciseId}`;
                logs.push({
                    exerciseId,
                    name: exerciseName,
                    sets: [newSetData]
                });
            }

            return { ...prev, loggedExercises: logs };
        });
    };

    const completeWorkout = async (stats) => {
        if (stats && activeWorkout) {
            await logWorkout({
                name: stats.title,
                duration: parseFloat(stats.duration) || 0,
                calories: stats.calories || 0,
                exercises: activeWorkout.loggedExercises || []
            });
        }
        setActiveWorkout(null);
    };

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
