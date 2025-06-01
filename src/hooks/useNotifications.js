import { useState } from 'react';
import { notificationService } from '@/services';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      throw err;
    }
  };
  const markAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      throw err;
    }
  };
  const getUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      return response.data.count;
    } catch (err) {
      setError(err.message || 'Failed to get unread count');
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
