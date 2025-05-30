import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Loading />
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
