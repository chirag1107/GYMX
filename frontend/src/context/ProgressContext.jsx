import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { API_URL, apiFetch } from '../utils/api';

const ProgressContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProgress = () => useContext(ProgressContext);

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

const defaultWeightHistory = [
    { date: '2023-10-01', weight: 85 },
    { date: '2023-10-08', weight: 84.5 },
    { date: '2023-10-15', weight: 83.8 },
    { date: '2023-10-22', weight: 82.5 },
    { date: '2023-10-29', weight: 81.2 },
    { date: '2023-11-05', weight: 80.5 },
];

export const ProgressProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [userProfile, setUserProfile] = useState(() => {
        const saved = localStorage.getItem('fatloss_user_profile');
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
        try {
            const parsed = saved ? JSON.parse(saved) : defaultWeightHistory;
            return Array.isArray(parsed) ? parsed.filter(item => item && item.date && !isNaN(item.weight)) : defaultWeightHistory;
        } catch (e) {
            console.error("Failed to parse weight history", e);
            return defaultWeightHistory;
        }
    });

    // Fetch data from backend on auth change
    useEffect(() => {
        const fetchUserData = async () => {
            if (API_URL && isAuthenticated) {
                try {
                    // Fetch progress profile & weight history
                    const progressRes = await apiFetch('/api/progress');
                    if (progressRes.success && progressRes.data) {
                        setUserProfile(progressRes.data.profile);
                        setWeightHistory(progressRes.data.weightHistory || []);
                    }

                    // Fetch workouts
                    const workoutRes = await apiFetch('/api/workouts');
                    if (workoutRes.success && workoutRes.data) {
                        setWorkoutHistory(workoutRes.data);
                    }
                } catch (err) {
                    console.error('Error fetching user data from backend:', err);
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated]);

    // Save to localStorage whenever state changes (fallback persistence)
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
    const logWorkout = async (workout) => {
        const localEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            ...workout
        };

        if (API_URL && isAuthenticated) {
            try {
                const res = await apiFetch('/api/workouts', {
                    method: 'POST',
                    body: JSON.stringify(workout)
                });
                if (res.success) {
                    setWorkoutHistory(prev => [res.data, ...prev]);
                    return res.data;
                }
            } catch (err) {
                console.error('Error saving workout to backend:', err);
            }
        }

        // Fallback
        setWorkoutHistory(prev => [localEntry, ...prev]);
        return localEntry;
    };

    const updateWeight = async (newWeight) => {
        const weight = parseFloat(newWeight);
        if (isNaN(weight)) return;

        const today = new Date().toISOString().split('T')[0];

        if (API_URL && isAuthenticated) {
            try {
                const res = await apiFetch('/api/progress/weight', {
                    method: 'POST',
                    body: JSON.stringify({ weight, date: today })
                });
                if (res.success) {
                    setUserProfile(res.data.profile);
                    setWeightHistory(res.data.weightHistory);
                    return;
                }
            } catch (err) {
                console.error('Error updating weight to backend:', err);
            }
        }

        // Fallback
        setUserProfile(prev => ({ ...prev, currentWeight: weight }));
        setWeightHistory(prev => {
            const existingIndex = prev.findIndex(entry => entry.date.startsWith(today));
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { date: today, weight };
                return updated;
            }
            return [...prev, { date: today, weight }];
        });
    };

    const updateProfile = async (newProfileData) => {
        if (API_URL && isAuthenticated) {
            try {
                const res = await apiFetch('/api/progress/profile', {
                    method: 'PUT',
                    body: JSON.stringify(newProfileData)
                });
                if (res.success) {
                    setUserProfile(res.data.profile);
                    setWeightHistory(res.data.weightHistory);
                    return;
                }
            } catch (err) {
                console.error('Error updating profile to backend:', err);
            }
        }

        // Fallback
        setUserProfile(prev => ({ ...prev, ...newProfileData }));
    };

    const getWeeklyStats = () => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const workoutsLastWeek = workoutHistory.filter(w => new Date(w.date) > oneWeekAgo);

        return {
            workoutsCount: workoutsLastWeek.length,
        };
    };

    const resetData = async () => {
        if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
            if (API_URL && isAuthenticated) {
                try {
                    await apiFetch('/api/progress/reset', {
                        method: 'DELETE'
                    });
                } catch (err) {
                    console.error('Error resetting backend data:', err);
                }
            }

            // Reset local storage
            localStorage.removeItem('fatloss_user_profile');
            localStorage.removeItem('fatloss_workout_history');
            localStorage.removeItem('fatloss_weight_history');

            // Reset states to defaults
            setUserProfile({
                name: 'User',
                startWeight: 85,
                currentWeight: 85,
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
