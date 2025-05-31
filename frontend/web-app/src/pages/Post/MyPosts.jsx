import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Post from '@/components/Post';
import Loading from '@/components/Loading';
import { usePosts } from '@/hooks/usePosts';

const MyPostsPage = () => {
  const { user } = useAuth();
  const { getPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      
      try {
        const response = await getPosts({ userId: user, page: 0, size: 20 });
        setPosts(response.result?.content || []);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
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
