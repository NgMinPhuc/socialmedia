package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FromID    string             `bson:"from_id" json:"fromId"`
	ToID      string             `bson:"to_id" json:"toId"`
	Content   string             `bson:"content" json:"content"`
	Read      bool               `bson:"read" json:"read"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}

type Conversation struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Participants []string           `bson:"participants" json:"participants"`
	LastMessage  *Message           `bson:"last_message" json:"lastMessage"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
	CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
}
