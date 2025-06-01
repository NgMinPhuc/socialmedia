// MongoDB initialization script for Post Service
// This script should be run after MongoDB is started

// Switch to the post_service_db database
use post_service_db;

// Create collections if they don't exist
db.createCollection("posts");
db.createCollection("comments");

// Create additional indexes for performance
db.posts.createIndex({ "userId": 1, "createdAt": -1 });
db.posts.createIndex({ "privacy": 1 });
db.posts.createIndex({ "createdAt": -1 });

db.comments.createIndex({ "post.$id": 1, "createdAt": -1 });
db.comments.createIndex({ "userId": 1 });

// Sample posts data for 5 users
db.posts.insertMany([
  {
    postId: "post-001",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    caption: "Exploring the beautiful streets of Ho Chi Minh City! 🏙️ #travel #vietnam",
    files: ["https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800"],
    contentTypes: ["image/jpeg"],
    likesCount: 25,
    commentsCount: 3,
    createdAt: new Date("2024-05-15T10:30:00Z"),
    updatedAt: new Date("2024-05-15T10:30:00Z"),
    privacy: "public",
    listCommentId: ["comment-001", "comment-002", "comment-003"]
  },
  {
    postId: "post-002",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    caption: "Just finished an amazing coding session! Working on something exciting 💻✨",
    files: [],
    contentTypes: [],
    likesCount: 18,
    commentsCount: 2,
    createdAt: new Date("2024-05-16T14:15:00Z"),
    updatedAt: new Date("2024-05-16T14:15:00Z"),
    privacy: "public",
    listCommentId: ["comment-004", "comment-005"]
  },
  {
    postId: "post-003",
    userId: "550e8400-e29b-41d4-a716-446655440002",
    caption: "Hanoi morning vibes ☕ Perfect weather for a walk around the Old Quarter",
    files: ["https://images.unsplash.com/photo-1509484515669-5511bb27b5c2?w=800"],
    contentTypes: ["image/jpeg"],
    likesCount: 32,
    commentsCount: 4,
    createdAt: new Date("2024-05-16T07:45:00Z"),
    updatedAt: new Date("2024-05-16T07:45:00Z"),
    privacy: "public",
    listCommentId: ["comment-006", "comment-007", "comment-008", "comment-009"]
  },
  {
    postId: "post-004",
    userId: "550e8400-e29b-41d4-a716-446655440003",
    caption: "Weekend getaway to Da Nang beach! The sunset was absolutely breathtaking 🌅",
    files: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800"],
    contentTypes: ["image/jpeg"],
    likesCount: 45,
    commentsCount: 5,
    createdAt: new Date("2024-05-17T18:20:00Z"),
    updatedAt: new Date("2024-05-17T18:20:00Z"),
    privacy: "public",
    listCommentId: ["comment-010", "comment-011", "comment-012", "comment-013", "comment-014"]
  },
  {
    postId: "post-005",
    userId: "550e8400-e29b-41d4-a716-446655440004",
    caption: "Learning new recipes today! Vietnamese cuisine is so diverse and delicious 🍜",
    files: [],
    contentTypes: [],
    likesCount: 22,
    commentsCount: 3,
    createdAt: new Date("2024-05-17T16:10:00Z"),
    updatedAt: new Date("2024-05-17T16:10:00Z"),
    privacy: "friends",
    listCommentId: ["comment-015", "comment-016", "comment-017"]
  },
  {
    postId: "post-006",
    userId: "550e8400-e29b-41d4-a716-446655440005",
    caption: "Historic Hue is absolutely amazing! So much culture and history 🏛️ #heritage",
    files: ["https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"],
    contentTypes: ["image/jpeg"],
    likesCount: 38,
    commentsCount: 6,
    createdAt: new Date("2024-05-18T09:30:00Z"),
    updatedAt: new Date("2024-05-18T09:30:00Z"),
    privacy: "public",
    listCommentId: ["comment-018", "comment-019", "comment-020", "comment-021", "comment-022", "comment-023"]
  }
]);

