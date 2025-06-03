import { useNotifications } from '@/hooks/useNotifications';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    error,
    markingAsRead,
    hasUnreadNotifications,
    markAsRead,
    markAllAsRead,
    getNotificationMessage,
    getNotificationIcon
  } = useNotifications();
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}        <div className="p-6 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {hasUnreadNotifications && (
            <Button
              onClick={markAllAsRead}
              disabled={markingAsRead}
              variant="outline"
              size="sm"
            >
              {markingAsRead ? 'Marking...' : 'Mark all as read'}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y">            
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              getMessage={getNotificationMessage}
              getIcon={getNotificationIcon}
            />
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationItem = ({ notification, onMarkAsRead, getMessage, getIcon }) => {
  const { id, read, createdAt, user: notifUser, post } = notification;

  const handleClick = () => {
    if (!read) {
      onMarkAsRead(id);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
        }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar src={notifUser.avatar} alt={notifUser.fullName} size="sm" />
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <span className="text-xs">{getIcon(notification.type)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            {getMessage(notification)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTime(createdAt)}
          </p>

          {post && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
              {post.content?.substring(0, 100)}
              {post.content?.length > 100 && '...'}
            </div>
          )}
        </div>

        {!read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
