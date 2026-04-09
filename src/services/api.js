import axios from 'axios';
import authService from './authService';

// Define API base URL from environment variable or default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Create an Axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add interceptor to attach auth token to requests
 */
api.interceptors.request.use(
  (config) => {
    const authHeader = authService.getAuthHeader();
    if (authHeader) {
      config.headers = {
        ...config.headers,
        ...authHeader,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Add interceptor to handle common response errors
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden - display message
    if (error.response && error.response.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    }
    
    // Handle 500 server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default api;