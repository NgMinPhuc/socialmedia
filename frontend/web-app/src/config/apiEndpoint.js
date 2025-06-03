// src/constants/apiEndpoints.js

export const API_CONFIG = {
  API_GATEWAY_BASE_URL: "http://localhost:8080/api/v1",
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login", //post
  AUTH_REGISTER: "/auth/register", //post
  AUTH_VALIDATE_TOKEN: "/auth/validateToken", //post
  AUTH_CHANGE_PASSWORD: "/auth/changePassword", //post

  CREATE_POST: "/posts/create", //post
  UPDATE_POST: (postId) => `/posts/update/${postId}`, //put
  GET_ALL_POST: "/posts/all", //get
  GET_MY_POST_POST: "/posts/me",  //get
  DELETE_POST: (postId) => `/posts/delete/${postId}`, //delete

  USER_PROFILE_UPDATE: "/users/update", //put
  USER_PROFILE_GET: (userId) => `/users/${userId}`, //get
};