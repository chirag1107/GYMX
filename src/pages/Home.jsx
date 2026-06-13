import { ArrowRight, Dumbbell, Utensils, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../assets/hero-image.png';

const Home = () => {

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>
                            <span className="text-gradient">Transform your body</span> <br />
                            <span className="text-gradient">Transform your life</span>
                        </h1>

                        <div className="hero-btns">
                            <Link to="/membership" className="btn btn-primary">Start Now <ArrowRight size={18} /></Link>
                            <Link to="/workouts" className="btn btn-outline">View Your Workouts</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="hero-glow"></div>
                        <img src={heroImage} alt="Fitness Transformation" className="hero-img" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features section-padding">
                <div className="container">
                    <h2 className="section-title">WHY CHOOSE <span className="text-highlight">GYMX</span></h2>
                    <div className="features-grid">
                        <Link to="/workouts" className="feature-card">
                            <div className="feature-icon"><Dumbbell size={48} /></div>
                            <h3>Expert Workouts</h3>
                            <p>Designed by top trainers to maximize fat loss and muscle gain.</p>
                        </Link>
                        <Link to="/nutrition" className="feature-card">
                            <div className="feature-icon"><Utensils size={48} /></div>
                            <h3>Nutrition Plans</h3>
                            <p>Tailored meal plans to fuel your body and speed up recovery.</p>
                        </Link>
                        <Link to="/progress" className="feature-card">
                            <div className="feature-icon"><TrendingUp size={48} /></div>
                            <h3>Track Progress</h3>
                            <p>Monitor your improvements with our advanced analytics tools.</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container cta-container">
                    <h2>READY TO LEVEL UP?</h2>
                    <p>Don't wait for tomorrow. Start your journey today.</p>
                    <Link to="/membership" className="btn btn-primary">Join Membership</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
