import api from './api';

/**
 * Service for handling skills-related API requests
 */
const skillsService = {
  /**
   * Get all available skills grouped by category
   * @returns {Promise} - API response with skills data
   */
  getAllSkills: async () => {
    return api.get('/skills/available').then(response => response.data);
  },
  
  /**
   * Get all skill categories
   * @returns {Promise} - API response with categories
   */
  getCategories: async () => {
    return api.get('/skills/categories').then(response => response.data);
  },
  
  /**
   * Get current user's skills
   * @returns {Promise} - API response with user skills
   */
  getUserSkills: async () => {
    return api.get('/skills/user').then(response => response.data);
  },
  
  /**
   * Add a skill to user's profile
   * @param {Object} skillData - Skill data
   * @returns {Promise} - API response
   */
  addUserSkill: async (skillData) => {
    return api.post('/skills/user', skillData).then(response => response.data);
  },
  
  /**
   * Update a user skill
   * @param {string} userSkillId - User skill ID
   * @param {Object} skillData - Updated skill data
   * @returns {Promise} - API response
   */
  updateUserSkill: async (userSkillId, skillData) => {
    return api.put(`/skills/user/${userSkillId}`, skillData)
      .then(response => response.data);
  },
  
  /**
   * Remove a skill from user's profile
   * @param {string} userSkillId - User skill ID
   * @returns {Promise} - API response
   */
  removeUserSkill: async (userSkillId) => {
    return api.delete(`/skills/user/${userSkillId}`).then(response => response.data);
  }
};

export default skillsService;