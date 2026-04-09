import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Tabs, Tab, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTag, FiUser, FiClock, FiArrowRight, FiRefreshCw, FiAlertTriangle, FiEye, FiCheckCircle, FiXCircle, FiSearch, FiFilter } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import exchangesService from '../../services/exchangesService';
import authService from '../../services/authService';
import './Exchanges.css';

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.user?.user_id;

  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      setError(null);
      const exchangesData = await exchangesService.getUserExchanges();
      setExchanges(exchangesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching exchanges:', err);
      setError('Failed to load exchanges. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    filterExchanges();
  }, [exchanges, activeTab, searchQuery]);

  const filterExchanges = () => {
    let filtered = exchanges;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(exchange => exchange.status === activeTab);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(exchange => 
        exchange.offering_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exchange.skill_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exchange.provider_name && exchange.provider_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exchange.requester_name && exchange.requester_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredExchanges(filtered);
  };

  const handleStatusUpdate = async (exchangeId, newStatus) => {
    try {
      setLoading(true);
      const response = await exchangesService.updateExchangeStatus(exchangeId, newStatus);
      setExchanges(exchanges.map(exchange => 
        exchange.exchange_id === exchangeId ? response.exchange : exchange
      ));
      setSuccessMessage(`Exchange ${newStatus} successfully`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      setLoading(false);
    } catch (err) {
      console.error('Error updating exchange status:', err);
      setError(err.response?.data?.message || 'Failed to update exchange status. Please try again.');
      setLoading(false);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="pulse">Pending</Badge>;
      case 'accepted':
        return <Badge bg="info" className="pulse">Accepted</Badge>;
      case 'completed':
        return <Badge bg="success" className="pulse">Completed</Badge>;
      case 'canceled':
        return <Badge bg="danger" className="pulse">Canceled</Badge>;
      default:
        return null;
    }
  };

  const getExchangeRole = (exchange) => {
    if (exchange.provider_id === currentUserId) {
      return {
        isProvider: true,
        role: 'Provider',
        otherParty: exchange.requester_name
      };
    } else {
      return {
        isProvider: false,
        role: 'Requester',
        otherParty: exchange.provider_name
      };
    }
  };

  if (loading && !exchanges.length) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <motion.h1 
              className="page-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              My Exchanges
            </motion.h1>
            <motion.p 
              className="page-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              Manage your skill exchanges with the AUI community
            </motion.p>
          </div>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                        onClick={fetchExchanges}
                        className="d-flex align-items-center retry-btn"
                      >
                        <FiRefreshCw className="me-1" /> Retry
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Alert>
            </motion.div>
          )}
          
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
                  <FiArrowRight className="ms-2" />
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="exchanges-layout-container">
          <div className="exchanges-content">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4 exchanges-tabs"
            >
              <Tab eventKey="all" title="All">
                <div className="exchanges-count mb-3">
                  {filteredExchanges.length} exchange{filteredExchanges.length !== 1 ? 's' : ''}
                </div>
              </Tab>
              <Tab eventKey="pending" title="Pending">
                <div className="exchanges-count mb-3">
                  {filteredExchanges.length} pending exchange{filteredExchanges.length !== 1 ? 's' : ''}
                </div>
              </Tab>
              <Tab eventKey="accepted" title="Accepted">
                <div className="exchanges-count mb-3">
                  {filteredExchanges.length} accepted exchange{filteredExchanges.length !== 1 ? 's' : ''}
                </div>
              </Tab>
              <Tab eventKey="completed" title="Completed">
                <div className="exchanges-count mb-3">
                  {filteredExchanges.length} completed exchange{filteredExchanges.length !== 1 ? 's' : ''}
                </div>
              </Tab>
              <Tab eventKey="canceled" title="Canceled">
                <div className="exchanges-count mb-3">
                  {filteredExchanges.length} canceled exchange{filteredExchanges.length !== 1 ? 's' : ''}
                </div>
              </Tab>
            </Tabs>
            
            {filteredExchanges.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="no-exchanges"
              >
                <div className="text-center">
                  <FiAlertTriangle size={40} className="mb-3 text-muted" />
                  <h3>No {activeTab !== 'all' ? activeTab : ''} exchanges found</h3>
                  <p className="text-muted">
                    {activeTab === 'all' ? 
                      "You haven't participated in any exchanges yet." : 
                      `You don't have any ${activeTab} exchanges.`}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button as={Link} to="/skills-marketplace" variant="primary">
                      Explore Skills Marketplace
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <Row>
                {filteredExchanges.map(exchange => {
                  const { isProvider, role, otherParty } = getExchangeRole(exchange);
                  
                  return (
                    <Col lg={12} className="mb-4" key={exchange.exchange_id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className={`exchange-card status-${exchange.status}`}>
                          <Card.Body>
                            <div className="exchange-header">
                              <h3 className="exchange-title">
                                {exchange.offering_title}
                              </h3>
                              {getStatusBadge(exchange.status)}
                            </div>
                            
                            <div className="exchange-meta">
                              <div className="meta-item">
                                <FiTag className="meta-icon" />
                                <span>{exchange.skill_name}</span>
                              </div>
                              
                              <div className="meta-item">
                                <FiUser className="meta-icon" />
                                <span>Your role: {role}</span>
                              </div>
                            </div>
                            
                            <div className="exchange-details">
                              <div className="exchange-party">
                                {isProvider ? 
                                  <p>You are offering this skill to <strong>{otherParty}</strong></p> :
                                  <p><strong>{otherParty}</strong> is offering this skill to you</p>
                                }
                              </div>
                              
                              {exchange.request_title && (
                                <div className="exchange-request">
                                  <p>Related to request: <strong>{exchange.request_title}</strong></p>
                                </div>
                              )}
                              
                              <div className="exchange-timeline">
                                <div className="timeline-item">
                                  <FiClock className="timeline-icon" />
                                  <div className="timeline-content">
                                    <div className="timeline-date">{formatDate(exchange.created_at)}</div>
                                    <div className="timeline-text">Exchange created</div>
                                  </div>
                                </div>
                                
                                {exchange.status !== 'pending' && (
                                  <div className="timeline-item">
                                    <FiClock className="timeline-icon" />
                                    <div className="timeline-content">
                                      <div className="timeline-date">{formatDate(exchange.updated_at)}</div>
                                      <div className="timeline-text">
                                        Marked as {exchange.status}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="exchange-actions">
                              {exchange.status === 'pending' && isProvider && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(exchange.exchange_id, 'accepted')}
                                  >
                                    <FiCheckCircle className="me-1" /> Accept
                                  </Button>
                                </motion.div>
                              )}
                              
                              {exchange.status === 'accepted' && !isProvider && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(exchange.exchange_id, 'completed')}
                                  >
                                    <FiCheckCircle className="me-1" /> Complete
                                  </Button>
                                </motion.div>
                              )}
                              
                              {(exchange.status === 'pending' || exchange.status === 'accepted') && (
                                <motion.div whileHover={{ scale: 1.05 }}>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(exchange.exchange_id, 'canceled')}
                                  >
                                    <FiXCircle className="me-1" /> Cancel
                                  </Button>
                                </motion.div>
                              )}
                              
                              <motion.div whileHover={{ scale: 1.05 }}>
                                <Link 
                                  to={`/exchanges/${exchange.exchange_id}`} 
                                  className="btn btn-sm btn-primary"
                                >
                                  <FiEye className="me-1" /> Details
                                </Link>
                              </motion.div>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>

          <div className="exchanges-sidebar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="filter-card">
                <Card.Body>
                  <h5 className="filter-title">
                    <FiFilter className="me-2" /> Filter Exchanges
                  </h5>
                  <div className="search-box mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search exchanges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="status-filter">
                    <h6 className="filter-subtitle">Quick Filters</h6>
                    <div className="filter-buttons">
                      <Button
                        variant={activeTab === 'all' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className="mb-2"
                      >
                        All Exchanges
                      </Button>
                      <Button
                        variant={activeTab === 'pending' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveTab('pending')}
                        className="mb-2"
                      >
                        Pending
                      </Button>
                      <Button
                        variant={activeTab === 'accepted' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveTab('accepted')}
                        className="mb-2"
                      >
                        Accepted
                      </Button>
                      <Button
                        variant={activeTab === 'completed' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveTab('completed')}
                        className="mb-2"
                      >
                        Completed
                      </Button>
                      <Button
                        variant={activeTab === 'canceled' ? 'primary' : 'outline-secondary'}
                        size="sm"
                        onClick={() => setActiveTab('canceled')}
                        className="mb-2"
                      >
                        Canceled
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="stats-card">
                <Card.Body>
                  <h5 className="stats-title">Exchange Stats</h5>
                  <div className="stat-item">
                    <div className="stat-label">Total Exchanges</div>
                    <div className="stat-value">{exchanges.length}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Pending</div>
                    <div className="stat-value">
                      {exchanges.filter(e => e.status === 'pending').length}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Accepted</div>
                    <div className="stat-value">
                      {exchanges.filter(e => e.status === 'accepted').length}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Completed</div>
                    <div className="stat-value">
                      {exchanges.filter(e => e.status === 'completed').length}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Exchanges;