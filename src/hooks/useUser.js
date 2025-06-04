import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { userApi } from '@/services';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Format data according to UserProfileUpdationRequest DTO
      const updateRequest = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        dob: userData.dob,
        phoneNumber: userData.phoneNumber,
        location: userData.location,
      }; const response = await userApi.updateUserProfile(updateRequest);

      // Handle UserProfileResponse DTO structure - userApi already returns data.result
      const updatedUser = {
        ...user,
        userId: response.userId,
        authenId: response.authenId,
        firstName: response.firstName,
        lastName: response.lastName,
        username: response.username,
        dob: response.dob,
        phoneNumber: response.phoneNumber,
        location: response.location,
        email: response.email,
      };

      setUser(updatedUser);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const followUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      // Show user-friendly message for unimplemented feature
      throw new Error('Follow functionality is not yet available. This feature will be added in a future update.');
    } catch (err) {
      const errorMessage = err.message || 'Failed to follow user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      // Show user-friendly message for unimplemented feature
      throw new Error('Unfollow functionality is not yet available. This feature will be added in a future update.');
    } catch (err) {
      const errorMessage = err.message || 'Failed to unfollow user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }; const getUserProfile = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getUserProfile(userId);
      // Handle UserProfileResponse DTO structure - response is already the result
      return {
        userId: response.userId,
        authenId: response.authenId,
        firstName: response.firstName,
        lastName: response.lastName,
        username: response.username,
        dob: response.dob,
        phoneNumber: response.phoneNumber,
        location: response.location,
        email: response.email,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get user profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getMyProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getMyProfile();
      // Handle UserProfileResponse DTO structure - response is already the result
      return {
        userId: response.userId,
        authenId: response.authenId,
        firstName: response.firstName,
        lastName: response.lastName,
        username: response.username,
        dob: response.dob,
        phoneNumber: response.phoneNumber,
        location: response.location,
        email: response.email,
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to get current user profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async (username) => {
    setLoading(true);
    setError(null);
    try {
      // Show user-friendly message for unimplemented feature
      throw new Error('Followers list functionality is not yet available. This feature will be added in a future update.');
    } catch (err) {
      const errorMessage = err.message || 'Failed to get followers';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFollowing = async (username) => {
    setLoading(true);
    setError(null);
    try {
      // Show user-friendly message for unimplemented feature
      throw new Error('Following list functionality is not yet available. This feature will be added in a future update.');
    } catch (err) {
      const errorMessage = err.message || 'Failed to get following list';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };



  return {
    user,
    loading,
    error,
    updateProfile,
    followUser,
    unfollowUser,
    getUserProfile,
    getMyProfile,
    getFollowers,
    getFollowing,
  };
};
