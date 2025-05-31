# Database Schema & Domain Models

## Database Schema Overview

The system uses multiple databases to optimize for different data access patterns:

1. **PostgreSQL** - Relational data (users, authentication)
2. **MongoDB** - Document data (posts, comments, notifications)
3. **Neo4j** - Graph data (social relationships)
4. **Elasticsearch** - Search indices (full-text search)
5. **Redis** - Caching and ephemeral data

## PostgreSQL Schema

### Authentication Service Database

#### Users Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ id             │ UUID        │ Primary key                        │
│ username       │ VARCHAR(50) │ Unique username                    │
│ email          │ VARCHAR(100)│ Unique email address               │
│ password_hash  │ VARCHAR(100)│ BCrypt hashed password             │
│ active         │ BOOLEAN     │ Account active status              │
│ created_at     │ TIMESTAMP   │ Account creation timestamp         │
│ last_login     │ TIMESTAMP   │ Last successful login              │
│ failed_attempts│ INTEGER     │ Count of failed login attempts     │
└────────────────┴─────────────┴────────────────────────────────────┘
```

#### Roles Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ id             │ UUID        │ Primary key                        │
│ name           │ VARCHAR(50) │ Role name (USER, ADMIN, etc)       │
└────────────────┴─────────────┴────────────────────────────────────┘
```

#### User_Roles Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ user_id        │ UUID        │ Foreign key to Users               │
│ role_id        │ UUID        │ Foreign key to Roles               │
├────────────────┼─────────────┼────────────────────────────────────┤
│ Primary Key    │ (user_id, role_id)                               │
└────────────────┴─────────────────────────────────────────────────┘
```

#### Refresh_Tokens Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ id             │ UUID        │ Primary key                        │
│ user_id        │ UUID        │ Foreign key to Users               │
│ token          │ VARCHAR(255)│ Refresh token value                │
│ expires_at     │ TIMESTAMP   │ Expiration time                    │
│ revoked        │ BOOLEAN     │ Whether token is revoked           │
│ created_at     │ TIMESTAMP   │ Creation timestamp                 │
└────────────────┴─────────────┴────────────────────────────────────┘
```

### User Service Database

