import api from './api';

/**
 * Service for handling requests-related API requests
 */
const requestsService = {
    /**
     * Get all skill requests
     * @param {Object} filters - Optional filters
     * @returns {Promise} - API response with requests data
     */
    getAllRequests: async (filters = {}) => {
        return api.get('/requests', { params: filters }).then(response => response.data);
    },

    /**
     * Get current user's requests
     * @returns {Promise} - API response with user requests
     */
    getUserRequests: async () => {
        return api.get('/requests/user').then(response => response.data);
    },

    /**
     * Get a single request by ID
     * @param {string} id - Request ID
     * @returns {Promise} - API response with request data
     */
    getRequestById: async (id) => {
        return api.get(`/requests/${id}`).then(response => response.data);
    },

    /**
     * Create a new request
     * @param {Object} requestData - Request data
     * @returns {Promise} - API response
     */
    createRequest: async (requestData) => {
        return api.post('/requests', requestData).then(response => response.data);
    },

    /**
     * Update a request
     * @param {string} id - Request ID
     * @param {Object} requestData - Updated request data
     * @returns {Promise} - API response
     */
    updateRequest: async (id, requestData) => {
        // Make sure is_active is set to true when updating from the form
        const updatedData = {
            ...requestData,
            is_active: true
        };

        return api.put(`/requests/${id}`, updatedData).then(response => response.data);
    },
    /**
     * Delete a request
     * @param {string} id - Request ID
     * @returns {Promise} - API response
     */
    deleteRequest: async (id) => {
        return api.delete(`/requests/${id}`).then(response => response.data);
    }
};

export default requestsService;