import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DashboardNavbar.css';
import logo from '../../../assets/images/logo.svg';
import authService from '../../../services/authService';
import { FiHome, FiGrid, FiMessageCircle, FiBell, FiUser, FiLogOut, FiMenu, FiX, FiChevronDown, FiSettings, FiHelpCircle, FiAward } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [notificationCount, setNotificationCount] = useState(3);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userData = authService.getCurrentUser();
        if (userData) {
            setUser(userData.user);
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const isLinkActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') {
            return true;
        }
        return location.pathname.startsWith(path) && path !== '/dashboard';
    };

    return (
        <header className={`dashboard-navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="logo-link">
                        <motion.img
                            src={logo}
                            alt="SkillSphere Logo"
                            className="logo"
                            whileHover={{ rotate: 10 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                        <motion.span
                            className="logo-text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            SkillSphere
                        </motion.span>
                    </Link>

                    <motion.button
                        className="mobile-menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </motion.button>
                </div>

                <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    to="/dashboard"
                                    className={`nav-link ${isLinkActive('/dashboard') ? 'active' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <FiHome className="nav-icon" />
                                    <span className="nav-label">Dashboard</span>
                                    {isLinkActive('/dashboard') && (
                                        <motion.span
                                            className="active-indicator"
                                            layoutId="activeIndicator"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        </li>
                        <li className="nav-item">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    to="/skills-marketplace"
                                    className={`nav-link ${isLinkActive('/skills-marketplace') ? 'active' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <FiGrid className="nav-icon" />
                                    <span className="nav-label">Marketplace</span>
                                    {isLinkActive('/skills-marketplace') && (
                                        <motion.span
                                            className="active-indicator"
                                            layoutId="activeIndicator"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        </li>
                        <li className="nav-item">
                            <motion.div whileHover={{ scale: 1.05 }}>
                                <Link
                                    to="/exchanges"
                                    className={`nav-link ${isLinkActive('/exchanges') ? 'active' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <FiMessageCircle className="nav-icon" />
                                    <span className="nav-label">Exchanges</span>
                                    {isLinkActive('/exchanges') && (
                                        <motion.span
                                            className="active-indicator"
                                            layoutId="activeIndicator"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        </li>
                    </ul>
                </nav>

                <div className={`navbar-right ${menuOpen ? 'open' : ''}`}>

                    <div className="user-dropdown" ref={dropdownRef}>
                        <motion.div
                            className={`user-menu-trigger ${dropdownOpen ? 'active' : ''}`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={toggleDropdown}
                        >
                            <motion.div
                                className="user-avatar"
                                whileHover={{ scale: 1.1 }}
                            >
                                {user && user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                            </motion.div>
                            <span className="user-name hide-on-mobile">
                                {user ? user.full_name : 'User'}
                            </span>
                            <motion.div
                                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiChevronDown className="dropdown-arrow" />
                            </motion.div>
                        </motion.div>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    className="user-dropdown-menu"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <div className="dropdown-header">
                                        <div className="dropdown-user-info">
                                            <motion.div
                                                className="dropdown-avatar"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {user && user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                            </motion.div>
                                            <div className="dropdown-user-details">
                                                <h4 className="dropdown-user-name">{user ? user.full_name : 'User'}</h4>
                                                <p className="dropdown-user-email">{user ? user.email : ''}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dropdown-divider"></div>

                                    <div className="dropdown-items-container">
                                        <motion.div whileHover={{ x: 5 }} className="dropdown-item-wrapper">
                                            <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                <FiUser className="dropdown-icon" />
                                                <span>My Profile</span>
                                            </Link>
                                        </motion.div>

                                        <motion.div whileHover={{ x: 5 }} className="dropdown-item-wrapper">
                                            <Link to="/profile/skills" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                <FiAward className="dropdown-icon" />
                                                <span>My Skills</span>
                                            </Link>
                                        </motion.div>

                                        <motion.div whileHover={{ x: 5 }} className="dropdown-item-wrapper">
                                            <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                <FiSettings className="dropdown-icon" />
                                                <span>Settings</span>
                                            </Link>
                                        </motion.div>

                                        <motion.div whileHover={{ x: 5 }} className="dropdown-item-wrapper">
                                            <Link to="/help" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                                <FiHelpCircle className="dropdown-icon" />
                                                <span>Help & Support</span>
                                            </Link>
                                        </motion.div>

                                        <div className="dropdown-divider"></div>

                                        <motion.div whileHover={{ x: 5 }} className="dropdown-item-wrapper">
                                            <button className="dropdown-item logout-item" onClick={handleLogout}>
                                                <FiLogOut className="dropdown-icon" />
                                                <span>Logout</span>
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;