import { useState } from 'react';
import axios from '@/config/axios';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/notifications');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await axios.patch('/notifications/read-all');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark all notifications as read');
      throw err;
    }
  };

  const getUnreadCount = async () => {
    try {
      const response = await axios.get('/notifications/unread-count');
      return response.data.count;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get unread count');
      throw err;
    }
  };

  return {
    loading,
    error,
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
  };
};
