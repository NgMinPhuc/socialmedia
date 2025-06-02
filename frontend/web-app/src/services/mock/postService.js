import mockFeedPosts from '../../mock/data/mockFeedPosts';
import mockUserPosts from '../../mock/data/mockUserPosts';

// Helper: chuyển user => author cho FE
function normalizePost(post) {
  // Nếu đã có author thì giữ nguyên, nếu chỉ có user thì chuyển sang author
  if (post.author) return post;
  return {
    ...post,
    author: post.user || {
      id: 0,
      username: 'unknown',
      name: 'Unknown',
      avatar: 'https://via.placeholder.com/40'
    },
    // Đảm bảo có trường image cho FE (lấy từ mediaUrls nếu có)
    image: post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[0] : undefined,
    commentsCount: post.comments || 0,
    likesCount: post.likes || 0,
  };
}

const postService = {
  getPosts: async (page = 1, size = 10) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = (page - 1) * size;
    const end = start + size;
    const posts = mockFeedPosts.slice(start, end).map(normalizePost);
    
    return {
      content: posts,
      totalElements: mockFeedPosts.length,
      totalPages: Math.ceil(mockFeedPosts.length / size),
      size,
      number: page - 1
    };
  },

  getUserPosts: async (userIdOrUsername) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Nếu truyền username hoặc id, lọc theo author.username hoặc author.id
    // Ở đây chỉ mock cho current_user
    const posts = mockUserPosts.map(normalizePost);
    return { data: posts };
  },

  getPostById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const post = [...mockFeedPosts, ...mockUserPosts].find(post => post.id === id);
    return post ? normalizePost(post) : undefined;
  },

  createPost: async (postData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost = {
      id: mockUserPosts.length + mockFeedPosts.length + 1,
      ...postData,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        username: 'current_user',
        name: 'Current User',
        avatar: 'https://i.pravatar.cc/150?img=1'
      }
    };
    mockUserPosts.unshift(newPost);
    return normalizePost(newPost);
  },

  likePost: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let post = mockFeedPosts.find(p => p.id === postId) || mockUserPosts.find(p => p.id === postId);
    if (post) {
      post.likesCount = (post.likesCount || 0) + 1;
    }
    return normalizePost(post);
  },

  unlikePost: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let post = mockFeedPosts.find(p => p.id === postId) || mockUserPosts.find(p => p.id === postId);
    if (post && post.likesCount > 0) {
      post.likesCount -= 1;
    }
    return normalizePost(post);
  }
};

export default postService; 