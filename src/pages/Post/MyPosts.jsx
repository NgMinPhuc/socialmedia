import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import Post from '@/components/Post';
import Loading from '@/components/Loading';

const MyPostsPage = () => {
  const { user } = useAuth();
  const { getUserPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchUserPosts = async (pageNumber = 0) => {
    if (!user?.username) return;

    try {
      const response = await getUserPosts(user.username, pageNumber, 10);
      if (pageNumber === 0) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      setHasMore(response.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchUserPosts();
    }
  }, [user]);
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserPosts(nextPage);
    }
  };

  if (loading && posts.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">My Posts</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (posts.length === 0 && !loading) {
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
          <Post
            key={post.id}
            post={post}
            onLikeUpdate={() => fetchUserPosts(page)}
          />
        ))}
      </div>

      {loading && <Loading />}

      {!loading && hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-white text-blue-500 rounded-lg shadow hover:bg-blue-50"
          >
            Load More
          </button>
        </div>
      )}

      {!loading && !hasMore && posts.length > 0 && (
        <div className="text-center text-gray-500 mt-8">
          No more posts to load
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
