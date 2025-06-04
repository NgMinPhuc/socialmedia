import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userApi } from '@/services';
import Avatar from '@/ui/Avatar';
import Input from '@/ui/Input';
import Button from '@/ui/Button';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 border-r">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {message && (
              <div className={`mb-4 p-4 rounded-lg ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileSettings
                user={user}
                updateUser={updateUser}
                loading={loading}
                setLoading={setLoading}
                showMessage={showMessage}
              />
            )}
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = ({ user, updateUser, loading, setLoading, showMessage }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload avatar if changed
      if (avatarFile) {
        await userApi.uploadAvatar(avatarFile);
      }      // Update profile
      const updatedUser = await userApi.updateUserProfile(formData);
      updateUser(updatedUser);
      showMessage('Profile updated successfully!');
    } catch (error) {
      showMessage('Failed to update profile', 'error');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-6">
          <Avatar
            src={avatarPreview}
            alt={formData.fullName}
            size="xl"
          />
          <div>
            <label className="block">
              <span className="sr-only">Choose avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <Input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <Input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const AccountSettings = () => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const showMessage = (msg, type = 'success') => {
    if (type === 'success') {
      setMessage(msg);
      setError('');
    } else {
      setError(msg);
      setMessage('');
    }
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 5000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('New password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      const passwordData = {
        oldPassword: currentPassword,
        newPassword: newPassword
      };

      await changePassword(passwordData);

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showMessage('Password changed successfully!');
    } catch (err) {
      showMessage(err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>

      {message && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 8 characters)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
        >
          {loading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </form>

      <div className="mt-12 pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Delete Account</h4>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="danger">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    allowMessagesFrom: 'everyone',
    showOnlineStatus: true,
    allowTagging: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={settings.profileVisibility}
            onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allow Messages From
          </label>
          <select
            value={settings.allowMessagesFrom}
            onChange={(e) => handleSettingChange('allowMessagesFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="everyone">Everyone</option>
            <option value="friends">Friends Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Show Online Status</h3>
            <p className="text-sm text-gray-500">Let others see when you're online</p>
          </div>
          <input
            type="checkbox"
            checked={settings.showOnlineStatus}
            onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Allow Tagging</h3>
            <p className="text-sm text-gray-500">Let others tag you in posts</p>
          </div>
          <input
            type="checkbox"
            checked={settings.allowTagging}
            onChange={(e) => handleSettingChange('allowTagging', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button>Save Privacy Settings</Button>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    follows: true,
    messages: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Push Notifications</h3>
            <p className="text-sm text-gray-500">Receive push notifications</p>
          </div>
          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <hr />

        <h3 className="text-lg font-medium text-gray-900">Activity Notifications</h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Likes</h4>
            <p className="text-sm text-gray-500">When someone likes your post</p>
          </div>
          <input
            type="checkbox"
            checked={settings.likes}
            onChange={(e) => handleSettingChange('likes', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Comments</h4>
            <p className="text-sm text-gray-500">When someone comments on your post</p>
          </div>
          <input
            type="checkbox"
            checked={settings.comments}
            onChange={(e) => handleSettingChange('comments', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Follows</h4>
            <p className="text-sm text-gray-500">When someone follows you</p>
          </div>
          <input
            type="checkbox"
            checked={settings.follows}
            onChange={(e) => handleSettingChange('follows', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Messages</h4>
            <p className="text-sm text-gray-500">When you receive a new message</p>
          </div>
          <input
            type="checkbox"
            checked={settings.messages}
            onChange={(e) => handleSettingChange('messages', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
