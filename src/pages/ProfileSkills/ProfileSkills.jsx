import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit, FiX, FiCheck, FiInfo, FiTag, FiAward, FiArrowLeft } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import skillsService from '../../services/skillsService';
import { Link } from 'react-router-dom';
import './ProfileSkills.css';

const ProfileSkills = () => {
  const [userSkills, setUserSkills] = useState([]);
  const [allSkills, setAllSkills] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [proficiencyLevel, setProficiencyLevel] = useState('beginner');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState(null);
  const [filteredSkills, setFilteredSkills] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's skills
      const userSkillsData = await skillsService.getUserSkills();
      setUserSkills(userSkillsData);
      
      // Fetch all available skills
      const allSkillsData = await skillsService.getAllSkills();
      setAllSkills(allSkillsData);
      
      // Get categories from all skills
      const categoriesData = Object.keys(allSkillsData);
      setCategories(categoriesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load skills data. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update filtered skills when category changes
    if (selectedCategory && allSkills[selectedCategory]) {
      // Filter out skills user already has
      const userSkillIds = userSkills.map(skill => skill.skill_id);
      const filtered = allSkills[selectedCategory].filter(
        skill => !userSkillIds.includes(skill.skill_id)
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  }, [selectedCategory, allSkills, userSkills]);

  const handleAddSkill = async () => {
    if (!selectedSkill || !proficiencyLevel) {
      setError('Please select a skill and proficiency level');
      return;
    }

    try {
      setLoading(true);
      
      const skillData = {
        skill_id: parseInt(selectedSkill),
        proficiency_level: proficiencyLevel,
        notes: notes.trim() || null
      };
      
      const response = await skillsService.addUserSkill(skillData);
      
      // Update user skills
      setUserSkills([...userSkills, response.skill]);
      
      // Reset form
      setSelectedCategory('');
      setSelectedSkill('');
      setProficiencyLevel('beginner');
      setNotes('');
      
      setSuccess('Skill added successfully');
      setShowAddModal(false);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error adding skill:', err);
      setError(err.response?.data?.message || 'Failed to add skill. Please try again.');
      setLoading(false);
    }
  };

  const handleEditSkill = async () => {
    if (!skillToEdit) return;

    try {
      setLoading(true);
      
      const skillData = {
        proficiency_level: proficiencyLevel,
        notes: notes.trim() || null
      };
      
      const response = await skillsService.updateUserSkill(skillToEdit.user_skill_id, skillData);
      
      // Update user skills
      setUserSkills(userSkills.map(skill => 
        skill.user_skill_id === skillToEdit.user_skill_id ? response.skill : skill
      ));
      
      setSuccess('Skill updated successfully');
      setShowEditModal(false);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating skill:', err);
      setError(err.response?.data?.message || 'Failed to update skill. Please try again.');
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (userSkillId) => {
    if (!window.confirm('Are you sure you want to remove this skill?')) return;

    try {
      setLoading(true);
      
      await skillsService.removeUserSkill(userSkillId);
      
      // Update user skills
      setUserSkills(userSkills.filter(skill => skill.user_skill_id !== userSkillId));
      
      setSuccess('Skill removed successfully');
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error removing skill:', err);
      setError(err.response?.data?.message || 'Failed to remove skill. Please try again.');
      setLoading(false);
    }
  };

  const openEditModal = (skill) => {
    setSkillToEdit(skill);
    setProficiencyLevel(skill.proficiency_level);
    setNotes(skill.notes || '');
    setShowEditModal(true);
  };

  const getProficiencyBadge = (level) => {
    const variants = {
      beginner: { bg: "success", label: "Beginner" },
      intermediate: { bg: "warning", label: "Intermediate" },
      advanced: { bg: "danger", label: "Advanced" }
    };
    
    return variants[level] ? (
      <Badge bg={variants[level].bg} className="proficiency-badge">
        {variants[level].label}
      </Badge>
    ) : null;
  };

  if (loading && !userSkills.length) {
    return <Loader />;
  }
  
  // Group skills by category
  const skillsByCategory = userSkills.reduce((acc, skill) => {
    const category = skill.category_name;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});
  
  const sortedCategories = Object.keys(skillsByCategory).sort();

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Skills</h1>
            <p className="page-subtitle">Manage your skills profile and expertise</p>
          </div>
          
          <div className="header-actions">
            <Link to="/profile" className="btn btn-outline-secondary back-btn">
              <FiArrowLeft /> Back to Profile
            </Link>
            <Button 
              variant="primary" 
              className="add-skill-btn" 
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus /> Add New Skill
            </Button>
          </div>
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
        
        {userSkills.length === 0 ? (
          <Card className="empty-skills-card">
            <Card.Body className="text-center py-5">
              <div className="empty-skills-icon">
                <FiAward size={48} />
              </div>
              <h3 className="mb-3">No Skills Added Yet</h3>
              <p className="text-muted mb-4">
                Add your skills to showcase your expertise to the AUI community
              </p>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => setShowAddModal(true)}
                className="main-action-btn"
              >
                <FiPlus className="me-2" /> Add Your First Skill
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <div className="skills-container">
            {sortedCategories.map(category => (
              <div className="category-section" key={category}>
                <h2 className="category-title">
                  <FiTag className="category-icon" />
                  {category}
                </h2>
                <Row className="skills-grid">
                  {skillsByCategory[category].map(skill => (
                    <Col key={skill.user_skill_id} lg={4} md={6} sm={12} className="mb-4">
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="skill-card">
                          <Card.Body>
                            <div className="skill-header">
                              <h3 className="skill-name">{skill.skill_name}</h3>
                              {getProficiencyBadge(skill.proficiency_level)}
                            </div>
                            
                            <div className="skill-content">
                              {skill.notes && (
                                <div className="skill-notes">
                                  <p>{skill.notes}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="skill-actions">
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                onClick={() => openEditModal(skill)}
                                className="edit-btn"
                              >
                                <FiEdit className="btn-icon" /> Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleRemoveSkill(skill.user_skill_id)}
                                className="remove-btn"
                              >
                                <FiTrash2 className="btn-icon" /> Remove
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}
          </div>
        )}
      </Container>
      
      {/* Add Skill Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        centered
        size="lg"
        className="skill-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Skill Category</Form.Label>
                  <Form.Select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-pill"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Skill</Form.Label>
                  <Form.Select 
                    value={selectedSkill} 
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    disabled={!selectedCategory}
                    className="rounded-pill"
                  >
                    <option value="">Select a skill</option>
                    {filteredSkills.map((skill) => (
                      <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.name}
                      </option>
                    ))}
                  </Form.Select>
                  {filteredSkills.length === 0 && selectedCategory && (
                    <Form.Text className="text-danger">
                      You already have all skills in this category
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-4">
              <Form.Label>Proficiency Level</Form.Label>
              <div className="proficiency-options">
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'beginner' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('beginner')}
                >
                  <div className="option-content">
                    <Badge bg="success" className="option-badge">Beginner</Badge>
                    <p className="option-desc">Just started learning or have basic knowledge</p>
                  </div>
                  {proficiencyLevel === 'beginner' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'intermediate' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('intermediate')}
                >
                  <div className="option-content">
                    <Badge bg="warning" className="option-badge">Intermediate</Badge>
                    <p className="option-desc">Good working knowledge and some experience</p>
                  </div>
                  {proficiencyLevel === 'intermediate' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'advanced' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('advanced')}
                >
                  <div className="option-content">
                    <Badge bg="danger" className="option-badge">Advanced</Badge>
                    <p className="option-desc">Extensive knowledge and significant experience</p>
                  </div>
                  {proficiencyLevel === 'advanced' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share details about your experience with this skill..."
                className="rounded-3"
              />
              <Form.Text className="text-muted">
                Maximum 500 characters. {notes ? 500 - notes.length : 500} characters remaining.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowAddModal(false)}
            className="rounded-pill px-4"
          >
            <FiX className="me-2" /> Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddSkill} 
            disabled={!selectedSkill || !proficiencyLevel || loading}
            className="rounded-pill px-4"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              <>
                <FiCheck className="me-2" /> Add Skill
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Skill Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        centered
        size="lg"
        className="skill-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Skill: {skillToEdit?.skill_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="skill-info mb-4">
            <div className="skill-meta">
              <Badge className="category-badge">{skillToEdit?.category_name}</Badge>
              <h5 className="skill-title">{skillToEdit?.skill_name}</h5>
            </div>
          </div>
          
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Proficiency Level</Form.Label>
              <div className="proficiency-options">
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'beginner' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('beginner')}
                >
                  <div className="option-content">
                    <Badge bg="success" className="option-badge">Beginner</Badge>
                    <p className="option-desc">Just started learning or have basic knowledge</p>
                  </div>
                  {proficiencyLevel === 'beginner' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'intermediate' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('intermediate')}
                >
                  <div className="option-content">
                    <Badge bg="warning" className="option-badge">Intermediate</Badge>
                    <p className="option-desc">Good working knowledge and some experience</p>
                  </div>
                  {proficiencyLevel === 'intermediate' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
                
                <div 
                  className={`proficiency-option ${proficiencyLevel === 'advanced' ? 'selected' : ''}`}
                  onClick={() => setProficiencyLevel('advanced')}
                >
                  <div className="option-content">
                    <Badge bg="danger" className="option-badge">Advanced</Badge>
                    <p className="option-desc">Extensive knowledge and significant experience</p>
                  </div>
                  {proficiencyLevel === 'advanced' && (
                    <div className="option-check">
                      <FiCheck />
                    </div>
                  )}
                </div>
              </div>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share details about your experience with this skill..."
                className="rounded-3"
              />
              <Form.Text className="text-muted">
                Maximum 500 characters. {notes ? 500 - notes.length : 500} characters remaining.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowEditModal(false)}
            className="rounded-pill px-4"
          >
            <FiX className="me-2" /> Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSkill}
            disabled={loading}
            className="rounded-pill px-4"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              <>
                <FiCheck className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileSkills;