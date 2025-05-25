import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Avatar from '@/ui/Avatar';
import Button from '@/ui/Button';

const FollowingPage = () => {
  const { username } = useParams();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch following from API
    setTimeout(() => {
      setFollowing([
        {
          id: 1,
          name: 'Alice Johnson',
          username: 'alicej',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Product Designer',
          isFollowing: true
        },
        {
          id: 2,
          name: 'Bob Wilson',
          username: 'bobw',
          avatar: 'https://via.placeholder.com/40',
          bio: 'Full Stack Developer',
          isFollowing: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [username]);

  const handleUnfollow = (userId) => {
    setFollowing(following.filter(user => user.id !== userId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Following</h1>

      <div className="space-y-4">
        {following.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Avatar src={user.avatar} alt={user.name} />
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleUnfollow(user.id)}
            >
              Following
            </Button>
          </div>
        ))}

        {following.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Not following anyone yet
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
