import axiosInstance from './axiosConfig';

const postApi = {
  createPost: async (postData) => {
    try {
      const formData = new FormData();
      // Kiểm tra xem postData có chứa media hay không (media = hình ảnh hoặc video)
      if (postData.media) {
        formData.append('media', postData.media);
      }
      formData.append('content', postData.content);
      formData.append('privacy', postData.privacy);

      const response = await axiosInstance.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, getFeed: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts/feed?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPosts: async (page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`/posts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPost: async (postId) => {
    try {
      const response = await axiosInstance.get(`/posts/${postId}`);
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
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPosts: async (username, page = 1, size = 10) => {
    try {
      const response = await axiosInstance.get(`/users/${username}/posts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default postApi;
