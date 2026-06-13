import { createContext, useState, useEffect, useContext } from 'react';

const ProgressContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
    // Determine initial state from localStorage or defaults
    // Determine initial state from localStorage or defaults
    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('fatloss_user_profile');
        const defaultProfile = {
            name: 'User',
            startWeight: 85,
            currentWeight: 80.5,
            targetWeight: 75,
            height: 175,
            age: 28,
            gender: 'male',
            activityLevel: 'moderate',
            goal: 'fat_loss',
            startDate: new Date().toISOString()
        };
        try {
            return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
        } catch (e) {
            console.error("Failed to parse user profile", e);
            return defaultProfile;
        }
    });

    const [workoutHistory, setWorkoutHistory] = useState(() => {
        const saved = localStorage.getItem('fatloss_workout_history');
        try {
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.filter(item => item && item.date) : [];
        } catch (e) {
            console.error("Failed to parse workout history", e);
            return [];
        }
    });

    const [weightHistory, setWeightHistory] = useState(() => {
        const saved = localStorage.getItem('fatloss_weight_history');
        // Default mock history if empty, for demo purposes
        const defaultHistory = [
            { date: '2023-10-01', weight: 85 },
            { date: '2023-10-08', weight: 84.5 },
            { date: '2023-10-15', weight: 83.8 },
            { date: '2023-10-22', weight: 82.5 },
            { date: '2023-10-29', weight: 81.2 },
            { date: '2023-11-05', weight: 80.5 },
        ];
        try {
            const parsed = saved ? JSON.parse(saved) : defaultHistory;
            return Array.isArray(parsed) ? parsed.filter(item => item && item.date && !isNaN(item.weight)) : defaultHistory;
        } catch (e) {
            console.error("Failed to parse weight history", e);
            return defaultHistory;
        }
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('fatloss_user_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('fatloss_workout_history', JSON.stringify(workoutHistory));
    }, [workoutHistory]);

    useEffect(() => {
        localStorage.setItem('fatloss_weight_history', JSON.stringify(weightHistory));
    }, [weightHistory]);

    // Actions
    const logWorkout = (workout) => {
        const newEntry = {
            id: Date.now(), // simple unique id
            date: new Date().toISOString(),
            ...workout
        };
        setWorkoutHistory(prev => [newEntry, ...prev]);
        return newEntry;
    };

    const updateWeight = (newWeight) => {
        const weight = parseFloat(newWeight);
        if (isNaN(weight)) return;

        setUserProfile(prev => ({ ...prev, currentWeight: weight }));

        const today = new Date().toISOString().split('T')[0];
        setWeightHistory(prev => {
            // Check if we already logged weight today, if so update it
            const existingIndex = prev.findIndex(entry => entry.date.startsWith(today));
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { date: today, weight };
                return updated;
            }
            return [...prev, { date: today, weight }];
        });
    };

    const updateProfile = (newProfileData) => {
        setUserProfile(prev => ({ ...prev, ...newProfileData }));
    };

    const getWeeklyStats = () => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const workoutsLastWeek = workoutHistory.filter(w => new Date(w.date) > oneWeekAgo);

        return {
            workoutsCount: workoutsLastWeek.length,
            // Add other weekly stats here
        };
    };

    const resetData = () => {
        if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            localStorage.removeItem('fatloss_user_profile');
            localStorage.removeItem('fatloss_workout_history');
            localStorage.removeItem('fatloss_weight_history');

            // Reset to defaults
            setUserProfile({
                name: 'User',
                startWeight: 85,
                currentWeight: 85, // Reset to start weight
                targetWeight: 75,
                startDate: new Date().toISOString()
            });
            setWorkoutHistory([]);
            setWeightHistory([]);
        }
    };

    const value = {
        userProfile,
        workoutHistory,
        weightHistory,
        logWorkout,
        updateWeight,
        updateProfile,
        getWeeklyStats,
        resetData
    };

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    );
};
