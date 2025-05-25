import { useState } from 'react';
import axios from '@/config/axios';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(postData).forEach(key => {
        formData.append(key, postData[key]);
      });
      
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('/posts', { params });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserPosts = async (username) => {
    setLoading(true);
    try {
      const response = await axios.get(`/users/${username}/posts`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId) => {
    try {
      const response = await axios.post(`/posts/${postId}/like`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like post');
      throw err;
    }
  };

  const unlikePost = async (postId) => {
    try {
      const response = await axios.delete(`/posts/${postId}/like`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlike post');
      throw err;
    }
  };

  const commentOnPost = async (postId, content) => {
    setLoading(true);
    try {
      const response = await axios.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
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
