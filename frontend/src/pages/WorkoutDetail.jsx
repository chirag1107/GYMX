import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Flame, Activity, CheckCircle } from 'lucide-react';
import { workoutPlans } from '../data/workouts';
import { useTracker } from '../context/TrackerContext';
import './WorkoutDetail.css';

const WorkoutDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { startWorkout } = useTracker();
    const workout = workoutPlans.find(p => p.id === parseInt(id));

    if (!workout) {
        return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}><h2>Workout not found</h2><Link to="/workouts" className="btn btn-primary">Back to Workouts</Link></div>;
    }

    const handleStartWorkout = () => {
        startWorkout(workout);
        navigate(`/workout/active/${workout.id}`);
    };

    return (
        <div className="workout-detail-page page-content">
            <div className="container">
                <Link to="/workouts" className="back-link"><ArrowLeft size={20} /> Back to Plans</Link>

                <div className="detail-header">
                    <div className="detail-info">
                        <span className="detail-level">{workout.level}</span>
                        <h1>{workout.title}</h1>
                        <p className="detail-desc">{workout.description}</p>
                        <div className="detail-stats">
                            <span><Clock /> {workout.duration}</span>
                            <span><Flame /> {workout.calories} kcal</span>
                        </div>
                        <button className="btn btn-primary complete-btn" onClick={handleStartWorkout} style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} /> Start Workout
                        </button>
                    </div>
                    <img src={workout.image} alt={workout.title} className="detail-image" />
                </div>

                <div className="exercises-list">
                    <h2>Exercises</h2>
                    <div className="exercises-grid">
                        {workout.exercises.map((ex, index) => (
                            <div key={index} className="exercise-card">
                                <div className="ex-header">
                                    <span className="ex-number">{index + 1}</span>
                                    <h3>{ex.name}</h3>
                                </div>
                                <div className="ex-calorie-badge">
                                    <Flame size={14} /> {ex.calories} kcal
                                </div>
                                <div className="ex-details">
                                    <div className="ex-stat">
                                        <span className="label">Sets</span>
                                        <span className="value">{ex.sets}</span>
                                    </div>
                                    <div className="ex-stat">
                                        <span className="label">Reps</span>
                                        <span className="value">{ex.reps}</span>
                                    </div>
                                    <div className="ex-stat">
                                        <span className="label">Rest</span>
                                        <span className="value">{ex.rest}</span>
                                    </div>
                                </div>
                                <p className="ex-instruction">{ex.instruction}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkoutDetail;
