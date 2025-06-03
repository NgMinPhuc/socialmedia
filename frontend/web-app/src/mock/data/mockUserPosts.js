// Mock user posts (bài viết cá nhân)
const mockUserPosts = [
  {
    id: 101,
    author: {
      username: 'current_user',
      name: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Đây là bài viết cá nhân số 1!',
    image: 'https://picsum.photos/seed/my1/600/400',
    createdAt: '2024-06-04T09:00:00Z',
    likesCount: 2,
    commentsCount: 0,
    isLiked: false
  },
  {
    id: 102,
    author: {
      username: 'current_user',
      name: 'Current User',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    content: 'Bài viết cá nhân số 2, chỉ mình tôi có!',
    image: '',
    createdAt: '2024-06-05T11:00:00Z',
    likesCount: 1,
    commentsCount: 0,
    isLiked: true
  }
];

export default mockUserPosts; 