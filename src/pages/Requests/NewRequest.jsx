import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSend, FiX, FiClock, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import skillsService from '../../services/skillsService';
import requestsService from '../../services/requestsService';
import './NewRequest.css';

// Validation schema using Yup
const requestSchema = Yup.object().shape({
  skill_id: Yup.number().required('Please select a skill'),
  title: Yup.string().required('Title is required').max(100, 'Title is too long'),
  description: Yup.string().required('Description is required').max(500, 'Description is too long'),
  urgency: Yup.string().required('Please select an urgency level'),
  preferred_timeframe: Yup.string().required('Timeframe information is required')
});

const NewRequest = () => {
  const { id } = useParams(); // Get request ID from URL if in edit mode
  const isEditMode = !!id;
  
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    skill_id: '',
    title: '',
    description: '',
    urgency: '',
    preferred_timeframe: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all skills
      const allSkillsData = await skillsService.getAllSkills();
      setSkills(allSkillsData);
      
      // Get categories
      const categoriesData = Object.keys(allSkillsData);
      setCategories(categoriesData);
      
      // If in edit mode, fetch the existing request
      if (isEditMode) {
        const response = await requestsService.getRequestById(id);
        const requestData = response.request;
        
        // Find the category for this skill
        let categoryName = '';
        for (const [category, skillsList] of Object.entries(allSkillsData)) {
          if (skillsList.some(skill => skill.skill_id === requestData.skill_id)) {
            categoryName = category;
            break;
          }
        }
        
        setSelectedCategory(categoryName);
        
        // Set initial form values from the request data
        setInitialValues({
          skill_id: requestData.skill_id,
          title: requestData.title,
          description: requestData.description,
          urgency: requestData.urgency,
          preferred_timeframe: requestData.preferred_timeframe
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
    return skills[selectedCategory];
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      
      if (isEditMode) {
        // Update existing request
        const updatedValues = {
          ...values,
          is_active: true
        };
        await requestsService.updateRequest(id, updatedValues);
        
        navigate('/requests', { 
          state: { 
            success: 'Your skill request has been updated successfully!' 
          } 
        });
      } else {
        // Create new request
        await requestsService.createRequest(values);
        
        navigate('/requests', { 
          state: { 
            success: 'Your skill request has been created successfully!' 
          } 
        });
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} request:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} request. Please try again.`);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">{isEditMode ? 'Edit Your Request' : 'Request a Skill'}</h1>
            <p className="page-subtitle">
              {isEditMode ? 'Update your skill request details' : 'Ask the AUI community for assistance'}
            </p>
          </div>
          
          <Button 
            variant="outline-secondary" 
            className="back-btn"
            onClick={() => navigate('/requests')}
          >
            <FiArrowLeft /> Back to Requests
          </Button>
        </div>
        
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="request-form-card">
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={requestSchema}
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
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
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
                        placeholder="E.g., Need help with Python programming for a project"
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
                        placeholder="Describe what you need help with in detail..."
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
                            <FiAlertTriangle className="icon-label" /> Urgency
                            {errors.urgency && touched.urgency ? (
                              <span className="text-danger ms-1">*</span>
                            ) : null}
                          </Form.Label>
                          <div className="urgency-selector">
                            <div 
                              className={`urgency-option urgency-low ${values.urgency === 'low' ? 'selected' : ''}`}
                              onClick={() => setFieldValue('urgency', 'low')}
                            >
                              <div className="urgency-content">
                                <div className="urgency-title">Low Priority</div>
                                <div className="urgency-description">Flexible timeline, not urgent</div>
                              </div>
                              {values.urgency === 'low' && (
                                <div className="urgency-check">
                                  <FiCheck className="check-icon" />
                                </div>
                              )}
                            </div>
                            
                            <div 
                              className={`urgency-option urgency-medium ${values.urgency === 'medium' ? 'selected' : ''}`}
                              onClick={() => setFieldValue('urgency', 'medium')}
                            >
                              <div className="urgency-content">
                                <div className="urgency-title">Medium Priority</div>
                                <div className="urgency-description">Needed within a reasonable timeframe</div>
                              </div>
                              {values.urgency === 'medium' && (
                                <div className="urgency-check">
                                  <FiCheck className="check-icon" />
                                </div>
                              )}
                            </div>
                            
                            <div 
                              className={`urgency-option urgency-high ${values.urgency === 'high' ? 'selected' : ''}`}
                              onClick={() => setFieldValue('urgency', 'high')}
                            >
                              <div className="urgency-content">
                                <div className="urgency-title">High Priority</div>
                                <div className="urgency-description">Urgent need, time-sensitive</div>
                              </div>
                              {values.urgency === 'high' && (
                                <div className="urgency-check">
                                  <FiCheck className="check-icon" />
                                </div>
                              )}
                            </div>
                          </div>
                          {errors.urgency && touched.urgency ? (
                            <div className="text-danger mt-2 small">
                              {errors.urgency}
                            </div>
                          ) : null}
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FiClock className="icon-label" /> Preferred Timeframe
                            {errors.preferred_timeframe && touched.preferred_timeframe ? (
                              <span className="text-danger ms-1">*</span>
                            ) : null}
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="preferred_timeframe"
                            placeholder="E.g., Next two weeks, Before end of semester"
                            value={values.preferred_timeframe}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.preferred_timeframe && touched.preferred_timeframe}
                          />
                          {errors.preferred_timeframe && touched.preferred_timeframe ? (
                            <Form.Control.Feedback type="invalid">
                              {errors.preferred_timeframe}
                            </Form.Control.Feedback>
                          ) : (
                            <Form.Text className="text-muted">
                              Specify when you need this help by
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <div className="form-actions">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/requests')}
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
                            <FiSend /> {isEditMode ? 'Update Request' : 'Create Request'}
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
      </Container>
    </div>
  );
};

export default NewRequest;