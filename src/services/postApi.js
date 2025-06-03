import axiosInstance from './axiosConfig';

const postApi = {
  createPost: async (postData) => {
    try {
      // Prepare request data to match backend DTO: {caption, mediaUrls, privacy}
      const requestData = {
        caption: postData.caption || postData.content, // Support both field names for backward compatibility
        mediaUrls: postData.mediaUrls || [], // List of media URLs
        privacy: postData.privacy || 'public' // Default to public if not specified
      };

      const response = await axiosInstance.post('/posts', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, getFeed: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts/feed?page=${page}&size=${size}`);
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPosts: async (page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}&size=${size}`);
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPost: async (postId) => {
    try {
      const requestData = {
        postId: postId
      };

      const response = await axiosInstance.post('/posts/get', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePost: async (postData) => {
    try {
      // Prepare request data to match backend DTO: {postId, caption, mediaUrls, privacy}
      const requestData = {
        postId: postData.postId,
        caption: postData.caption,
        mediaUrls: postData.mediaUrls || [],
        privacy: postData.privacy || 'public'
      };

      const response = await axiosInstance.put('/posts', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
    } catch (error) {
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/unlike`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getComments: async (postId, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}/comments?page=${page}&size=${size}`);
      // Handle paginated response if backend returns similar format for comments
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPosts: async (username, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`/users/${username}/posts?page=${page}&size=${size}`);
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default postApi;
