export const mockMessages = [
  {
    id: 1,
    senderId: 1,
    receiverId: 2,
    content: "Hey, how are you doing?",
    isRead: true,
    createdAt: "2024-03-15T09:30:00Z",
    sender: {
      id: 1,
      username: "john_doe",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  },
  {
    id: 2,
    senderId: 2,
    receiverId: 1,
    content: "I'm good! Just working on some new features. How about you?",
    isRead: true,
    createdAt: "2024-03-15T09:32:00Z",
    sender: {
      id: 2,
      username: "jane_smith",
      firstName: "Jane",
      lastName: "Smith",
      avatar: "https://i.pravatar.cc/150?img=2"
    }
  },
  {
    id: 3,
    senderId: 1,
    receiverId: 2,
    content: "Same here! Working on the frontend part of our project.",
    isRead: false,
    createdAt: "2024-03-15T09:35:00Z",
    sender: {
      id: 1,
      username: "john_doe",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://i.pravatar.cc/150?img=1"
    }
  }
];

export const mockChats = [
  {
    id: 1,
    participants: [
      {
        id: 1,
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      {
        id: 2,
        username: "jane_smith",
        firstName: "Jane",
        lastName: "Smith",
        avatar: "https://i.pravatar.cc/150?img=2"
      }
    ],
    lastMessage: {
      id: 3,
      content: "Same here! Working on the frontend part of our project.",
      createdAt: "2024-03-15T09:35:00Z",
      senderId: 1
    },
    unreadCount: 1
  }
]; 