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
  async getMyProfile() {
    try {
      const { data } = await httpClient.get(API_ENDPOINTS.USER_PROFILE_GET_MY);
      return data.result;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
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

  // Placeholder methods for unimplemented backend features
  async followUser(userId) {
    console.warn('followUser: Backend endpoint not implemented yet');
    throw new Error('Follow functionality not implemented in backend');
  },

  async unfollowUser(userId) {
    console.warn('unfollowUser: Backend endpoint not implemented yet');
    throw new Error('Unfollow functionality not implemented in backend');
  },

  async getFollowers(username) {
    console.warn('getFollowers: Backend endpoint not implemented yet');
    throw new Error('Get followers functionality not implemented in backend');
  },

  async getFollowing(username) {
    console.warn('getFollowing: Backend endpoint not implemented yet');
    throw new Error('Get following functionality not implemented in backend');
  },
};

export default userService;