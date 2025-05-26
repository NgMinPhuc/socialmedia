# Authentication Service

Service for handling user authentication and authorization in the Social Media system.

## Port
- 8081

## Main Functions
1. **Account Registration**
   - Check username/email duplicates
   - Password encryption
   - Create new account

2. **Login**
   - Authenticate login information
   - Generate JWT token
   - Generate refresh token

3. **Token Management**
   - Refresh token
   - Validate token
   - Logout (invalidate token)

4. **Password Management**
   - Change password
   - Check password strength

## API Endpoints

### 1. Register (POST /auth/register)
```http
POST http://localhost:8081/auth/register
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
}
```

### 2. Login (POST /auth/login)
```http
POST http://localhost:8081/auth/login
Content-Type: application/json

{
    "username": "johndoe",
    "password": "password123"
}
```

### 3. Refresh Token (POST /auth/refreshToken)
```http
POST http://localhost:8081/auth/refreshToken
Content-Type: application/json

{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Logout (POST /auth/logout)
```http
POST http://localhost:8081/auth/logout
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 5. Validate Token (POST /auth/validateToken)
```http
POST http://localhost:8081/auth/validateToken
Content-Type: application/json

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 6. Change Password (POST /auth/changePassword)
```http
POST http://localhost:8081/auth/changePassword
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
    "oldPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
}
```

## Configuration

### application.yaml
```yaml
server:
  port: 8081

spring:
  application:
    name: authen-service
  data:
    mongodb:
      uri: mongodb://localhost:27017/socialmedia

jwt:
  secret: your_jwt_secret_key
  expiration: 86400000  # 24 hours
  refresh-token:
    expiration: 604800000  # 7 days

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

## Dependencies
- Spring Boot 3.x
- Spring Security
- Spring Data MongoDB
- JWT
- Spring Cloud Eureka Client
- Lombok
- Validation

## Error Codes
- 404: User not found
- 401: Invalid credentials
- 409: Username/email already exists
- 400: Invalid input data
- 500: Internal server error 