import { Dumbbell, Clock, Flame, ArrowLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workoutPlans } from '../data/workouts';
import { useMembership } from '../context/MembershipContext';
import './Workouts.css';

const Workouts = () => {
    const { hasAccess } = useMembership();
    return (
        <div className="workouts-page page-content">
            <div className="container">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Home</Link>
                <div className="section-header">
                    <h1>WORKOUT <span className="text-highlight">PLANS</span></h1>
                    <p>Choose a routine that fits your schedule and goals.</p>
                </div>

                <div className="workouts-grid">
                    {workoutPlans.map((plan) => {
                        const isLocked = !hasAccess(plan.requiredTier);
                        return (
                            <div key={plan.id} className={`workout-card ${isLocked ? 'locked' : ''}`}>
                                <div className="workout-card-image-container">
                                    <img src={plan.image} alt={plan.title} className="workout-image" />
                                    <div className="workout-level">{plan.level}</div>
                                    {isLocked && (
                                        <div className="lock-overlay">
                                            <Lock size={48} className="lock-icon" />
                                            <p>Upgrade to Unlock</p>
                                        </div>
                                    )}
                                </div>
                                <div className="workout-content">
                                    <h2>{plan.title}</h2>
                                    <div className="workout-stats">
                                        <span><Clock size={16} /> {plan.duration}</span>
                                        <span><Flame size={16} /> {plan.calories} kcal</span>
                                    </div>
                                    {isLocked ? (
                                        <Link to="/membership" className="btn btn-secondary btn-block text-center">View Plans</Link>
                                    ) : (
                                        <Link to={`/workouts/${plan.id}`} className="btn btn-primary btn-block text-center">Start Workout</Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Workouts;
