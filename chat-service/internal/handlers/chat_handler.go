package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/socialmedia/chat-service/internal/models"
	"github.com/socialmedia/chat-service/internal/service"
)

type ChatHandler struct {
	chatService *service.ChatService
	upgrader    websocket.Upgrader
}

func NewChatHandler(chatService *service.ChatService) *ChatHandler {
	return &ChatHandler{
		chatService: chatService,
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true // In production, configure this properly
			},
		},
	}
}

func (h *ChatHandler) WebSocket(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade connection"})
		return
	}

	// Create message handler
	messageHandler := func(msg service.WebSocketMessage) error {
		switch msg.Type {
		case "message":
			var chatMsg models.Message
			if err := json.Unmarshal(msg.Content, &chatMsg); err != nil {
				return err
			}
			chatMsg.FromID = userID // Set sender ID from authenticated user
			return h.chatService.SendMessage(c.Request.Context(), &chatMsg)

		case "typing":
			// Handle typing indicator if needed
			return nil
		}
		return nil
	}

	ws := service.NewWebSocket(conn, messageHandler)
	h.chatService.RegisterClient(userID, ws)

	// Start listening for messages
	go ws.Listen()

	// Keep the connection alive until it's closed
	<-ws.CloseChan

	h.chatService.RemoveClient(userID)
}

func (h *ChatHandler) GetConversation(c *gin.Context) {
	userID := c.GetString("user_id")
	otherID := c.Param("otherID")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "50"), 10, 64)

	messages, err := h.chatService.GetConversation(c.Request.Context(), userID, otherID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get conversation"})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func (h *ChatHandler) MarkAsRead(c *gin.Context) {
	userID := c.GetString("user_id")
	fromID := c.Param("fromID")

	err := h.chatService.MarkAsRead(c.Request.Context(), fromID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to mark messages as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (h *ChatHandler) GetUnreadCount(c *gin.Context) {
	userID := c.GetString("user_id")

	count, err := h.chatService.GetUnreadCount(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get unread count"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}
