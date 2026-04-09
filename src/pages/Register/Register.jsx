import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Register.css';
import authService from '../../services/authService';
import logo from '../../assets/images/logo.svg';

// Import icons
import { FiMail, FiLock, FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    // Check AUI email
    if (!formData.email.endsWith('@aui.ma')) {
      setError('Please use your AUI email (@aui.ma)');
      return false;
    }
    
    // Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
      
      // Call register API - using student as default role
      await authService.register({
        email: formData.email,
        password: formData.password,
        full_name: formData.email.split('@')[0], // Using email username as fallback name
        role: 'student'
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please log in with your new account.' } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
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
              <div className="auth-welcome register-welcome">
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
                    Join SkillSphere
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="welcome-text"
                  >
                    Create an account to share your expertise and discover new skills within the AUI community.
                  </motion.p>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="welcome-illustration"
                  >
                    <div className="illustration-placeholder">
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#006633" d="M44.9,-51.2C58.4,-42,69.8,-27.7,73.5,-11.3C77.3,5.1,73.3,23.6,63.3,37.4C53.2,51.2,37.1,60.2,20.1,65.2C3.2,70.2,-14.5,71.1,-29.7,64.7C-44.9,58.2,-57.6,44.4,-65.4,27.9C-73.2,11.3,-76,-8,-69.7,-23.1C-63.4,-38.2,-48,-49.2,-33,-55.3C-18,-61.3,-3.4,-62.5,10.9,-60.7C25.2,-59,31.4,-60.5,44.9,-51.2Z" transform="translate(100 100)" />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Right panel - Registration form */}
              <div className="auth-form-container">
                <motion.div 
                  className="auth-form-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="form-header">
                    <h2>Create Account</h2>
                    <p>Join the SkillSphere community at AUI</p>
                  </div>
                
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
                          name="email"
                          placeholder="you@aui.ma"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-with-icon"
                          required
                        />
                      </div>
                      <Form.Text className="text-muted input-hint">
                        You must use an AUI email address to register.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FiLock className="input-icon" />
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleChange}
                          className="input-with-icon"
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      <Form.Text className="text-muted input-hint">
                        Password must be at least 6 characters long.
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="form-group">
                      <div className="input-icon-wrapper">
                        <FiLock className="input-icon" />
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="input-with-icon"
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="auth-button" 
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-text">
                          <span className="spinner"></span>
                          Creating Account...
                        </span>
                      ) : (
                        <span className="button-text">
                          Create Account <FiArrowRight className="button-icon" />
                        </span>
                      )}
                    </Button>
                  </Form>
                  
                  <div className="auth-form-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Sign in <FiArrowRight size={14} /></Link></p>
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

export default Register;