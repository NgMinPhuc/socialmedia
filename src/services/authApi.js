import axiosInstance from './axiosConfig';

const authApi = {
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async () => {
        try {
            const response = await axiosInstance.post('/auth/refresh-token');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authApi;
