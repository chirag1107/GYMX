import { useState } from 'react';
import { Plus, RefreshCw, Droplets, Utensils, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTracker } from '../context/TrackerContext';
import './Tracker.css';

const Tracker = () => {
    const {
        waterIntake, waterGoal, addWater, resetWater,
        dailyMacros, macroGoals, addFood, resetMacros
    } = useTracker();

    const [showMacroForm, setShowMacroForm] = useState(false);
    const [foodEntry, setFoodEntry] = useState({ calories: '', protein: '', carbs: '', fats: '' });

    // Calculate percentages
    const waterPercent = Math.min((waterIntake / waterGoal) * 100, 100);
    const proPercent = Math.min((dailyMacros.protein / macroGoals.protein) * 100, 100);
    const carbPercent = Math.min((dailyMacros.carbs / macroGoals.carbs) * 100, 100);
    const fatPercent = Math.min((dailyMacros.fats / macroGoals.fats) * 100, 100);

    const handleAddWater = () => {
        if (waterIntake < waterGoal && waterIntake + 250 >= waterGoal) {
            // Fireworks / Crackers Celebration
            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
                }));
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
                }));
            }, 250);
        }
        addWater(250);
    };

    const isWaterGoalReached = waterIntake >= waterGoal;

    const handleFoodChange = (e) => {
        setFoodEntry({ ...foodEntry, [e.target.name]: e.target.value });
    };

    const handleAddFood = (e) => {
        e.preventDefault();
        addFood({
            calories: parseInt(foodEntry.calories) || 0,
            protein: parseInt(foodEntry.protein) || 0,
            carbs: parseInt(foodEntry.carbs) || 0,
            fats: parseInt(foodEntry.fats) || 0,
        });
        setFoodEntry({ calories: '', protein: '', carbs: '', fats: '' });
        setShowMacroForm(false);
    };

    return (
        <div className="tracker-page page-content">
            <div className="container">
                <div className="tracker-header">
                    <h1>Daily Tracker</h1>
                    <p>Log your meals and hydration to stay on top of your goals.</p>
                </div>

                <div className="tracker-grid">

                    {/* Water Tracker Card */}
                    <div className="tracker-card water-card">
                        <div className="card-title">
                            <Droplets size={28} color="#00bfff" />
                            Water Intake
                        </div>

                        <div className="water-content">
                            <div className={`glass-container ${isWaterGoalReached ? 'goal-reached' : ''}`} onClick={handleAddWater} title="Click to add 250ml">
                                <div className="water-fill" style={{ height: `${waterPercent}%` }}></div>
                            </div>

                            <div className="water-stats-text">
                                <h3>{waterIntake} <span style={{ fontSize: '1rem' }}>ml</span></h3>
                                <span>of {waterGoal} ml goal</span>
                            </div>

                            <div className="water-actions">
                                <button className="btn btn-outline" onClick={handleAddWater}>
                                    <Plus size={18} /> Add 250ml
                                </button>
                                <button className="btn btn-icon" onClick={resetWater} title="Reset Water">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Macro Tracker Card */}
                    <div className="tracker-card macro-card">
                        <div className="card-title">
                            <Utensils size={28} color="var(--primary-color)" />
                            Nutrition & Macros
                        </div>

                        <div className="macros-overview">
                            <div className="calories-text">{dailyMacros.calories}</div>
                            <span className="calories-label">/ {macroGoals.calories} kcal consumed</span>
                        </div>

                        <div className="macro-bars">
                            <div className="macro-row">
                                <div className="macro-labels">
                                    <span className="macro-name">Protein</span>
                                    <span className="macro-val">{dailyMacros.protein}g / {macroGoals.protein}g</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill protein-fill" style={{ width: `${proPercent}%` }}></div>
                                </div>
                            </div>

                            <div className="macro-row">
                                <div className="macro-labels">
                                    <span className="macro-name">Carbs</span>
                                    <span className="macro-val">{dailyMacros.carbs}g / {macroGoals.carbs}g</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill carbs-fill" style={{ width: `${carbPercent}%` }}></div>
                                </div>
                            </div>

                            <div className="macro-row">
                                <div className="macro-labels">
                                    <span className="macro-name">Fats</span>
                                    <span className="macro-val">{dailyMacros.fats}g / {macroGoals.fats}g</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill fats-fill" style={{ width: `${fatPercent}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {!showMacroForm ? (
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button className="btn btn-primary" onClick={() => setShowMacroForm(true)}>
                                    <Plus size={18} /> Quick Log Meal
                                </button>
                                <button className="btn btn-icon" onClick={resetMacros} title="Reset Macros">
                                    <RefreshCw size={18} />
                                </button>
                            </div>
                        ) : (
                            <form className="quick-add-form" onSubmit={handleAddFood}>
                                <div className="form-group">
                                    <input type="number" name="calories" placeholder="Calories (kcal)" value={foodEntry.calories} onChange={handleFoodChange} required />
                                </div>
                                <div className="form-group">
                                    <input type="number" name="protein" placeholder="Protein (g)" value={foodEntry.protein} onChange={handleFoodChange} />
                                </div>
                                <div className="form-group">
                                    <input type="number" name="carbs" placeholder="Carbs (g)" value={foodEntry.carbs} onChange={handleFoodChange} />
                                </div>
                                <div className="form-group">
                                    <input type="number" name="fats" placeholder="Fats (g)" value={foodEntry.fats} onChange={handleFoodChange} />
                                </div>
                                <div className="quick-add-actions">
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Meal</button>
                                    <button type="button" className="btn btn-outline" onClick={() => setShowMacroForm(false)}>
                                        <X size={18} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracker;
