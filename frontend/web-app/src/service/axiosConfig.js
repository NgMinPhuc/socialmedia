import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080'; // API Gateway URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                const response = await authService.refreshToken();
                const newToken = response.result?.accessToken;

                if (newToken) {
                    // Lưu token mới
                    localStorage.setItem('token', newToken);
                    
                    // Thêm token mới vào header
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    // Thử lại request ban đầu
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
            }

            // Nếu refresh token thất bại, xóa token và chuyển về trang login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
