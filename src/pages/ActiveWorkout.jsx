import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTracker } from '../context/TrackerContext';
import { Check, X, ChevronLeft, Save } from 'lucide-react';
import './ActiveWorkout.css';

const ActiveWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activeWorkout, logExerciseSet, completeWorkout } = useTracker();
    const [timer, setTimer] = useState(0);

    // If no active workout matches the URL, boot them back
    useEffect(() => {
        if (!activeWorkout || activeWorkout.id !== parseInt(id)) {
            navigate('/workouts');
        }
    }, [activeWorkout, id, navigate]);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeWorkout) {
                setTimer(Math.floor((Date.now() - activeWorkout.startTime) / 1000));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activeWorkout]);

    if (!activeWorkout) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFinish = () => {
        // Calculate basic stats for the completed workout
        const durationMins = Math.ceil(timer / 60);
        const stats = {
            workoutId: activeWorkout.id,
            title: activeWorkout.title,
            duration: `${durationMins} min`,
            calories: Math.round(activeWorkout.calories * (durationMins / parseInt(activeWorkout.duration || 30))),
            completedAt: new Date().toISOString()
        };
        completeWorkout(stats);
        // Navigate to progress to see results
        navigate('/progress');
    };

    return (
        <div className="active-workout-page page-content">
            <div className="container">
                <button className="btn btn-outline" onClick={() => navigate(`/workouts/${id}`)} style={{ marginBottom: '2rem' }}>
                    <ChevronLeft size={20} /> Pause / Back
                </button>

                <div className="workout-header">
                    <h1>{activeWorkout.title}</h1>
                    <div className="timer-display">{formatTime(timer)}</div>
                </div>

                <RestTimer />

                <div className="exercises-list">
                    {activeWorkout.exercises.map((exercise, exIndex) => (
                        <ExerciseLogger
                            key={exIndex}
                            exercise={exercise}
                            exerciseId={exIndex}
                            logSet={logExerciseSet}
                            logs={activeWorkout.loggedExercises?.find(l => l.exerciseId === exIndex)?.sets || []}
                        />
                    ))}
                </div>

                <div className="finish-workout-container">
                    <button className="btn btn-finish" onClick={handleFinish}>
                        FINISH WORKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component for individual exercise logging
const ExerciseLogger = ({ exercise, exerciseId, logSet, logs }) => {
    // Determine how many sets to show based on standard "3 sets of 10" format
    const targetSets = parseInt(exercise.sets) || 3;
    const targetReps = parseInt(exercise.reps) || 10;

    return (
        <div className="exercise-log-card">
            <div className="exercise-log-header">
                <h3>{exercise.name}</h3>
                <span className="text-secondary">{exercise.sets} x {exercise.reps}</span>
            </div>

            <div className="sets-container">
                {Array.from({ length: targetSets }).map((_, i) => (
                    <SetRow
                        key={i}
                        setNum={i + 1}
                        targetReps={targetReps}
                        exerciseId={exerciseId}
                        logSet={logSet}
                        existingLog={logs.find(s => s.setNumber === i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

const SetRow = ({ setNum, targetReps, exerciseId, logSet, existingLog }) => {
    const isCompleted = !!existingLog;
    const [reps, setReps] = useState(existingLog?.reps || targetReps);
    const [weight, setWeight] = useState(existingLog?.weight || '');

    const handleSave = () => {
        if (!isCompleted) {
            logSet(exerciseId, setNum, reps, weight || 0);
        } else {
            // Optional: allow editing by un-checking (not fully implemented in this simple flow)
        }
    };

    return (
        <div className={`set-row ${isCompleted ? 'completed' : ''}`}>
            <div className="set-number">Set {setNum}</div>

            <div className="log-input-group">
                <label>Reps</label>
                <input
                    type="number"
                    className="log-input"
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                    disabled={isCompleted}
                />
            </div>

            <div className="log-input-group">
                <label>Weight (kg)</label>
                <input
                    type="number"
                    className="log-input"
                    value={weight}
                    placeholder="Bodyweight"
                    onChange={e => setWeight(e.target.value)}
                    disabled={isCompleted}
                />
            </div>

            <div className="set-check">
                <button
                    className={`btn btn-icon ${isCompleted ? 'btn-success' : 'btn-outline'}`}
                    onClick={handleSave}
                    disabled={isCompleted}
                >
                    {isCompleted ? <Check size={20} /> : <Save size={20} />}
                </button>
            </div>
        </div>
    );
};

// Sub-component for Rest Timer
const RestTimer = () => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const startTimer = (seconds) => {
        setTimeLeft(seconds);
        setIsActive(true);
    };

    const stopTimer = () => {
        setIsActive(false);
        setTimeLeft(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="rest-timer-card">
            <div className="rest-timer-header">
                <h3>Rest Timer</h3>
                {isActive && <div className="rest-time-display glow-text">{formatTime(timeLeft)}</div>}
            </div>
            <div className="rest-timer-controls">
                <button className="btn btn-outline small-btn" onClick={() => startTimer(30)}>30s</button>
                <button className="btn btn-outline small-btn" onClick={() => startTimer(60)}>60s</button>
                <button className="btn btn-outline small-btn" onClick={() => startTimer(90)}>90s</button>
                {isActive && (
                    <button className="btn btn-danger small-btn" onClick={stopTimer}>
                        <X size={16} /> Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActiveWorkout;
