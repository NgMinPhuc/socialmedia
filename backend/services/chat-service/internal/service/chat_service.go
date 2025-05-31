package service

import (
	"context"
	"encoding/json"
	"sync"

	"github.com/socialmedia/chat-service/internal/models"
	"github.com/socialmedia/chat-service/internal/repository"
)

type Client struct {
	ID     string
	Socket *WebSocket
}

type ChatService struct {
	repo      *repository.ChatRepository
	clients   map[string]*Client
	clientsMu sync.RWMutex
}

func NewChatService(repo *repository.ChatRepository) *ChatService {
	return &ChatService{
		repo:    repo,
		clients: make(map[string]*Client),
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
	if err := s.repo.SaveMessage(ctx, msg); err != nil {
		return err
	}

	// Try to send message to recipient if online
	s.clientsMu.RLock()
	if client, ok := s.clients[msg.ToID]; ok {
		msgBytes, _ := json.Marshal(msg)
		client.Socket.SendMessage(msgBytes)
	}
	s.clientsMu.RUnlock()

	return nil
}

func (s *ChatService) GetConversation(ctx context.Context, user1ID, user2ID string, limit int64) ([]*models.Message, error) {
	return s.repo.GetConversation(ctx, user1ID, user2ID, limit)
}

func (s *ChatService) MarkAsRead(ctx context.Context, fromID, toID string) error {
	return s.repo.MarkAsRead(ctx, fromID, toID)
}

func (s *ChatService) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	return s.repo.GetUnreadCount(ctx, userID)
}
