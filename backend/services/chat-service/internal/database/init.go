package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// InitializeDB creates sample data for the chat service
func InitializeDB(db *mongo.Database) error {
	ctx := context.Background()

	// Drop existing collections
	db.Collection("conversations").Drop(ctx)
	db.Collection("messages").Drop(ctx)

	// Create collections
	err := db.CreateCollection(ctx, "conversations")
	if err != nil {
		return err
	}
	err = db.CreateCollection(ctx, "messages")
	if err != nil {
		return err
	}

	// Create indexes
	conversations := db.Collection("conversations")
	messages := db.Collection("messages")

	// Conversation indexes
	_, err = conversations.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{{"participants.userId", 1}},
		},
		{
			Keys: bson.D{{"type", 1}},
		},
		{
			Keys: bson.D{{"lastMessageAt", -1}},
		},
		{
			Keys: bson.D{{"createdAt", -1}},
		},
	})
	if err != nil {
		return err
	}

	// Message indexes
	_, err = messages.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys: bson.D{{"conversationId", 1}, {"timestamp", -1}},
		},
		{
			Keys: bson.D{{"senderId", 1}},
		},
		{
			Keys: bson.D{{"type", 1}},
		},
		{
			Keys: bson.D{{"timestamp", -1}},
		},
	})
	if err != nil {
		return err
	}

	// Create conversations
	conv1, err := conversations.InsertOne(ctx, bson.M{
		"name":         nil,
		"type":         "DIRECT",
		"createdAt":    time.Date(2024, 5, 15, 10, 0, 0, 0, time.UTC),
		"updatedAt":    time.Date(2024, 5, 18, 15, 30, 0, 0, time.UTC),
		"lastMessageAt": time.Date(2024, 5, 18, 15, 30, 0, 0, time.UTC),
		"participants": []bson.M{
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440001", // Alice
				"joinedAt":   time.Date(2024, 5, 15, 10, 0, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 15, 30, 0, 0, time.UTC),
			},
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440002", // Bob
				"joinedAt":   time.Date(2024, 5, 15, 10, 0, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 15, 25, 0, 0, time.UTC),
			},
		},
	})
	if err != nil {
		return err
	}

	conv2, err := conversations.InsertOne(ctx, bson.M{
		"name":         "Vietnam Travel Group",
		"type":         "GROUP",
		"createdAt":    time.Date(2024, 5, 16, 9, 0, 0, 0, time.UTC),
		"updatedAt":    time.Date(2024, 5, 18, 14, 45, 0, 0, time.UTC),
		"lastMessageAt": time.Date(2024, 5, 18, 14, 45, 0, 0, time.UTC),
		"participants": []bson.M{
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440001", // Alice
				"joinedAt":   time.Date(2024, 5, 16, 9, 0, 0, 0, time.UTC),
				"role":       "ADMIN",
				"lastReadAt": time.Date(2024, 5, 18, 14, 45, 0, 0, time.UTC),
			},
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440003", // Charlie
				"joinedAt":   time.Date(2024, 5, 16, 9, 30, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 14, 40, 0, 0, time.UTC),
			},
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440004", // Diana
				"joinedAt":   time.Date(2024, 5, 16, 10, 0, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 14, 30, 0, 0, time.UTC),
			},
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440005", // Ethan
				"joinedAt":   time.Date(2024, 5, 16, 10, 15, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 14, 20, 0, 0, time.UTC),
			},
		},
	})
	if err != nil {
		return err
	}

	conv3, err := conversations.InsertOne(ctx, bson.M{
		"name":         nil,
		"type":         "DIRECT",
		"createdAt":    time.Date(2024, 5, 17, 16, 0, 0, 0, time.UTC),
		"updatedAt":    time.Date(2024, 5, 18, 13, 15, 0, 0, time.UTC),
		"lastMessageAt": time.Date(2024, 5, 18, 13, 15, 0, 0, time.UTC),
		"participants": []bson.M{
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440003", // Charlie
				"joinedAt":   time.Date(2024, 5, 17, 16, 0, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 13, 15, 0, 0, time.UTC),
			},
			{
				"userId":     "550e8400-e29b-41d4-a716-446655440005", // Ethan
				"joinedAt":   time.Date(2024, 5, 17, 16, 0, 0, 0, time.UTC),
				"role":       "MEMBER",
				"lastReadAt": time.Date(2024, 5, 18, 13, 10, 0, 0, time.UTC),
			},
		},
	})
	if err != nil {
		return err
	}

	// Create messages for Alice and Bob conversation
	_, err = messages.InsertMany(ctx, []interface{}{
		bson.M{
			"conversationId": conv1.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440001",
			"type":          "TEXT",
			"content":       "Hey Bob! How are you doing?",
			"timestamp":     time.Date(2024, 5, 15, 10, 30, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv1.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440002",
			"type":          "TEXT",
			"content":       "Hi Alice! I'm doing great, thanks! Just enjoying the weather in Hanoi ☀️",
			"timestamp":     time.Date(2024, 5, 15, 10, 35, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv1.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440001",
			"type":          "TEXT",
			"content":       "That's awesome! I love the Old Quarter morning vibes. Did you see my post about HCMC?",
			"timestamp":     time.Date(2024, 5, 15, 11, 0, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv1.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440002",
			"type":          "TEXT",
			"content":       "Yes! The photo was amazing 📸 Makes me want to visit the south again",
			"timestamp":     time.Date(2024, 5, 15, 11, 5, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv1.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440001",
			"type":          "TEXT",
			"content":       "You should definitely come! We could explore together 🎉",
			"timestamp":     time.Date(2024, 5, 18, 15, 30, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
	})
	if err != nil {
		return err
	}

	// Create messages for travel group
	_, err = messages.InsertMany(ctx, []interface{}{
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440001",
			"type":          "TEXT",
			"content":       "Welcome everyone to our Vietnam Travel Group! 🇻🇳",
			"timestamp":     time.Date(2024, 5, 16, 9, 0, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440003",
			"type":          "TEXT",
			"content":       "Thanks for creating this! Can't wait to share travel tips ✈️",
			"timestamp":     time.Date(2024, 5, 16, 9, 35, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440004",
			"type":          "TEXT",
			"content":       "Perfect timing! I'm planning a trip to the Mekong Delta",
			"timestamp":     time.Date(2024, 5, 16, 10, 5, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440005",
			"type":          "TEXT",
			"content":       "The imperial tombs in Hue are absolutely must-see! 🏛️",
			"timestamp":     time.Date(2024, 5, 16, 10, 20, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440001",
			"type":          "TEXT",
			"content":       "Great suggestions everyone! Let's share our favorite local foods too 🍜",
			"timestamp":     time.Date(2024, 5, 17, 14, 30, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv2.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440003",
			"type":          "TEXT",
			"content":       "Bun Bo Hue is my absolute favorite! Nothing beats authentic central Vietnamese cuisine",
			"timestamp":     time.Date(2024, 5, 18, 14, 45, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
	})
	if err != nil {
		return err
	}

	// Create messages for Charlie and Ethan conversation
	_, err = messages.InsertMany(ctx, []interface{}{
		bson.M{
			"conversationId": conv3.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440003",
			"type":          "TEXT",
			"content":       "Hey Ethan! Your post about Hue looks amazing!",
			"timestamp":     time.Date(2024, 5, 17, 18, 30, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv3.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440005",
			"type":          "TEXT",
			"content":       "Thanks Charlie! The history there is incredible. Have you been?",
			"timestamp":     time.Date(2024, 5, 17, 18, 45, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv3.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440003",
			"type":          "TEXT",
			"content":       "Not yet, but it's definitely on my list! Da Nang was beautiful though 🌅",
			"timestamp":     time.Date(2024, 5, 18, 9, 15, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
		bson.M{
			"conversationId": conv3.InsertedID,
			"senderId":      "550e8400-e29b-41d4-a716-446655440005",
			"type":          "TEXT",
			"content":       "Da Nang beaches are perfect! We should plan a trip together sometime 🏖️",
			"timestamp":     time.Date(2024, 5, 18, 13, 15, 0, 0, time.UTC),
			"edited":        false,
			"editedAt":      nil,
		},
	})
	if err != nil {
		return err
	}

	return nil
} 