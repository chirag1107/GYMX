import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Scale, Calendar, Activity, RotateCcw, ArrowLeft } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import Modal from '../components/Modal';
import './Progress.css';

const Progress = () => {
    const { userProfile, weightHistory, workoutHistory, resetData } = useProgress();
    const [activeModal, setActiveModal] = useState(null);

    // Calculate stats
    const currentWeight = userProfile?.currentWeight || 0;
    const startWeight = userProfile?.startWeight || 0;
    const weightChange = (currentWeight - startWeight).toFixed(1);
    const isWeightLoss = weightChange <= 0;

    const daysActiveSet = new Set((workoutHistory || []).map(w => w?.date ? w.date.split('T')[0] : ''));
    const daysActive = daysActiveSet.size;


    // Format chart data safely
    const chartData = (weightHistory || []).map(entry => {
        if (!entry || !entry.date) return null;
        try {
            return {
                name: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                weight: entry.weight
            };
        } catch {
            return null;
        }
    }).filter(Boolean);

    // Calculate Workout Frequency Data for BarChart
    const workoutFrequencyMap = {};
    (workoutHistory || []).forEach(w => {
        if (!w || !w.date) return;
        const dateStr = new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        workoutFrequencyMap[dateStr] = (workoutFrequencyMap[dateStr] || 0) + 1;
    });

    const workoutFrequencyData = Object.keys(workoutFrequencyMap).map(date => ({
        name: date,
        workouts: workoutFrequencyMap[date]
    }));

    const closeModal = () => setActiveModal(null);

    return (
        <div className="progress-page page-content">
            <div className="container">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Home</Link>
                <div className="section-header">
                    <h1>YOUR <span className="text-highlight">PROGRESS</span></h1>
                    <p>Track your transformation journey with detailed analytics.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card clickable-card" onClick={() => setActiveModal('weight')}>
                        <div className="stat-icon"><Scale size={32} /></div>
                        <h3>Current Weight</h3>
                        <p className="stat-value">{currentWeight} <span className="unit">kg</span></p>
                        <p className={`stat-change ${isWeightLoss ? 'positive' : 'negative'}`}>
                            {weightChange > 0 ? '+' : ''}{weightChange} kg
                        </p>
                        <span className="click-hint">View Your History</span>
                    </div>
                    <div className="stat-card clickable-card" onClick={() => setActiveModal('days')}>
                        <div className="stat-icon"><Calendar size={32} /></div>
                        <h3>Days Active</h3>
                        <p className="stat-value">{daysActive} <span className="unit">days</span></p>
                        <p className="stat-change positive">Keep it up! 🔥</p>
                        <span className="click-hint">View Your Calendar</span>
                    </div>
                    <div className="stat-card clickable-card" onClick={() => setActiveModal('workouts')}>
                        <div className="stat-icon"><Activity size={32} /></div>
                        <h3>Workouts Done</h3>
                        <p className="stat-value">{workoutHistory.length} <span className="unit">sessions</span></p>
                        <p className="stat-change positive">Total Sessions</p>
                        <span className="click-hint">View Your Log</span>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Weight History</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    itemStyle={{ color: '#4DD21D' }}
                                />
                                <Line type="monotone" dataKey="weight" stroke="#4DD21D" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container" style={{ marginTop: '2rem' }}>
                    <h2>Workout Frequency</h2>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={workoutFrequencyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    itemStyle={{ color: '#00bfff' }}
                                />
                                <Bar dataKey="workouts" fill="#00bfff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    {workoutHistory.length > 0 ? (
                        <ul className="activity-list">
                            {workoutHistory.slice(0, 5).map(workout => (
                                <li key={workout.id}>
                                    <span className="activity-date">
                                        {new Date(workout.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="activity-name">{workout.title}</span>
                                    <span className="activity-score">Completed</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-activity">No workouts logged yet. Go to Workouts to start!</p>
                    )}
                </div>

                <div className="reset-section">
                    <button className="reset-btn" onClick={resetData}>
                        <RotateCcw size={18} /> Reset All Progress
                    </button>
                    <p className="reset-hint">This will clear all your history and stats.</p>
                </div>

                {/* Modals */}
                <Modal isOpen={activeModal === 'weight'} onClose={closeModal} title="Weight History">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Weight (kg)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...weightHistory].reverse().map((entry, index) => (
                                <tr key={index}>
                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                    <td>{entry.weight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>

                <Modal isOpen={activeModal === 'days'} onClose={closeModal} title="Days Active">
                    <div className="days-list">
                        {[...daysActiveSet].sort().reverse().map(date => (
                            <div key={date} className="day-item">
                                <span className="day-date">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="day-status">Active ✅</span>
                            </div>
                        ))}
                    </div>
                </Modal>

                <Modal isOpen={activeModal === 'workouts'} onClose={closeModal} title="Workout History">
                    <ul className="history-list">
                        {workoutHistory.map(workout => (
                            <li key={workout.id} className="history-item">
                                <div className="history-header">
                                    <span className="history-title">{workout.title}</span>
                                    <span className="history-date">
                                        {new Date(workout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="history-details">
                                    <span>{workout.duration}</span> • <span>{workout.calories} kcal</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Modal>
            </div>
        </div>
    );
};

export default Progress;
