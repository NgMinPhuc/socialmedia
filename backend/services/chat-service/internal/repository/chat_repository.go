package repository

import (
	"context"
	"time"

	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/logger"
	"github.com/socialmedia/chat-service/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ChatRepository struct {
	db *mongo.Database
}

func NewChatRepository(db *mongo.Database) *ChatRepository {
	return &ChatRepository{db: db}
}

func (r *ChatRepository) SaveMessage(ctx context.Context, msg *models.Message) error {
	if msg == nil {
		return errors.NewAppError(errors.InvalidRequest, "Message cannot be nil")
	}

	msg.CreatedAt = time.Now()
	msg.UpdatedAt = time.Now()

	collection := r.db.Collection("messages")
	_, err := collection.InsertOne(ctx, msg)
	if err != nil {
		errors.LogError(err, "ChatRepository.SaveMessage")
		return errors.WrapError(errors.DatabaseOperationFailed, err)
	}
	
	errors.LogInfo("Message saved successfully", "ChatRepository.SaveMessage")
	return nil
}

func (r *ChatRepository) GetConversation(ctx context.Context, user1ID, user2ID string, limit int64) ([]*models.Message, error) {
	if user1ID == "" || user2ID == "" {
		return nil, errors.NewAppError(errors.InvalidRequest, "User IDs cannot be empty")
	}

	collection := r.db.Collection("messages")

	filter := bson.M{
		"$or": []bson.M{
			{
				"from_id": user1ID,
				"to_id":   user2ID,
			},
			{
				"from_id": user2ID,
				"to_id":   user1ID,
			},
		},
	}

	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetLimit(limit)

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		errors.LogError(err, "ChatRepository.GetConversation")
		return nil, errors.WrapError(errors.DatabaseOperationFailed, err)
	}
	defer cursor.Close(ctx)

	var messages []*models.Message
	if err = cursor.All(ctx, &messages); err != nil {
		errors.LogError(err, "ChatRepository.GetConversation - Cursor decode")
		return nil, errors.WrapError(errors.DatabaseOperationFailed, err)
	}

	errors.LogInfo("Conversation retrieved successfully", "ChatRepository.GetConversation")
	return messages, nil
}

func (r *ChatRepository) MarkAsRead(ctx context.Context, fromID, toID string) error {
	if fromID == "" || toID == "" {
		return errors.NewAppError(errors.InvalidRequest, "User IDs cannot be empty")
	}

	collection := r.db.Collection("messages")

	filter := bson.M{
		"from_id": fromID,
		"to_id":   toID,
		"read":    false,
	}

	update := bson.M{
		"$set": bson.M{
			"read":       true,
			"updated_at": time.Now(),
		},
	}

	result, err := collection.UpdateMany(ctx, filter, update)
	if err != nil {
		logger.WithContext("ChatRepository").Errorf("Failed to mark messages as read: %v", err)
		return errors.NewAppError(errors.DatabaseOperationFailed, "Failed to mark messages as read")
	}

	logger.WithContext("ChatRepository").Infof("Messages marked as read, updated count: %d", result.ModifiedCount)
	return nil
}

func (r *ChatRepository) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	if userID == "" {
		return 0, errors.NewAppError(errors.InvalidRequest, "User ID cannot be empty")
	}

	collection := r.db.Collection("messages")

	filter := bson.M{
		"to_id": userID,
		"read":  false,
	}

	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		logger.WithContext("ChatRepository").Errorf("Failed to count unread messages: %v", err)
		return 0, errors.NewAppError(errors.DatabaseOperationFailed, "Failed to count unread messages")
	}

	logger.WithContext("ChatRepository").Infof("Unread count retrieved successfully: %d", count)
	return count, nil
}
