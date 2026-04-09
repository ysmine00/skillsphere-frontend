import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">SkillSphere</h3>
          <p className="footer-description">
            A community skill exchange platform for Al Akhawayn University.
            Connect, learn, and share skills with fellow students, faculty, and staff.
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/offerings">Browse Skills</Link></li>
            <li><Link to="/requests">Skill Requests</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Resources</h3>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><a href="https://www.aui.ma" target="_blank" rel="noopener noreferrer">AUI Website</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-links">
            <li><a href="mailto:skillsphere@aui.ma">skillsphere@aui.ma</a></li>
            <li><a href="tel:+212539000000">+212 539 00 00 00</a></li>
            <li>Al Akhawayn University</li>
            <li>Ifrane, 53000, Morocco</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} SkillSphere - Al Akhawayn University. All rights reserved.</p>
        <p>Developed by Alex Chen & Ben Miller</p>
      </div>
    </footer>
  );
};

export default Footer;