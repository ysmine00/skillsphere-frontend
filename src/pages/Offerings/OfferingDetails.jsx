import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiMap, FiUser, FiCalendar, FiTag, FiClock, 
  FiMessageCircle, FiAlertTriangle, FiRefreshCw, FiEdit, FiTrash2,
  FiChevronRight, FiExternalLink
} from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import offeringsService from '../../services/offeringsService';
import exchangesService from '../../services/exchangesService';
import authService from '../../services/authService';
import './OfferingDetails.css';

const OfferingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.user?.user_id;

  useEffect(() => {
    fetchOfferingDetails();
  }, [id]);

  const fetchOfferingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const offeringData = await offeringsService.getOfferingById(id);
      setOffering(offeringData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offering details:', err);
      setError('Failed to load offering details. Please try again later.');
      setLoading(false);
    }
  };

  const handleCreateExchange = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await exchangesService.createExchange({
        offering_id: offering.offering_id
      });
      setSuccessMessage('Exchange request created successfully. You can view it in your exchanges.');
      setTimeout(() => {
        navigate(`/exchanges/${response.exchange.exchange_id}`);
      }, 3000);
    } catch (err) {
      console.error('Error creating exchange:', err);
      setError(err.response?.data?.message || 'Failed to create exchange. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDeleteOffering = async () => {
    if (!window.confirm('Are you sure you want to delete this offering? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      await offeringsService.deleteOffering(offering.offering_id);
      setSuccessMessage('Offering deleted successfully');
      setTimeout(() => {
        navigate('/offerings');
      }, 3000);
    } catch (err) {
      console.error('Error deleting offering:', err);
      setError(err.response?.data?.message || 'Failed to delete offering. Please try again.');
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online':
        return <Badge bg="info" className="mode-badge pulse">Online</Badge>;
      case 'in-person':
        return <Badge bg="success" className="mode-badge pulse">In-Person</Badge>;
      case 'both':
        return <Badge bg="primary" className="mode-badge pulse">Hybrid</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <DashboardNavbar />
        <Container className="dashboard-main">
          <div className="page-header">
            <motion.div whileHover={{ x: -5 }}>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/offerings')}
                className="back-btn"
              >
                <FiArrowLeft /> Back to Offerings
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="danger" className="mb-4 error-alert">
              <div className="d-flex align-items-center">
                <div className="me-3 flex-shrink-0">
                  <FiAlertTriangle size={24} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{error}</p>
                </div>
                <div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={fetchOfferingDetails}
                      className="d-flex align-items-center retry-btn"
                    >
                      <FiRefreshCw className="me-1" /> Retry
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Alert>
          </motion.div>
        </Container>
      </div>
    );
  }

  if (!offering) {
    return (
      <div className="dashboard-container">
        <DashboardNavbar />
        <Container className="dashboard-main">
          <div className="page-header">
            <motion.div whileHover={{ x: -5 }}>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/offerings')}
                className="back-btn"
              >
                <FiArrowLeft /> Back to Offerings
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="warning" className="not-found-alert">
              Offering not found or you don't have permission to view it.
            </Alert>
          </motion.div>
        </Container>
      </div>
    );
  }

  const isOwner = offering.provider_id === currentUserId;

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <motion.div whileHover={{ x: -5 }}>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/offerings')}
              className="back-btn"
            >
              <FiArrowLeft /> Back to Offerings
            </Button>
          </motion.div>
          
          <div className="mode-badge-container">
            {getModeIcon(offering.mode)}
          </div>
        </div>
        
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="success-alert">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    {successMessage}
                  </div>
                  <FiChevronRight className="ms-2" />
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="offering-layout-container">
          <div className="offering-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="offering-card">
                <Card.Body>
                  <div className="offering-header">
                    <motion.h1 
                      className="offering-title"
                      whileHover={{ color: 'var(--aui-primary-dark)' }}
                    >
                      {offering.title}
                    </motion.h1>
                    <div className="offering-meta">
                      <motion.div 
                        className="meta-badge"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiTag className="meta-icon" />
                        <span>{offering.skill_name}</span>
                      </motion.div>
                      <motion.div 
                        className="meta-badge"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiClock className="meta-icon" />
                        <span>Posted on {formatDate(offering.created_at)}</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="offering-description">
                    <h3 className="section-title">Description</h3>
                    <motion.p 
                      className="description-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {offering.description}
                    </motion.p>
                  </div>
                  
                  <div className="offering-details">
                    <h3 className="section-title">Details</h3>
                    <ListGroup variant="flush" className="details-list">
                      <motion.div whileHover={{ x: 5 }}>
                        <ListGroup.Item className="detail-item">
                          <div className="detail-icon">
                            <FiMap />
                          </div>
                          <div className="detail-content">
                            <h4 className="detail-label">Mode</h4>
                            <p className="detail-value">
                              {offering.mode === 'online' ? 'Online (Virtual)' : 
                              offering.mode === 'in-person' ? 'In-Person' : 
                              'Online or In-Person (Flexible)'}
                            </p>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                      
                      <motion.div whileHover={{ x: 5 }}>
                        <ListGroup.Item className="detail-item">
                          <div className="detail-icon">
                            <FiCalendar />
                          </div>
                          <div className="detail-content">
                            <h4 className="detail-label">Availability</h4>
                            <p className="detail-value">{offering.availability}</p>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                      
                      <motion.div whileHover={{ x: 5 }}>
                        <ListGroup.Item className="detail-item">
                          <div className="detail-icon">
                            <FiTag />
                          </div>
                          <div className="detail-content">
                            <h4 className="detail-label">Category</h4>
                            <p className="detail-value">{offering.category_name}</p>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                    </ListGroup>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </div>

          <div className="offering-sidebar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="provider-card">
                <Card.Body>
                  <div className="provider-info">
                    <h3 className="provider-title">About the Provider</h3>
                    <motion.div 
                      className="provider-details"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div 
                        className="provider-avatar"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        {offering.provider_name ? offering.provider_name.charAt(0).toUpperCase() : 'U'}
                      </motion.div>
                      <div className="provider-meta">
                        <h4 className="provider-name">{offering.provider_name}</h4>
                        <p className="provider-role">{offering.department || 'AUI Community Member'}</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="action-section">
                    {isOwner ? (
                      <>
                        <h5 className="action-title">Manage Your Offering</h5>
                        <div className="owner-actions">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button 
                              variant="outline-primary" 
                              className="action-btn"
                              as={Link}
                              to={`/offerings/edit/${offering.offering_id}`}
                            >
                              <FiEdit className="me-2" /> Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button 
                              variant="outline-danger" 
                              className="action-btn"
                              onClick={handleDeleteOffering}
                              disabled={submitting}
                            >
                              {submitting ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <FiTrash2 className="me-2" /> Delete
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="action-title">Interested in this skill?</h5>
                        <p className="text-muted mb-3">Request this skill to start an exchange.</p>
                        
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          onHoverStart={() => setIsHovered(true)}
                          onHoverEnd={() => setIsHovered(false)}
                        >
                          <Button 
                            variant="primary" 
                            className="action-btn"
                            onClick={handleCreateExchange}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                Request Skill
                                <motion.span
                                  animate={{ x: isHovered ? 5 : 0 }}
                                  transition={{ type: 'spring', stiffness: 500 }}
                                  className="ms-2"
                                >
                                  <FiChevronRight />
                                </motion.span>
                              </>
                            )}
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button 
                            variant="outline-primary" 
                            className="action-btn"
                            as="a"
                            href={`mailto:${offering.provider_email || currentUser.user.email}`}
                          >
                            <FiMessageCircle className="me-2" /> Contact
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
              
              <motion.div whileHover={{ y: -5 }}>
                <Card className="related-card">
                  <Card.Body>
                    <h5 className="related-title">Find Similar Skills</h5>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link 
                        to={`/skills-marketplace?category=${offering.category_name}`} 
                        className="btn btn-outline-primary action-btn"
                      >
                        Browse {offering.category_name}
                        <FiExternalLink className="ms-2" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link 
                        to="/requests/new" 
                        className="btn btn-outline-secondary action-btn"
                      >
                        Create Request
                        <FiExternalLink className="ms-2" />
                      </Link>
                    </motion.div>
                  </Card.Body>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default OfferingDetails;