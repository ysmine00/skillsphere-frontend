import React from 'react';
import './SkillsOffered.css';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SkillsOffered = ({ offerings }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-card skills-offered-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Skills Offered</h2>
        <Link to="/offerings" className="view-all-link">
          View All <FiArrowRight />
        </Link>
      </div>
      
      {offerings.length === 0 ? (
        <div className="no-data-message">
          <p>You haven't offered any skills yet.</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/offerings/new" className="btn btn-sm btn-primary">Offer a Skill</Link>
          </motion.div>
        </div>
      ) : (
        <ul className="skills-list-dashboard">
          {offerings.map((offering, index) => (
            <motion.li 
              key={offering.offering_id} 
              className="skill-list-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="skill-header">
                <h3 className="skill-title">{offering.title}</h3>
                <span className="skill-category">{offering.category_name}</span>
              </div>
              <p className="skill-description">{offering.description.substring(0, 100)}...</p>
              <div className="skill-footer">
                <div className="skill-meta">
                  <span className="skill-meta-item">
                    <FiLayers /> {offering.skill_name}
                  </span>
                  <span className="skill-meta-item">
                    <FiCalendar /> {formatDate(offering.created_at)}
                  </span>
                </div>
                <motion.div whileHover={{ x: 3 }}>
                  <Link to={`/offerings/${offering.offering_id}`} className="skill-link">
                    Details <FiArrowRight />
                  </Link>
                </motion.div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillsOffered;