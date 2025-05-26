package repository

import (
	"context"
	"time"

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
	msg.CreatedAt = time.Now()
	msg.UpdatedAt = time.Now()

	collection := r.db.Collection("messages")
	_, err := collection.InsertOne(ctx, msg)
	return err
}

func (r *ChatRepository) GetConversation(ctx context.Context, user1ID, user2ID string, limit int64) ([]*models.Message, error) {
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
		return nil, err
	}
	defer cursor.Close(ctx)

	var messages []*models.Message
	if err = cursor.All(ctx, &messages); err != nil {
		return nil, err
	}

	return messages, nil
}

func (r *ChatRepository) MarkAsRead(ctx context.Context, fromID, toID string) error {
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

	_, err := collection.UpdateMany(ctx, filter, update)
	return err
}

func (r *ChatRepository) GetUnreadCount(ctx context.Context, userID string) (int64, error) {
	collection := r.db.Collection("messages")

	filter := bson.M{
		"to_id": userID,
		"read":  false,
	}

	count, err := collection.CountDocuments(ctx, filter)
	return count, err
}
