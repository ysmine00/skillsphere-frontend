import axios from 'axios';

// Define API base URL from environment variable or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Service for handling authentication-related API requests
 */
const authService = {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    return axios.post(`${API_URL}/auth/register`, userData);
  },
  
  /**
   * Log in an existing user
   * @param {object} credentials - User login credentials
   * @returns {Promise} - API response with user data and token
   */
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  
  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('user');
  },
  
  /**
   * Get the current authenticated user
   * @returns {object|null} - User data or null if not authenticated
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  /**
   * Verify if a user's email belongs to AUI domain
   * @param {string} email - Email to verify
   * @returns {boolean} - Whether the email is valid
   */
  isValidAuiEmail: (email) => {
    return email && email.endsWith('@aui.ma');
  },
  
  /**
   * Get the authentication header for API requests
   * @returns {object|null} - Header object or null if not authenticated
   */
  getAuthHeader: () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return null;
  }
};

export default authService;