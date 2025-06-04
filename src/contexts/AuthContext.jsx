import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';
import { getToken } from '@/config/localStorageToken';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const storedUser = localStorage.getItem('user');

        if (token && storedUser && !user) {
          // Try to validate the token
          const validationResult = await authService.validateToken();
          if (validationResult.valid) {
            // Token is valid, restore user from localStorage
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Token is invalid, clear everything
            authService.logout();
            localStorage.removeItem('user');
            setUser(null);
          }
        } else if (!token) {
          // No token, clear user data
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.log('Auth initialization failed');
        // Clear invalid token and user data
        authService.logout();
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Remove user dependency to avoid infinite loop

  const login = async (loginData) => {
    setLoading(true);
    setError(null);
    try {
      // loginData is already formatted as LoginRequest DTO by the Login component
      const response = await authService.login(loginData);

      // Extract user data from LoginResponse DTO
      const userData = {
        id: response.authenId,
        username: response.username,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        authenticated: response.authenticated
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      return response;
    } catch (err) {
      // Extract error message from API response structure
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // userData is already formatted as RegisterRequest DTO by the Register component
      const response = await authService.register(userData);

      // RegisterResponse DTO: {authenId, username, authenticated}
      // User is not automatically logged in after registration
      navigate('/auth/login', {
        state: {
          message: 'Registration successful! Please login to continue.',
          registeredUsername: response.username
        }
      });
      return response;
    } catch (err) {
      // Extract error message from API response structure
      const errorMessage = err.response?.data?.message || err.message || 'Failed to register';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      // passwordData is formatted as ChangePasswordRequest DTO: {oldPassword, newPassword}
      const response = await authService.changePassword(passwordData);
      // ChangePasswordResponse DTO: {success, message}
      return response;
    } catch (err) {
      // Extract error message from API response structure
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    logout,
    register,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
