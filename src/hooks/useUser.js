import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { userService } from '@/services';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.updateProfile(userData);
      setUser(response.data);
      return response.data;
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
      const response = await userService.followUser(userId);
      return response.data;
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
      const response = await userService.unfollowUser(userId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to unfollow user');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getUserProfile = async (username) => {
    setLoading(true);
    try {
      const response = await userService.getUserProfile(username);
      return response.data;
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
