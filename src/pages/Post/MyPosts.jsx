import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Post from '@/components/Post';
import Loading from '@/components/Loading';

const MyPostsPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's posts from API
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          content: 'My first post!',
          author: {
            name: user?.name || 'Current User',
            avatar: user?.avatar || 'https://via.placeholder.com/40'
          },
          image: 'https://via.placeholder.com/600x400',
          likes: 10,
          comments: []
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">My Posts</h1>
        <p className="text-gray-600">You haven't created any posts yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default MyPostsPage;
