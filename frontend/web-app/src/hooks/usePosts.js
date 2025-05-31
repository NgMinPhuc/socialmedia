import { useState } from 'react';
import { postApi, commentApi } from '@/services';

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
      const errorMessage = err.message || 'Failed to create post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await postApi.getPosts(params);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch posts';
      setError(errorMessage);
      throw new Error(errorMessage);
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
      const errorMessage = err.message || 'Failed to fetch post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.updatePost(postId, postData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.deletePost(postId);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete post';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Comment operations
  const createComment = async (commentData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentApi.createComment(commentData);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getComments = async (postId, params = {}) => {
    setLoading(true);
    try {
      const response = await commentApi.getComments(postId, params);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch comments';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId, content) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentApi.updateComment(commentId, content);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentApi.deleteComment(commentId);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
    createComment,
    getComments,
    updateComment,
    deleteComment,
  };
};
