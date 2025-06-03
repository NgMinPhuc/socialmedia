import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token && !user) {
          const userData = authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.log('Auth initialization failed');
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);
  const login = async (emailOrUsername, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(emailOrUsername, password);
      setUser(data.user);
      navigate('/');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }; const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(userData);
      // Registration successful but user is not automatically logged in
      // Redirect to login page with success message
      navigate('/auth/login', {
        state: {
          message: data.message || 'Registration successful! Please login to continue.',
          registeredUsername: data.user.username
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

  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.resetPassword(token, newPassword);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  }; const logout = async () => {
    try {
      const result = await authService.logout();

      // Handle the new response format: {success: boolean, message?: string, error?: string}
      if (result.success) {
        console.log('Logout successful:', result.message);
      } else {
        console.warn('Logout had issues:', result.error);
        // Continue with logout even if there were backend issues
      }
    } catch (error) {
      console.warn('Logout failed:', error);
      // Continue with logout even if API call fails
    } finally {
      setUser(null);
      navigate('/auth/login');
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword
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