#### User_Profiles Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ id             │ UUID        │ Primary key (same as Users.id)     │
│ first_name     │ VARCHAR(50) │ User's first name                  │
│ last_name      │ VARCHAR(50) │ User's last name                   │
│ bio            │ TEXT        │ User's biography                   │
│ location       │ VARCHAR(100)│ User's location                    │
│ avatar_url     │ VARCHAR(255)│ URL to avatar image                │
│ cover_url      │ VARCHAR(255)│ URL to cover image                 │
│ date_of_birth  │ DATE        │ User's birth date                  │
│ phone_number   │ VARCHAR(20) │ User's phone number                │
│ website        │ VARCHAR(100)│ User's website                     │
│ created_at     │ TIMESTAMP   │ Creation timestamp                 │
│ updated_at     │ TIMESTAMP   │ Last update timestamp              │
└────────────────┴─────────────┴────────────────────────────────────┘
```

#### User_Settings Table
```
┌────────────────┬─────────────┬────────────────────────────────────┐
│ Column         │ Type        │ Description                        │
├────────────────┼─────────────┼────────────────────────────────────┤
│ user_id        │ UUID        │ Foreign key to User_Profiles       │
│ privacy_level  │ VARCHAR(20) │ PUBLIC, FRIENDS, PRIVATE           │
│ email_notif    │ BOOLEAN     │ Email notification preference      │
│ push_notif     │ BOOLEAN     │ Push notification preference       │
│ theme          │ VARCHAR(20) │ UI theme preference                │
│ language       │ VARCHAR(10) │ Language preference                │
└────────────────┴─────────────┴────────────────────────────────────┘
```

## MongoDB Schema

### Post Service Collections

#### Posts Collection
```json
{
  "_id": "ObjectId",
  "userId": "UUID",
  "content": "String",
  "mediaUrls": ["String"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "likeCount": "Number",
  "commentCount": "Number",
  "shareCount": "Number",
  "visibility": "String (PUBLIC, FRIENDS, PRIVATE)",
  "tags": ["String"],
  "location": {
    "name": "String",
    "latitude": "Number",
    "longitude": "Number"
  },
  "hashtags": ["String"]
}
```

#### Comments Collection
```json
{
  "_id": "ObjectId",
  "postId": "ObjectId",
  "userId": "UUID",
  "content": "String",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "likeCount": "Number",
  "parentId": "ObjectId (for replies, null for top-level)"
}
```

#### Likes Collection
```json
{
  "_id": "ObjectId",
  "targetId": "ObjectId (post or comment ID)",
  "targetType": "String (POST or COMMENT)",
  "userId": "UUID",
  "createdAt": "ISODate"
}
```

### Chat Service Collections

#### Conversations Collection
```json
{
  "_id": "ObjectId",
  "name": "String (for group chats)",
  "type": "String (DIRECT or GROUP)",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "lastMessageAt": "ISODate",
  "participants": [
    {
      "userId": "UUID",
      "joinedAt": "ISODate",
      "role": "String (OWNER, ADMIN, MEMBER)",
      "lastReadAt": "ISODate"
    }
  ]
}
```

#### Messages Collection
```json
{
  "_id": "ObjectId",
  "conversationId": "ObjectId",
  "senderId": "UUID",
  "content": "String",
  "mediaUrls": ["String"],
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "readBy": [
    {
      "userId": "UUID",
      "readAt": "ISODate"
    }
  ],
  "status": "String (SENT, DELIVERED, READ)",
  "replyTo": "ObjectId (if replying to a message)"
}
```

### Notification Service Collections

#### Notifications Collection
```json
{
  "_id": "ObjectId",
  "userId": "UUID",
  "type": "String (LIKE, COMMENT, FOLLOW, etc)",
  "sourceId": "UUID (source user ID)",
  "referenceId": "String (relevant entity ID)",
  "referenceType": "String (POST, COMMENT, USER, etc)",
  "content": "String",
  "read": "Boolean",
  "createdAt": "ISODate",
  "readAt": "ISODate"
}
```

## Neo4j Graph Schema

### Social Graph Model

#### Nodes
```
(:User {id: UUID, username: String})
(:Hashtag {name: String})
(:Location {name: String, latitude: Float, longitude: Float})
```

#### Relationships
```
(:User)-[:FOLLOWS {since: DateTime}]->(:User)
(:User)-[:BLOCKED {since: DateTime}]->(:User)
(:User)-[:POSTED {at: DateTime}]->(:Post)
(:User)-[:LIKED {at: DateTime}]->(:Post)
(:User)-[:COMMENTED {at: DateTime}]->(:Comment)
(:Post)-[:HAS_TAG]->(:Hashtag)
(:Post)-[:LOCATED_AT]->(:Location)
```

## Elasticsearch Indices

### Search Service Indices

#### Users Index
```json
{
  "mappings": {
    "properties": {
      "userId": { "type": "keyword" },
      "username": { "type": "text", "analyzer": "standard" },
      "fullName": { "type": "text", "analyzer": "standard" },
      "bio": { "type": "text", "analyzer": "standard" },
      "location": { "type": "text", "analyzer": "standard" },
      "tags": { "type": "keyword" },
      "createdAt": { "type": "date" },
      "followerCount": { "type": "integer" },
      "followingCount": { "type": "integer" }
    }
  }
}
```

#### Posts Index
```json
{
  "mappings": {
    "properties": {
      "postId": { "type": "keyword" },
      "userId": { "type": "keyword" },
      "content": { "type": "text", "analyzer": "standard" },
      "hashtags": { "type": "keyword" },
      "location": { "type": "geo_point" },
      "createdAt": { "type": "date" },
      "likeCount": { "type": "integer" },
      "commentCount": { "type": "integer" },
      "shareCount": { "type": "integer" }
    }
  }
}
```

## Class Diagrams

### User Domain

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│     User      │      │  UserProfile  │      │ UserSettings  │
├───────────────┤      ├───────────────┤      ├───────────────┤
│ id: UUID      │      │ id: UUID      │      │ userId: UUID  │
│ username      │      │ firstName     │      │ privacyLevel  │
│ email         │      │ lastName      │      │ emailNotif    │
│ passwordHash  │      │ bio           │      │ pushNotif     │
│ active        │      │ location      │      │ theme         │
│ createdAt     │      │ avatarUrl     │      │ language      │
│ lastLogin     │      │ coverUrl      │      └───────────────┘
│ failedAttempts│      │ dateOfBirth   │
└───────┬───────┘      │ phoneNumber   │
        │              │ website       │
        │              │ createdAt     │
        │              │ updatedAt     │
        │              └───────┬───────┘
        │                      │
        └──────────────────────┘
                  1:1
```

### Content Domain

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│     Post      │      │    Comment    │      │     Like      │
├───────────────┤      ├───────────────┤      ├───────────────┤
│ id: ObjectId  │      │ id: ObjectId  │      │ id: ObjectId  │
│ userId: UUID  │      │ postId        │      │ targetId      │
│ content       │      │ userId        │      │ targetType    │
│ mediaUrls     │      │ content       │      │ userId        │
│ createdAt     │      │ createdAt     │      │ createdAt     │
│ updatedAt     │      │ updatedAt     │      └───────────────┘
│ likeCount     │      │ likeCount     │
│ commentCount  │      │ parentId      │
│ shareCount    │      └───────┬───────┘
│ visibility    │              │
│ tags          │              │
│ location      │              │
│ hashtags      │              │
└───────┬───────┘              │
        │                      │
        └──────────────────────┘
                 1:N
```

### Chat Domain

```
┌───────────────┐      ┌───────────────┐
│ Conversation  │      │    Message    │
├───────────────┤      ├───────────────┤
│ id: ObjectId  │      │ id: ObjectId  │
│ name          │      │ conversationId│
│ type          │      │ senderId      │
│ createdAt     │      │ content       │
│ updatedAt     │      │ mediaUrls     │
│ lastMessageAt │      │ createdAt     │
│ participants  │      │ updatedAt     │
└───────┬───────┘      │ readBy        │
        │              │ status        │
        │              │ replyTo       │
        │              └───────┬───────┘
        │                      │
        └──────────────────────┘
                 1:N
```

### Notification Domain

```
┌───────────────┐
│ Notification  │
├───────────────┤
│ id: ObjectId  │
│ userId        │
│ type          │
│ sourceId      │
│ referenceId   │
│ referenceType │
│ content       │
│ read          │
│ createdAt     │
│ readAt        │
└───────────────┘
```

## Entity Relationships

### Authentication & User Management
```
┌───────────┐         ┌───────────┐         ┌───────────┐
│   User    │1       N│  User     │N       1│   User    │
│(Auth)     │◄────────┤  Roles    ├────────►│  Profile  │
└───────────┘         └───────────┘         └───────────┘
      │                                            │
      │                                            │
      ▼                                            ▼
┌───────────┐                              ┌───────────┐
│ Refresh   │                              │   User    │
│  Token    │                              │ Settings  │
└───────────┘                              └───────────┘
```

### Content Management
```
┌───────────┐         ┌───────────┐         ┌───────────┐
│   User    │1       N│   Post    │1       N│  Comment  │
│           │◄────────┤           ├────────►│           │
└───────────┘         └───────────┘         └───────────┘
                            │                     │
                            │                     │
                            ▼                     ▼
                      ┌───────────┐         ┌───────────┐
                      │   Like    │         │   Like    │
                      │ (Post)    │         │ (Comment) │
                      └───────────┘         └───────────┘
```

### Communication
```
┌───────────┐         ┌───────────┐         ┌───────────┐
│   User    │N       M│Conversation│1       N│  Message  │
│           │◄────────┤           ├────────►│           │
└───────────┘         └───────────┘         └───────────┘
      │                                            │
      │                                            │
      ▼                                            ▼
┌───────────┐                              ┌───────────┐
│ Participant│                             │ Read      │
│  Status   │                              │ Status    │
└───────────┘                              └───────────┘
```
