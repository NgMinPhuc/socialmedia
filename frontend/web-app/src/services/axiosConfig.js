import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // API Gateway base URL
    timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                
                const response = await axios.post('http://localhost:8080/api/v1/auth/refreshToken', {
                    refreshToken
                });
                
                const { accessToken } = response.data.result;
                // Lưu token mới vào cùng storage nơi có refresh token
                const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
                storage.setItem('accessToken', accessToken);
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Xóa tất cả tokens từ cả localStorage và sessionStorage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('username');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                sessionStorage.removeItem('username');
                
                // Let React Router handle the redirect
                return Promise.reject(new Error('Authentication failed'));
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;
