import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi, postApi } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import Post from '@/components/Post';
import CreatePost from '@/components/CreatePost';
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

  const isOwnProfile = !userId || userId === currentUser;
  const profileUserId = userId || currentUser;

  console.log('ProfilePage mounted');
  console.log('currentUser:', currentUser);
  console.log('userId from params:', userId);
  console.log('profileUserId:', profileUserId);

  useEffect(() => {
    console.log('useEffect triggered with profileUserId:', profileUserId);
    fetchUserProfile();
    fetchUserPosts();
  }, [profileUserId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      let userData;
      if (isOwnProfile) {
        console.log('Fetching own profile...');
        userData = await userApi.getMyProfile();
        console.log('Got own profile data:', userData);
      } else {
        console.log('Fetching profile for userId:', profileUserId);
        userData = await userApi.getUserProfile(profileUserId);
        console.log('Got user profile data:', userData);
      }
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null); // Ensure user is null on error
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      // Get posts filtered by userId
      const response = await postApi.getPosts({ userId: profileUserId });
      setPosts(response.content || response.data || response);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };
  
  // Function to be called after a post is created to refresh the post list
  const handlePostCreated = () => {
    fetchUserPosts();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 border-b-2 border-blue-200 pb-2">
        {user ? `@${user.userName}'s Profile` : "Profile"}
      </h1>
      
      {/* Section 1: About Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500 w-full">
        <div className="flex justify-between items-center mb-3 pb-2 border-b">
          <h2 className="text-lg font-semibold text-blue-700">
            <span className="mr-2 bg-blue-100 p-1 rounded-full">👤</span> About Information
          </h2>
          {isOwnProfile && (
            <Link to="/profile/edit">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex items-start space-x-6">
          {user ? (
            <Avatar 
              src={user.avatar} 
              alt={user.fullName}
              size="xl"
            />
          ) : (
            <Avatar size="xl" /> // Placeholder avatar
          )}
          
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900">{user ? (user.fullName || `${user.firstName} ${user.lastName}`) : 'Loading user...'}</h3>
              <p className="text-gray-600">{user ? `@${user.userName}` : ' '}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-l-4 border-blue-400 pl-3 p-2 bg-blue-50 rounded">
                <span className="block text-sm text-blue-600 font-medium">📧 Email</span>
                <span className="text-gray-800">{user ? user.email : 'N/A'}</span>
              </div>
              
              {user && user.location && (
                <div className="border-l-4 border-green-400 pl-3 p-2 bg-green-50 rounded">
                  <span className="block text-sm text-green-600 font-medium">📍 Location</span>
                  <span className="text-gray-800">{user.location}</span>
                </div>
              )}
              
              <div className="border-l-4 border-purple-400 pl-3 p-2 bg-purple-50 rounded">
                <span className="block text-sm text-purple-600 font-medium">📝 Posts</span>
                <span className="font-semibold text-gray-900">{posts.length > 0 ? posts.length : 'N/A'}</span>
              </div>
              
              {user && user.joinDate && (
                <div className="border-l-4 border-yellow-400 pl-3 p-2 bg-yellow-50 rounded">
                  <span className="block text-sm text-yellow-600 font-medium">🗓️ Joined</span>
                  <span className="text-gray-800">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {user && user.bio && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-1 flex items-center">
                  <span className="mr-2">📄</span> Biography
                </h4>
                <p className="text-gray-800 italic">"{user.bio}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Section 2: Create Post */}
      {isOwnProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow border-l-4 border-green-500 w-full">
          <div className="flex justify-between items-center mb-3 pb-2 border-b">
            <h2 className="text-lg font-semibold text-green-700">
              <span className="mr-2 bg-green-100 p-1 rounded-full">✏️</span> Create New Post
            </h2>
          </div>

          <div className="mb-4 bg-green-50 p-4 rounded-lg">
            <p className="text-green-700 font-medium">
              Share your thoughts, photos, and updates with your followers. What's on your mind today?
            </p>
          </div>
          
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Section 3: Posts History */}
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500 w-full">
        <div className="p-4 border-b flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-purple-700">
            <span className="mr-2 bg-purple-100 p-1 rounded-full">📜</span>
            {isOwnProfile ? "Your Posts History" : "Posts"}
          </h2>
          {isOwnProfile && (
            <Link 
              to="/myposts" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all your posts
            </Link>
          )}
        </div>
        
        {postsLoading ? (
          <Loading />
        ) : posts.length > 0 ? (
          <div className="divide-y w-full">
            {posts.map((post) => (
              <Post 
                key={post.id} 
                post={post} 
                onUpdate={() => fetchUserPosts()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 w-full">
            <p className="text-gray-500">
              {isOwnProfile ? (
                <>
                  You haven't posted anything yet. 
                  <span className="block mt-2">Create your first post in the section above!</span>
                </>
              ) : (
                "No posts yet"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
