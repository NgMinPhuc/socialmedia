import axiosClient from './axiosClient.js';

const authenApi = {
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },
    register: (data) => {
        return axiosClient.post('/auth/register', data);
    },
    refreshToken: (data) => {
        return axiosClient.post('/auth/refreshToken', data);
    },
    logout: (data) => {
        return axiosClient.post('/auth/logout', data);
    },
    validateToken: (data) => {
        return axiosClient.post('/auth/validateToken', data);
    },
    changePassword: (data) => {
        // Note: The backend `changePassword` endpoint expects a `User` object
        // and a request body. Assuming `authenClient` already sends the token,
        // you might only need to send the request body. If `User` object is
        // derived from the token, you don't need to pass it explicitly here.
        return axiosClient.post('/auth/changePassword', data);
    },
};

export default authenApi;