// src/services/postService.js

import httpClient from '@/config/httpClient';
import { API_ENDPOINTS } from '@/config/apiEndpoint';

const postService = {
  /**
   * Lấy tất cả bài viết.
   * BE: GET /posts/all (không @AuthenticationPrincipal)
   * @returns {Promise<Array>} Danh sách bài viết.
   */
  getAllPosts: async () => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.POST_GET_ALL);
      return response.data.result; // Giả định BE trả về ApiResponse<PostListResponse> với danh sách posts trong 'result'
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  },

  /**
   * Tạo bài viết mới.
   * BE: POST /posts/create (có @AuthenticationPrincipal)
   * @param {Object} postData - Dữ liệu bài viết cần tạo (title, content, etc.).
   * @returns {Promise<Object>} Bài viết vừa được tạo.
   */
  createPost: async (postData) => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.POST_CREATE, postData);
      return response.data.result;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Cập nhật bài viết hiện có.
   * BE: PUT /posts/update/{postId} (có @AuthenticationPrincipal)
   * @param {string} postId - ID của bài viết cần cập nhật.
   * @param {Object} postData - Dữ liệu cập nhật cho bài viết.
   * @returns {Promise<Object>} Bài viết đã được cập nhật.
   */
  updatePost: async (postId, postData) => {
    try {
      const response = await httpClient.put(API_ENDPOINTS.POST_UPDATE(postId), postData);
      return response.data.result;
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa bài viết.
   * BE: DELETE /posts/delete/{postId} (có @AuthenticationPrincipal)
   * @param {string} postId - ID của bài viết cần xóa.
   * @returns {Promise<void>}
   */
  deletePost: async (postId) => {
    try {
      const response = await httpClient.delete(API_ENDPOINTS.POST_DELETE(postId));
      return response.data.result; // Hoặc `response.data` nếu BE trả về một thông báo đơn giản
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy các bài viết của người dùng hiện tại.
   * BE: GET /posts/me (có @AuthenticationPrincipal)
   * @returns {Promise<Array>} Danh sách bài viết của người dùng hiện tại.
   */
  getMyPosts: async () => {
    try {
      // Lưu ý: Đã sửa GET_MY_POST_POST thành GET_MY_POST (trong apiEndpoints.js)
      const response = await httpClient.get(API_ENDPOINTS.POST_GET_MY);
      return response.data.result;
    } catch (error) {
      console.error('Error fetching current user posts:', error);
      throw error;
    }
  }
};

export default postService;