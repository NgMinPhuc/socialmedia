export const API_CONFIG = {
  API_GATEWAY_BASE_URL: "http://localhost:8080/api/v1",
};

export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login", //post
  AUTH_REGISTER: "/auth/register", //post
  AUTH_VALIDATE_TOKEN: "/auth/validateToken", //post
  AUTH_CHANGE_PASSWORD: "/auth/changePassword", //post

  POST_CREATE: "/posts/create", //post
  POST_UPDATE: (postId) => `/posts/update/${postId}`, //put
  POST_GET_ALL: "/posts/all", //get
  POST_GET_MY: "/posts/me",  //get
  POST_DELETE: (postId) => `/posts/delete/${postId}`, //delete

  USER_PROFILE_UPDATE: "/users/update", //put
  USER_PROFILE_GET: (userId) => `/users/${userId}`, //get
};