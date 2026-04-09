import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiEdit, FiUser, FiMail, FiBriefcase, FiAward, FiRefreshCw, 
  FiAlertTriangle, FiMessageSquare, FiGift, FiSearch
} from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get current user ID
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await profileService.getUserProfile();
      setProfileData(response);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again later.');
      setLoading(false);
    }
  };

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'danger';
      default:
        return 'primary';
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
                  onClick={fetchProfile}
                  className="d-flex align-items-center"
                >
                  <FiRefreshCw className="me-1" /> Retry
                </Button>
              </div>
            </div>
          </Alert>
        </Container>
      </div>
    );
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

  const { profile, stats, skills } = profileData;

  const getActivityLevel = (score) => {
    if (score < 10) return { label: 'Just Started', color: '#6c757d' };
    if (score < 30) return { label: 'Getting Active', color: '#17a2b8' };
    if (score < 50) return { label: 'Regular Contributor', color: '#28a745' };
    if (score < 80) return { label: 'Very Active', color: '#fd7e14' };
    return { label: 'Super Contributor', color: '#dc3545' };
  };

  const activityInfo = getActivityLevel(stats.activity_score);

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <Container className="dashboard-main">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">View and manage your profile information</p>
          </div>
          
          <Link to="/profile/edit" className="btn btn-primary edit-profile-btn">
            <FiEdit className="me-1" /> Edit Profile
          </Link>
        </div>
        
        <Row>
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="profile-card mb-4">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="profile-info">
                    <h2 className="profile-name">{profile.full_name || 'Unnamed User'}</h2>
                    <p className="profile-role">{profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</p>
                  </div>
                </div>
                
                <Card.Body>
                  <div className="profile-details">
                    <div className="detail-item">
                      <FiUser className="detail-icon" />
                      <div className="detail-content">
                        <h3 className="detail-label">Full Name</h3>
                        <p className="detail-value">{profile.full_name || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FiMail className="detail-icon" />
                      <div className="detail-content">
                        <h3 className="detail-label">Email</h3>
                        <p className="detail-value">{profile.email}</p>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FiBriefcase className="detail-icon" />
                      <div className="detail-content">
                        <h3 className="detail-label">Department/Major</h3>
                        <p className="detail-value">{profile.department_major || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FiMessageSquare className="detail-icon" />
                      <div className="detail-content">
                        <h3 className="detail-label">Contact Preference</h3>
                        <p className="detail-value">{profile.contact_preference || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <div className="profile-bio">
                      <h3 className="bio-label">Bio</h3>
                      <p className="bio-text">{profile.bio}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title className="activity-title">
                    <FiAward className="me-2" /> Activity Score
                  </Card.Title>
                  
                  <div className="activity-display">
                    <div 
                      className="activity-circle" 
                      style={{ backgroundColor: activityInfo.color }}
                    >
                      {stats.activity_score}
                    </div>
                    <div className="activity-info">
                      <h4 className="activity-level">{activityInfo.label}</h4>
                      <p className="activity-description">Based on your participation</p>
                    </div>
                  </div>
                  
                  <div className="activity-stats">
                    <div className="stat-row">
                      <div className="stat-label">Skills Offered</div>
                      <div className="stat-value">{stats.offerings_count}</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Skills Requested</div>
                      <div className="stat-value">{stats.requests_count}</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Provided</div>
                      <div className="stat-value">{stats.provided_count}</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Requested</div>
                      <div className="stat-value">{stats.requested_count}</div>
                    </div>
                    <div className="stat-row">
                      <div className="stat-label">Completed Exchanges</div>
                      <div className="stat-value">{stats.completed_count}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="mb-4">
                <Card.Body>
                  <div className="skills-header">
                    <Card.Title>My Skills</Card.Title>
                    <div className="skills-actions">
                      <Link to="/profile/skills" className="btn btn-sm btn-primary">
                        <FiEdit className="me-1" /> Manage Skills
                      </Link>
                    </div>
                  </div>
                  
                  {skills.length === 0 ? (
                    <div className="no-skills">
                      <p>You haven't added any skills to your profile yet.</p>
                      <Link to="/profile/skills" className="btn btn-outline-primary">
                        Add Your First Skill
                      </Link>
                    </div>
                  ) : (
                    <div className="skills-grid">
                      {skills.map(skill => (
                        <div className="skill-item" key={skill.user_skill_id}>
                          <div className="skill-header">
                            <h4 className="skill-name">{skill.skill_name}</h4>
                            <Badge 
                              bg={getProficiencyColor(skill.proficiency_level)}
                              className="proficiency-badge"
                            >
                              {skill.proficiency_level}
                            </Badge>
                          </div>
                          <div className="skill-category">
                            <span className="category-label">Category:</span>
                            <span className="category-value">{skill.category_name}</span>
                          </div>
                          {skill.notes && (
                            <p className="skill-notes">{skill.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <div className="profile-actions">
                <Row>
                  <Col md={6} className="mb-4">
                    <Card className="action-card">
                      <Card.Body className="d-flex flex-column align-items-center">
                        <div className="action-icon">
                          <FiGift />
                        </div>
                        <Card.Title className="action-title">Offer Your Skills</Card.Title>
                        <Card.Text className="action-text text-center">
                          Share your expertise with the AUI community
                        </Card.Text>
                        <Link to="/offerings/new" className="btn btn-primary mt-auto">
                          Create Offering
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} className="mb-4">
                    <Card className="action-card">
                      <Card.Body className="d-flex flex-column align-items-center">
                        <div className="action-icon">
                          <FiSearch />
                        </div>
                        <Card.Title className="action-title">Request Skills</Card.Title>
                        <Card.Text className="action-text text-center">
                          Find others who can help you learn
                        </Card.Text>
                        <Link to="/requests/new" className="btn btn-primary mt-auto">
                          Create Request
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;