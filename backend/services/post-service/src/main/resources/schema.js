// MongoDB schema validator for Post Service 

// Posts collection validator
db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "content", "createdAt", "visibility"],
      properties: {
        userId: {
          bsonType: "string",
          description: "User ID who created the post"
        },
        content: {
          bsonType: "string",
          description: "Text content of the post"
        },
        mediaUrls: {
          bsonType: "array",
          description: "URLs to media attached to the post"
        },
        createdAt: {
          bsonType: "date",
          description: "Post creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Post update timestamp"
        },
        likeCount: {
          bsonType: "int",
          description: "Number of likes for the post"
        },
        commentCount: {
          bsonType: "int",
          description: "Number of comments on the post"
        },
        shareCount: {
          bsonType: "int",
          description: "Number of shares of the post"
        },
        visibility: {
          enum: ["PUBLIC", "FRIENDS", "PRIVATE"],
          description: "Visibility setting for the post"
        },
        tags: {
          bsonType: "array",
          description: "Users tagged in the post"
        },
        location: {
          bsonType: "object",
          properties: {
            name: {
              bsonType: "string",
              description: "Location name"
            },
            latitude: {
              bsonType: "double",
              description: "Latitude coordinate"
            },
            longitude: {
              bsonType: "double",
              description: "Longitude coordinate"
            }
          }
        },
        hashtags: {
          bsonType: "array",
          description: "Hashtags used in the post"
        }
      }
    }
  }
});

// Comments collection validator
db.createCollection("comments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["postId", "userId", "content", "createdAt"],
      properties: {
        postId: {
          bsonType: "objectId",
          description: "ID of the post this comment belongs to"
        },
        userId: {
          bsonType: "string",
          description: "User ID who created the comment"
        },
        content: {
          bsonType: "string",
          description: "Comment content"
        },
        createdAt: {
          bsonType: "date",
          description: "Comment creation timestamp"
        },
        updatedAt: {
          bsonType: "date",
          description: "Comment update timestamp"
        },
        likeCount: {
          bsonType: "int",
          description: "Number of likes for the comment"
        },
        parentId: {
          bsonType: ["objectId", "null"],
          description: "ID of parent comment for replies, null for top-level comments"
        }
      }
    }
  }
});

// Likes collection validator
db.createCollection("likes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["targetId", "targetType", "userId", "createdAt"],
      properties: {
        targetId: {
          bsonType: "objectId",
          description: "ID of the post or comment that was liked"
        },
        targetType: {
          enum: ["POST", "COMMENT"],
          description: "Type of the target (post or comment)"
        },
        userId: {
          bsonType: "string",
          description: "User ID who created the like"
        },
        createdAt: {
          bsonType: "date",
          description: "Like creation timestamp"
        }
      }
    }
  }
});

// Create indexes for better performance
db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ createdAt: -1 });
db.posts.createIndex({ hashtags: 1 });
db.posts.createIndex({ "location.latitude": 1, "location.longitude": 1 });

db.comments.createIndex({ postId: 1 });
db.comments.createIndex({ userId: 1 });
db.comments.createIndex({ parentId: 1 });

db.likes.createIndex({ targetId: 1, targetType: 1 });
db.likes.createIndex({ userId: 1 });
