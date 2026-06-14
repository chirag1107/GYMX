import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    // Only show footer on the Membership plans page
    if (location.pathname !== '/membership') {
        return null;
    }

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-logo">
                    <h2>GYM<span className="text-highlight">X</span></h2>
                    <p>Transform your body, transform your life.</p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/workouts">Workouts</Link></li>
                        <li><Link to="/nutrition">Nutrition</Link></li>
                        <li><Link to="/membership">Membership</Link></li>
                        <li><Link to="/progress">Progress</Link></li>
                    </ul>
                </div>

                <div className="footer-socials">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><Instagram /></a>
                        <a href="#" className="social-icon"><Facebook /></a>
                        <a href="#" className="social-icon"><Twitter /></a>
                        <a href="#" className="social-icon"><Youtube /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 GYMX. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
