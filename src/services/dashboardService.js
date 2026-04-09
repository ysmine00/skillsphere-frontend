import api from './api';

/**
 * Service for handling dashboard-related API requests
 */
const dashboardService = {
  /**
   * Get dashboard data for the authenticated user
   * @returns {Promise} - API response with dashboard data
   */
  getUserDashboard: async () => {
    return api.get('/dashboard').then(response => response.data);
  }
};

export default dashboardService;