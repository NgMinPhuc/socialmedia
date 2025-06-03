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
  }; const getPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await postApi.getPosts(params.page || 1, params.size || 10);
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return {
        posts: response.posts || [],
        hasMore: !response.last,
        pagination: {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last
        }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  }; const getUserPosts = async (username, page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await postApi.getUserPosts(username, page + 1, size); // Convert to 1-based for API
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return {
        posts: response.posts || [],
        hasMore: !response.last,
        pagination: {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last
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
      const response = await postApi.likePost(postId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to like post');
      throw err;
    }
  };
  const unlikePost = async (postId) => {
    try {
      const response = await postApi.unlikePost(postId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to unlike post');
      throw err;
    }
  }; const commentOnPost = async (postId, content) => {
    setLoading(true);
    try {
      const response = await postApi.addComment(postId, content);
      return response;
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
      const response = await postApi.getFeed(page, size);
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      return {
        posts: response.posts || [],
        hasMore: !response.last,
        pagination: {
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last
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
      const response = await postApi.getPost(postId);
      return response;
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
      const response = await postApi.getComments(postId, page, size);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch comments');
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
  };
};
