import axiosInstance from './axiosConfig';

const commentApi = {
    createComment: async (commentData) => {
        try {
            const response = await axiosInstance.post('/comments', {
                postId: commentData.postId,
                userId: commentData.userId,
                content: commentData.content
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getComments: async (postId, params = {}) => {
        try {
            const queryParams = new URLSearchParams({
                page: params.page || 0,
                size: params.size || 10,
                sortBy: params.sortBy || 'createdAt',
                sortDirection: params.sortDirection || 'desc'
            });

            const response = await axiosInstance.get(`/comments/${postId}?${queryParams}`, {
                data: { postId } // Adding the request body as required by backend
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    updateComment: async (commentId, content) => {
        try {
            const response = await axiosInstance.put(`/comments/${commentId}`, {
                commentId,
                content
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            const response = await axiosInstance.delete(`/comments/${commentId}`, {
                data: { commentId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default commentApi;
