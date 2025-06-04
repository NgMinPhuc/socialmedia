import { useState } from 'react';
import { postApi } from '@/services';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure postData matches CreatePostRequest DTO
      const requestData = {
        caption: postData.caption || '',
        mediaUrls: postData.mediaUrls || [],
        privacy: postData.privacy || 'public'
      };
      const response = await postApi.createPost(requestData);
      // Backend returns PostResponse DTO
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
      const response = await postApi.getAllPosts(); // Use getAllPosts instead of getPosts
      // Handle PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      // Each post in the array follows PostResponse DTO structure
      return {
        posts: response.posts || response || [], // Handle both array and object response
        hasMore: response.last ? !response.last : false,
        pagination: {
          page: response.page || 0,
          size: response.size || 10,
          totalElements: response.totalElements || (response.posts?.length || 0),
          totalPages: response.totalPages || 1,
          last: response.last || true
        }
      };
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };// Get current user's posts (using /posts/me endpoint)
  const getMyPosts = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await postApi.getMyPosts();
      // Backend returns PostListResponse DTO: {posts, page, size, totalElements, totalPages, last}
      // Each post follows PostResponse DTO structure
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
      setError(err.message || 'Failed to fetch my posts');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // For backward compatibility - this will only work for current user
  // Since backend only supports /posts/me, we ignore the username parameter
  const getUserPosts = async (username, page = 0, size = 10) => {
    console.warn('getUserPosts: Backend only supports current user posts. Using getMyPosts instead.');
    return getMyPosts(page, size);
  }; const likePost = async (postId) => {
    console.warn('likePost: Backend endpoint not implemented yet');
    // TODO: Implement when backend adds like/unlike endpoints
    throw new Error('Like functionality not implemented in backend');
  };

  const unlikePost = async (postId) => {
    console.warn('unlikePost: Backend endpoint not implemented yet');
    // TODO: Implement when backend adds like/unlike endpoints
    throw new Error('Unlike functionality not implemented in backend');
  };

  const commentOnPost = async (postId, content) => {
    console.warn('commentOnPost: Backend comment endpoint not implemented yet');
    // TODO: Implement when backend adds comment endpoints
    throw new Error('Comment functionality not implemented in backend');
  }; const getFeed = async (page = 0, size = 10) => {
    console.warn('getFeed: Using getAllPosts since dedicated feed endpoint not available');
    // Use getAllPosts as fallback for feed functionality
    return getPosts({ page, size });
  };

  const getPost = async (postId) => {
    console.warn('getPost: Single post endpoint not implemented yet');
    // TODO: Implement when backend adds single post endpoint
    throw new Error('Single post fetch not implemented in backend');
  }; const deletePost = async (postId) => {
    setLoading(true);
    try {
      // Backend expects GetPostByPostIdRequest in body for DELETE
      const response = await postApi.deletePost(postId);
      // Backend returns PostDeleteResponse: {isSuccess, message}
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, postData) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure postData matches UpdatePostRequest DTO
      const requestData = {
        postId: postId,
        caption: postData.caption || '',
        mediaUrls: postData.mediaUrls || [],
        privacy: postData.privacy || 'public'
      };
      const response = await postApi.updatePost(postId, requestData);
      // Backend returns PostResponse DTO
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getComments = async (postId, page = 0, size = 10) => {
    console.warn('getComments: Comment endpoint not implemented yet');
    // TODO: Implement when backend adds comment endpoints
    throw new Error('Comment functionality not implemented in backend');
  }; return {
    loading,
    error,
    createPost,
    updatePost,
    getPosts,
    getUserPosts,
    getMyPosts, // Add explicit getMyPosts method
    likePost,
    unlikePost,
    commentOnPost,
    getFeed,
    getPost,
    deletePost,
    getComments,
  };
};
