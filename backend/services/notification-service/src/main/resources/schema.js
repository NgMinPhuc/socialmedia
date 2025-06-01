// MongoDB schema validator for Notification Service

// Notifications collection validator
db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "type", "content", "read", "createdAt"],
      properties: {
        userId: {
          bsonType: "string",
          description: "User ID who receives the notification"
        },
        type: {
          enum: ["LIKE", "COMMENT", "FOLLOW", "MENTION", "TAG", "MESSAGE", "SYSTEM"],
          description: "Type of notification"
        },
        sourceId: {
          bsonType: ["string", "null"],
          description: "User ID who triggered the notification"
        },
        referenceId: {
          bsonType: ["string", "null"],
          description: "ID of the related entity (post, comment, etc.)"
        },
        referenceType: {
          enum: ["POST", "COMMENT", "USER", "MESSAGE", "SYSTEM", null],
          description: "Type of referenced entity"
        },
        content: {
          bsonType: "string",
          description: "Notification content text"
        },
        read: {
          bsonType: "bool",
          description: "Whether notification has been read"
        },
        createdAt: {
          bsonType: "date",
          description: "Notification creation timestamp"
        },
        readAt: {
          bsonType: ["date", "null"],
          description: "When the notification was read"
        }
      }
    }
  }
});

// Notification Preferences collection validator
db.createCollection("notification_preferences", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId"],
      properties: {
        userId: {
          bsonType: "string",
          description: "User ID for these preferences"
        },
        likes: {
          bsonType: "bool",
          description: "Receive notifications for likes"
        },
        comments: {
          bsonType: "bool",
          description: "Receive notifications for comments"
        },
        follows: {
          bsonType: "bool",
          description: "Receive notifications for follows"
        },
        messages: {
          bsonType: "bool", 
          description: "Receive notifications for messages"
        },
        mentions: {
          bsonType: "bool",
          description: "Receive notifications for mentions"
        },
        email: {
          bsonType: "bool",
          description: "Send email notifications"
        },
        push: {
          bsonType: "bool",
          description: "Send push notifications"
        }
      }
    }
  }
});

// Create indexes for better performance
db.notifications.createIndex({ userId: 1, read: 1 });
db.notifications.createIndex({ userId: 1, createdAt: -1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ sourceId: 1 });
db.notifications.createIndex({ referenceId: 1, referenceType: 1 });

db.notification_preferences.createIndex({ userId: 1 });
