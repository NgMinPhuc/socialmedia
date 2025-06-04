import { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import Post from '@/components/Post';
import CreatePost from '@/components/CreatePost';
import Loading from '@/components/Loading';

const Feed = () => {
  const { getFeed } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // getFeed uses 0-based pagination
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber = 0) => {
    try {
      const response = await getFeed(pageNumber, 10);
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
  const handlePostCreated = () => {
    // Refresh the feed from the beginning
    setPage(0);
    fetchPosts(0);
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <CreatePost onPostCreated={handlePostCreated} />      <div className="space-y-6 mt-8">
        {posts.map(post => (
          <Post
            key={post.postId || post.id}
            post={post}
            onLikeUpdate={() => fetchPosts(page)}
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

      {!loading && posts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No posts yet. Be the first to post!
        </div>
      )}
    </div>
  );
};

export default Feed;
