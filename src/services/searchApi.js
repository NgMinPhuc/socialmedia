import axiosInstance from './axiosConfig';

const searchApi = {
  // Comprehensive search that returns SearchResponse DTO with both users and posts
  search: async (query, type = 'all', page = 0, size = 10, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
      const response = await axiosInstance.get('/search', {
        params: {
          query,
          type,
          page,
          size,
          sortBy,
          sortOrder
        }
      });

      // Handle ApiResponse<SearchResponse> wrapper
      const apiResponse = response.data;
      if (apiResponse.code === 200 && apiResponse.result) {
        return apiResponse.result; // Return SearchResponse DTO directly
      } else {
        throw new Error(apiResponse.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Legacy methods for backward compatibility (now use comprehensive search)
  searchUsers: async (query, page = 0, size = 10) => {
    try {
      const searchResponse = await searchApi.search(query, 'users', page, size);
      // Return users array from SearchResponse DTO
      return searchResponse.users || [];
    } catch (error) {
      throw error;
    }
  },

  searchPosts: async (query, page = 0, size = 10) => {
    try {
      const searchResponse = await searchApi.search(query, 'posts', page, size);
      // Return posts array from SearchResponse DTO
      return searchResponse.posts || [];
    } catch (error) {
      throw error;
    }
  }
};

export default searchApi;
