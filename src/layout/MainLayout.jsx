import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Loading from '@/components/Loading';

const MainLayout = () => {
  const { isAuthenticated } = useAuthGuard(false);
  if (!isAuthenticated) {
    return <Loading />;
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
