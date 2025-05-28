import axiosInstance from './axiosConfig';

const notificationApi = {
    getNotifications: async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/notifications?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAsRead: async (notificationId) => {
        try {
            const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await axiosInstance.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default notificationApi;
