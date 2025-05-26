# Search Service

Service for searching posts and users in the Social Media system.

## Port
- 8085

## Main Functions
1. **Content Search**
   - Search posts
   - Search users
   - Combined search
   - Result pagination
   - Result sorting

2. **Index Management**
   - Create new index
   - Update index
   - Reindex all data

## API Endpoints

### 1. Search (GET /search)
```http
GET http://localhost:8085/search?query=test&type=all&page=0&size=10&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <your_jwt_token>
```

Example Response:
```json
{
    "code": 200,
    "message": "Search completed successfully",
    "result": {
        "users": [
            {
                "id": "1",
                "userId": "user123",
                "firstName": "John",
                "lastName": "Doe",
                "userName": "johndoe",
                "dob": "1990-01-01",
                "phoneNumber": "+1234567890",
                "location": "New York",
                "email": "john@example.com",
                "avatar": null
            }
        ],
        "posts": [
            {
                "postId": "1",
                "userId": "user123",
                "caption": "This is a test post",
                "files": ["image1.jpg", "image2.jpg"],
                "contentTypes": ["image/jpeg", "image/jpeg"],
                "createdAt": "2024-03-26T10:00:00",
                "updatedAt": "2024-03-26T10:00:00",
                "privacy": "PUBLIC",
                "listCommentId": ["comment1", "comment2"]
            }
        ],
        "totalHits": 2,
        "page": 0,
        "size": 10
    }
}
```

### 2. Reindex Data (POST /search/reindex)
```http
POST http://localhost:8085/search/reindex
Authorization: Bearer <your_jwt_token>
```

Example Response:
```json
{
    "code": 200,
    "message": "Reindexing completed successfully"
}
```

## Configuration

### application.yaml
```yaml
server:
  port: 8085

spring:
  application:
    name: search-service
  data:
    elasticsearch:
      uris: http://localhost:9200
      username: elastic
      password: your_password

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

## Dependencies
- Spring Boot 3.x
- Spring Security
- Spring Data Elasticsearch
- Spring Cloud Eureka Client
- Lombok
- Validation

## Error Codes
- 404: Resource not found
- 400: Invalid input data
- 401: Unauthorized
- 403: Forbidden (ADMIN role required for reindex)
- 500: Internal server error

## Search Parameters

### Query Parameters
- `query`: Search keyword
- `type`: Search type ("all", "users", "posts")
- `page`: Page number (default: 0)
- `size`: Results per page (default: 10)
- `sortBy`: Sort field (default: "createdAt")
- `sortOrder`: Sort order ("asc" or "desc", default: "desc")

## Index Structure

### User Index
```json
{
    "id": "string",
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "userName": "string",
    "dob": "date",
    "phoneNumber": "string",
    "location": "string",
    "email": "string",
    "avatar": "string"
}
```

### Post Index
```json
{
    "postId": "string",
    "userId": "string",
    "caption": "string",
    "files": ["string"],
    "contentTypes": ["string"],
    "createdAt": "date",
    "updatedAt": "date",
    "privacy": "string",
    "listCommentId": ["string"]
}
``` 