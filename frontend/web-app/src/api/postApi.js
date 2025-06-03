import axiosClient from './axiosClient.js';

const postApi = {
    /**
     * Creates a new post.
     * @param {object} data - Post creation request data (caption, mediaUrls, privacy).
     * @returns {Promise} Axios response.
     */
    createPost: (data) => {
        return axiosClient.post('/posts/create', data);
    },

    /**
     * Updates an existing post.
     * @param {string} postId - The ID of the post to update (from the path variable).
     * @param {object} data - Post update request data (postId, caption, mediaUrls, privacy).
     * @returns {Promise} Axios response.
     */
    updatePost: (postId, data) => {
        return axiosClient.put(`/posts/update/${postId}`, data);
    },

    /**
     * Retrieves a single post by its ID.
     * IMPORTANT: The backend's @GetMapping("/{postId}") also expects a @RequestBody.
     * This is unconventional for GET, but the implementation matches your backend.
     * @param {string} postId - The ID of the post to retrieve.
     * @returns {Promise} Axios response.
     */
    getPostById: (postId) => {
        return axiosClient.get(`/posts/${postId}`, { data: { postId: postId } });
    },

    /**
     * Retrieves posts created by the currently authenticated user with pagination.
     * @param {object} params - Optional pagination parameters (e.g., `{ page: 0, size: 10, sort: 'createdAt,desc' }`).
     * @returns {Promise} Axios response.
     */
    getMyPosts: (params) => {
        return axiosClient.get('/posts/me', { params });
    },

    /**
     * Retrieves all posts with pagination.
     * @param {object} params - Optional pagination parameters (e.g., `{ page: 0, size: 10, sort: 'createdAt,desc' }`).
     * @returns {Promise} Axios response.
     */
    getAllPosts: (params) => {
        return axiosClient.get('/posts/all', { params });
    },

    /**
     * Deletes a post by its ID.
     * IMPORTANT: The backend's @DeleteMapping("/delete/{postId}") also expects a @RequestBody.
     * This is unconventional for DELETE, but the implementation matches your backend.
     * @param {string} postId - The ID of the post to delete.
     * @returns {Promise} Axios response.
     */
    deletePost: (postId) => {
        return axiosClient.delete(`/posts/delete/${postId}`, { data: { postId: postId } });
    },
};

export default postApi;