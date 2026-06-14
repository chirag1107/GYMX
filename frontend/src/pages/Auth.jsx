import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when typing
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' }); // Reset form
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.name, formData.email, formData.password);
            }
            // Navigate to home after successful auth
            navigate('/');
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-image-side">
                <div className="image-overlay">
                    <h1>Transform Your Body.<br />Elevate Your Life.</h1>
                    <p>Join thousands of others who have already reached their fitness goals with GymX.</p>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-glass-panel">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <Dumbbell className="logo-icon" size={32} />
                            <span className="logo-text">GYM<span className="text-highlight">X</span></span>
                        </div>
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="auth-subtitle">
                            {isLogin ? 'Enter your details to access your dashboard.' : 'Start your fitness journey today.'}
                        </p>
                    </div>

                    {error && <div className="auth-error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group-container">

                            <div className={`form-group ${isLogin ? 'hidden-input' : 'visible-input'}`}>
                                <div className="input-icon-wrapper">
                                    <User className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        disabled={isLogin}
                                    />
                                </div>
                            </div>

                            <div className="form-group visible-input" style={{ transitionDelay: '0.1s' }}>
                                <div className="input-icon-wrapper">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group visible-input" style={{ transitionDelay: '0.2s' }}>
                                <div className="input-icon-wrapper">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="spinner" size={20} />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Sign Up'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button className="auth-toggle-btn" onClick={toggleMode} type="button">
                                {isLogin ? 'Sign Up Now' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
