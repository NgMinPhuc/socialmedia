import axiosInstance from './axiosConfig';

const notificationApi = {
    // Currently only health endpoint is available
    getHealth: async () => {
        try {
            const response = await axiosInstance.get('/notifications/health');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }

    // TODO: Implement when notification endpoints are available
    // getNotifications: async (params = {}) => {},
    // markAsRead: async (notificationId) => {},
    // markAllAsRead: async () => {}
};

export default notificationApi;