// Get the inserted post ObjectIds for proper DBRef
var post1 = db.posts.findOne({postId: "post-001"});
var post2 = db.posts.findOne({postId: "post-002"});
var post3 = db.posts.findOne({postId: "post-003"});
var post4 = db.posts.findOne({postId: "post-004"});
var post5 = db.posts.findOne({postId: "post-005"});
var post6 = db.posts.findOne({postId: "post-006"});

// Sample comments data
db.comments.insertMany([
  {
    commentId: "comment-001",
    post: DBRef("posts", post1._id),
    userId: "550e8400-e29b-41d4-a716-446655440002",
    content: "Beautiful shot! I love HCMC too 😍",
    createdAt: new Date("2024-05-15T11:00:00Z"),
    updatedAt: new Date("2024-05-15T11:00:00Z")
  },
  {
    commentId: "comment-002",
    post: DBRef("posts", post1._id),
    userId: "550e8400-e29b-41d4-a716-446655440003",
    content: "Which district is this? Looks amazing!",
    createdAt: new Date("2024-05-15T11:15:00Z"),
    updatedAt: new Date("2024-05-15T11:15:00Z")
  },
  {
    commentId: "comment-003",
    post: DBRef("posts", post1._id),
    userId: "550e8400-e29b-41d4-a716-446655440004",
    content: "I need to visit soon! Thanks for sharing ✨",
    createdAt: new Date("2024-05-15T12:30:00Z"),
    updatedAt: new Date("2024-05-15T12:30:00Z")
  },
  {
    commentId: "comment-004",
    post: DBRef("posts", post2._id),
    userId: "550e8400-e29b-41d4-a716-446655440005",
    content: "What are you working on? Sounds interesting!",
    createdAt: new Date("2024-05-16T14:45:00Z"),
    updatedAt: new Date("2024-05-16T14:45:00Z")
  },
  {
    commentId: "comment-005",
    post: DBRef("posts", post2._id),
    userId: "550e8400-e29b-41d4-a716-446655440003",
    content: "Keep it up! 💪",
    createdAt: new Date("2024-05-16T15:00:00Z"),
    updatedAt: new Date("2024-05-16T15:00:00Z")
  },
  {
    commentId: "comment-006",
    post: DBRef("posts", post3._id),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Hanoi mornings are the best! ☕",
    createdAt: new Date("2024-05-16T08:00:00Z"),
    updatedAt: new Date("2024-05-16T08:00:00Z")
  },
  {
    commentId: "comment-007",
    post: DBRef("posts", post3._id),
    userId: "550e8400-e29b-41d4-a716-446655440004",
    content: "I miss the Old Quarter so much!",
    createdAt: new Date("2024-05-16T08:30:00Z"),
    updatedAt: new Date("2024-05-16T08:30:00Z")
  },
  {
    commentId: "comment-008",
    post: DBRef("posts", post3._id),
    userId: "550e8400-e29b-41d4-a716-446655440005",
    content: "Perfect weather indeed! Enjoy your walk 🚶‍♂️",
    createdAt: new Date("2024-05-16T09:00:00Z"),
    updatedAt: new Date("2024-05-16T09:00:00Z")
  },
  {
    commentId: "comment-009",
    post: DBRef("posts", post3._id),
    userId: "550e8400-e29b-41d4-a716-446655440002",
    content: "Old Quarter is magical in the morning! 🌅",
    createdAt: new Date("2024-05-16T09:30:00Z"),
    updatedAt: new Date("2024-05-16T09:30:00Z")
  },
  {
    commentId: "comment-010",
    post: DBRef("posts", post4._id),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Da Nang beaches are incredible! 🏖️",
    createdAt: new Date("2024-05-17T19:00:00Z"),
    updatedAt: new Date("2024-05-17T19:00:00Z")
  },
  {
    commentId: "comment-011",
    post: DBRef("posts", post4._id),
    userId: "550e8400-e29b-41d4-a716-446655440002",
    content: "That sunset looks amazing! 🌅",
    createdAt: new Date("2024-05-17T19:15:00Z"),
    updatedAt: new Date("2024-05-17T19:15:00Z")
  },
  {
    commentId: "comment-012",
    post: DBRef("posts", post4._id),
    userId: "550e8400-e29b-41d4-a716-446655440004",
    content: "Perfect weekend getaway spot!",
    createdAt: new Date("2024-05-17T19:30:00Z"),
    updatedAt: new Date("2024-05-17T19:30:00Z")
  },
  {
    commentId: "comment-013",
    post: DBRef("posts", post4._id),
    userId: "550e8400-e29b-41d4-a716-446655440005",
    content: "I need to plan a trip there soon!",
    createdAt: new Date("2024-05-17T20:00:00Z"),
    updatedAt: new Date("2024-05-17T20:00:00Z")
  },
  {
    commentId: "comment-014",
    post: DBRef("posts", post4._id),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Thanks for sharing! Great photo 📸",
    createdAt: new Date("2024-05-17T20:30:00Z"),
    updatedAt: new Date("2024-05-17T20:30:00Z")
  },
  {
    commentId: "comment-015",
    post: DBRef("posts", post5._id),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Vietnamese food is the best! 🍜",
    createdAt: new Date("2024-05-17T16:45:00Z"),
    updatedAt: new Date("2024-05-17T16:45:00Z")
  },
  {
    commentId: "comment-016",
    post: DBRef("posts", post5._id),
    userId: "550e8400-e29b-41d4-a716-446655440003",
    content: "What recipe are you trying? Looks delicious!",
    createdAt: new Date("2024-05-17T17:00:00Z"),
    updatedAt: new Date("2024-05-17T17:00:00Z")
  },
  {
    commentId: "comment-017",
    post: DBRef("posts", post5._id),
    userId: "550e8400-e29b-41d4-a716-446655440005",
    content: "Share the recipe when you're done! 👨‍🍳",
    createdAt: new Date("2024-05-17T17:30:00Z"),
    updatedAt: new Date("2024-05-17T17:30:00Z")
  },
  {
    commentId: "comment-018",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440001",
    content: "Hue is such a historic gem! 🏛️",
    createdAt: new Date("2024-05-18T10:00:00Z"),
    updatedAt: new Date("2024-05-18T10:00:00Z")
  },
  {
    commentId: "comment-019",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440002",
    content: "The Imperial City is breathtaking!",
    createdAt: new Date("2024-05-18T10:30:00Z"),
    updatedAt: new Date("2024-05-18T10:30:00Z")
  },
  {
    commentId: "comment-020",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440003",
    content: "Vietnam's history is so rich and fascinating ✨",
    createdAt: new Date("2024-05-18T11:00:00Z"),
    updatedAt: new Date("2024-05-18T11:00:00Z")
  },
  {
    commentId: "comment-021",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440004",
    content: "Great photo! Did you visit the tombs too?",
    createdAt: new Date("2024-05-18T11:30:00Z"),
    updatedAt: new Date("2024-05-18T11:30:00Z")
  },
  {
    commentId: "comment-022",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440005",
    content: "Adding Hue to my travel bucket list! 📝",
    createdAt: new Date("2024-05-18T12:00:00Z"),
    updatedAt: new Date("2024-05-18T12:00:00Z")
  },
  {
    commentId: "comment-023",
    post: DBRef("posts", post6._id),
    userId: "550e8400-e29b-41d4-a716-446655440002",
    content: "Perfect weather for exploring the city! ☀️",
    createdAt: new Date("2024-05-18T12:30:00Z"),
    updatedAt: new Date("2024-05-18T12:30:00Z")
  }
]);

print("Post Service database initialized successfully with sample data!");
