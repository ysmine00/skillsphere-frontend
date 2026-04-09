import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiClock, FiAlertTriangle, FiTag, FiUser } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import requestsService from '../../services/requestsService';
import skillsService from '../../services/skillsService';
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    urgency: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Check for success message in URL state
    const params = new URLSearchParams(window.location.search);
    const successMsg = params.get('success');
    if (successMsg) {
      setSuccess(successMsg);
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all requests
      const requestsData = await requestsService.getAllRequests();
      setRequests(requestsData);
      
      // Fetch all skills
      const allSkillsData = await skillsService.getAllSkills();
      setSkills(allSkillsData);
      
      // Get categories
      const categoriesData = await skillsService.getCategories();
      setCategories(categoriesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load requests. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [requests, searchTerm, filters]);

  const applyFilters = () => {
    let filtered = [...requests];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term) ||
        request.skill_name.toLowerCase().includes(term) ||
        request.requester_name.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(request => 
        request.category_name === filters.category
      );
    }
    
    // Apply skill filter
    if (filters.skill) {
      filtered = filtered.filter(request => 
        request.skill_id === parseInt(filters.skill)
      );
    }
    
    // Apply urgency filter
    if (filters.urgency) {
      filtered = filtered.filter(request => 
        request.urgency === filters.urgency
      );
    }
    
    setFilteredRequests(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Reset skill filter if category changes
    if (name === 'category' && filters.skill) {
      setFilters({
        ...filters,
        category: value,
        skill: ''
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      skill: '',
      urgency: ''
    });
    setSearchTerm('');
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
        return <Badge bg="danger">High Priority</Badge>;
      case 'medium':
        return <Badge bg="warning">Medium Priority</Badge>;
      case 'low':
        return <Badge bg="success">Low Priority</Badge>;
      default:
        return null;
    }
  };

  // Get available skills for selected category
  const getSkillsForCategory = () => {
    if (!filters.category || !skills[filters.category]) {
      return [];
    }
    return skills[filters.category];
  };

  if (loading && !requests.length) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Skill Requests</h1>
            <p className="page-subtitle">Find requests from the AUI community</p>
          </div>
          
          <Link to="/requests/new" className="btn btn-primary add-request-btn">
            <FiPlus /> Request a Skill
          </Link>
        </div>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
            {success}
          </Alert>
        )}
        
        <div className="requests-search-container">
          <div className="search-bar-container">
            <InputGroup>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Button 
              variant="outline-secondary" 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </Button>
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="filter-container"
            >
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                      name="category" 
                      value={filters.category} 
                      onChange={handleFilterChange}
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
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Skill</Form.Label>
                    <Form.Select 
                      name="skill" 
                      value={filters.skill} 
                      onChange={handleFilterChange}
                      disabled={!filters.category}
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
                
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Urgency</Form.Label>
                    <Form.Select 
                      name="urgency" 
                      value={filters.urgency} 
                      onChange={handleFilterChange}
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
        </div>
        
        <div className="requests-results">
          <div className="results-header">
            <p className="results-count">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {filteredRequests.length === 0 ? (
            <div className="no-results">
              <p>No requests match your filters. Try adjusting your search criteria.</p>
              <Button variant="outline-primary" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <Row>
              {filteredRequests.map((request) => (
                <Col key={request.request_id} lg={4} md={6} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`request-card urgency-${request.urgency}`}>
                      <Card.Body>
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
                            <FiAlertTriangle className="detail-icon" />
                            <span>Urgency: {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}</span>
                          </div>
                        </div>
                        
                        <div className="request-footer">
                          <span className="request-date">Posted on {formatDate(request.created_at)}</span>
                          <Link 
                            to={`/requests/${request.request_id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Requests;