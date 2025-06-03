import { mockMessages, mockChats } from '../../mock/data/messages';

const chatService = {
  getChats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockChats;
  },

  getMessages: async (chatId, page = 1, size = 20) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const start = (page - 1) * size;
    const end = start + size;
    const messages = mockMessages.slice(start, end);
    
    return {
      content: messages,
      totalElements: mockMessages.length,
      totalPages: Math.ceil(mockMessages.length / size),
      size,
      number: page - 1
    };
  },

  sendMessage: async (chatId, content) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMessage = {
      id: mockMessages.length + 1,
      senderId: 1, // Current user
      receiverId: 2, // Other participant
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: {
        id: 1,
        username: "current_user",
        firstName: "Current",
        lastName: "User",
        avatar: "https://i.pravatar.cc/150?img=1"
      }
    };
    mockMessages.push(newMessage);
    
    // Update last message in chat
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = {
        id: newMessage.id,
        content: newMessage.content,
        createdAt: newMessage.createdAt,
        senderId: newMessage.senderId
      };
    }
    
    return newMessage;
  },

  markAsRead: async (chatId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
      mockMessages.forEach(message => {
        if (message.receiverId === 1) { // Current user
          message.isRead = true;
        }
      });
    }
    return chat;
  }
};

export default chatService; 