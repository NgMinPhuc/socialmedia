import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthGuard = (requireAuth = true) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      navigate('/auth/login', { replace: true });
    } else if (!requireAuth && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, requireAuth, navigate]);

  return { isAuthenticated };
};
