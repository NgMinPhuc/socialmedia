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
    }
};

export default userApi;
