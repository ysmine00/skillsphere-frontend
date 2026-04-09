import api from './api';

/**
 * Service for handling offerings-related API requests
 */
const offeringsService = {
  /**
   * Get all skill offerings
   * @param {Object} filters - Optional filters
   * @returns {Promise} - API response with offerings data
   */
  getAllOfferings: async (filters = {}) => {
    return api.get('/offerings', { params: filters }).then(response => response.data);
  },
  
  /**
   * Get current user's offerings
   * @returns {Promise} - API response with user offerings
   */
  getUserOfferings: async () => {
    return api.get('/offerings/user').then(response => response.data);
  },
  
  /**
   * Get a single offering by ID
   * @param {string} id - Offering ID
   * @returns {Promise} - API response with offering data
   */
  getOfferingById: async (id) => {
    return api.get(`/offerings/${id}`).then(response => response.data);
  },
  
  /**
   * Create a new offering
   * @param {Object} offeringData - Offering data
   * @returns {Promise} - API response
   */
  createOffering: async (offeringData) => {
    return api.post('/offerings', offeringData).then(response => response.data);
  },
  
  /**
   * Update an offering
   * @param {string} id - Offering ID
   * @param {Object} offeringData - Updated offering data
   * @returns {Promise} - API response
   */
  updateOffering: async (id, offeringData) => {
  // Make sure is_active is set to true when updating from the form
  const updatedData = { 
    ...offeringData, 
    is_active: true 
  };
  
  return api.put(`/offerings/${id}`, updatedData).then(response => response.data);
},
  
  /**
   * Delete an offering
   * @param {string} id - Offering ID
   * @returns {Promise} - API response
   */
  deleteOffering: async (id) => {
    return api.delete(`/offerings/${id}`).then(response => response.data);
  }
};

export default offeringsService;