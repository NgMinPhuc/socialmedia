import axiosInstance from './axiosConfig';

const API_PREFIX = '/api/v1';

const authService = {
  // Login user and store token
  login: async (usernameOrEmail, password) => {
    try {
      // Check hardcoded credentials first
      const hardcodedUser = {
        username: 'Nguyen',
        email: 'itcsiu22225@student.hcmiu.edu.vn',
        password: 'password'
      };

      // Check if credentials match hardcoded values
      if ((usernameOrEmail === hardcodedUser.username || usernameOrEmail === hardcodedUser.email) 
          && password === hardcodedUser.password) {
        // Create fake response data
        const fakeResponse = {
          code: 200,
          result: {
            accessToken: 'fake-jwt-token',
            refreshToken: 'fake-refresh-token',
            user: {
              username: hardcodedUser.username,
              email: hardcodedUser.email,
              firstName: 'Nguyen',
              lastName: 'User'
            }
          }
        };

        // Store in localStorage
        localStorage.setItem('token', fakeResponse.result.accessToken);
        localStorage.setItem('refreshToken', fakeResponse.result.refreshToken);
        localStorage.setItem('user', JSON.stringify(fakeResponse.result.user));

        return fakeResponse;
      }

      // If not matching hardcoded credentials, proceed with normal login
      const isEmail = usernameOrEmail.includes('@');
      const loginData = isEmail 
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };

      console.log('Login request data:', loginData);

      const response = await axiosInstance.post(`${API_PREFIX}/auth/login`, loginData);
      console.log('Login response:', response.data);

      const data = response.data;
      
      // Kiểm tra response format
      if (data.code === 200 && data.result?.accessToken) {
        // Store in localStorage
        localStorage.setItem('token', data.result.accessToken);
        if (data.result.refreshToken) {
          localStorage.setItem('refreshToken', data.result.refreshToken);
        }
        if (data.result.user) {
          localStorage.setItem('user', JSON.stringify(data.result.user));
        }
        return data;
      } else {
        throw new Error(data.message || 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  // Register user and store token
  register: async (userData) => {
    try {
      // Validate required fields
      const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 'dob', 'phoneNumber', 'location'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate password match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = userData;

      const response = await axiosInstance.post(`${API_PREFIX}/auth/register`, registerData);
      const data = response.data;
      
      // Kiểm tra response format
      if (data.code === 200 && data.result) {
        // Sau khi register thành công, tự động login
        const loginResponse = await this.login(userData.username, userData.password);
        // Lưu token và user data vào localStorage
        if (loginResponse.result?.accessToken) {
          localStorage.setItem('token', loginResponse.result.accessToken);
          if (loginResponse.result.refreshToken) {
            localStorage.setItem('refreshToken', loginResponse.result.refreshToken);
          }
          if (loginResponse.result.user) {
            localStorage.setItem('user', JSON.stringify(loginResponse.result.user));
          }
        }
        return loginResponse;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error.response?.data || error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post(`${API_PREFIX}/auth/logout`);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
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
      const response = await axiosInstance.post(`${API_PREFIX}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to process forgot password request');
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post(`${API_PREFIX}/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to reset password');
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post(`${API_PREFIX}/auth/refresh-token`, {
        refreshToken
      });
      
      const data = response.data;
      
      if (data.code === 200 && data.result?.accessToken) {
        localStorage.setItem('token', data.result.accessToken);
        if (data.result.refreshToken) {
          localStorage.setItem('refreshToken', data.result.refreshToken);
        }
        return data;
      } else {
        throw new Error(data.message || 'Invalid refresh token response');
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      // Xóa token khi refresh thất bại
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { valid: false };
      }

      const response = await axiosInstance.post(`${API_PREFIX}/auth/validate-token`);
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  // Check if token is expired
  isTokenExpired: () => {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post(`${API_PREFIX}/auth/changePassword`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to change password');
    }
  }
};

export default authService;
