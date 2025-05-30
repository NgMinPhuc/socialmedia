import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';

const MainLayout = () => {
  const { user, loading } = useAuth();
  
  // Show loading while checking auth
  if (loading) {
    return <Loading />;
  }
  
  // Redirect to login if not authenticated
  if (user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
