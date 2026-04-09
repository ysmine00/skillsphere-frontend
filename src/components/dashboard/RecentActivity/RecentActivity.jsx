import React from 'react';
import './RecentActivity.css';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiClock, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RecentActivity = ({ exchanges }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'accepted':
        return 'status-accepted';
      case 'canceled':
        return 'status-canceled';
      default:
        return 'status-pending';
    }
  };

  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.user.user_id : null;
  };

  return (
    <div className="dashboard-card recent-activity-card">
      <div className="dashboard-card-header">
        <h2 className="dashboard-card-title">Recent Activity</h2>
        <Link to="/exchanges" className="view-all-link">
          View All <FiArrowRight />
        </Link>
      </div>
      
      {exchanges.length === 0 ? (
        <div className="no-data-message">
          <p>No exchange activity yet. Start by offering or requesting a skill!</p>
        </div>
      ) : (
        <ul className="activity-list">
          {exchanges.map((exchange, index) => (
            <motion.li 
              key={exchange.exchange_id} 
              className="activity-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="activity-content">
                <div className="activity-header">
                  <h3 className="activity-title">
                    {exchange.provider_id === getUserId() ? (
                      <>
                        <FiUserCheck className="role-icon provider" />
                        <span>You offered help with <strong>{exchange.skill_name}</strong></span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="role-icon requester" />
                        <span>You requested help with <strong>{exchange.skill_name}</strong></span>
                      </>
                    )}
                  </h3>
                  <span className={`status-label ${getStatusStyle(exchange.status)}`}>
                    {exchange.status}
                  </span>
                </div>
                
                <p className="activity-details">
                  {exchange.provider_id === getUserId() ? (
                    <>You offered "{exchange.offering_title}" to {exchange.requester_name}</>
                  ) : (
                    <>{exchange.provider_name} offered "{exchange.offering_title}" to you</>
                  )}
                </p>
                
                <div className="activity-footer">
                  <div className="activity-meta">
                    <span className="activity-meta-item">
                      <FiCalendar /> Created on {formatDate(exchange.created_at)}
                    </span>
                    <span className="activity-meta-item">
                      <FiClock /> Updated on {formatDate(exchange.updated_at)}
                    </span>
                  </div>
                  <motion.div whileHover={{ x: 3 }}>
                    <Link to={`/exchanges/${exchange.exchange_id}`} className="activity-link">
                      View Exchange <FiArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;