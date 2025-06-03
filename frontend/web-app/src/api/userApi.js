import axiosClient from './axiosClient.js';

const userApi = {
    /**
     * Creates a new user profile.
     * @param {object} data - User profile creation request data.
     * @returns {Promise} Axios response.
     */
    createUserProfile: (data) => {
        return axiosClient.post('/users/create', data);
    },

    /**
     * Updates an existing user profile.
     * @param {object} data - User profile update request data.
     * @returns {Promise} Axios response.
     */
    updateUserProfile: (data) => {
        return axiosClient.put('/users/update', data);
    },

    /**
     * Retrieves the profile of the currently authenticated user.
     * @returns {Promise} Axios response.
     */
    getMyProfile: () => {
        return axiosClient.get('/users/me');
    },
};

export default userApi;