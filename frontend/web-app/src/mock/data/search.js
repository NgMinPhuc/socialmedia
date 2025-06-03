export const mockSearchResults = {
  users: [
    {
      id: 1,
      username: "john_doe",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      bio: "Software Developer | React Enthusiast"
    },
    {
      id: 2,
      username: "jane_smith",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
      bio: "UI/UX Designer | Coffee Lover"
    }
  ],
  posts: [
    {
      id: 1,
      content: "Just finished building my first React application! 🚀",
      mediaUrls: ["https://picsum.photos/800/600"],
      userId: 1,
      likes: 15,
      comments: 5,
      createdAt: "2024-03-15T10:30:00Z",
      user: {
        id: 1,
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    }
  ],
  hashtags: [
    {
      id: 1,
      name: "react",
      postCount: 150
    },
    {
      id: 2,
      name: "javascript",
      postCount: 300
    }
  ]
}; 