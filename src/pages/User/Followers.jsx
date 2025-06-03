import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const FollowersPage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowers();
  }, [username]);
  const fetchFollowers = async () => {
    try {
      const response = await userApi.getFollowers(username);
      setFollowers(response.data || response);
    } catch (error) {
      console.error('Error fetching followers:', error);
      setFollowers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await userApi.unfollowUser(userId);
      } else {
        await userApi.followUser(userId);
      }

      setFollowers(prev =>
        prev.map(follower =>
          follower.id === userId
            ? { ...follower, isFollowing: !isFollowing }
            : follower
        )
      );
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            {username}'s Followers
          </h1>
        </div>

        <div className="p-6">
          {followers.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No followers yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={follower.avatar}
                      alt={follower.fullName}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {follower.fullName}
                      </h3>
                      <p className="text-gray-600">@{follower.username}</p>
                      {follower.bio && (
                        <p className="text-sm text-gray-500 mt-1">
                          {follower.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {follower.id !== user?.id && (
                    <Button
                      onClick={() => handleFollow(follower.id, follower.isFollowing)}
                      variant={follower.isFollowing ? "outline" : "primary"}
                      size="sm"
                    >
                      {follower.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersPage;
