import axiosInstance from './axiosConfig';

const chatService = {
    socket: null,
    messageListeners: [],
    connectionListeners: [],

    // WebSocket connection methods
    connect: (token) => {
        if (chatService.socket?.readyState === WebSocket.OPEN) {
            return chatService.socket;
        }

        const wsUrl = `ws://localhost:8084/api/chat/ws?token=${token}`;
        chatService.socket = new WebSocket(wsUrl);

        chatService.socket.onopen = () => {
            console.log('Chat WebSocket connected');
            chatService.connectionListeners.forEach(listener => listener(true));
        };

        chatService.socket.onclose = () => {
            console.log('Chat WebSocket disconnected');
            chatService.connectionListeners.forEach(listener => listener(false));
        };

        chatService.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                chatService.messageListeners.forEach(listener => listener(message));
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        chatService.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return chatService.socket;
    },

    disconnect: () => {
        if (chatService.socket) {
            chatService.socket.close();
            chatService.socket = null;
        }
        chatService.messageListeners = [];
        chatService.connectionListeners = [];
    },

    onMessage: (callback) => {
        chatService.messageListeners.push(callback);
        return () => {
            chatService.messageListeners = chatService.messageListeners.filter(l => l !== callback);
        };
    },

    onConnectionChange: (callback) => {
        chatService.connectionListeners.push(callback);
        return () => {
            chatService.connectionListeners = chatService.connectionListeners.filter(l => l !== callback);
        };
    },

    sendMessage: (message) => {
        if (chatService.socket?.readyState === WebSocket.OPEN) {
            chatService.socket.send(JSON.stringify(message));
            return true;
        }
        return false;
    },

    // REST API methods
    getConversations: async () => {
        try {
            const response = await axiosInstance.get('/chat/conversations');
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error.response?.data || error;
        }
    },

    getChatHistory: async (otherUserId, limit = 50) => {
        try {
            const response = await axiosInstance.get(`/chat/conversations/${otherUserId}?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error.response?.data || error;
        }
    },

    getConversation: async (otherUserId, limit = 50) => {
        try {
            const response = await axiosInstance.get(`/chat/conversations/${otherUserId}?limit=${limit}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    markMessagesAsRead: async (fromUserId) => {
        try {
            const response = await axiosInstance.post(`/chat/conversations/${fromUserId}/read`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getUnreadCount: async () => {
        try {
            const response = await axiosInstance.get('/chat/unread');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};
export default chatService;
