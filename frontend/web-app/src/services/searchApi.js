import axiosInstance from './axiosConfig';

const searchApi = {
    search: async (searchParams) => {
        try {
            const queryParams = new URLSearchParams({
                query: searchParams.query,
                type: searchParams.type || 'all',
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                sortBy: searchParams.sortBy || 'createdAt',
                sortOrder: searchParams.sortOrder || 'desc'
            });

            const response = await axiosInstance.get(`/search?${queryParams}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    reindexData: async () => {
        try {
            const response = await axiosInstance.post('/search/reindex');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default searchApi;
