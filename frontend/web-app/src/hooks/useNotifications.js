import { useState } from 'react';
import { notificationApi } from '@/services';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHealth = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getHealth();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to check notification service health';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement when notification endpoints are available
  // const getNotifications = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await notificationApi.getNotifications();
  //     return response;
  //   } catch (err) {
  //     const errorMessage = err.message || 'Failed to fetch notifications';
  //     setError(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    loading,
    error,
    getHealth,
    // getNotifications,
    // markAsRead,
    // markAllAsRead,
    // getUnreadCount,
  };
};
