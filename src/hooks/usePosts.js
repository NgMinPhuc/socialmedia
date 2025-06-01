import { useState } from 'react';
import { postService } from '@/services';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postService.createPost(postData);
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
      const response = await postService.getPosts(params.page || 1, params.limit || 10);
      return {
        posts: response.data,
        hasMore: response.pagination ? response.pagination.page < response.pagination.totalPages : false
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getUserPosts = async (username) => {
    setLoading(true);
    try {
      const response = await postService.getUserPosts ?
        await postService.getUserPosts(username) :
        await postService.getPosts(1, 10); // Fallback for mock
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch user posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const likePost = async (postId) => {
    try {
      const response = await postService.likePost(postId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to like post');
      throw err;
    }
  };
  const unlikePost = async (postId) => {
    try {
      const response = await postService.unlikePost(postId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to unlike post');
      throw err;
    }
  };
  const commentOnPost = async (postId, content) => {
    setLoading(true);
    try {
      const response = await postService.addComment(postId, content);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to add comment');
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
  };
};
