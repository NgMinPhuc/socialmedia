import { useState } from 'react';
import { postApi } from '@/services';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.createPost(postData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await postApi.getAllPosts();
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      // Each post in the posts array follows PostResponse DTO structure
      return {
        posts: response?.posts || [],
        hasMore: !response?.last,
        pagination: {
          page: response?.page || 0,
          size: response?.size || 0,
          totalElements: response?.totalElements || 0,
          totalPages: response?.totalPages || 1,
          last: response?.last || true
        }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getUserPosts = async (username, page = 0, size = 10) => {
    setLoading(true);
    try {
      // Use getMyPosts for current user's posts since getUserPosts doesn't exist in API
      const response = await postApi.getMyPosts();
      // Handle array of PostResponse DTOs directly
      return {
        posts: response || [],
        hasMore: false, // getMyPosts doesn't support pagination yet
        pagination: {
          page: 0,
          size: response?.length || 0,
          totalElements: response?.length || 0,
          totalPages: 1,
          last: true
        }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch user posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      // This feature is not implemented in the backend yet
      console.warn('Like feature is not yet implemented. Backend API endpoint needed.');
      // Return mock response to prevent UI errors
      return { liked: true, likesCount: 0 };
    } catch (err) {
      setError(err.message || 'Failed to like post');
      throw err;
    }
  };

  const unlikePost = async (postId) => {
    try {
      // This feature is not implemented in the backend yet
      console.warn('Unlike feature is not yet implemented. Backend API endpoint needed.');
      // Return mock response to prevent UI errors
      return { liked: false, likesCount: 0 };
    } catch (err) {
      setError(err.message || 'Failed to unlike post');
      throw err;
    }
  };

  const commentOnPost = async (postId, content) => {
    setLoading(true);
    try {
      // This feature is not implemented in the backend yet
      console.warn('Comment feature is not yet implemented. Backend API endpoint needed.');
      // Return mock response to prevent UI errors
      return {
        id: Date.now(),
        content,
        author: { name: 'You' },
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getFeed = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      // Use getAllPosts as feed since getFeed doesn't exist in API
      const response = await postApi.getAllPosts();
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return {
        posts: response?.posts || [],
        hasMore: !response?.last,
        pagination: {
          page: response?.page || 0,
          size: response?.size || 0,
          totalElements: response?.totalElements || 0,
          totalPages: response?.totalPages || 1,
          last: response?.last || true
        }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch feed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPost = async (postId) => {
    setLoading(true);
    try {
      // This feature is not implemented in the backend yet
      console.warn('Get single post feature is not yet implemented. Backend API endpoint needed.');
      // Return mock response to prevent UI errors
      return {
        id: postId,
        title: 'Post not available',
        content: 'Single post retrieval is not yet implemented.',
        author: { name: 'Unknown' }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    setLoading(true);
    try {
      await postApi.deletePost(postId);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (postId, page = 0, size = 10) => {
    setLoading(true);
    try {
      // This feature is not implemented in the backend yet
      console.warn('Get comments feature is not yet implemented. Backend API endpoint needed.');
      // Return empty array to prevent UI errors
      return [];
    } catch (err) {
      setError(err.message || 'Failed to fetch comments');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    setLoading(true);
    try {
      const response = await postApi.updatePost(postId, postData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPost,
    getPosts,
    getUserPosts,
    likePost,
    unlikePost,
    commentOnPost,
    getFeed,
    getPost,
    deletePost,
    getComments,
    updatePost,
  };
};
