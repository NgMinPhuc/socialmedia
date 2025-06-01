# Database Schema & Domain Models

## Database Schema Overview

The system uses multiple databases to optimize for different data access patterns and service isolation:

1. **PostgreSQL** - Relational data for Authentication Service
2. **MongoDB** - Document data for multiple services
3. **Neo4j** - Graph data for User Service
4. **Elasticsearch** - Search indices for Search Service
5. **Redis** - Caching for Post and Search Services

## PostgreSQL Schema

### Authentication Service Database (`authdb`)

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    failed_attempts INTEGER DEFAULT 0
);
```

#### Refresh_Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Indexes:**
- `idx_refresh_tokens_user_id` on `refresh_tokens(user_id)`
- `idx_refresh_tokens_token` on `refresh_tokens(token)`
## Neo4j Graph Schema (User Service)

### User Profiles and Social Relationships

#### User Nodes
```cypher
(:User {
  userId: "UUID",
  userName: "String",
  email: "String", 
  firstName: "String",
  lastName: "String",
  dob: "Date",
  phoneNumber: "String",
  location: "String"
})
```

#### Relationships
```cypher
(:User)-[:FOLLOWS]->(:User)
```

**Constraints:**
- `CONSTRAINT FOR (u:User) REQUIRE u.userId IS UNIQUE`
- `CONSTRAINT FOR (u:User) REQUIRE u.userName IS UNIQUE`
- `CONSTRAINT FOR (u:User) REQUIRE u.email IS UNIQUE`

**Indexes:**
- Index on `User.firstName`
- Index on `User.lastName`
- Index on `User.location`
## MongoDB Schema

### Post Service Database (`post_service_db`)

#### Posts Collection
```javascript
{
  postId: "String",
  userId: "UUID String",
  caption: "String",
  files: ["String"], // URLs to media files
  contentTypes: ["String"], // MIME types
  likesCount: "Number",
  commentsCount: "Number", 
  createdAt: "Date",
  updatedAt: "Date",
  privacy: "String", // public, private, friends
  listCommentId: ["String"] // Array of comment IDs
}
```

#### Comments Collection
```javascript
{
  commentId: "String",
  post: {
    $ref: "posts",
    $id: "ObjectId"
  },
  userId: "UUID String",
  content: "String",
  likesCount: "Number",
  createdAt: "Date",
  updatedAt: "Date"
}
```

**Indexes:**
- `{ "userId": 1, "createdAt": -1 }` on posts
- `{ "privacy": 1 }` on posts
- `{ "createdAt": -1 }` on posts
- `{ "post.$id": 1, "createdAt": -1 }` on comments
- `{ "userId": 1 }` on comments

### Chat Service Database (`chatDB`)

#### Conversations Collection
```javascript
{
  name: "String", // null for direct chats
  type: "String", // DIRECT or GROUP
  createdAt: "Date",
  updatedAt: "Date", 
  lastMessageAt: "Date",
  participants: [
    {
      userId: "UUID String",
      joinedAt: "Date",
      role: "String", // OWNER, ADMIN, MEMBER
      lastReadAt: "Date"
    }
  ]
}
```

#### Messages Collection
```javascript
{
  conversationId: "ObjectId",
  senderId: "UUID String",
  content: "String",
  mediaUrls: ["String"],
  timestamp: "Date",
  type: "String", // TEXT, IMAGE, FILE, etc.
  readBy: [
    {
      userId: "UUID String", 
      readAt: "Date"
    }
  ]
}
```

**Indexes:**
- `{ "participants.userId": 1 }` on conversations
- `{ "type": 1 }` on conversations
- `{ "lastMessageAt": -1 }` on conversations
- `{ "createdAt": -1 }` on conversations
- `{ "conversationId": 1, "timestamp": -1 }` on messages
- `{ "senderId": 1 }` on messages
- `{ "type": 1 }` on messages
- `{ "timestamp": -1 }` on messages

### Notification Service Database (`notification_service_db`)

#### Notifications Collection
```javascript
{
  userId: "UUID String",
  type: "String", // LIKE, COMMENT, FOLLOW, MENTION, TAG, MESSAGE, SYSTEM
  sourceId: "UUID String", // ID of user who triggered notification
  referenceId: "String", // ID of related entity (post, comment, etc.)
  referenceType: "String", // POST, COMMENT, USER, etc.
  content: "String",
  read: "Boolean",
  createdAt: "Date",
  readAt: "Date"
}
```

#### NotificationPreferences Collection
```javascript
{
  userId: "UUID String",
  preferences: {
    email: "Boolean",
    push: "Boolean", 
    sms: "Boolean"
  },
  types: {
    LIKE: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    COMMENT: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    FOLLOW: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    MENTION: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    TAG: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    MESSAGE: { enabled: "Boolean", email: "Boolean", push: "Boolean" },
    SYSTEM: { enabled: "Boolean", email: "Boolean", push: "Boolean" }
  },
  createdAt: "Date",
  updatedAt: "Date"
}
```

**Indexes:**
- `{ "userId": 1, "createdAt": -1 }` on notifications
- `{ "userId": 1, "read": 1 }` on notifications
- `{ "type": 1 }` on notifications
- `{ "sourceId": 1 }` on notifications
- `{ "referenceId": 1, "referenceType": 1 }` on notifications
- `{ "createdAt": -1 }` on notifications
- `{ "userId": 1 }` (unique) on notificationPreferences

## Elasticsearch Indices (Search Service)

### Users Index
```json
{
  "mappings": {
    "properties": {
      "userId": { "type": "keyword" },
      "username": { "type": "text", "analyzer": "standard" },
      "fullName": { "type": "text", "analyzer": "standard" },
      "location": { "type": "text", "analyzer": "standard" },
      "followerCount": { "type": "integer" },
      "followingCount": { "type": "integer" }
    }
  }
}
```

### Posts Index  
```json
{
  "mappings": {
    "properties": {
      "postId": { "type": "keyword" },
      "userId": { "type": "keyword" },
      "caption": { "type": "text", "analyzer": "standard" },
      "createdAt": { "type": "date" },
      "likesCount": { "type": "integer" },
      "commentsCount": { "type": "integer" },
      "privacy": { "type": "keyword" }
    }
  }
}
```

## Redis Caching Strategy

Used by **Post Service** and **Search Service** on port `6379`:

- **Post Service**: Cache frequently accessed posts and user feeds
- **Search Service**: Cache search results and user queries
- **Session Storage**: Store temporary data and user sessions

## Class Diagrams

### Authentication Domain

```
┌─────────────────┐      ┌─────────────────┐
│      User       │      │ RefreshToken    │
├─────────────────┤      ├─────────────────┤
│ id: UUID        │      │ id: UUID        │
│ username: String│      │ userId: UUID    │
│ email: String   │      │ token: String   │
│ password: String│      │ expiresAt: Date │
│ active: Boolean │      │ revoked: Boolean│
│ createdAt: Date │      │ createdAt: Date │
│ updatedAt: Date │      └─────────────────┘
│ lastLogin: Date │              │
│ failedAttempts  │              │
└─────────┬───────┘              │
          │                      │
          └──────────────────────┘
                   1:N
