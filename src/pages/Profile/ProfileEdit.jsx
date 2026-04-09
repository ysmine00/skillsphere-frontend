import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiBriefcase, FiMessageSquare, FiInfo } from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import profileService from '../../services/profileService';
import './ProfileEdit.css';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [formValues, setFormValues] = useState({
    full_name: '',
    department_major: '',
    contact_preference: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getUserProfile();
      setProfileData(response);
      
      // Initialize form with current profile data
      const { profile } = response;
      setFormValues({
        full_name: profile.full_name || '',
        department_major: profile.department_major || '',
        contact_preference: profile.contact_preference || '',
        bio: profile.bio || ''
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      await profileService.updateProfile(formValues);
      
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds and redirect to profile
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!profileData) {
    return (
      <div className="dashboard-container">
        <DashboardNavbar />
        <Container className="dashboard-main">
          <Alert variant="warning">
            Profile data not available. Please try again later.
          </Alert>
        </Container>
      </div>
    );
  }

  const { profile } = profileData;

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">Edit Profile</h1>
            <p className="page-subtitle">Update your profile information</p>
          </div>
          
          <Link to="/profile" className="btn btn-outline-secondary back-btn">
            <FiArrowLeft className="me-1" /> Back to Profile
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
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="profile-edit-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <div className="profile-info-section">
                  <div className="section-header">
                    <h3 className="section-title">
                      <FiUser className="section-icon" /> Basic Information
                    </h3>
                  </div>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <div className="readonly-input">
                          <FiMail className="readonly-icon" />
                          <span>{profile.email}</span>
                        </div>
                        <Form.Text className="text-muted">
                          Email address cannot be changed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          value={formValues.full_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Department/Major</Form.Label>
                        <Form.Control
                          type="text"
                          name="department_major"
                          value={formValues.department_major}
                          onChange={handleChange}
                          placeholder="e.g., Computer Science, Business Administration"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Preference</Form.Label>
                        <Form.Select
                          name="contact_preference"
                          value={formValues.contact_preference}
                          onChange={handleChange}
                        >
                          <option value="">Select contact preference</option>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="In Person">In Person</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                
                <div className="profile-bio-section">
                  <div className="section-header">
                    <h3 className="section-title">
                      <FiInfo className="section-icon" /> About Me
                    </h3>
                  </div>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={formValues.bio}
                      onChange={handleChange}
                      placeholder="Tell the community about yourself, your interests, and expertise..."
                      rows={5}
                    />
                    <Form.Text className="text-muted">
                      This will be displayed on your profile
                    </Form.Text>
                  </Form.Group>
                </div>
                
                <div className="form-actions">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/profile')}
                    className="me-2"
                    disabled={saving}
                  >
                    <FiX className="me-1" /> Cancel
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-1" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mt-4">
            <Card.Body>
              <div className="section-header">
                <h3 className="section-title">
                  <FiBriefcase className="section-icon" /> Skills Management
                </h3>
              </div>
              
              <p className="mb-4">
                Add, edit, or remove skills from your profile to showcase your expertise.
              </p>
              
              <Link to="/profile/skills" className="btn btn-primary">
                Manage My Skills
              </Link>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default ProfileEdit;