import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/layout/MainLayout';
import AuthLayout from '@/layout/AuthLayout';
import HomePage from '@/pages/Home';
import ExplorePage from '@/pages/Post/Explore';
import MyPostsPage from '@/pages/Post/MyPosts';
import EditProfilePage from '@/pages/User/EditProfile';
import FollowersPage from '@/pages/User/Followers';
import FollowingPage from '@/pages/User/Following';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="myposts" element={<MyPostsPage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="profile/:username/followers" element={<FollowersPage />} />
            <Route path="profile/:username/following" element={<FollowingPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