```

### User Profile Domain (Neo4j)

```
┌─────────────────┐      ┌─────────────────┐
│      User       │      │  Relationship   │
├─────────────────┤      ├─────────────────┤
│ userId: UUID    │      │ [:FOLLOWS]      │
│ userName: String│─────▶│ since: Date     │
│ email: String   │      │ status: String  │
│ firstName: String│     └─────────────────┘
│ lastName: String│              │
│ dob: Date       │              │
│ phoneNumber     │              ▼
│ location: String│      ┌─────────────────┐
└─────────────────┘      │      User       │
                         │ (Followed)      │
                         └─────────────────┘
```

### Content Domain

```
┌─────────────────┐      ┌─────────────────┐
│      Post       │      │    Comment      │
├─────────────────┤      ├─────────────────┤
│ postId: String  │      │ commentId: String│
│ userId: UUID    │      │ post: DBRef     │
│ caption: String │      │ userId: UUID    │
│ files: [String] │      │ content: String │
│ contentTypes    │      │ likesCount: Int │
│ likesCount: Int │      │ createdAt: Date │
│ commentsCount   │      │ updatedAt: Date │
│ createdAt: Date │      └─────────────────┘
│ updatedAt: Date │              │
│ privacy: String │              │
│ listCommentId   │              │
└─────────┬───────┘              │
          │                      │
          └──────────────────────┘
                   1:N
