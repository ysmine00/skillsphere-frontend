import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Login.css';
import authService from '../../services/authService';
import logo from '../../assets/images/logo.svg';

// Import icons
import { FiMail, FiLock, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!email.endsWith('@aui.ma')) {
      setError('Please use your AUI email (@aui.ma)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Call login API
      await authService.login({ email, password });
      
      // Redirect to dashboard or home page
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-background"></div>
      
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={9}>
            <motion.div 
              className="auth-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Left panel - Illustration and welcome */}
              <div className="auth-welcome">
                <div className="welcome-content">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="auth-logo-container"
                  >
                    <img src={logo} alt="SkillSphere Logo" className="auth-welcome-logo" />
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="welcome-title"
                  >
                    Welcome Back!
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="welcome-text"
                  >
                    Log in to continue your learning journey and connect with the AUI community.
                  </motion.p>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="welcome-illustration"
                  >
                    {/* You can replace this with an actual illustration SVG */}
                    <div className="illustration-placeholder">
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#006633" d="M45.7,-51.9C59.9,-42.2,72.7,-28.8,76.4,-13.3C80.2,2.2,74.9,19.7,65.3,33.3C55.7,46.9,41.8,56.4,26.4,62.5C11,68.6,-5.9,71.2,-20.4,66.2C-34.9,61.2,-47,48.7,-56.3,34.3C-65.6,19.9,-72.3,3.7,-69.9,-11.1C-67.6,-25.8,-56.2,-39.1,-43,-47.8C-29.7,-56.6,-14.9,-60.9,0.5,-61.5C15.8,-62.1,31.6,-61.7,45.7,-51.9Z" transform="translate(100 100)" />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Right panel - Login form */}
              <div className="auth-form-container">
                <motion.div 
                  className="auth-form-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="form-header">
                    <h2>Sign In</h2>
                    <p>Enter your credentials to access your account</p>
                  </div>
                
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="success" className="custom-alert success">{success}</Alert>
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Alert variant="danger" className="custom-alert error">{error}</Alert>
                    </motion.div>
                  )}
                  
                  <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FiMail className="input-icon" />
                        <Form.Control
                          type="email"
                          placeholder="you@aui.ma"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input-with-icon"
                          required
                        />
                      </div>
                    </Form.Group>
                    
                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FiLock className="input-icon" />
                        <Form.Control
                          type="password"
                          placeholder="Your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-with-icon"
                          required
                        />
                      </div>
                    </Form.Group>
                    
                    <div className="form-help">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                      </div>
                      <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="auth-button" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-text">
                          <span className="spinner"></span>
                          Signing in...
                        </span>
                      ) : (
                        <span className="button-text">
                          Sign In <FiArrowRight className="button-icon" />
                        </span>
                      )}
                    </Button>
                  </Form>
                  
                  <div className="auth-form-footer">
                    <p>Don't have an account? <Link to="/register" className="auth-link">Sign up <FiArrowRight size={14} /></Link></p>
                    <Link to="/" className="back-link"><FiArrowLeft size={14} /> Back to Home</Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;