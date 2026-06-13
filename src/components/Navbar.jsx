import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell, ArrowRight, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <Dumbbell className="logo-icon" />
          <span className="logo-text">GYM<span className="text-highlight">X</span></span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </div>

        {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/workouts" className={`nav-link ${isActive('/workouts')}`} onClick={closeMenu}>
              Workouts
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/nutrition" className={`nav-link ${isActive('/nutrition')}`} onClick={closeMenu}>
              Nutrition
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tracker" className={`nav-link ${isActive('/tracker')}`} onClick={closeMenu}>
              Daily Log
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/progress" className={`nav-link ${isActive('/progress')}`} onClick={closeMenu}>
              Progress
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/membership" className={`nav-link ${isActive('/membership')}`} onClick={closeMenu}>
              Membership
            </Link>
          </li>
          {user ? (
            <li className="nav-item user-info-item">
              <Link to="/profile" className="user-greeting" onClick={closeMenu}>
                <User size={18} />
                Hi, {user.name || 'User'}
              </Link>
              <button className="btn btn-outline nav-btn logout-btn" onClick={() => { logout(); closeMenu(); }}>
                <LogOut size={16} /> Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link to="/membership" className="btn btn-primary nav-btn" onClick={closeMenu}>
                Join Now <ArrowRight size={18} style={{ marginLeft: '5px' }} />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
