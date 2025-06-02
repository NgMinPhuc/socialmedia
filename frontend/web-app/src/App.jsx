import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import MainLayout from '@/layout/MainLayout';
import AuthLayout from '@/layout/AuthLayout';
import HomePage from '@/pages/Home';
// import ExplorePage from '@/pages/Post/Explore';
import MyPostsPage from '@/pages/Post/MyPosts';
import ProfilePage from '@/pages/User/Profile';
import EditProfilePage from '@/pages/User/EditProfile';
import FollowersPage from '@/pages/User/Followers';
import FollowingPage from '@/pages/User/Following';
import SearchPage from '@/pages/Search';
import NotificationsPage from '@/pages/Notifications';
import MessagesPage from '@/pages/Messages';
import SettingsPage from '@/pages/Settings';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import ResetPassword from '@/pages/Auth/ResetPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            {/* <Route path="explore" element={<ExplorePage />} /> */}
            <Route path="myposts" element={<MyPostsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:userId" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
            <Route path="profile/:username/followers" element={<FollowersPage />} />
            <Route path="profile/:username/following" element={<FollowingPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
