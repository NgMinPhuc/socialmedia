import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { userApi } from '@/services';

export const useUser = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.createUserProfile(userData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.updateUserProfile(userData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = err.message || 'Failed to get user profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyProfile();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (userId, avatarFile) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.uploadAvatar(userId, avatarFile);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserAvatar = async (userId) => {
    setLoading(true);
    try {
      const avatarUrl = await userApi.getUserAvatar(userId);
      return avatarUrl;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get avatar';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    createUserProfile,
    updateUserProfile,
    getUserProfile,
    getMyProfile,
    uploadAvatar,
    getUserAvatar,
  };
};
