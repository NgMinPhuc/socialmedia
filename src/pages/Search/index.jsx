import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchApi } from '@/services';
import Post from '@/components/Post';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Input from '@/ui/Input';
import Button from '@/ui/Button';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    totalHits: 0,
    page: 0,
    size: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchParams({ q: searchQuery });

    try {
      // Use comprehensive search that returns SearchResponse DTO
      const searchResponse = await searchApi.search(searchQuery, activeTab, 0, 10);

      // Handle SearchResponse DTO structure: {users, posts, aggregations, totalHits, page, size}
      setSearchResults({
        users: searchResponse.users || [],
        posts: searchResponse.posts || [],
        totalHits: searchResponse.totalHits || 0,
        page: searchResponse.page || 0,
        size: searchResponse.size || 10
      });
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Search failed. Please try again.');
      setSearchResults({
        users: [],
        posts: [],
        totalHits: 0,
        page: 0,
        size: 10
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (query.trim()) {
      handleSearch();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const getUsersCount = () => searchResults.users?.length || 0;
  const getPostsCount = () => searchResults.posts?.length || 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Input
            type="text"
            placeholder="Search for users or posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Search Results */}
      {query && (
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                All ({searchResults.totalHits})
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Users ({getUsersCount()})
              </button>
              <button
                onClick={() => handleTabChange('posts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                Posts ({getPostsCount()})
              </button>
            </nav>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {loading ? (
              <Loading />
            ) : (
              <>
                {activeTab === 'all' ? (
                  <AllResults
                    users={searchResults.users}
                    posts={searchResults.posts}
                    totalHits={searchResults.totalHits}
                  />
                ) : activeTab === 'users' ? (
                  <UsersResults users={searchResults.users} />
                ) : (
                  <PostsResults posts={searchResults.posts} />
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-gray-500">Enter a search term to find users and posts</p>
        </div>
      )}
    </div>
  );
};

// Component to show both users and posts in combined view
const AllResults = ({ users, posts, totalHits }) => {
  if (totalHits === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {users && users.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users ({users.length})</h3>
          <UsersResults users={users.slice(0, 3)} />
          {users.length > 3 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View all {users.length} users
              </Button>
            </div>
          )}
        </div>
      )}

      {posts && posts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posts ({posts.length})</h3>
          <PostsResults posts={posts.slice(0, 3)} />
          {posts.length > 3 && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View all {posts.length} posts
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const UsersResults = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id || user.userId} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
          <Avatar
            src={user.avatar ? `data:image/jpeg;base64,${user.avatar}` : null}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-600">@{user.userName}</p>
            {user.location && (
              <p className="text-sm text-gray-500 mt-1">{user.location}</p>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </div>
      ))}
    </div>
  );
};

const PostsResults = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        // Convert PostSearchResult to PostResponse format for compatibility with Post component
        const postResponse = {
          postId: post.postId,
          authenId: post.userId, // Map userId to authenId for Post component
          caption: post.caption,
          mediaUrls: post.files || [], // Map files to mediaUrls
          likesCount: 0, // Not available in search result
          commentsCount: post.listCommentId?.length || 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          privacy: post.privacy
        };

        return (
          <Post key={post.postId} post={postResponse} />
        );
      })}
    </div>
  );
};

export default SearchPage;
