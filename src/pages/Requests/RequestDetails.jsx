import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiClock, FiTag, FiUser, FiMapPin, FiAlertTriangle, 
  FiCalendar, FiMessageCircle, FiRefreshCw, FiEdit, FiTrash2,
  FiExternalLink, FiChevronRight
} from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import requestsService from '../../services/requestsService';
import exchangesService from '../../services/exchangesService';
import authService from '../../services/authService';
import './RequestDetails.css';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.user?.user_id;

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await requestsService.getRequestById(id);
      setRequestData(response);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to load request details. Please try again later.');
      setLoading(false);
    }
  };

  const handleCreateExchange = async (offeringId) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // Create exchange with this offering and request
      const response = await exchangesService.createExchange({
        offering_id: offeringId,
        request_id: id
      });
      
      setSuccessMessage('Exchange created successfully. You can view it in your exchanges.');
      
      // Redirect to exchange details after 3 seconds
      setTimeout(() => {
        navigate(`/exchanges/${response.exchange.exchange_id}`);
      }, 3000);
    } catch (err) {
      console.error('Error creating exchange:', err);
      setError(err.response?.data?.message || 'Failed to create exchange. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      await requestsService.deleteRequest(id);
      
      setSuccessMessage('Request deleted successfully');
      
      // Redirect to requests page after 3 seconds
      setTimeout(() => {
        navigate('/requests');
      }, 3000);
    } catch (err) {
      console.error('Error deleting request:', err);
      setError(err.response?.data?.message || 'Failed to delete request. Please try again.');
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

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'high':
        return <Badge bg="danger" className="urgency-badge pulse">High Priority</Badge>;
      case 'medium':
        return <Badge bg="warning" className="urgency-badge pulse">Medium Priority</Badge>;
      case 'low':
        return <Badge bg="success" className="urgency-badge pulse">Low Priority</Badge>;
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
                onClick={() => navigate('/requests')}
                className="back-btn"
              >
                <FiArrowLeft /> Back to Requests
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
                      onClick={fetchRequestDetails}
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

  if (!requestData || !requestData.request) {
    return (
      <div className="dashboard-container">
        <DashboardNavbar />
        <Container className="dashboard-main">
          <div className="page-header">
            <motion.div whileHover={{ x: -5 }}>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/requests')}
                className="back-btn"
              >
                <FiArrowLeft /> Back to Requests
              </Button>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="warning" className="not-found-alert">
              Request not found or you don't have permission to view it.
            </Alert>
          </motion.div>
        </Container>
      </div>
    );
  }

  const { request, matchingOfferings } = requestData;
  const isOwner = request.requester_id === currentUserId;

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <motion.div whileHover={{ x: -5 }}>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/requests')}
              className="back-btn"
            >
              <FiArrowLeft /> Back to Requests
            </Button>
          </motion.div>
          
          <div className="urgency-badge-container">
            {getUrgencyBadge(request.urgency)}
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

        <div className="request-layout-container">
          <div className="request-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="request-card">
                <Card.Body>
                  <div className="request-header">
                    <motion.h1 
                      className="request-title"
                      whileHover={{ color: 'var(--aui-primary-dark)' }}
                    >
                      {request.title}
                    </motion.h1>
                    <div className="request-meta">
                      <motion.div 
                        className="meta-badge"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiTag className="meta-icon" />
                        <span>{request.skill_name}</span>
                      </motion.div>
                      <motion.div 
                        className="meta-badge"
                        whileHover={{ scale: 1.05 }}
                      >
                        <FiClock className="meta-icon" />
                        <span>Posted on {formatDate(request.created_at)}</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="request-description">
                    <h3 className="section-title">Description</h3>
                    <motion.p 
                      className="description-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {request.description}
                    </motion.p>
                  </div>
                  
                  <div className="request-details">
                    <h3 className="section-title">Details</h3>
                    <ListGroup variant="flush" className="details-list">
                      <motion.div whileHover={{ x: 5 }}>
                        <ListGroup.Item className="detail-item">
                          <div className="detail-icon">
                            <FiCalendar />
                          </div>
                          <div className="detail-content">
                            <h4 className="detail-label">Preferred Timeframe</h4>
                            <p className="detail-value">{request.preferred_timeframe}</p>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                      
                      <motion.div whileHover={{ x: 5 }}>
                        <ListGroup.Item className="detail-item">
                          <div className="detail-icon">
                            <FiAlertTriangle />
                          </div>
                          <div className="detail-content">
                            <h4 className="detail-label">Urgency</h4>
                            <p className="detail-value">
                              {request.urgency === 'high' ? 'High Priority' :
                               request.urgency === 'medium' ? 'Medium Priority' :
                               'Low Priority'}
                            </p>
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
                            <p className="detail-value">{request.category_name}</p>
                          </div>
                        </ListGroup.Item>
                      </motion.div>
                    </ListGroup>
                  </div>
                  
                  {!isOwner && Array.isArray(matchingOfferings) && matchingOfferings.length > 0 && (
                    <div className="matching-section">
                      <h3 className="section-title">Your Matching Offerings</h3>
                      <p className="text-muted mb-4">
                        You have offerings that match this request. You can create an exchange with one of your offerings.
                      </p>
                      
                      {matchingOfferings.map(offering => (
                        <motion.div 
                          key={offering.offering_id}
                          whileHover={{ y: -3, boxShadow: '0 10px 20px rgba(0, 102, 51, 0.1)' }}
                        >
                          <Card className="inner-card matching-offering-card mb-3">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h4 className="matching-title">{offering.title}</h4>
                                  <Badge 
                                    bg={offering.match_score === 10 ? 'success' : 'info'}
                                    className="matching-score"
                                  >
                                    {offering.match_score === 10 ? 'Perfect Match' : 'Related Skill'}
                                  </Badge>
                                </div>
                                <motion.div 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button 
                                    variant="primary" 
                                    size="sm"
                                    onClick={() => handleCreateExchange(offering.offering_id)}
                                    disabled={submitting}
                                  >
                                    {submitting ? 'Processing...' : 'Offer Your Skill'}
                                  </Button>
                                </motion.div>
                              </div>
                            </Card.Body>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </div>

          <div className="request-sidebar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="requester-card">
                <Card.Body>
                  <div className="requester-info">
                    <h3 className="requester-title">About the Requester</h3>
                    <motion.div 
                      className="requester-details"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div 
                        className="requester-avatar"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        {request.requester_name ? request.requester_name.charAt(0).toUpperCase() : 'U'}
                      </motion.div>
                      <div className="requester-meta">
                        <h4 className="requester-name">{request.requester_name}</h4>
                        <p className="requester-role">{request.department_major || 'AUI Community Member'}</p>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="action-section">
                    {isOwner ? (
                      <>
                        <h5 className="action-title">Manage Your Request</h5>
                        <div className="owner-actions">
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button 
                              variant="outline-primary" 
                              className="action-btn"
                              as={Link}
                              to={`/requests/edit/${request.request_id}`}
                            >
                              <FiEdit className="me-2" /> Edit
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }}>
                            <Button 
                              variant="outline-danger" 
                              className="action-btn"
                              onClick={handleDeleteRequest}
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
                        <h5 className="action-title">Do you have this skill?</h5>
                        <p className="text-muted mb-3">If you can help with this request, you can create an offering or contact the requester.</p>
                        
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          onHoverStart={() => setIsHovered(true)}
                          onHoverEnd={() => setIsHovered(false)}
                        >
                          <Button 
                            variant="primary" 
                            className="action-btn"
                            as={Link}
                            to={`/offerings/new?skill=${request.skill_id}`}
                          >
                            Create Related Offering
                            <motion.span
                              animate={{ x: isHovered ? 5 : 0 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                              className="ms-2"
                            >
                              <FiChevronRight />
                            </motion.span>
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button 
                            variant="outline-primary" 
                            className="action-btn"
                            as="a"
                            href={`mailto:${request.requester_email || ''}`}
                          >
                            <FiMessageCircle className="me-2" /> Contact Requester
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
                    <h5 className="related-title">Find Similar Requests</h5>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link 
                        to={`/skills-marketplace?tab=requests&category=${request.category_name}`} 
                        className="btn btn-outline-primary action-btn"
                      >
                        Browse {request.category_name} Requests
                        <FiExternalLink className="ms-2" />
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 5 }}>
                      <Link 
                        to="/offerings/new" 
                        className="btn btn-outline-secondary action-btn"
                      >
                        Offer Your Skills
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

export default RequestDetails;