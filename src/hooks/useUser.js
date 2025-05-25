import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import axios from '@/config/axios';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/users/${user.id}`, userData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post(`/users/${userId}/follow`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to follow user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unfollow user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(`/users/${username}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get user profile');
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
