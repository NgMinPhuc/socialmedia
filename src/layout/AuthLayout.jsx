import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Loading from '@/components/Loading';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthGuard(false);

  if (isAuthenticated) {
    return <Navigate to="/" />;
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
