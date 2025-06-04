import httpClient from '@/config/httpClient';
import { API_ENDPOINTS } from '@/config/apiEndpoint';

const userService = {
  async getUserProfile(userId) {
    try {
      const { data } = await httpClient.get(API_ENDPOINTS.USER_PROFILE_GET(userId));
      return data.result;
    } catch (error) {
      console.error(`Error fetching user profile for ID ${userId}:`, error);
      throw error;
    }
  },

  async updateUserProfile(profileData) {
    try {
      const { data } = await httpClient.put(API_ENDPOINTS.USER_PROFILE_UPDATE, profileData);
      return data.result;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

export default userService;