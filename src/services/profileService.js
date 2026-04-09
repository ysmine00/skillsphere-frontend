import api from './api';

/**
 * Service for handling profile-related API requests
 */
const profileService = {
  /**
   * Get current user's profile
   * @returns {Promise} - API response with profile data
   */
  getUserProfile: async () => {
    return api.get('/profile').then(response => response.data);
  },
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - API response
   */
  updateProfile: async (profileData) => {
    return api.put('/profile', profileData).then(response => response.data);
  },
  
  /**
   * Upload profile image (for future implementation)
   * @param {File} imageFile - Image file to upload
   * @returns {Promise} - API response
   */
  uploadProfileImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return api.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  }
};

export default profileService;