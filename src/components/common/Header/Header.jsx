import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../../../assets/images/logo.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="SkillSphere Logo" className="logo" />
            <span className="logo-text">SkillSphere</span>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <ul className="nav-list">
            {['Home', 'About', 'Skills', 'Contact'].map((item) => (
              <li className="nav-item" key={item}>
                <Link 
                  to={`/${item.toLowerCase()}`} 
                  className={`nav-link ${item === 'Home' ? 'active' : ''}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-text">Log In</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;