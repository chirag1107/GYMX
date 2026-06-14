import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Apple, Droplet, Utensils, Calculator, ArrowLeft, Lock } from 'lucide-react';
import { useMembership } from '../context/MembershipContext';
import { nutritionTopics } from '../data/nutrition';
import './Nutrition.css';

const Nutrition = () => {
    const { hasAccess } = useMembership();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('1.2');
    const [calories, setCalories] = useState(null);

    const calculateCalories = (e) => {
        e.preventDefault();
        if (!weight || !height || !age) return;

        // BMR Calculation (Mifflin-St Jeor Equation)
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = bmr * parseFloat(activity);

        // Fat Loss Adjustment (Deficit of 500 calories)
        setCalories(Math.round(tdee - 500));
    };

    const resetCalculator = () => {
        setWeight('');
        setHeight('');
        setAge('');
        setGender('male');
        setActivity('1.2');
        setCalories(null);
    };

    return (
        <div className="nutrition-page page-content">
            <div className="container">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Home</Link>
                <div className="section-header">
                    <h1>NUTRITION <span className="text-highlight">PLAN</span></h1>
                    <p>Fuel your body right. 80% of results come from nutrition.</p>
                </div>

                <div className="nutrition-grid">
                    {/* Calorie Calculator */}
                    <div className="calculator-card">
                        <div className="card-header">
                            <Calculator size={24} className="icon-pulse" />
                            <h2>Calorie Calculator</h2>
                        </div>
                        <form onSubmit={calculateCalories} className="calculator-form">
                            <div className="form-group">
                                <label>Weight (kg)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="e.g. 75"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="e.g. 180"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="e.g. 25"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Activity Level</label>
                                <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                                    <option value="1.2">Sedentary (Office job)</option>
                                    <option value="1.375">Light Exercise (1-2 days/week)</option>
                                    <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                                    <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                                    <option value="1.9">Athlete (2x per day)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Calculate Daily Calories</button>
                            <button type="button" onClick={resetCalculator} className="btn btn-reset btn-block">Reset Calculator</button>
                        </form>

                        {calories && (
                            <div className="result-box">
                                <h3>Your Fat Loss Target:</h3>
                                <div className="calorie-number">{calories} <span>kcal/day</span></div>
                                <p>Eat 15-20% below your maintenance calories for sustainable fat loss.</p>
                            </div>
                        )}
                    </div>

                    {/* Nutrition Tips */}
                    <div className="tips-container">
                        {nutritionTopics.map((topic) => {
                            const isLocked = !hasAccess(topic.requiredTier);

                            // Map local IDs to icons for display (since icons are components)
                            let IconComponent = Apple;
                            if (topic.id === 'hydration') IconComponent = Droplet;
                            if (topic.id === 'protein') IconComponent = Utensils;

                            const content = (
                                <>
                                    <img src={topic.bannerImage} alt={topic.title} className="tip-image" />
                                    <div className="tip-content">
                                        <div className="tip-header">
                                            <div className="tip-icon"><IconComponent /></div>
                                            <h3>{topic.title}</h3>
                                        </div>
                                    </div>
                                    {isLocked && (
                                        <div className="lock-overlay">
                                            <Lock size={48} className="lock-icon" />
                                            <p>Upgrade to Unlock</p>
                                        </div>
                                    )}
                                </>
                            );

                            return isLocked ? (
                                <Link to="/membership" key={topic.id} className="tip-card locked">
                                    {content}
                                </Link>
                            ) : (
                                <Link to={`/nutrition/${topic.id}`} key={topic.id} className="tip-card">
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nutrition;
