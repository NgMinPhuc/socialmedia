import { useState, useEffect, useRef } from 'react';
import { chatService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';
import Avatar from '@/ui/Avatar';
import Input from '@/ui/Input';
import Button from '@/ui/Button';

const MessagesPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    initializeWebSocket();

    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    if (user?.id) {
      chatService.connect(user.id);
      
      chatService.onMessage((message) => {
        if (selectedConversation && 
            (message.senderId === selectedConversation.userId || 
             message.receiverId === selectedConversation.userId)) {
          setMessages(prev => [...prev, message]);
        }
        
        // Update conversation list with latest message
        setConversations(prev => 
          prev.map(conv => 
            conv.userId === message.senderId || conv.userId === message.receiverId
              ? { ...conv, lastMessage: message, lastMessageTime: message.createdAt }
              : conv
          )
        );
      });

      chatService.onConnectionChange(setConnected);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await chatService.getConversations();
      setConversations(response.data || response);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (userId) => {
    setMessagesLoading(true);
    try {
      const response = await chatService.getChatHistory(userId);
      setMessages(response.data || response);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchChatHistory(conversation.userId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !connected) return;

    const message = {
      content: newMessage.trim(),
      receiverId: selectedConversation.userId,
      senderId: user.id,
      createdAt: new Date().toISOString()
    };

    chatService.sendMessage(message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-120px)]">
      <div className="bg-white rounded-lg shadow-md h-full flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center mt-2">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
              <span className="text-sm text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No conversations yet</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <ConversationItem
                  key={conversation.userId}
                  conversation={conversation}
                  isSelected={selectedConversation?.userId === conversation.userId}
                  onClick={() => selectConversation(conversation)}
                />
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center">
                <Avatar 
                  src={selectedConversation.avatar} 
                  alt={selectedConversation.fullName}
                  size="sm"
                />
                <div className="ml-3">
                  <h3 className="font-semibold">{selectedConversation.fullName}</h3>
                  <p className="text-sm text-gray-500">@{selectedConversation.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <Loading />
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <MessageBubble
                        key={`${message.id || index}-${message.createdAt}`}
                        message={message}
                        isOwn={message.senderId === user.id}
                        formatTime={formatTime}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={!connected}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !connected}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const formatLastMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar 
          src={conversation.avatar} 
          alt={conversation.fullName}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 truncate">
              {conversation.fullName}
            </h4>
            {conversation.lastMessageTime && (
              <span className="text-xs text-gray-500">
                {formatLastMessageTime(conversation.lastMessageTime)}
              </span>
            )}
          </div>
          {conversation.lastMessage && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {conversation.lastMessage.content}
            </p>
          )}
        </div>
        {conversation.unreadCount > 0 && (
          <div className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isOwn, formatTime }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-200 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default MessagesPage;
