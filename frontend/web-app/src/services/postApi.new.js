import axiosInstance from './axiosConfig';

const postApi = {
    createPost: async (postData) => {
        try {
            const formData = new FormData();
            formData.append('userId', postData.userId);
            formData.append('caption', postData.caption);
            formData.append('privacy', postData.privacy || 'public');
            
            // Handle multiple files
            if (postData.files && postData.files.length > 0) {
                postData.files.forEach(file => {
                    formData.append('files', file);
                });
            }
            
            // Handle content types
            if (postData.contentTypes && postData.contentTypes.length > 0) {
                postData.contentTypes.forEach(type => {
                    formData.append('contentTypes', type);
                });
            }

            const response = await axiosInstance.post('/api/v1/feed/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPosts: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams({
                page: params.page || 0,
                size: params.size || 10,
                sortBy: params.sortBy || 'createdAt',
                sortDirection: params.sortDirection || 'desc'
            });
            
            if (params.userId) {
                queryParams.append('userId', params.userId);
            }

            const response = await axiosInstance.get(`/api/v1/feed/posts?${queryParams}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getPost: async (postId) => {
        try {
            const response = await axiosInstance.get(`/api/v1/feed/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updatePost: async (postId, postData) => {
        try {
            const response = await axiosInstance.put(`/api/v1/feed/posts/${postId}`, {
                caption: postData.caption,
                files: postData.files,
                contentTypes: postData.contentTypes,
                privacy: postData.privacy
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deletePost: async (postId) => {
        try {
            const response = await axiosInstance.delete(`/api/v1/feed/posts/${postId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default postApi;
