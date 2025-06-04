import axiosInstance from './axiosConfig';

const searchApi = {
    searchUsers: async (query, page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/search/users?query=${query}&page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    searchPosts: async (query, page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get(`/search/posts?query=${query}&page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default searchApi;
