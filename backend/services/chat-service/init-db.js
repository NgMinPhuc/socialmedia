// MongoDB initialization script for Chat Service
// This script should be run after MongoDB is started

// Switch to the chatDB database
use chatDB;

// Create collections if they don't exist
db.createCollection("conversations");
db.createCollection("messages");

// Create indexes for better performance
db.conversations.createIndex({ "participants.userId": 1 });
db.conversations.createIndex({ "type": 1 });
db.conversations.createIndex({ "lastMessageAt": -1 });
db.conversations.createIndex({ "createdAt": -1 });

db.messages.createIndex({ "conversationId": 1, "timestamp": -1 });
db.messages.createIndex({ "senderId": 1 });
db.messages.createIndex({ "type": 1 });
db.messages.createIndex({ "timestamp": -1 });

// Create sample conversations and messages between our 5 users
var conv1 = db.conversations.insertOne({
  name: null,
  type: "DIRECT",
  createdAt: new Date("2024-05-15T10:00:00Z"),
  updatedAt: new Date("2024-05-18T15:30:00Z"),
  lastMessageAt: new Date("2024-05-18T15:30:00Z"),
  participants: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
      joinedAt: new Date("2024-05-15T10:00:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T15:30:00Z")
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440002", // Bob
      joinedAt: new Date("2024-05-15T10:00:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T15:25:00Z")
    }
  ]
});

var conv2 = db.conversations.insertOne({
  name: "Vietnam Travel Group",
  type: "GROUP",
  createdAt: new Date("2024-05-16T09:00:00Z"),
  updatedAt: new Date("2024-05-18T14:45:00Z"),
  lastMessageAt: new Date("2024-05-18T14:45:00Z"),
  participants: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440001", // Alice
      joinedAt: new Date("2024-05-16T09:00:00Z"),
      role: "ADMIN",
      lastReadAt: new Date("2024-05-18T14:45:00Z")
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440003", // Charlie
      joinedAt: new Date("2024-05-16T09:30:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T14:40:00Z")
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440004", // Diana
      joinedAt: new Date("2024-05-16T10:00:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T14:30:00Z")
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440005", // Ethan
      joinedAt: new Date("2024-05-16T10:15:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T14:20:00Z")
    }
  ]
});

var conv3 = db.conversations.insertOne({
  name: null,
  type: "DIRECT",
  createdAt: new Date("2024-05-17T16:00:00Z"),
  updatedAt: new Date("2024-05-18T13:15:00Z"),
  lastMessageAt: new Date("2024-05-18T13:15:00Z"),
  participants: [
    {
      userId: "550e8400-e29b-41d4-a716-446655440003", // Charlie
      joinedAt: new Date("2024-05-17T16:00:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T13:15:00Z")
    },
    {
      userId: "550e8400-e29b-41d4-a716-446655440005", // Ethan
      joinedAt: new Date("2024-05-17T16:00:00Z"),
      role: "MEMBER",
      lastReadAt: new Date("2024-05-18T13:10:00Z")
    }
  ]
});

// Sample messages for Alice and Bob conversation
db.messages.insertMany([
  {
    conversationId: conv1.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    type: "TEXT",
    content: "Hey Bob! How are you doing?",
    timestamp: new Date("2024-05-15T10:30:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv1.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440002",
    type: "TEXT",
    content: "Hi Alice! I'm doing great, thanks! Just enjoying the weather in Hanoi ☀️",
    timestamp: new Date("2024-05-15T10:35:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv1.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    type: "TEXT",
    content: "That's awesome! I love the Old Quarter morning vibes. Did you see my post about HCMC?",
    timestamp: new Date("2024-05-15T11:00:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv1.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440002",
    type: "TEXT",
    content: "Yes! The photo was amazing 📸 Makes me want to visit the south again",
    timestamp: new Date("2024-05-15T11:05:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv1.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    type: "TEXT",
    content: "You should definitely come! We could explore together 🎉",
    timestamp: new Date("2024-05-18T15:30:00Z"),
    edited: false,
    editedAt: null
  }
]);

// Sample messages for travel group
db.messages.insertMany([
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    type: "TEXT",
    content: "Welcome everyone to our Vietnam Travel Group! 🇻🇳",
    timestamp: new Date("2024-05-16T09:00:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440003",
    type: "TEXT",
    content: "Thanks for creating this! Can't wait to share travel tips ✈️",
    timestamp: new Date("2024-05-16T09:35:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440004",
    type: "TEXT",
    content: "Perfect timing! I'm planning a trip to the Mekong Delta",
    timestamp: new Date("2024-05-16T10:05:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440005",
    type: "TEXT",
    content: "The imperial tombs in Hue are absolutely must-see! 🏛️",
    timestamp: new Date("2024-05-16T10:20:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440001",
    type: "TEXT",
    content: "Great suggestions everyone! Let's share our favorite local foods too 🍜",
    timestamp: new Date("2024-05-17T14:30:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv2.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440003",
    type: "TEXT",
    content: "Bun Bo Hue is my absolute favorite! Nothing beats authentic central Vietnamese cuisine",
    timestamp: new Date("2024-05-18T14:45:00Z"),
    edited: false,
    editedAt: null
  }
]);

// Sample messages for Charlie and Ethan conversation
db.messages.insertMany([
  {
    conversationId: conv3.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440003",
    type: "TEXT",
    content: "Hey Ethan! Your post about Hue looks amazing!",
    timestamp: new Date("2024-05-17T18:30:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv3.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440005",
    type: "TEXT",
    content: "Thanks Charlie! The history there is incredible. Have you been?",
    timestamp: new Date("2024-05-17T18:45:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv3.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440003",
    type: "TEXT",
    content: "Not yet, but it's definitely on my list! Da Nang was beautiful though 🌅",
    timestamp: new Date("2024-05-18T09:15:00Z"),
    edited: false,
    editedAt: null
  },
  {
    conversationId: conv3.insertedId,
    senderId: "550e8400-e29b-41d4-a716-446655440005",
    type: "TEXT",
    content: "Da Nang beaches are perfect! We should plan a trip together sometime 🏖️",
    timestamp: new Date("2024-05-18T13:15:00Z"),
    edited: false,
    editedAt: null
  }
]);

print("Chat Service database initialized successfully!");
