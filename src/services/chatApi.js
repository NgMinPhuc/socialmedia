import axiosInstance from './axiosConfig';

const chatApi = {
    // Get chat history with a specific user
    getChatHistory: async (userId, page = 0, size = 20) => {
        try {
            const response = await axiosInstance.get(`/chat/${userId}/history?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get list of recent chat conversations
    getConversations: async () => {
        try {
            const response = await axiosInstance.get('/chat/conversations');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Initialize WebSocket connection
    initializeWebSocket: (userId) => {
        const ws = new WebSocket(`ws://localhost:8080/ws/chat?userId=${userId}`);
        
        ws.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return ws;
    },

    // Send message through WebSocket
    sendMessage: (ws, message) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        } else {
            throw new Error('WebSocket connection not open');
        }
    }
};

export default chatApi;
