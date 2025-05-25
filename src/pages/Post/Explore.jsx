import { useState, useEffect } from 'react';
import Post from '@/components/Post';
import Loading from '@/components/Loading';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch explore posts from API
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          content: 'Exploring new places! 🌍',
          author: {
            name: 'John Doe',
            avatar: 'https://via.placeholder.com/40'
          },
          image: 'https://via.placeholder.com/600x400',
          likes: 25,
          comments: []
        },
        {
          id: 2,
          content: 'Beautiful sunset today 🌅',
          author: {
            name: 'Jane Smith',
            avatar: 'https://via.placeholder.com/40'
          },
          image: 'https://via.placeholder.com/600x400',
          likes: 42,
          comments: []
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
