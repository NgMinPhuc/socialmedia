// Chat Service MongoDB schema validators - Written in JavaScript for MongoDB

// Conversations collection validator
db.createCollection("conversations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "createdAt", "participants"],
      properties: {
        name: {
          bsonType: ["string", "null"],
          description: "Group chat name, null for direct conversations"
        },
        type: {
          enum: ["DIRECT", "GROUP"],
          description: "Type of conversation"
        },
        createdAt: {
          bsonType: "date",
          description: "Conversation creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Conversation update timestamp"
        },
        lastMessageAt: {
          bsonType: "date",
          description: "Timestamp of the last message"
        },
        participants: {
          bsonType: "array",
          minItems: 2,
          items: {
            bsonType: "object",
            required: ["userId", "joinedAt"],
            properties: {
              userId: {
                bsonType: "string",
                description: "User ID of the participant"
              },
              joinedAt: {
                bsonType: "date",
                description: "When the user joined the conversation"
              },
              role: {
                enum: ["OWNER", "ADMIN", "MEMBER"],
                description: "User's role in group conversations"
              },
              lastReadAt: {
                bsonType: "date",
                description: "Timestamp of when user last read the conversation"
              }
            }
          }
        }
      }
    }
  }
});

// Messages collection validator
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["conversationId", "senderId", "content", "createdAt", "status"],
      properties: {
        conversationId: {
          bsonType: "objectId",
          description: "ID of the conversation this message belongs to"
        },
        senderId: {
          bsonType: "string",
          description: "User ID who sent the message"
        },
        content: {
          bsonType: "string",
          description: "Message content"
        },
        mediaUrls: {
          bsonType: "array",
          description: "URLs to media attached to the message"
        },
        createdAt: {
          bsonType: "date",
          description: "Message creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Message update timestamp"
        },
        readBy: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["userId", "readAt"],
            properties: {
              userId: {
                bsonType: "string",
                description: "User ID who read the message"
              },
              readAt: {
                bsonType: "date",
                description: "Timestamp when the message was read"
              }
            }
          }
        },
        status: {
          enum: ["SENT", "DELIVERED", "READ"],
          description: "Current status of the message"
        },
        replyTo: {
          bsonType: ["objectId", "null"],
          description: "ID of the message this is replying to, null if not a reply"
        }
      }
    }
  }
});

// Create indexes for better performance
db.conversations.createIndex({ "participants.userId": 1 });
db.conversations.createIndex({ lastMessageAt: -1 });
db.conversations.createIndex({ type: 1 });

db.messages.createIndex({ conversationId: 1, createdAt: -1 });
db.messages.createIndex({ senderId: 1 });
db.messages.createIndex({ "readBy.userId": 1 });
