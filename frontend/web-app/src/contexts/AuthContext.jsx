import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

const AuthContext = createContext(null);

// Mock user for development
const mockUser = {
  id: 1,
  username: "current_user",
  fullName: "Current User",
  avatar: "https://i.pravatar.cc/150?img=1",
  email: "user@example.com"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    if (token && !user) {
      const userData = authService.getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    }
  }, [user]);

  const login = async (usernameOrEmail, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext login attempt:', { usernameOrEmail, password });
      const data = await authService.login(usernameOrEmail, password);
      console.log('AuthContext login success:', data);
      
      // Kiểm tra và lưu token
      if (data.result?.accessToken) {
        localStorage.setItem('token', data.result.accessToken);
        // Lưu thông tin user đầy đủ
        const userData = {
          id: data.result.id || 1,
          username: data.result.username || usernameOrEmail,
          fullName: data.result.fullName || "Current User",
          avatar: data.result.avatar || "https://i.pravatar.cc/150?img=1",
          email: data.result.email || `${usernameOrEmail}@example.com`
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Chuyển hướng sau khi đăng nhập thành công
        navigate('/');
      } else {
        throw new Error('Invalid response format from server');
      }
      return data;
    } catch (err) {
      console.error('AuthContext login error:', err);
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
      setUser(data.user);
      navigate('/');
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
  };

  const logout = () => {
    authService.logout();
    setUser(null);
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
