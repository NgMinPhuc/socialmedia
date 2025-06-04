import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { userApi } from '@/services';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Only updateProfile and getUserProfile are available here
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.updateUserProfile(userData);
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const followUser = async (userId) => {
    setLoading(true);
    try {
      // This feature is not implemented in the backend yet
      throw new Error('Follow feature is not yet implemented. Backend API endpoint needed.');
    } catch (err) {
      setError(err.message || 'Failed to follow user');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const unfollowUser = async (userId) => {
    setLoading(true);
    try {
      // This feature is not implemented in the backend yet
      throw new Error('Unfollow feature is not yet implemented. Backend API endpoint needed.');
    } catch (err) {
      setError(err.message || 'Failed to unfollow user');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getUserProfile = async (userId) => {
    setLoading(true);
    try {
      const response = await userApi.getUserProfile(userId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to get user profile');
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
  };
};
