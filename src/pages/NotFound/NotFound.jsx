import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome, FiSearch, FiHelpCircle } from 'react-icons/fi';

// Import styles
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="not-found-card">
                <Card.Body className="text-center">
                  <div className="error-code">404</div>
                  <h1 className="error-title">Page Not Found</h1>
                  <p className="error-message">
                    The page you are looking for doesn't exist or has been moved.
                  </p>
                  
                  <div className="error-illustration">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="80" fill="#f8f9fa" />
                      <path fill="#006633" fillOpacity="0.2" d="M44.5,-65.3C59.3,-55.2,74.2,-43.5,81.1,-27.7C88,-11.9,86.9,8,80.1,24.4C73.3,40.8,60.8,53.7,46.1,61.8C31.4,69.9,14.4,73.3,-1.9,76C-18.3,78.7,-34,80.6,-47.1,73.8C-60.3,67,-70.9,51.4,-76.1,34.8C-81.3,18.2,-81.2,0.5,-77.3,-15.4C-73.5,-31.3,-66,-45.5,-54.2,-56.4C-42.5,-67.3,-26.4,-74.9,-9.5,-73.8C7.3,-72.7,29.7,-75.5,44.5,-65.3Z" transform="translate(100 100)" />
                      <path fill="#006633" fillOpacity="0.6" d="M53.4,-67.9C69.2,-56.3,82,-39.5,87.4,-20.6C92.8,-1.8,90.7,19.1,81.1,35.9C71.5,52.7,54.3,65.4,35.6,70.6C16.9,75.8,-3.5,73.4,-22.6,67.8C-41.8,62.1,-59.7,53.2,-68.8,38.7C-77.9,24.2,-78.1,4.2,-74.1,-14.6C-70.2,-33.4,-62.1,-51,-48.7,-62.9C-35.3,-74.8,-17.7,-81.1,1.1,-82.6C19.8,-84,37.7,-79.5,53.4,-67.9Z" transform="translate(100 100)" />
                    </svg>
                  </div>
                  
                  <div className="action-buttons">
                    <Link to="/" className="btn btn-primary action-btn">
                      <FiHome className="btn-icon" /> Go to Home
                    </Link>
                    <Link to="/skills-marketplace" className="btn btn-outline-primary action-btn">
                      <FiSearch className="btn-icon" /> Explore Skills
                    </Link>
                  </div>
                  
                  <div className="help-links">
                    <Link to="/" className="help-link">
                      <FiArrowLeft className="link-icon" /> Back to previous page
                    </Link>
                    <Link to="/contact" className="help-link">
                      <FiHelpCircle className="link-icon" /> Need help?
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;