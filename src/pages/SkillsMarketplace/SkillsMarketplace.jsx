import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiMapPin, FiTag, FiUser, FiAlertTriangle, FiRefreshCw, FiPlus, FiZap } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import offeringsService from '../../services/offeringsService';
import requestsService from '../../services/requestsService';
import skillsService from '../../services/skillsService';
import { Link } from 'react-router-dom';
import './SkillsMarketplace.css';

const SkillsMarketplace = () => {
  const [offerings, setOfferings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    mode: '',
    urgency: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOfferings, setFilteredOfferings] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isHovering, setIsHovering] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [offeringsData, requestsData, allSkillsData, categoriesData] = await Promise.all([
        offeringsService.getAllOfferings(),
        requestsService.getAllRequests(),
        skillsService.getAllSkills(),
        skillsService.getCategories()
      ]);
      
      setOfferings(offeringsData);
      setRequests(requestsData);
      setSkills(allSkillsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load marketplace data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [offerings, requests, searchTerm, filters, activeTab]);

  const applyFilters = () => {
    let filteredOffs = [...offerings];
    let filteredReqs = [...requests];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredOffs = filteredOffs.filter(offering => 
        offering.title.toLowerCase().includes(term) ||
        offering.description.toLowerCase().includes(term) ||
        offering.skill_name.toLowerCase().includes(term) ||
        offering.provider_name?.toLowerCase().includes(term)
      );
      filteredReqs = filteredReqs.filter(request => 
        request.title.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term) ||
        request.skill_name.toLowerCase().includes(term) ||
        request.requester_name?.toLowerCase().includes(term)
      );
    }
    
    if (filters.category) {
      filteredOffs = filteredOffs.filter(offering => offering.category_name === filters.category);
      filteredReqs = filteredReqs.filter(request => request.category_name === filters.category);
    }
    
    if (filters.skill) {
      filteredOffs = filteredOffs.filter(offering => offering.skill_id === parseInt(filters.skill));
      filteredReqs = filteredReqs.filter(request => request.skill_id === parseInt(filters.skill));
    }
    
    if (filters.mode) {
      filteredOffs = filteredOffs.filter(offering => offering.mode === filters.mode);
    }
    
    if (filters.urgency) {
      filteredReqs = filteredReqs.filter(request => request.urgency === filters.urgency);
    }
    
    setFilteredOfferings(filteredOffs);
    setFilteredRequests(filteredReqs);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { skill: '' }) // Reset skill if category changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      skill: '',
      mode: '',
      urgency: ''
    });
    setSearchTerm('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getModeIcon = (mode) => {
    const modes = {
      'online': { text: 'Online', bg: 'info' },
      'in-person': { text: 'In-Person', bg: 'success' },
      'both': { text: 'Online / In-Person', bg: 'primary' }
    };
    return modes[mode] ? <Badge bg={modes[mode].bg}>{modes[mode].text}</Badge> : null;
  };

  const getUrgencyBadge = (urgency) => {
    const urgencies = {
      'high': { text: 'High Priority', bg: 'danger' },
      'medium': { text: 'Medium Priority', bg: 'warning' },
      'low': { text: 'Low Priority', bg: 'success' }
    };
    return urgencies[urgency] ? <Badge bg={urgencies[urgency].bg}>{urgencies[urgency].text}</Badge> : null;
  };

  const getSkillsForCategory = () => {
    return filters.category && skills[filters.category] ? skills[filters.category] : [];
  };

  if (loading && !offerings.length && !requests.length) {
    return <Loader />;
  }

  const combinedCount = 
    (activeTab === 'all' ? filteredOfferings.length + filteredRequests.length : 
     activeTab === 'offerings' ? filteredOfferings.length : filteredRequests.length);

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="page-title">Skills Marketplace</h1>
            <p className="page-subtitle">Discover skills and requests from the AUI community</p>
          </div>
          
          <motion.div className="marketplace-actions">
            <Link to="/offerings/new" className="btn btn-outline-primary marketplace-btn">
              <FiPlus /> Offer a Skill
            </Link>
            <Link to="/requests/new" className="btn btn-primary marketplace-btn">
              <FiZap /> Request a Skill
            </Link>
          </motion.div>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="danger" className="mb-4">
              <div className="d-flex align-items-center">
                <div className="me-3 flex-shrink-0">
                  <FiAlertTriangle size={24} />
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0">{error}</p>
                </div>
                <div>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={fetchData}
                    className="d-flex align-items-center"
                  >
                    <FiRefreshCw className="me-1" /> Retry
                  </Button>
                </div>
              </div>
            </Alert>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="marketplace-search-container mb-4">
            <Card.Body>
              <div className="search-bar-container">
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="search-icon">
                    <FiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search marketplace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </InputGroup>
                
                <Button 
                  variant={showFilters ? "primary" : "outline-secondary"}
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FiFilter /> {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
              </div>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="filter-container"
                  >
                    <Row>
                      <Col md={6} lg={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Category</Form.Label>
                          <Form.Select 
                            name="category" 
                            value={filters.category} 
                            onChange={handleFilterChange}
                            className="filter-select"
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category.category_id} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} lg={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Skill</Form.Label>
                          <Form.Select 
                            name="skill" 
                            value={filters.skill} 
                            onChange={handleFilterChange}
                            disabled={!filters.category}
                            className="filter-select"
                          >
                            <option value="">All Skills</option>
                            {getSkillsForCategory().map((skill) => (
                              <option key={skill.skill_id} value={skill.skill_id}>
                                {skill.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} lg={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mode</Form.Label>
                          <Form.Select 
                            name="mode" 
                            value={filters.mode} 
                            onChange={handleFilterChange}
                            className="filter-select"
                          >
                            <option value="">All Modes</option>
                            <option value="online">Online</option>
                            <option value="in-person">In-Person</option>
                            <option value="both">Both</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6} lg={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Urgency</Form.Label>
                          <Form.Select 
                            name="urgency" 
                            value={filters.urgency} 
                            onChange={handleFilterChange}
                            className="filter-select"
                          >
                            <option value="">All Urgency Levels</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="filter-actions">
                      <Button variant="outline-secondary" size="sm" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Body>
          </Card>
        </motion.div>
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 marketplace-tabs"
        >
          <Tab eventKey="all" title={
            <motion.span whileHover={{ scale: 1.05 }}>All</motion.span>
          }>
            <div className="results-header">
              <p className="results-count">
                {combinedCount} {combinedCount === 1 ? 'result' : 'results'} found
              </p>
            </div>
            
            {combinedCount === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No results match your search criteria. Try adjusting your filters.</p>
                <Button variant="outline-primary" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <div className="combined-results">
                {filteredOfferings.length > 0 && (
                  <div className="result-section">
                    <h2 className="section-title">Offerings ({filteredOfferings.length})</h2>
                    <Row>
                      {filteredOfferings.map((offering) => (
                        <Col key={offering.offering_id} lg={4} md={6} className="mb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            onMouseEnter={() => setIsHovering(`offer-${offering.offering_id}`)}
                            onMouseLeave={() => setIsHovering(null)}
                          >
                            <Card className="offering-card h-100">
                              <Card.Body className="d-flex flex-column">
                                <div className="offering-header">
                                  <h3 className="offering-title">{offering.title}</h3>
                                  {getModeIcon(offering.mode)}
                                </div>
                                
                                <div className="offering-meta">
                                  <div className="meta-item">
                                    <FiTag className="meta-icon" />
                                    <span>{offering.skill_name}</span>
                                  </div>
                                  
                                  <div className="meta-item">
                                    <FiUser className="meta-icon" />
                                    <span>{offering.provider_name}</span>
                                  </div>
                                </div>
                                
                                <p className="offering-description">
                                  {offering.description.length > 120 
                                    ? `${offering.description.substring(0, 120)}...` 
                                    : offering.description}
                                </p>
                                
                                <div className="offering-details">
                                  <div className="detail-item">
                                    <FiClock className="detail-icon" />
                                    <span>{offering.availability}</span>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <FiMapPin className="detail-icon" />
                                    <span>{offering.mode === 'online' ? 'Online' : 
                                          offering.mode === 'in-person' ? 'In-Person' : 
                                          'Online or In-Person'}</span>
                                  </div>
                                </div>
                                
                                <div className="offering-footer mt-auto">
                                  <span className="offering-date">Posted on {formatDate(offering.created_at)}</span>
                                  <motion.div
                                    animate={{
                                      x: isHovering === `offer-${offering.offering_id}` ? 5 : 0
                                    }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                  >
                                    <Link 
                                      to={`/offerings/${offering.offering_id}`} 
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      View Details
                                    </Link>
                                  </motion.div>
                                </div>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                
                {filteredRequests.length > 0 && (
                  <div className={`result-section ${filteredOfferings.length > 0 ? 'mt-5' : ''}`}>
                    <h2 className="section-title">Requests ({filteredRequests.length})</h2>
                    <Row>
                      {filteredRequests.map((request) => (
                        <Col key={request.request_id} lg={4} md={6} className="mb-4">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            onMouseEnter={() => setIsHovering(`req-${request.request_id}`)}
                            onMouseLeave={() => setIsHovering(null)}
                          >
                            <Card className={`request-card h-100 urgency-${request.urgency}`}>
                              <Card.Body className="d-flex flex-column">
                                <div className="request-header">
                                  <h3 className="request-title">{request.title}</h3>
                                  {getUrgencyBadge(request.urgency)}
                                </div>
                                
                                <div className="request-meta">
                                  <div className="meta-item">
                                    <FiTag className="meta-icon" />
                                    <span>{request.skill_name}</span>
                                  </div>
                                  
                                  <div className="meta-item">
                                    <FiUser className="meta-icon" />
                                    <span>{request.requester_name}</span>
                                  </div>
                                </div>
                                
                                <p className="request-description">
                                  {request.description.length > 120 
                                    ? `${request.description.substring(0, 120)}...` 
                                    : request.description}
                                </p>
                                
                                <div className="request-details">
                                  <div className="detail-item">
                                    <FiClock className="detail-icon" />
                                    <span>Timeframe: {request.preferred_timeframe}</span>
                                  </div>
                                  
                                  <div className="detail-item">
                                    <FiAlertTriangle className="detail-icon urgency-icon" />
                                    <span>Urgency: {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}</span>
                                  </div>
                                </div>
                                
                                <div className="request-footer mt-auto">
                                  <span className="request-date">Posted on {formatDate(request.created_at)}</span>
                                  <motion.div
                                    animate={{
                                      x: isHovering === `req-${request.request_id}` ? 5 : 0
                                    }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                  >
                                    <Link 
                                      to={`/requests/${request.request_id}`} 
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      View Details
                                    </Link>
                                  </motion.div>
                                </div>
                              </Card.Body>
                            </Card>
                          </motion.div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            )}
          </Tab>
          
          <Tab eventKey="offerings" title={
            <motion.span whileHover={{ scale: 1.05 }}>Offerings</motion.span>
          }>
            <div className="results-header">
              <p className="results-count">
                {filteredOfferings.length} offering{filteredOfferings.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {filteredOfferings.length === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No offerings match your search criteria. Try adjusting your filters.</p>
                <Button variant="outline-primary" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <Row>
                {filteredOfferings.map((offering) => (
                  <Col key={offering.offering_id} lg={4} md={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => setIsHovering(`offer-${offering.offering_id}`)}
                      onMouseLeave={() => setIsHovering(null)}
                    >
                      <Card className="offering-card h-100">
                        <Card.Body className="d-flex flex-column">
                          <div className="offering-header">
                            <h3 className="offering-title">{offering.title}</h3>
                            {getModeIcon(offering.mode)}
                          </div>
                          
                          <div className="offering-meta">
                            <div className="meta-item">
                              <FiTag className="meta-icon" />
                              <span>{offering.skill_name}</span>
                            </div>
                            
                            <div className="meta-item">
                              <FiUser className="meta-icon" />
                              <span>{offering.provider_name}</span>
                            </div>
                          </div>
                          
                          <p className="offering-description">
                            {offering.description.length > 120 
                              ? `${offering.description.substring(0, 120)}...` 
                              : offering.description}
                          </p>
                          
                          <div className="offering-details">
                            <div className="detail-item">
                              <FiClock className="detail-icon" />
                              <span>{offering.availability}</span>
                            </div>
                            
                            <div className="detail-item">
                              <FiMapPin className="detail-icon" />
                              <span>{offering.mode === 'online' ? 'Online' : 
                                    offering.mode === 'in-person' ? 'In-Person' : 
                                    'Online or In-Person'}</span>
                            </div>
                          </div>
                          
                          <div className="offering-footer mt-auto">
                            <span className="offering-date">Posted on {formatDate(offering.created_at)}</span>
                            <motion.div
                              animate={{
                                x: isHovering === `offer-${offering.offering_id}` ? 5 : 0
                              }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <Link 
                                to={`/offerings/${offering.offering_id}`} 
                                className="btn btn-sm btn-outline-primary"
                              >
                                View Details
                              </Link>
                            </motion.div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>
          
          <Tab eventKey="requests" title={
            <motion.span whileHover={{ scale: 1.05 }}>Requests</motion.span>
          }>
            <div className="results-header">
              <p className="results-count">
                {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            {filteredRequests.length === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No requests match your search criteria. Try adjusting your filters.</p>
                <Button variant="outline-primary" onClick={resetFilters}>
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <Row>
                {filteredRequests.map((request) => (
                  <Col key={request.request_id} lg={4} md={6} className="mb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      onMouseEnter={() => setIsHovering(`req-${request.request_id}`)}
                      onMouseLeave={() => setIsHovering(null)}
                    >
                      <Card className={`request-card h-100 urgency-${request.urgency}`}>
                        <Card.Body className="d-flex flex-column">
                          <div className="request-header">
                            <h3 className="request-title">{request.title}</h3>
                            {getUrgencyBadge(request.urgency)}
                          </div>
                          
                          <div className="request-meta">
                            <div className="meta-item">
                              <FiTag className="meta-icon" />
                              <span>{request.skill_name}</span>
                            </div>
                            
                            <div className="meta-item">
                              <FiUser className="meta-icon" />
                              <span>{request.requester_name}</span>
                            </div>
                          </div>
                          
                          <p className="request-description">
                            {request.description.length > 120 
                              ? `${request.description.substring(0, 120)}...` 
                              : request.description}
                          </p>
                          
                          <div className="request-details">
                            <div className="detail-item">
                              <FiClock className="detail-icon" />
                              <span>Timeframe: {request.preferred_timeframe}</span>
                            </div>
                            
                            <div className="detail-item">
                              <FiAlertTriangle className="detail-icon urgency-icon" />
                              <span>Urgency: {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}</span>
                            </div>
                          </div>
                          
                          <div className="request-footer mt-auto">
                            <span className="request-date">Posted on {formatDate(request.created_at)}</span>
                            <motion.div
                              animate={{
                                x: isHovering === `req-${request.request_id}` ? 5 : 0
                              }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <Link 
                                to={`/requests/${request.request_id}`} 
                                className="btn btn-sm btn-outline-primary"
                              >
                                View Details
                              </Link>
                            </motion.div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default SkillsMarketplace;