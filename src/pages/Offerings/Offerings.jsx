import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiClock, FiMapPin, FiTag, FiUser } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import offeringsService from '../../services/offeringsService';
import skillsService from '../../services/skillsService';
import './Offerings.css';

const Offerings = () => {
  const [offerings, setOfferings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    skill: '',
    mode: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOfferings, setFilteredOfferings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all offerings
      const offeringsData = await offeringsService.getAllOfferings();
      setOfferings(offeringsData);
      
      // Fetch all skills
      const allSkillsData = await skillsService.getAllSkills();
      setSkills(allSkillsData);
      
      // Get categories
      const categoriesData = await skillsService.getCategories();
      setCategories(categoriesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load offerings. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [offerings, searchTerm, filters]);

  const applyFilters = () => {
    let filtered = [...offerings];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(offering => 
        offering.title.toLowerCase().includes(term) ||
        offering.description.toLowerCase().includes(term) ||
        offering.skill_name.toLowerCase().includes(term) ||
        offering.provider_name.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(offering => 
        offering.category_name === filters.category
      );
    }
    
    // Apply skill filter
    if (filters.skill) {
      filtered = filtered.filter(offering => 
        offering.skill_id === parseInt(filters.skill)
      );
    }
    
    // Apply mode filter
    if (filters.mode) {
      filtered = filtered.filter(offering => 
        offering.mode === filters.mode
      );
    }
    
    setFilteredOfferings(filtered);
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
      mode: ''
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

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online':
        return <Badge bg="info">Online</Badge>;
      case 'in-person':
        return <Badge bg="success">In-Person</Badge>;
      case 'both':
        return <Badge bg="primary">Online / In-Person</Badge>;
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

  if (loading && !offerings.length) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Skill Offerings</h1>
            <p className="page-subtitle">Discover skills shared by the AUI community</p>
          </div>
          
          <Link to="/offerings/new" className="btn btn-primary add-offering-btn">
            <FiPlus /> Offer Your Skill
          </Link>
        </div>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <div className="offerings-search-container">
          <div className="search-bar-container">
            <InputGroup>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search offerings..."
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
                    <Form.Label>Mode</Form.Label>
                    <Form.Select 
                      name="mode" 
                      value={filters.mode} 
                      onChange={handleFilterChange}
                    >
                      <option value="">All Modes</option>
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      <option value="both">Both</option>
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
        
        <div className="offerings-results">
          <div className="results-header">
            <p className="results-count">
              {filteredOfferings.length} offering{filteredOfferings.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {filteredOfferings.length === 0 ? (
            <div className="no-results">
              <p>No offerings match your filters. Try adjusting your search criteria.</p>
              <Button variant="outline-primary" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <Row>
              {filteredOfferings.map((offering) => (
                <Col key={offering.offering_id} lg={4} md={6} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="offering-card">
                      <Card.Body>
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
                        
                        <div className="offering-footer">
                          <span className="offering-date">Posted on {formatDate(offering.created_at)}</span>
                          <Link 
                            to={`/offerings/${offering.offering_id}`} 
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

export default Offerings;