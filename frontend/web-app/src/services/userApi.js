import axiosInstance from './axiosConfig';

const userApi = {
    createUserProfile: async (userData) => {
        try {
            const response = await axiosInstance.post('/users/create', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateUserProfile: async (userData) => {
        try {
            const response = await axiosInstance.put('/users/update', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserProfile: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getMyProfile: async () => {
        try {
            const response = await axiosInstance.get('/users/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    uploadAvatar: async (userId, avatarFile) => {
        try {
            const formData = new FormData();
            formData.append('userId', userId);
            formData.append('avatar', avatarFile);

            const response = await axiosInstance.post('/users/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUserAvatar: async (userId) => {
        try {
            const response = await axiosInstance.get(`/users/${userId}/avatar`, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default userApi;
