import React from 'react';
import './SkillsRequested.css';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiLayers, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SkillsRequested = ({ requests }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUrgencyStyle = (urgency) => {
    switch(urgency) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      default:
        return 'urgency-low';
    }
  };

  return (
    <div className="dashboard-card skills-requested-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Skills Requested</h2>
        <Link to="/requests" className="view-all-link">
          View All <FiArrowRight />
        </Link>
      </div>
      
      {requests.length === 0 ? (
        <div className="no-data-message">
          <p>You haven't requested any skills yet.</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link to="/requests/new" className="btn btn-sm btn-primary">Request a Skill</Link>
          </motion.div>
        </div>
      ) : (
        <ul className="skills-list-dashboard">
          {requests.map((request, index) => (
            <motion.li 
              key={request.request_id} 
              className="skill-list-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="skill-header">
                <h3 className="skill-title">{request.title}</h3>
                <span className={`urgency-label ${getUrgencyStyle(request.urgency)}`}>
                  {request.urgency} priority
                </span>
              </div>
              <p className="skill-description">{request.description.substring(0, 100)}...</p>
              <div className="skill-footer">
                <div className="skill-meta">
                  <span className="skill-meta-item">
                    <FiLayers /> {request.skill_name}
                  </span>
                  <span className="skill-meta-item">
                    <FiCalendar /> {formatDate(request.created_at)}
                  </span>
                  <span className="skill-meta-item">
                    <FiClock /> {request.preferred_timeframe}
                  </span>
                </div>
                <motion.div whileHover={{ x: 3 }}>
                  <Link to={`/requests/${request.request_id}`} className="skill-link">
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

export default SkillsRequested;