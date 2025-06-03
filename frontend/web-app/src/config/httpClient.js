import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '@/constants/apiEndpoints';
import { getToken, setToken, removeToken } from '@/services/localStorageToken';

const API_BASE_URL = API_CONFIG.API_GATEWAY_BASE_URL;

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 36000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

// --- Request Interceptor ---
httpClient.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest.url !== API_ENDPOINTS.AUTH_REFRESH_TOKEN && !originalRequest._retry) {
      originalRequest._retry = true;

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });

        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (refreshToken) {
            axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REFRESH_TOKEN}`, { refreshToken })
              .then(response => {
                const { newAccessToken, newRefreshToken } = response.data.result;
                setToken(newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                processQueue(null, newAccessToken);
                resolve(httpClient(originalRequest));
              })
              .catch(refreshError => {
                console.error('Failed to refresh token:', refreshError);
                removeToken();
                localStorage.removeItem('refreshToken');
                processQueue(refreshError, null);
                window.location.href = '/login';
                reject(refreshError);
              })
              .finally(() => { isRefreshing = false; });
          } else {
            removeToken();
            localStorage.removeItem('refreshToken');
            processQueue(new Error('No refresh token available.'), null);
            window.location.href = '/login';
            reject(new Error('No refresh token available.'));
          }
        }
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;
