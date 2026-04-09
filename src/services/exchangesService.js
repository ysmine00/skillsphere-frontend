import api from './api';

/**
 * Service for handling exchanges-related API requests
 */
const exchangesService = {
  /**
   * Get all exchanges for the authenticated user
   * @returns {Promise} - API response with exchanges data
   */
  getUserExchanges: async () => {
    return api.get('/exchanges/user').then(response => response.data);
  },
  
  /**
   * Get a single exchange by ID
   * @param {string} id - Exchange ID
   * @returns {Promise} - API response with exchange data
   */
  getExchangeById: async (id) => {
    return api.get(`/exchanges/${id}`).then(response => response.data);
  },
  
  /**
   * Create a new exchange
   * @param {Object} exchangeData - Exchange data
   * @returns {Promise} - API response
   */
  createExchange: async (exchangeData) => {
    return api.post('/exchanges', exchangeData).then(response => response.data);
  },
  
  /**
   * Update an exchange status
   * @param {string} id - Exchange ID
   * @param {string} status - New status (pending, accepted, completed, canceled)
   * @returns {Promise} - API response
   */
  updateExchangeStatus: async (id, status) => {
    return api.put(`/exchanges/${id}/status`, { status }).then(response => response.data);
  },
  
  /**
   * Delete an exchange
   * @param {string} id - Exchange ID
   * @returns {Promise} - API response
   */
  deleteExchange: async (id) => {
    return api.delete(`/exchanges/${id}`).then(response => response.data);
  }
};

export default exchangesService;