import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { ArrowLeft, Save, User, Activity, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { userProfile, updateProfile } = useProgress();
    const navigate = useNavigate();

    // Local state for the form so edits don't apply immediately until saved
    const [formData, setFormData] = useState(userProfile);
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ["startWeight", "targetWeight", "height", "age"].includes(name)
                ? Number(value)
                : value
        }));
        setSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="profile-page page-content">
            <div className="container profile-container">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Home</Link>

                <div className="section-header text-center">
                    <h1>YOUR <span className="text-highlight">PROFILE</span></h1>
                    <p>Customize your metrics to receive personalized daily goals.</p>
                </div>

                <form className="profile-form" onSubmit={handleSave}>
                    {saved && <div className="success-banner">Profile Saved Successfully! Goals Updated.</div>}

                    {/* Basic Info Section */}
                    <div className="profile-section">
                        <h2><User className="section-icon" /> Basic Information</h2>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Age (years)</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="10" max="100" />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Biometrics Section */}
                    <div className="profile-section">
                        <h2><Activity className="section-icon" /> Biometrics</h2>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} required min="100" max="250" />
                            </div>
                            <div className="form-group">
                                <label>Starting Weight (kg)</label>
                                <input type="number" name="startWeight" value={formData.startWeight} onChange={handleChange} required min="30" max="250" />
                            </div>
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="profile-section">
                        <h2><Target className="section-icon" /> Goals & Activity</h2>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Target Weight (kg)</label>
                                <input type="number" name="targetWeight" value={formData.targetWeight} onChange={handleChange} required min="30" max="250" />
                            </div>
                            <div className="form-group">
                                <label>Primary Goal</label>
                                <select name="goal" value={formData.goal} onChange={handleChange}>
                                    <option value="fat_loss">Fat Loss</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="muscle_gain">Muscle Gain</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Activity Level</label>
                                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                                    <option value="sedentary">Sedentary (Office Job)</option>
                                    <option value="light">Lightly Active (1-3 days/wk)</option>
                                    <option value="moderate">Moderately Active (3-5 days/wk)</option>
                                    <option value="active">Very Active (6-7 days/wk)</option>
                                    <option value="extra">Extra Active (Labor Job + Training)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary profile-save-btn">
                            <Save size={20} /> Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
