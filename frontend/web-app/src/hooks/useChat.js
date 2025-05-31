import { useState, useRef, useEffect } from 'react';
import { chatService } from '@/services';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);

  const connectWebSocket = (token) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = chatService.connectWebSocket(token);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setConnected(false);
      };
    } catch (err) {
      setError('Failed to connect to chat service');
    }
  };

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setError('WebSocket not connected');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnected(false);
    }
  };

  const getConversation = async (otherUserId, limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getConversation(otherUserId, limit);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get conversation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (fromUserId) => {
    try {
      const response = await chatService.markMessagesAsRead(fromUserId);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to mark messages as read';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getUnreadCount = async () => {
    try {
      const response = await chatService.getUnreadCount();
      setUnreadCount(response.count || 0);
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get unread count';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    loading,
    error,
    connected,
    messages,
    unreadCount,
    connectWebSocket,
    sendMessage,
    disconnect,
    getConversation,
    markMessagesAsRead,
    getUnreadCount,
    setMessages,
  };
};
