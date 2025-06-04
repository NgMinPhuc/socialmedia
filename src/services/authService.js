import httpClient from '@/config/httpClient';
import { API_ENDPOINTS } from '@/config/apiEndpoint';
import { setToken, removeToken } from '@/config/localStorageToken';

const authService = {
  async login(credentials) {
    try {
      const { data } = await httpClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
      const { accessToken, refreshToken } = data.result;
      setToken(accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return data.result;
    } catch (error) {
      console.error('Login failed:', error);
      authService.logout();
      throw error;
    }
  },

  async register(userData) {
    try {
      const { data } = await httpClient.post(API_ENDPOINTS.AUTH_REGISTER, userData);
      return data.result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async validateToken() {
    try {
      const { data } = await httpClient.post(API_ENDPOINTS.AUTH_VALIDATE_TOKEN);
      return data.result;
    } catch (error) {
      console.error('Token validation failed:', error);
      authService.logout();
      throw error;
    }
  },

  async changePassword(passwordData) {
    try {
      const { data } = await httpClient.post(API_ENDPOINTS.AUTH_CHANGE_PASSWORD, passwordData);
      return data.result;
    } catch (error) {
      console.error('Change password failed:', error);
      throw error;
    }
  },

  logout() {
    removeToken();
    localStorage.removeItem('refreshToken');
  }
};

export default authService;