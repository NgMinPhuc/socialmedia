package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/models"
	"github.com/socialmedia/chat-service/internal/response"
	"github.com/socialmedia/chat-service/internal/service"
	"github.com/socialmedia/chat-service/internal/validation"
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
		errors.LogError(errors.NewAppError(errors.Unauthorized, "User ID not found in context"), "ChatHandler.WebSocket")
		response.UnauthorizedResponse(c, "User authentication required")
		return
	}

	// Validate user ID format
	validator := validation.NewMessageValidation()
	if err := validator.ValidateUserID(userID); err != nil {
		errors.LogError(err, "ChatHandler.WebSocket - UserID validation")
		response.ErrorResponse(c, err)
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		appErr := errors.WrapError(errors.WebSocketUpgradeFailed, err)
		errors.LogError(appErr, "ChatHandler.WebSocket - Connection upgrade")
		response.ErrorResponse(c, appErr)
		return
	}

	// Create message handler
	messageHandler := func(msg service.WebSocketMessage) error {
		switch msg.Type {
		case "message":
			var chatMsg models.Message
			if err := json.Unmarshal(msg.Content, &chatMsg); err != nil {
				return errors.WrapError(errors.InvalidWebSocketMessage, err)
			}
			chatMsg.FromID = userID // Set sender ID from authenticated user
			return h.chatService.SendMessage(c.Request.Context(), &chatMsg)

		case "typing":
			// Handle typing indicator if needed
			errors.LogInfo("Typing indicator received", "ChatHandler.WebSocket")
			return nil
		default:
			return errors.NewAppError(errors.InvalidWebSocketMessage, "Unknown message type: "+msg.Type)
		}
	}

	ws := service.NewWebSocket(conn, messageHandler)
	h.chatService.RegisterClient(userID, ws)

	errors.LogInfo("WebSocket connection established for user: "+userID, "ChatHandler.WebSocket")

	// Start listening for messages
	go ws.Listen()

	// Keep the connection alive until it's closed
	<-ws.CloseChan

	h.chatService.RemoveClient(userID)
	errors.LogInfo("WebSocket connection closed for user: "+userID, "ChatHandler.WebSocket")
}

func (h *ChatHandler) GetConversation(c *gin.Context) {
	userID := c.GetString("user_id")
	otherID := c.Param("otherID")
	
	if userID == "" {
		response.UnauthorizedResponse(c, "User authentication required")
		return
	}

	if otherID == "" {
		response.BadRequestResponse(c, "Other user ID is required")
		return
	}

	// Parse limit parameter
	limitStr := c.DefaultQuery("limit", "50")
	limit, err := strconv.ParseInt(limitStr, 10, 64)
	if err != nil || limit <= 0 {
		limit = 50
	}
	if limit > 100 {
		limit = 100 // Max limit for performance
	}

	messages, err := h.chatService.GetConversation(c.Request.Context(), userID, otherID, limit)
	if err != nil {
		errors.LogError(err, "ChatHandler.GetConversation")
		response.ErrorResponse(c, err)
		return
	}

	response.SuccessResponse(c, gin.H{
		"messages": messages,
		"count":    len(messages),
		"limit":    limit,
	})
}

func (h *ChatHandler) MarkAsRead(c *gin.Context) {
	userID := c.GetString("user_id")
	fromID := c.Param("fromID")

	if userID == "" {
		response.UnauthorizedResponse(c, "User authentication required")
		return
	}

	if fromID == "" {
		response.BadRequestResponse(c, "From user ID is required")
		return
	}

	err := h.chatService.MarkAsRead(c.Request.Context(), fromID, userID)
	if err != nil {
		errors.LogError(err, "ChatHandler.MarkAsRead")
		response.ErrorResponse(c, err)
		return
	}

	response.SuccessResponseWithMessage(c, "Messages marked as read successfully", gin.H{
		"fromId": fromID,
		"toId":   userID,
		"status": "read",
	})
}

func (h *ChatHandler) GetUnreadCount(c *gin.Context) {
	userID := c.GetString("user_id")

	if userID == "" {
		response.UnauthorizedResponse(c, "User authentication required")
		return
	}

	count, err := h.chatService.GetUnreadCount(c.Request.Context(), userID)
	if err != nil {
		errors.LogError(err, "ChatHandler.GetUnreadCount")
		response.ErrorResponse(c, err)
		return
	}

	response.SuccessResponse(c, gin.H{
		"userId":      userID,
		"unreadCount": count,
	})
}
