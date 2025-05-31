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
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

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
    setSearchParams({ q: searchQuery });

    try {
      if (activeTab === 'users') {
        setUsersLoading(true);
        const response = await searchApi.search({
          query: searchQuery,
          type: 'users'
        });
        setUsers(response.users || response.data?.users || []);
        setUsersLoading(false);
      } else {
        setPostsLoading(true);
        const response = await searchApi.search({
          query: searchQuery,
          type: 'posts'
        });
        setPosts(response.posts || response.data?.posts || []);
        setPostsLoading(false);
      }
    } catch (error) {
      console.error('Search error:', error);
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
            Search
          </Button>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="bg-white rounded-lg shadow-md">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => handleTabChange('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => handleTabChange('posts')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts
              </button>
            </nav>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {loading ? (
              <Loading />
            ) : (
              <>
                {activeTab === 'users' ? (
                  <UsersResults users={users} loading={usersLoading} />
                ) : (
                  <PostsResults posts={posts} loading={postsLoading} />
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

const UsersResults = ({ users, loading }) => {
  if (loading) return <Loading />;

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
          <Avatar src={user.avatar} alt={user.fullName} />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-gray-600">@{user.username}</p>
            {user.bio && (
              <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
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

const PostsResults = ({ posts, loading }) => {
  if (loading) return <Loading />;

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default SearchPage;
