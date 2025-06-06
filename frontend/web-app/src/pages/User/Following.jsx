import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from 'src/service';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const FollowingPage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, [username]);

  const fetchFollowing = async () => {
    try {
      // This would need to be implemented in userApi
      // For now, using mock data
      const response = await userApi.getFollowing?.(username) || [];
      setFollowing(response.data || response);
    } catch (error) {
      console.error('Error fetching following:', error);
      // Mock data for demo
      setFollowing([
        {
          id: 1,
          fullName: 'Alice Johnson',
          username: 'alicej',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Product Designer',
          isFollowing: true
        },
        {
          id: 2,
          fullName: 'Bob Wilson',
          username: 'bobw',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Full Stack Developer',
          isFollowing: true
        },
        {
          id: 3,
          fullName: 'Sarah Davis',
          username: 'sarahd',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Marketing Specialist',
          isFollowing: true
        }
      ]);
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
      
      setFollowing(prev => 
        prev.map(followedUser => 
          followedUser.id === userId 
            ? { ...followedUser, isFollowing: !isFollowing }
            : followedUser
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
            {username}'s Following
          </h1>
        </div>
        
        <div className="p-6">
          {following.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Not following anyone yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar 
                      src={followedUser.avatar} 
                      alt={followedUser.fullName}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {followedUser.fullName}
                      </h3>
                      <p className="text-gray-600">@{followedUser.username}</p>
                      {followedUser.bio && (
                        <p className="text-sm text-gray-500 mt-1">
                          {followedUser.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {followedUser.id !== user?.id && (
                    <Button
                      onClick={() => handleFollow(followedUser.id, followedUser.isFollowing)}
                      variant={followedUser.isFollowing ? "outline" : "primary"}
                      size="sm"
                    >
                      {followedUser.isFollowing ? 'Following' : 'Follow'}
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

export default FollowingPage;
