import { useState, useEffect } from 'react';
import Post from '@/components/Post';
import Loading from '@/components/Loading';
import { usePosts } from '@/hooks/usePosts';
import CreatePost from '@/components/CreatePost';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getPosts } = usePosts();

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const response = await getPosts({ page: 0, size: 20 });
        setPosts(response.result?.content || []);
      } catch (error) {
        console.error('Error fetching explore posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExplorePosts();
  }, []);

  // Function to be called after a post is created to refresh the post list
  const handlePostCreated = () => {
    fetchExplorePosts();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Create Post Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-3 border-b pb-2">
          <span className="mr-2 bg-blue-100 p-1 rounded-full">✏️</span> Create New Post
        </h2>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
