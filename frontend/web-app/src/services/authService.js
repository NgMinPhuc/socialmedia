import axiosInstance from './axiosConfig';

const authService = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                username: credentials.username,
                password: credentials.password
            });
            
            if (response.data.code === 200) {
                const { accessToken, refreshToken, username } = response.data.result;
                
                // Nếu rememberMe = true, lưu vào localStorage, ngược lại lưu vào sessionStorage
                const storage = credentials.rememberMe ? localStorage : sessionStorage;
                
                storage.setItem('accessToken', accessToken);
                storage.setItem('refreshToken', refreshToken);
                storage.setItem('username', username);
                
                // Nếu có rememberMe, xóa dữ liệu cũ trong storage khác
                if (credentials.rememberMe) {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    sessionStorage.removeItem('username');
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                }
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                dob: userData.dob,
                phoneNumber: userData.phoneNumber
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
            if (refreshToken) {
                await axiosInstance.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Remove data from both localStorage and sessionStorage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('username');
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await axiosInstance.post('/auth/changePassword', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            
            const response = await axiosInstance.post('/auth/refreshToken', {
                refreshToken
            });
            
            if (response.data.code === 200) {
                const { accessToken } = response.data.result;
                // Save new token to the same storage where refresh token exists
                const storage = localStorage.getItem('refreshToken') ? localStorage : sessionStorage;
                storage.setItem('accessToken', accessToken);
                return accessToken;
            }
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    isAuthenticated: () => {
        return !!(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'));
    },

    getCurrentUser: () => {
        return localStorage.getItem('username') || sessionStorage.getItem('username');
    },

    getAccessToken: () => {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    }
};

export default authService;
