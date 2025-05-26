# Post Service

Service for managing posts and comments in the Social Media system.

## Port
- 8083

## Main Functions
1. **Post Management**
   - Create new post
   - Update post
   - View post
   - Delete post
   - List posts

2. **Comment Management**
   - Add comment
   - Update comment
   - View comment
   - Delete comment

## API Endpoints

### 1. Create Post (POST /posts)
```http
POST http://localhost:8083/posts
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "userId": "user123",
    "caption": "This is a test post",
    "files": ["image1.jpg", "image2.jpg"],
    "contentTypes": ["image/jpeg", "image/jpeg"],
    "privacy": "PUBLIC"
}
```

### 2. View Post (GET /posts/{postId})
```http
GET http://localhost:8083/posts/1
Authorization: Bearer <your_jwt_token>
```

### 3. List Posts (GET /posts)
```http
GET http://localhost:8083/posts?userId=user123&page=0&size=10&sortBy=createdAt&sortDirection=desc
Authorization: Bearer <your_jwt_token>
```

### 4. Update Post (PUT /posts/{postId})
```http
PUT http://localhost:8083/posts/1
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "caption": "Updated test post",
    "privacy": "PRIVATE"
}
```

### 5. Delete Post (DELETE /posts/{postId})
```http
DELETE http://localhost:8083/posts/1
Authorization: Bearer <your_jwt_token>
```

### 6. Add Comment (POST /comments)
```http
POST http://localhost:8083/comments
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "postId": "1",
    "userId": "user123",
    "content": "This is a test comment"
}
```

### 7. View Comments (GET /comments/{postId})
```http
GET http://localhost:8083/comments/1?page=0&size=10&sortBy=createdAt&sortDirection=desc
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "postId": "1"
}
```

### 8. Update Comment (PUT /comments/{commentId})
```http
PUT http://localhost:8083/comments/1
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "commentId": "1",
    "content": "Updated test comment"
}
```

## Configuration

### application.yaml
```yaml
server:
  port: 8083

spring:
  application:
    name: post-service
  data:
    mongodb:
      uri: mongodb://localhost:27017/socialmedia
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

file:
  upload-dir: ./uploads/posts

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

## Dependencies
- Spring Boot 3.x
- Spring Security
- Spring Data MongoDB
- Spring Cloud Eureka Client
- Lombok
- Validation

## Error Codes
- 404: Post/Comment not found
- 400: Invalid input data
- 413: File too large
- 415: Unsupported media type
- 500: Internal server error 