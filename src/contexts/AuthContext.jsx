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
        if (token && !user) {
          // Try to validate the token
          const userData = await authService.validateToken();
          if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        }
      } catch (err) {
        console.log('Auth initialization failed');
        // Clear invalid token and user data
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [user]);
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    setError(null);
    try {
      const credentials = {
        username: emailOrUsername,
        password: password
      };

      const data = await authService.login(credentials);

      // Extract user data from response
      const userData = {
        id: data.authenId,
        username: data.username,
        accessToken: data.accessToken,
        authenticated: data.authenticated
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }; 
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      // Registration successful but user is not automatically logged in
      // Redirect to login page with success message
      navigate('/auth/login', {
        state: {
          message: 'Registration successful! Please login to continue.',
          registeredUsername: userData.username
        }
      });
      return data;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.changePassword(passwordData);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  }; const logout = () => {
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
