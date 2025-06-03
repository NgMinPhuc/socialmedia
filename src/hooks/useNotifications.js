import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/services';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  const fetchNotifications = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getNotifications(page, size);
      setNotifications(response.data || response);
      return response.data || response;
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
      return true;
    } catch (err) {
      setError(err.message || 'Failed to mark notification as read');
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setMarkingAsRead(true);
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      return true;
    } catch (err) {
      setError(err.message || 'Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', err);
      throw err;
    } finally {
      setMarkingAsRead(false);
    }
  }, []); const getUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.data?.count || response.count;
    } catch (err) {
      setError(err.message || 'Failed to get unread count');
      console.error('Error getting unread count:', err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    setLoading(true);
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete notification');
      console.error('Error deleting notification:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    setLoading(true);
    try {
      await notificationApi.deleteAllNotifications();
      setNotifications([]);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete all notifications');
      console.error('Error deleting all notifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions
  const getNotificationMessage = useCallback((notification) => {
    const { type, user: notifUser, post } = notification;

    switch (type) {
      case 'LIKE':
        return `${notifUser.fullName} liked your post`;
      case 'COMMENT':
        return `${notifUser.fullName} commented on your post`;
      case 'FOLLOW':
        return `${notifUser.fullName} started following you`;
      case 'MENTION':
        return `${notifUser.fullName} mentioned you in a post`;
      default:
        return 'New notification';
    }
  }, []);

  const getNotificationIcon = useCallback((type) => {
    switch (type) {
      case 'LIKE':
        return '❤️';
      case 'COMMENT':
        return '💬';
      case 'FOLLOW':
        return '👤';
      case 'MENTION':
        return '@';
      default:
        return '🔔';
    }
  }, []);

  const hasUnreadNotifications = notifications.some(n => !n.read);
  return {
    // State
    notifications,
    loading,
    error,
    markingAsRead,
    hasUnreadNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification,
    deleteAllNotifications,

    // Helpers
    getNotificationMessage,
    getNotificationIcon,
  };
};
