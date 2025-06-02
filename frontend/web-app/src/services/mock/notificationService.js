import { mockNotifications } from '../../mock/data/notifications';

const notificationService = {
  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockNotifications;
  },

  markAsRead: async (notificationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return notification;
  },

  markAllAsRead: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockNotifications.forEach(notification => {
      notification.read = true;
    });
    return { success: true };
  },

  getUnreadCount: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockNotifications.filter(n => !n.read).length;
  }
};

export default notificationService; 