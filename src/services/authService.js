import axiosInstance from './axiosConfig';

const authService = {  // Login user with email/username and password
  login: async (emailOrUsername, password) => {
    try {
      const loginData = {
        identifier: emailOrUsername,
        password
      };

      const response = await axiosInstance.post('/auth/login', loginData);
      const data = response.data;

      if (data.authenticated && data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken || '');

        // Create user object from response data
        const userObj = {
          id: data.authenId,
          username: data.username,
          authenticated: data.authenticated
        };
        localStorage.setItem('user', JSON.stringify(userObj));
      }

      return {
        token: data.accessToken,
        user: {
          id: data.authenId,
          username: data.username,
          authenticated: data.authenticated
        },
        authenticated: data.authenticated
      };
    } catch (error) {
      throw error;
    }
  },  // Register user - returns user info without tokens (user needs to login separately)
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const data = response.data;

      // Register response only contains user info, no tokens
      // User will need to login separately after registration
      return {
        user: {
          id: data.authenId,
          username: data.username,
          authenticated: data.authenticated
        },
        authenticated: data.authenticated,
        message: 'Registration successful. Please login to continue.'
      };
    } catch (error) {
      throw error;
    }
  },  // Logout user
  logout: async () => {
    try {
      // Get tokens from localStorage to send to backend
      const accessToken = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      // Send tokens to backend for logout
      const response = await axiosInstance.post('/auth/logout', {
        accessToken: accessToken,
        refreshToken: refreshToken
      });

      // Handle the backend response DTO: {loggedOut: boolean, message: string}
      const { loggedOut, message } = response.data;

      if (loggedOut) {
        console.log('Logout successful:', message);
        return { success: true, message };
      } else {
        console.warn('Logout response indicated failure:', message);
        // Continue with local cleanup even if backend indicates failure
      }
    } catch (error) {
      // Continue logout even if API call fails
      console.warn('Logout API call failed:', error);
      return { success: false, error: error.message };
    } finally {
      // Always clear local data regardless of backend response
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }

    return { success: true, message: 'Logged out locally' };
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
  },  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/auth/refresh-token', {
        refreshToken: refreshToken
      });
      const data = response.data;

      // Handle response with new token format
      if (data.newAccessToken) {
        localStorage.setItem('token', data.newAccessToken);
        if (data.newRefreshToken) {
          localStorage.setItem('refreshToken', data.newRefreshToken);
        }
      }

      return {
        accessToken: data.newAccessToken,
        refreshToken: data.newRefreshToken,
        message: data.message
      };
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
