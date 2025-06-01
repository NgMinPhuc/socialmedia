package service

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/models"
	"github.com/socialmedia/chat-service/internal/repository"
	"github.com/socialmedia/chat-service/internal/validation"
)

type Client struct {
	ID     string
	Socket *WebSocket
}

type ChatService struct {
	repo      *repository.ChatRepository
	clients   map[string]*Client
	clientsMu sync.RWMutex
	validator *validation.MessageValidation
}

func NewChatService(repo *repository.ChatRepository) *ChatService {
	return &ChatService{
		repo:      repo,
		clients:   make(map[string]*Client),
		validator: validation.NewMessageValidation(),
	}
}

func (s *ChatService) RegisterClient(userID string, ws *WebSocket) {
	s.clientsMu.Lock()
	defer s.clientsMu.Unlock()

	client := &Client{
		ID:     userID,
		Socket: ws,
	}
	s.clients[userID] = client
}

func (s *ChatService) RemoveClient(userID string) {
	s.clientsMu.Lock()
	defer s.clientsMu.Unlock()

	delete(s.clients, userID)
}

func (s *ChatService) SendMessage(ctx context.Context, msg *models.Message) error {
	// Validate message content
	if err := s.validator.ValidateMessageContent(msg.Content); err != nil {
		errors.LogError(err, "ChatService.SendMessage - Content validation")
		return err
	}

	// Validate user IDs
	if err := s.validator.ValidateUserID(msg.FromID); err != nil {
		errors.LogError(err, "ChatService.SendMessage - FromID validation")
		return err
	}

	if err := s.validator.ValidateUserID(msg.ToID); err != nil {
		errors.LogError(err, "ChatService.SendMessage - ToID validation")
		return err
	}

	// Set timestamps
	now := time.Now()
	msg.CreatedAt = now
	msg.UpdatedAt = now
	msg.Read = false

	// Save message to database
	if err := s.repo.SaveMessage(ctx, msg); err != nil {
		appErr := errors.WrapError(errors.DatabaseOperationFailed, err)
		errors.LogError(appErr, "ChatService.SendMessage - Database save")
		return appErr
	}

	// Try to send message to recipient if online
	s.clientsMu.RLock()
	if client, ok := s.clients[msg.ToID]; ok {
		msgBytes, err := json.Marshal(msg)
		if err != nil {
			errors.LogError(err, "ChatService.SendMessage - JSON marshal")
		} else {
			if err := client.Socket.SendMessage(msgBytes); err != nil {
				errors.LogError(err, "ChatService.SendMessage - WebSocket send")
			}
		}
	}
	s.clientsMu.RUnlock()

	errors.LogInfo("Message sent successfully", "ChatService.SendMessage")
	return nil
}

func (s *ChatService) GetConversation(ctx context.Context, user1ID, user2ID string, limit int64) ([]*models.Message, error) {
	// Validate user IDs
	if err := s.validator.ValidateUserID(user1ID); err != nil {
		errors.LogError(err, "ChatService.GetConversation - User1ID validation")
		return nil, err
	}

	if err := s.validator.ValidateUserID(user2ID); err != nil {
		errors.LogError(err, "ChatService.GetConversation - User2ID validation")
		return nil, err
	}

	// Check if users are different
	if user1ID == user2ID {
		err := errors.NewAppError(errors.InvalidRequest, "Cannot get conversation with yourself")
		errors.LogError(err, "ChatService.GetConversation")
		return nil, err
	}

	// Set reasonable limit
	if limit <= 0 || limit > 100 {
		limit = 50
	}

	messages, err := s.repo.GetConversation(ctx, user1ID, user2ID, limit)
	if err != nil {
		appErr := errors.WrapError(errors.DatabaseOperationFailed, err)
		errors.LogError(appErr, "ChatService.GetConversation - Database query")
		return nil, appErr
	}

	errors.LogInfo("Conversation retrieved successfully", "ChatService.GetConversation")
	return messages, nil
}

func (s *ChatService) MarkAsRead(ctx context.Context, fromID, toID string) error {
	// Validate user IDs
	if err := s.validator.ValidateUserID(fromID); err != nil {
		errors.LogError(err, "ChatService.MarkAsRead - FromID validation")
		return err
	}

	if err := s.validator.ValidateUserID(toID); err != nil {
		errors.LogError(err, "ChatService.MarkAsRead - ToID validation")
		return err
	}

	if err := s.repo.MarkAsRead(ctx, fromID, toID); err != nil {
		appErr := errors.WrapError(errors.DatabaseOperationFailed, err)
		errors.LogError(appErr, "ChatService.MarkAsRead - Database update")
		return appErr
	}

	errors.LogInfo("Messages marked as read successfully", "ChatService.MarkAsRead")
	return nil
}

func (s *ChatService) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	// Validate user ID
	if err := s.validator.ValidateUserID(userID); err != nil {
		errors.LogError(err, "ChatService.GetUnreadCount - UserID validation")
		return 0, err
	}

	count, err := s.repo.GetUnreadCount(ctx, userID)
	if err != nil {
		appErr := errors.WrapError(errors.DatabaseOperationFailed, err)
		errors.LogError(appErr, "ChatService.GetUnreadCount - Database query")
		return 0, appErr
	}

	errors.LogInfo("Unread count retrieved successfully", "ChatService.GetUnreadCount")
	return count, nil
}
