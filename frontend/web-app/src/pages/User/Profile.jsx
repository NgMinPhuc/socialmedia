import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userApi, postApi } from 'src/service';
import { useAuth } from '@/contexts/AuthContext';
import Post from '@/components/Post';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
  }, [profileUserId]);

  const fetchUserProfile = async () => {
    try {
      if (isOwnProfile) {
        setUser(currentUser);
      } else {
        const userData = await userApi.getUser(profileUserId);
        setUser(userData);
        setFollowing(userData.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      // Sử dụng getUserPosts để lấy post cá nhân
      const response = await postApi.getUserPosts?.(profileUserId);
      setPosts(response.data || response);
    } catch (error) {
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (following) {
        await userApi.unfollowUser(profileUserId);
        setFollowing(false);
      } else {
        await userApi.followUser(profileUserId);
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start space-x-6">
          <Avatar 
            src={user.avatar} 
            alt={user.fullName}
            size="xl"
          />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              
              {!isOwnProfile && (
                <Button
                  onClick={handleFollow}
                  disabled={followLoading}
                  variant={following ? "outline" : "primary"}
                  className="px-6"
                >
                  {followLoading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
                </Button>
              )}
            </div>
            
            {user.bio && (
              <p className="text-gray-700 mb-4">{user.bio}</p>
            )}
            
            <div className="flex space-x-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold text-gray-900">{user.postsCount || 0}</span> Posts
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user.followersCount || 0}</span> Followers
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user.followingCount || 0}</span> Following
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Posts</h2>
        </div>
        
        {postsLoading ? (
          <Loading />
        ) : posts.length > 0 ? (
          <div className="divide-y">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {isOwnProfile ? "You haven't posted anything yet" : "No posts yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