```

### Chat Domain

```
┌─────────────────┐      ┌─────────────────┐
│  Conversation   │      │    Message      │
├─────────────────┤      ├─────────────────┤
│ _id: ObjectId   │      │ _id: ObjectId   │
│ name: String    │      │ conversationId  │
│ type: String    │      │ senderId: UUID  │
│ createdAt: Date │      │ content: String │
│ updatedAt: Date │      │ mediaUrls       │
│ lastMessageAt   │      │ timestamp: Date │
│ participants: [{│      │ type: String    │
│   userId: UUID, │      │ readBy: [{      │
│   joinedAt: Date│      │   userId: UUID, │
│   role: String, │      │   readAt: Date  │
│   lastReadAt    │      │ }]              │
│ }]              │      └─────────────────┘
└─────────┬───────┘              │
          │                      │
          └──────────────────────┘
                   1:N
```

### Notification Domain

```
┌─────────────────┐      ┌─────────────────┐
│  Notification   │      │NotificationPref │
├─────────────────┤      ├─────────────────┤
│ _id: ObjectId   │      │ userId: UUID    │
│ userId: UUID    │      │ preferences: {  │
│ type: String    │      │   email: Boolean│
│ sourceId: UUID  │      │   push: Boolean │
│ referenceId     │      │   sms: Boolean  │
│ referenceType   │      │ }               │
│ content: String │      │ types: {        │
│ read: Boolean   │      │   LIKE: {...},  │
│ createdAt: Date │      │   COMMENT: {...}│
│ readAt: Date    │      │   ...           │
└─────────────────┘      │ }               │
                         │ createdAt: Date │
                         │ updatedAt: Date │
                         └─────────────────┘
```

## Entity Relationships

### Cross-Service Data Flow

```
┌─────────────────┐         ┌─────────────────┐
│   Auth Service  │         │  User Service   │
│   (PostgreSQL)  │ ◄──────►│    (Neo4j)      │
│                 │   UUID  │                 │
│ • User Auth     │         │ • User Profile  │
│ • JWT Tokens    │         │ • Social Graph  │
└─────────────────┘         └─────────────────┘
          │                           │
          │ UUID                      │ UUID
          ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Post Service   │         │  Chat Service   │
│   (MongoDB)     │         │   (MongoDB)     │
│                 │         │                 │
│ • Posts         │         │ • Conversations │
│ • Comments      │         │ • Messages      │
└─────────────────┘         └─────────────────┘
          │                           │
          │ Events                    │ Events
          ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ Search Service  │         │Notification Svc │
│(Elasticsearch) │         │   (MongoDB)     │
│                 │         │                 │
│ • User Index    │         │ • Notifications │
│ • Post Index    │         │ • Preferences   │
└─────────────────┘         └─────────────────┘
```

## Database Connection Configuration

### Service-Database Mapping

| Service | Database | Port | Database Name | Configuration |
|---------|----------|------|---------------|---------------|
| **Auth Service** | PostgreSQL | 5432 | `authdb` | `spring.datasource.url=jdbc:postgresql://localhost:5432/authdb` |
| **User Service** | Neo4j | 7687/7474 | `neo4j` | `spring.neo4j.uri=bolt://localhost:7687` |
| **Post Service** | MongoDB | 27017 | `post_service_db` | `spring.data.mongodb.uri=mongodb://localhost:27017/post_service_db` |
| **Chat Service** | MongoDB | 27017 | `chatDB` | `database.mongodb.uri=mongodb://localhost:27017/chatDB` |
| **Notification Service** | MongoDB | 27017 | `notification_service_db` | `spring.data.mongodb.uri=mongodb://localhost:27017/notification_service_db` |
| **Search Service** | Elasticsearch | 9200 | - | `spring.elasticsearch.uris=http://localhost:9200` |
| **Post Service** | Redis | 6379 | - | `spring.redis.host=localhost` |
| **Search Service** | Redis | 6379 | - | `spring.redis.host=localhost` |

### Database Initialization

#### PostgreSQL (Auth Service)
- **Schema**: Auto-created from `/src/main/resources/schema.sql`
- **Data**: Auto-loaded from `/src/main/resources/data.sql`
- **Mode**: `spring.sql.init.mode=always`

#### Neo4j (User Service)  
- **Schema**: Auto-executed from `/src/main/resources/schema.cypher`
- **Sample Data**: 5 sample users with follow relationships

#### MongoDB Services
- **Post Service**: Auto-initialized from `init-db.js` script
- **Chat Service**: Auto-initialized from `init-db.js` script  
- **Notification Service**: Auto-initialized from `init-db.js` script
- **Sample Data**: Pre-populated with sample posts, conversations, and notifications

#### Elasticsearch (Search Service)
- **Mappings**: Auto-loaded from `/src/main/resources/elasticsearch-mappings.json`
- **Auto-indexing**: Enabled for automatic index creation
