// MongoDB initialization script for Notification Service
// This script should be run after MongoDB is started

// Switch to the notification_service_db database
use notification_service_db;

// Create collections if they don't exist
db.createCollection("notifications");
db.createCollection("notificationPreferences");

// Create additional indexes for performance
db.notifications.createIndex({ "userId": 1, "createdAt": -1 });
db.notifications.createIndex({ "userId": 1, "read": 1 });
db.notifications.createIndex({ "type": 1 });
db.notifications.createIndex({ "sourceId": 1 });
db.notifications.createIndex({ "referenceId": 1, "referenceType": 1 });
db.notifications.createIndex({ "createdAt": -1 });

db.notificationPreferences.createIndex({ "userId": 1 }, { unique: true });

// Create default notification preferences for sample users
db.notificationPreferences.insertMany([
  {
    userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
    preferences: {
      email: true,
      push: true,
      sms: false
    },
    types: {
      LIKE: { enabled: true, email: false, push: true },
      COMMENT: { enabled: true, email: true, push: true },
      FOLLOW: { enabled: true, email: true, push: true },
      MENTION: { enabled: true, email: true, push: true },
      TAG: { enabled: true, email: false, push: true },
      MESSAGE: { enabled: true, email: false, push: true },
      SYSTEM: { enabled: true, email: true, push: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002", // Bob
    preferences: {
      email: true,
      push: true,
      sms: false
    },
    types: {
      LIKE: { enabled: true, email: false, push: true },
      COMMENT: { enabled: true, email: true, push: true },
      FOLLOW: { enabled: true, email: true, push: true },
      MENTION: { enabled: true, email: true, push: true },
      TAG: { enabled: true, email: false, push: true },
      MESSAGE: { enabled: true, email: false, push: true },
      SYSTEM: { enabled: true, email: true, push: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440003", // Charlie
    preferences: {
      email: false,
      push: true,
      sms: false
    },
    types: {
      LIKE: { enabled: true, email: false, push: true },
      COMMENT: { enabled: true, email: false, push: true },
      FOLLOW: { enabled: true, email: false, push: true },
      MENTION: { enabled: true, email: false, push: true },
      TAG: { enabled: true, email: false, push: true },
      MESSAGE: { enabled: true, email: false, push: true },
      SYSTEM: { enabled: true, email: false, push: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440004", // Diana
    preferences: {
      email: true,
      push: true,
      sms: true
    },
    types: {
      LIKE: { enabled: true, email: false, push: true },
      COMMENT: { enabled: true, email: true, push: true },
      FOLLOW: { enabled: true, email: true, push: true },
      MENTION: { enabled: true, email: true, push: true },
      TAG: { enabled: true, email: false, push: true },
      MESSAGE: { enabled: true, email: false, push: true },
      SYSTEM: { enabled: true, email: true, push: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440005", // Ethan
    preferences: {
      email: true,
      push: false,
      sms: false
    },
    types: {
      LIKE: { enabled: true, email: true, push: false },
      COMMENT: { enabled: true, email: true, push: false },
      FOLLOW: { enabled: true, email: true, push: false },
      MENTION: { enabled: true, email: true, push: false },
      TAG: { enabled: true, email: true, push: false },
      MESSAGE: { enabled: false, email: false, push: false },
      SYSTEM: { enabled: true, email: true, push: false }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create sample notifications
db.notifications.insertMany([
  {
    userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
    type: "SYSTEM",
    sourceId: null,
    referenceId: null,
    referenceType: "SYSTEM",
    content: "Welcome to our social media platform! Start connecting with friends and sharing your thoughts.",
    read: true,
    createdAt: new Date("2024-05-15T09:00:00Z"),
    readAt: new Date("2024-05-15T09:30:00Z")
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
    type: "LIKE",
    sourceId: "550e8400-e29b-41d4-a716-446655440002", // Bob liked Alice's post
    referenceId: "post-001",
    referenceType: "POST",
    content: "Bob Tran liked your post about Ho Chi Minh City",
    read: true,
    createdAt: new Date("2024-05-15T11:30:00Z"),
    readAt: new Date("2024-05-15T12:00:00Z")
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
    type: "COMMENT",
    sourceId: "550e8400-e29b-41d4-a716-446655440002", // Bob commented on Alice's post
    referenceId: "comment-001",
    referenceType: "COMMENT",
    content: "Bob Tran commented on your post: \"Beautiful shot! I love HCMC too 😍\"",
    read: true,
    createdAt: new Date("2024-05-15T11:00:00Z"),
    readAt: new Date("2024-05-15T11:45:00Z")
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440002", // Bob
    type: "LIKE",
    sourceId: "550e8400-e29b-41d4-a716-446655440001", // Alice liked Bob's post
    referenceId: "post-003",
    referenceType: "POST",
    content: "Alice Nguyen liked your post about Hanoi morning vibes",
    read: false,
    createdAt: new Date("2024-05-16T08:45:00Z"),
    readAt: null
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440003", // Charlie
    type: "COMMENT",
    sourceId: "550e8400-e29b-41d4-a716-446655440005", // Ethan commented on Charlie's post
    referenceId: "comment-014",
    referenceType: "COMMENT",
    content: "Ethan Vo commented on your post: \"Thanks for sharing! Great photo 📸\"",
    read: false,
    createdAt: new Date("2024-05-17T20:30:00Z"),
    readAt: null
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440004", // Diana
    type: "MESSAGE",
    sourceId: "550e8400-e29b-41d4-a716-446655440001", // Alice sent message in group
    referenceId: "Vietnam Travel Group",
    referenceType: "CONVERSATION",
    content: "Alice Nguyen sent a message in Vietnam Travel Group",
    read: true,
    createdAt: new Date("2024-05-17T14:30:00Z"),
    readAt: new Date("2024-05-17T15:00:00Z")
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440005", // Ethan
    type: "LIKE",
    sourceId: "550e8400-e29b-41d4-a716-446655440003", // Charlie liked Ethan's post
    referenceId: "post-006",
    referenceType: "POST",
    content: "Charlie Le liked your post about Historic Hue",
    read: false,
    createdAt: new Date("2024-05-18T10:15:00Z"),
    readAt: null
  },
  {
    userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
    type: "MESSAGE",
    sourceId: "550e8400-e29b-41d4-a716-446655440002", // Bob sent direct message
    referenceId: "direct-conversation",
    referenceType: "CONVERSATION",
    content: "Bob Tran sent you a message",
    read: true,
    createdAt: new Date("2024-05-18T15:30:00Z"),
    readAt: new Date("2024-05-18T15:32:00Z")
  }
]);

print("Notification Service database initialized successfully!");
