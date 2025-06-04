import { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import Post from '@/components/Post';
import Loading from '@/components/Loading';

const ExplorePage = () => {
  const { getPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber = 0) => {
    try {
      const response = await getPosts({ page: pageNumber + 1, size: 10 }); // getPosts uses 1-based pagination
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
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  if (loading && posts.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>

      {posts.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No posts to explore yet.</p>
        </div>
      ) : (<div className="space-y-6">
        {posts.map((post) => (
          <Post
            key={post.postId || post.id}
            post={post}
            onLikeUpdate={() => fetchPosts(page)}
          />
        ))}
      </div>
      )}

      {loading && <Loading />}

      {!loading && hasMore && posts.length > 0 && (
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

export default ExplorePage;
