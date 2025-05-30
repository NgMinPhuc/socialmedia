import axiosInstance from './axiosConfig';

class ChatService {
    constructor() {
        this.websocket = null;
        this.messageCallbacks = new Set();
        this.connectionCallbacks = new Set();
    }

    // HTTP Operations
    async getChatHistory(userId, page = 0, size = 20) {
        try {
            const response = await axiosInstance.get(`/chat/${userId}/history?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getConversations() {
        try {
            const response = await axiosInstance.get('/chat/conversations');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // WebSocket Management with Business Logic
    connect(userId) {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            return this.websocket; // Already connected
        }

        this.websocket = new WebSocket(`ws://localhost:8080/ws/chat?userId=${userId}`);
        
        this.websocket.onopen = () => {
            console.log('Chat WebSocket connected');
            this.connectionCallbacks.forEach(callback => callback(true));
        };

        this.websocket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.messageCallbacks.forEach(callback => callback(message));
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        this.websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.connectionCallbacks.forEach(callback => callback(false));
        };

        this.websocket.onclose = () => {
            console.log('WebSocket connection closed');
            this.websocket = null;
            this.connectionCallbacks.forEach(callback => callback(false));
        };

        return this.websocket;
    }

    sendMessage(message) {
        if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket not connected');
        }

        this.websocket.send(JSON.stringify({
            ...message,
            timestamp: new Date().toISOString()
        }));
    }

    // Event Management (Business Logic)
    onMessage(callback) {
        this.messageCallbacks.add(callback);
        return () => this.messageCallbacks.delete(callback); // Return cleanup function
    }

    onConnectionChange(callback) {
        this.connectionCallbacks.add(callback);
        return () => this.connectionCallbacks.delete(callback);
    }

    disconnect() {
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        this.messageCallbacks.clear();
        this.connectionCallbacks.clear();
    }

    isConnected() {
        return this.websocket && this.websocket.readyState === WebSocket.OPEN;
    }
}

// Export singleton instance
const chatService = new ChatService();
export default chatService;
