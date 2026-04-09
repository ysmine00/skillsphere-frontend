import React from 'react';
import './UserProfile.css';
import { Link } from 'react-router-dom';
import { FiEdit, FiUser, FiMail, FiBriefcase, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserProfile = ({ profile, skills }) => {
  const getRoleLabel = (role) => {
    switch(role) {
      case 'faculty':
        return 'Faculty Member';
      case 'staff':
        return 'Staff Member';
      case 'admin':
        return 'Administrator';
      default:
        return 'Student';
    }
  };

  return (
    <div className="user-profile-card">
      <div className="profile-header">
        <motion.div 
          className="profile-avatar"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
        </motion.div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.full_name || 'Unnamed User'}</h2>
          <p className="profile-role">{getRoleLabel(profile.role)}</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/profile/edit" className="edit-profile-btn">
            <FiEdit /> Edit Profile
          </Link>
        </motion.div>
      </div>
      
      <div className="profile-details">
        <motion.div 
          className="detail-item"
          whileHover={{ x: 5 }}
        >
          <FiUser className="detail-icon" />
          <div className="detail-content">
            <h3 className="detail-label">Full Name</h3>
            <p className="detail-value">{profile.full_name || 'Not provided'}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="detail-item"
          whileHover={{ x: 5 }}
        >
          <FiMail className="detail-icon" />
          <div className="detail-content">
            <h3 className="detail-label">Email</h3>
            <p className="detail-value">{profile.email}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="detail-item"
          whileHover={{ x: 5 }}
        >
          <FiBriefcase className="detail-icon" />
          <div className="detail-content">
            <h3 className="detail-label">Department/Major</h3>
            <p className="detail-value">{profile.department_major || 'Not specified'}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="detail-item"
          whileHover={{ x: 5 }}
        >
          <FiInfo className="detail-icon" />
          <div className="detail-content">
            <h3 className="detail-label">Bio</h3>
            <p className="detail-value bio-text">{profile.bio || 'No bio provided. Tell the community about yourself!'}</p>
          </div>
        </motion.div>
      </div>
      
      <div className="profile-skills">
        <h3 className="skills-title">My Skills</h3>
        {skills.length === 0 ? (
          <p className="no-skills-message">You haven't added any skills to your profile yet.</p>
        ) : (
          <div className="skills-tags">
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.user_skill_id} 
                className="skill-tag"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="skill-name">{skill.skill_name}</span>
                <span className={`proficiency-badge ${skill.proficiency_level}`}>
                  {skill.proficiency_level}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        <div className="profile-actions">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/profile/skills" className="btn btn-sm btn-primary">
              Manage Skills
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;