import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiInfo, FiSend, FiX, FiCalendar, FiMapPin, FiCheck } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import skillsService from '../../services/skillsService';
import offeringsService from '../../services/offeringsService';
import './NewOffering.css';

// Validation schema using Yup
const offeringSchema = Yup.object().shape({
  skill_id: Yup.number().required('Please select a skill'),
  title: Yup.string().required('Title is required').max(100, 'Title is too long'),
  description: Yup.string().required('Description is required').max(500, 'Description is too long'),
  mode: Yup.string().required('Please select a mode'),
  availability: Yup.string().required('Availability information is required')
});

const NewOffering = () => {
  const { id } = useParams(); // Get offering ID from URL if in edit mode
  const isEditMode = !!id;
  
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [userSkills, setUserSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    skill_id: '',
    title: '',
    description: '',
    mode: '',
    availability: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's skills
      const userSkillsData = await skillsService.getUserSkills();
      setUserSkills(userSkillsData);
      
      // Fetch all skills
      const allSkillsData = await skillsService.getAllSkills();
      setSkills(allSkillsData);
      
      // Get categories
      const categoriesData = Object.keys(allSkillsData);
      setCategories(categoriesData);
      
      // If in edit mode, fetch the existing offering
      if (isEditMode) {
        const offeringData = await offeringsService.getOfferingById(id);
        
        // Find the category for this skill
        let categoryName = '';
        for (const [category, skillsList] of Object.entries(allSkillsData)) {
          if (skillsList.some(skill => skill.skill_id === offeringData.skill_id)) {
            categoryName = category;
            break;
          }
        }
        
        setSelectedCategory(categoryName);
        
        // Set initial form values from the offering data
        setInitialValues({
          skill_id: offeringData.skill_id,
          title: offeringData.title,
          description: offeringData.description,
          mode: offeringData.mode,
          availability: offeringData.availability
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
      setLoading(false);
    }
  };

  // Get skills for the selected category
  const getSkillsForCategory = () => {
    if (!selectedCategory || !skills[selectedCategory]) {
      return [];
    }
    
    // Filter to only include skills the user has
    const userSkillIds = userSkills.map(skill => skill.skill_id);
    return skills[selectedCategory].filter(skill => userSkillIds.includes(skill.skill_id));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      if (isEditMode) {
        // Update existing offering
        await offeringsService.updateOffering(id, values);
        
        navigate('/offerings', { 
          state: { 
            success: 'Your skill offering has been updated successfully!' 
          } 
        });
      } else {
        // Create new offering
        await offeringsService.createOffering(values);
        
        navigate('/offerings', { 
          state: { 
            success: 'Your skill offering has been created successfully!' 
          } 
        });
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} offering:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} offering. Please try again.`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Check if user has any skills
  const hasSkills = userSkills.length > 0;

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">{isEditMode ? 'Edit Your Offering' : 'Offer Your Skill'}</h1>
            <p className="page-subtitle">
              {isEditMode ? 'Update your skill offering details' : 'Share your expertise with the AUI community'}
            </p>
          </div>
          
          <Button 
            variant="outline-secondary" 
            className="back-btn"
            onClick={() => navigate('/offerings')}
          >
            <FiArrowLeft /> Back to Offerings
          </Button>
        </div>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        {!hasSkills ? (
          <Card className="no-skills-card">
            <Card.Body>
              <div className="no-skills-message">
                <FiInfo size={40} className="info-icon" />
                <h3>Add Skills to Your Profile First</h3>
                <p>
                  You need to add at least one skill to your profile before you can create an offering.
                  This helps ensure you're offering skills you're proficient in.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/profile/skills')}
                  className="add-skills-btn"
                >
                  Add Skills to Your Profile
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="offering-form-card">
              <Card.Body>
                <Formik
                  initialValues={initialValues}
                  validationSchema={offeringSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Skill Category</Form.Label>
                            <Form.Select
                              name="category"
                              value={selectedCategory}
                              onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setFieldValue('skill_id', '');
                              }}
                              disabled={isEditMode} // Disable category change in edit mode
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => {
                                // Only show categories where user has skills
                                const hasSkillsInCategory = userSkills.some(
                                  skill => skill.category_name === category
                                );
                                if (hasSkillsInCategory) {
                                  return (
                                    <option key={category} value={category}>
                                      {category}
                                    </option>
                                  );
                                }
                                return null;
                              })}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Skill
                              {errors.skill_id && touched.skill_id ? (
                                <span className="text-danger ms-1">*</span>
                              ) : null}
                            </Form.Label>
                            <Form.Select
                              name="skill_id"
                              value={values.skill_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={errors.skill_id && touched.skill_id}
                              disabled={!selectedCategory || isEditMode} // Disable skill change in edit mode
                            >
                              <option value="">Select a skill</option>
                              {getSkillsForCategory().map((skill) => (
                                <option key={skill.skill_id} value={skill.skill_id}>
                                  {skill.name}
                                </option>
                              ))}
                            </Form.Select>
                            {errors.skill_id && touched.skill_id ? (
                              <Form.Control.Feedback type="invalid">
                                {errors.skill_id}
                              </Form.Control.Feedback>
                            ) : null}
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Title
                          {errors.title && touched.title ? (
                            <span className="text-danger ms-1">*</span>
                          ) : null}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          placeholder="E.g., Python Programming Tutoring for Beginners"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={errors.title && touched.title}
                        />
                        {errors.title && touched.title ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Description
                          {errors.description && touched.description ? (
                            <span className="text-danger ms-1">*</span>
                          ) : null}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          placeholder="Describe what you're offering in detail..."
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={errors.description && touched.description}
                        />
                        {errors.description && touched.description ? (
                          <Form.Control.Feedback type="invalid">
                            {errors.description}
                          </Form.Control.Feedback>
                        ) : (
                          <Form.Text className="text-muted">
                            {500 - values.description.length} characters remaining
                          </Form.Text>
                        )}
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FiMapPin className="icon-label" /> Mode
                              {errors.mode && touched.mode ? (
                                <span className="text-danger ms-1">*</span>
                              ) : null}
                            </Form.Label>
                            <div className="mode-selector">
                              <div 
                                className={`mode-option ${values.mode === 'online' ? 'selected' : ''}`}
                                onClick={() => setFieldValue('mode', 'online')}
                              >
                                <div className="mode-content">
                                  <div className="mode-title">Online</div>
                                  <div className="mode-description">Virtual meetings, video calls</div>
                                </div>
                                {values.mode === 'online' && (
                                  <div className="mode-check">
                                    <FiCheck className="check-icon" />
                                  </div>
                                )}
                              </div>
                              
                              <div 
                                className={`mode-option ${values.mode === 'in-person' ? 'selected' : ''}`}
                                onClick={() => setFieldValue('mode', 'in-person')}
                              >
                                <div className="mode-content">
                                  <div className="mode-title">In-Person</div>
                                  <div className="mode-description">Face-to-face meetings on campus</div>
                                </div>
                                {values.mode === 'in-person' && (
                                  <div className="mode-check">
                                    <FiCheck className="check-icon" />
                                  </div>
                                )}
                              </div>
                              
                              <div 
                                className={`mode-option ${values.mode === 'both' ? 'selected' : ''}`}
                                onClick={() => setFieldValue('mode', 'both')}
                              >
                                <div className="mode-content">
                                  <div className="mode-title">Both</div>
                                  <div className="mode-description">Flexible options available</div>
                                </div>
                                {values.mode === 'both' && (
                                  <div className="mode-check">
                                    <FiCheck className="check-icon" />
                                  </div>
                                )}
                              </div>
                            </div>
                            {errors.mode && touched.mode ? (
                              <div className="text-danger mt-2 small">
                                {errors.mode}
                              </div>
                            ) : null}
                          </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              <FiCalendar className="icon-label" /> Availability
                              {errors.availability && touched.availability ? (
                                <span className="text-danger ms-1">*</span>
                              ) : null}
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="availability"
                              placeholder="E.g., Weekdays after 5pm, Weekends"
                              value={values.availability}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={errors.availability && touched.availability}
                            />
                            {errors.availability && touched.availability ? (
                              <Form.Control.Feedback type="invalid">
                                {errors.availability}
                              </Form.Control.Feedback>
                            ) : (
                              <Form.Text className="text-muted">
                                Specify when you're available to share your skill
                              </Form.Text>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="form-actions">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => navigate('/offerings')}
                          disabled={isSubmitting}
                        >
                          <FiX /> Cancel
                        </Button>
                        
                        <Button 
                          variant="primary" 
                          type="submit" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <FiSend /> {isEditMode ? 'Update Offering' : 'Create Offering'}
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default NewOffering;