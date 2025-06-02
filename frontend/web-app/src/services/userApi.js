import axiosInstance from './axiosConfig';

const API_PREFIX = '/api/v1';

const userApi = {
    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/me`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put(`${API_PREFIX}/users/profile`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await axiosInstance.post(`${API_PREFIX}/users/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUser: async (userId) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    followUser: async (userId) => {
        try {
            const response = await axiosInstance.post(`${API_PREFIX}/users/follow/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    unfollowUser: async (userId) => {
        try {
            const response = await axiosInstance.post(`${API_PREFIX}/users/unfollow/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserByUsername: async (username) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/username/${username}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFollowers: async (username) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/${username}/followers`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFollowing: async (username) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/${username}/following`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserPosts: async (username) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/${username}/posts`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSettings: async (settingsData) => {
        try {
            const response = await axiosInstance.put(`${API_PREFIX}/users/settings`, settingsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.put(`${API_PREFIX}/users/password`, passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAccount: async () => {
        try {
            const response = await axiosInstance.delete(`${API_PREFIX}/users/account`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/all`);
            return response.data;
        } catch (error) {
            console.error('Get all users error:', error);
            throw error;
        }
    },

    getUserAvatar: async (userId) => {
        try {
            const response = await axiosInstance.get(`${API_PREFIX}/users/${userId}/avatar`, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error('Get user avatar error:', error);
            throw error;
        }
    }
};

export default userApi;
