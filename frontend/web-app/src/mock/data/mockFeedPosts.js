// Mock feed posts (tất cả mọi người)
const mockFeedPosts = [
  {
    id: 1,
    author: {
      username: 'alice',
      name: 'Alice',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    content: 'Hello from Alice!',
    image: 'https://picsum.photos/seed/alice/600/400',
    createdAt: '2024-06-01T10:00:00Z',
    likesCount: 5,
    commentsCount: 2,
    isLiked: false
  },
  {
    id: 2,
    author: {
      username: 'bob',
      name: 'Bob',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    content: 'Bob vừa đăng bài mới!',
    image: 'https://picsum.photos/seed/bob/600/400',
    createdAt: '2024-06-02T12:00:00Z',
    likesCount: 3,
    commentsCount: 1,
    isLiked: false
  },
  {
    id: 3,
    author: {
      username: 'current_user',
      name: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Bài viết của tôi cũng xuất hiện ở feed chung!',
    image: '',
    createdAt: '2024-06-03T15:00:00Z',
    likesCount: 10,
    commentsCount: 0,
    isLiked: true
  }
];

export default mockFeedPosts; 