import { useState, useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import Post from '@/components/Post';
import CreatePost from '@/components/CreatePost';
import Loading from '@/components/Loading';

const Feed = () => {
  const { getPosts } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNumber = 1) => {
    try {
      console.log('Feed: Fetching posts...');
      const response = await getPosts({ page: pageNumber - 1, size: 10 }); // Backend uses 0-based pagination
      
      if (pageNumber === 1) {
        setPosts(response.result?.content || []);
      } else {
        setPosts(prev => [...prev, ...(response.result?.content || [])]);
      }
      setHasMore(!response.result?.last);
      console.log('Feed: Posts fetched successfully');
    } catch (err) {
      console.error('Feed: Error fetching posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Feed: useEffect triggered');
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
    // Refresh the feed
    setPage(1);
    fetchPosts(1);
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
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-6 mt-8">
        {posts.map(post => (
          <Post 
            key={post.postId || post.id} 
            post={post}
            onUpdate={() => fetchPosts(page)}
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
