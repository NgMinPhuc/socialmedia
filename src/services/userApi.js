import axiosInstance from './axiosConfig';

const userApi = {
    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get('/users/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/users/profile', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const response = await axiosInstance.post('/users/avatar', formData, {
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
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    followUser: async (userId) => {
        try {
            const response = await axiosInstance.post(`/users/follow/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    unfollowUser: async (userId) => {
        try {
            const response = await axiosInstance.post(`/users/unfollow/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserByUsername: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/username/${username}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFollowers: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/${username}/followers`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFollowing: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/${username}/following`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserPosts: async (username) => {
        try {
            const response = await axiosInstance.get(`/users/${username}/posts`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSettings: async (settingsData) => {
        try {
            const response = await axiosInstance.put('/users/settings', settingsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.put('/users/password', passwordData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAccount: async () => {
        try {
            const response = await axiosInstance.delete('/users/account');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userApi;
