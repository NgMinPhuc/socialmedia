import axiosInstance from './axiosConfig';

const authService = {
  // Login user and store token
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register user and store token
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      // Tiếp tục logout ngay cả khi API call thất bại
      console.warn('Logout API call failed:', error);
    } finally {
      // Luôn xóa dữ liệu local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userString = localStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },  
  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token');
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
