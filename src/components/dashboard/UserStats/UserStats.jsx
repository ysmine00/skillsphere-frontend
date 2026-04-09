import React from 'react';
import './UserStats.css';
import { FiFlag, FiBook, FiGift, FiUsers, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserStats = ({ stats, activityScore }) => {
  const statsItems = [
    {
      id: 'offerings',
      label: 'Skills Offered',
      value: stats.offerings_count,
      icon: <FiGift />,
      color: '#0070d2',
    },
    {
      id: 'requests',
      label: 'Skills Requested',
      value: stats.requests_count,
      icon: <FiBook />,
      color: '#f59e0b',
    },
    {
      id: 'provider',
      label: 'Times as Provider',
      value: stats.provider_count,
      icon: <FiFlag />,
      color: '#059669',
    },
    {
      id: 'requester',
      label: 'Times as Requester',
      value: stats.requester_count,
      icon: <FiUsers />,
      color: '#8b5cf6',
    },
    {
      id: 'completed',
      label: 'Completed Exchanges',
      value: stats.completed_count,
      icon: <FiAward />,
      color: '#ec4899',
    }
  ];

  const getScoreColor = (score) => {
    if (score < 10) return '#f59e0b';
    if (score < 30) return '#3b82f6';
    if (score < 50) return '#8b5cf6';
    if (score < 80) return '#ec4899';
    return '#10b981';
  };

  return (
    <div className="user-stats">
      <div className="stats-grid">
        {statsItems.map((item, index) => (
          <motion.div 
            key={item.id}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              {item.icon}
            </div>
            <div className="stat-info">
              <h3 className="stat-value">{item.value}</h3>
              <p className="stat-label">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="activity-score">
        <div className="activity-info">
          <h3>Activity Score</h3>
          <p>Your engagement on the platform</p>
        </div>
        <div className="score-display">
          <motion.div 
            className="score-circle"
            style={{ background: `linear-gradient(135deg, ${getScoreColor(activityScore)}, ${getScoreColor(activityScore + 10)})` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {activityScore}
          </motion.div>
          <div className="score-label">
            {activityScore < 10 ? 'Just Started' : 
             activityScore < 30 ? 'Getting Active' : 
             activityScore < 50 ? 'Regular Contributor' : 
             activityScore < 80 ? 'Very Active' : 'Super Contributor'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;