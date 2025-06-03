import { mockSearchResults } from '../../mock/data/search';

const searchService = {
  search: async (query, type = 'all', page = 1, size = 10) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = { ...mockSearchResults };
    
    // Filter results based on query
    if (query) {
      const lowerQuery = query.toLowerCase();
      
      if (type === 'all' || type === 'users') {
        results.users = results.users.filter(user => 
          user.username.toLowerCase().includes(lowerQuery) ||
          user.firstName.toLowerCase().includes(lowerQuery) ||
          user.lastName.toLowerCase().includes(lowerQuery) ||
          user.bio.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (type === 'all' || type === 'posts') {
        results.posts = results.posts.filter(post =>
          post.content.toLowerCase().includes(lowerQuery)
        );
      }
      
      if (type === 'all' || type === 'hashtags') {
        results.hashtags = results.hashtags.filter(tag =>
          tag.name.toLowerCase().includes(lowerQuery)
        );
      }
    }
    
    // Apply pagination
    if (type !== 'all') {
      const start = (page - 1) * size;
      const end = start + size;
      results[type] = results[type].slice(start, end);
    }
    
    return {
      ...results,
      totalElements: results[type]?.length || 0,
      totalPages: Math.ceil((results[type]?.length || 0) / size),
      size,
      number: page - 1
    };
  },

  getTrendingHashtags: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSearchResults.hashtags.sort((a, b) => b.postCount - a.postCount);
  },

  getRecentSearches: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      { id: 1, query: 'react', type: 'hashtags', timestamp: '2024-03-15T10:00:00Z' },
      { id: 2, query: 'john', type: 'users', timestamp: '2024-03-15T09:30:00Z' },
      { id: 3, query: 'javascript', type: 'hashtags', timestamp: '2024-03-15T09:00:00Z' }
    ];
  }
};

export default searchService; 