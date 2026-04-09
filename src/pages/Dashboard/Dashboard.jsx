import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import './DashboardShared.css';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import UserProfile from '../../components/dashboard/UserProfile/UserProfile';
import UserStats from '../../components/dashboard/UserStats/UserStats';
import SkillsOffered from '../../components/dashboard/SkillsOffered/SkillsOffered';
import SkillsRequested from '../../components/dashboard/SkillsRequested/SkillsRequested';
import RecentActivity from '../../components/dashboard/RecentActivity/RecentActivity';
import Loader from '../../components/common/Loader/Loader';
import dashboardService from '../../services/dashboardService';
import { FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <DashboardNavbar />
        <div className="dashboard-main">
          <motion.div 
            className="dashboard-error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>{error}</p>
            <motion.button 
              className="btn btn-primary" 
              onClick={fetchDashboardData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiRefreshCw /> Try Again
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardNavbar />
      
      <div className="dashboard-main">
        <motion.div 
          className="dashboard-welcome"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1>Welcome, {dashboardData.profile.full_name || 'User'}!</h1>
          <p>Here's what's happening with your skill exchanges.</p>
        </motion.div>
        
        <motion.div 
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <UserStats 
            stats={dashboardData.stats} 
            activityScore={dashboardData.activityScore} 
          />
        </motion.div>
        
        <motion.div 
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="dashboard-grid dashboard-grid-sidebar">
            <div className="dashboard-grid-item">
              <UserProfile 
                profile={dashboardData.profile}
                skills={dashboardData.skills}
              />
            </div>
            <div className="dashboard-grid-item">
              <RecentActivity exchanges={dashboardData.exchanges} />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="dashboard-grid dashboard-grid-2">
            <div className="dashboard-grid-item">
              <SkillsOffered offerings={dashboardData.offerings} />
            </div>
            <div className="dashboard-grid-item">
              <SkillsRequested requests={dashboardData.requests} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;