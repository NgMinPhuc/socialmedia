# User Service

Service for managing user information and profiles in the Social Media system.

## Port
- 8082

## Main Functions
1. **Profile Management**
   - Create new profile
   - Update information
   - View profile
   - List profiles

2. **Avatar Management**
   - Upload avatar
   - Get avatar
   - Update avatar

## API Endpoints

### 1. Create Profile (POST /users/create)
```http
POST http://localhost:8082/users/create
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "userId": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "johndoe",
    "dob": "1990-01-01",
    "phoneNumber": "+1234567890",
    "location": "New York",
    "email": "john@example.com"
}
```

### 2. Update Profile (PUT /users/update)
```http
PUT http://localhost:8082/users/update
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "userId": "user123",
    "firstName": "John",
    "lastName": "Doe",
    "userName": "johndoe",
    "dob": "1990-01-01",
    "phoneNumber": "+1234567890",
    "location": "Los Angeles",
    "email": "john@example.com"
}
```

### 3. View Profile (GET /users/{userId})
```http
GET http://localhost:8082/users/user123
Authorization: Bearer <your_jwt_token>
```

### 4. View All Profiles (GET /users/me)
```http
GET http://localhost:8082/users/me
Authorization: Bearer <your_jwt_token>
```

### 5. Upload Avatar (POST /users/avatar)
```http
POST http://localhost:8082/users/avatar
Content-Type: multipart/form-data
Authorization: Bearer <your_jwt_token>

{
    "userId": "user123",
    "avatar": <file>
}
```

### 6. Get Avatar (GET /users/{userId}/avatar)
```http
GET http://localhost:8082/users/user123/avatar
Authorization: Bearer <your_jwt_token>
```

## Configuration

### application.yaml
```yaml
server:
  port: 8082

spring:
  application:
    name: user-service
  data:
    mongodb:
      uri: mongodb://localhost:27017/socialmedia
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

file:
  upload-dir: ./uploads/avatars

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
- 404: User not found
- 400: Invalid input data
- 413: File too large
- 415: Unsupported media type
- 500: Internal server error 