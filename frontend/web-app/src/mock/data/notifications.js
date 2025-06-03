export const mockNotifications = [
  {
    id: 1,
    type: "LIKE",
    read: false,
    createdAt: "2024-03-15T11:30:00Z",
    user: {
      id: 2,
      username: "john_doe",
      fullName: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    post: {
      id: 1,
      content: "Just finished building my first React application! 🚀"
    }
  },
  {
    id: 2,
    type: "COMMENT",
    read: true,
    createdAt: "2024-03-15T12:45:00Z",
    user: {
      id: 3,
      username: "jane_smith",
      fullName: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    post: {
      id: 1,
      content: "Just finished building my first React application! 🚀"
    }
  },
  {
    id: 3,
    type: "FOLLOW",
    read: false,
    createdAt: "2024-03-15T14:20:00Z",
    user: {
      id: 4,
      username: "alex_wilson",
      fullName: "Alex Wilson",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 4,
    type: "MENTION",
    read: false,
    createdAt: "2024-03-15T16:15:00Z",
    user: {
      id: 2,
      username: "john_doe",
      fullName: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    post: {
      id: 3,
      content: "Just learned a new programming concept! #coding #learning"
    }
  }
]; 