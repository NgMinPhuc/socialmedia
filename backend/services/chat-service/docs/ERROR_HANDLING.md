# Chat Service Error Handling Documentation

## Overview
This document describes the comprehensive error handling system implemented in the chat service, providing consistent error responses and proper logging throughout the application.

## Error Handling Architecture

### 1. Error Code System (`internal/errors/error_codes.go`)

The error code system provides standardized error identification:

```go
type ErrorCode string

const (
    // General errors
    INTERNAL_SERVER_ERROR ErrorCode = "INTERNAL_SERVER_ERROR"
    INVALID_INPUT         ErrorCode = "INVALID_INPUT"
    DATABASE_ERROR        ErrorCode = "DATABASE_ERROR"
    
    // Authentication errors
    UNAUTHORIZED          ErrorCode = "UNAUTHORIZED"
    INVALID_TOKEN         ErrorCode = "INVALID_TOKEN"
    TOKEN_EXPIRED         ErrorCode = "TOKEN_EXPIRED"
    
    // Chat-specific errors
    MESSAGE_NOT_FOUND      ErrorCode = "MESSAGE_NOT_FOUND"
    CONVERSATION_NOT_FOUND ErrorCode = "CONVERSATION_NOT_FOUND"
    INVALID_USER_ID        ErrorCode = "INVALID_USER_ID"
    MESSAGE_TOO_LONG       ErrorCode = "MESSAGE_TOO_LONG"
    MESSAGE_EMPTY          ErrorCode = "MESSAGE_EMPTY"
    WEBSOCKET_UPGRADE_FAILED ErrorCode = "WEBSOCKET_UPGRADE_FAILED"
    EXTERNAL_SERVICE_ERROR   ErrorCode = "EXTERNAL_SERVICE_ERROR"
)
```

### 2. AppError Structure (`internal/errors/app_error.go`)

The `AppError` struct provides structured error handling with cause wrapping:

```go
type AppError struct {
    Code    ErrorCode `json:"code"`
    Message string    `json:"message"`
    Cause   error     `json:"-"`
}
```

**Key Features:**
- Wraps underlying errors while preserving the original cause
- Provides structured logging capabilities
- Supports error chain analysis
- Maps error codes to appropriate HTTP status codes

### 3. Response Structure (`internal/response/response.go`)

Standardized API response format:

```go
type APIResponse struct {
    Success      bool        `json:"success"`
    Data         interface{} `json:"data,omitempty"`
    ErrorCode    string      `json:"errorCode,omitempty"`
    ErrorMessage string      `json:"errorMessage,omitempty"`
    Timestamp    time.Time   `json:"timestamp"`
}
```

## Implementation Guidelines

### 1. Service Layer Error Handling

**In service methods:**
```go
func (s *ChatService) SendMessage(message *models.Message) error {
    // Validate input
    if err := validation.ValidateMessage(message); err != nil {
        return errors.NewAppError(errors.INVALID_INPUT, "Message validation failed", err)
    }
    
    // Check user existence
    if _, err := s.externalService.GetUserInfo(message.ToID); err != nil {
        return errors.NewAppError(errors.INVALID_USER_ID, "Recipient user not found", err)
    }
    
    // Save to database
    if err := s.repository.SaveMessage(message); err != nil {
        return errors.NewAppError(errors.DATABASE_ERROR, "Failed to save message", err)
    }
    
    return nil
}
```

### 2. Handler Layer Error Handling

**In HTTP handlers:**
```go
func (h *ChatHandler) GetConversation(c *gin.Context) {
    otherID := c.Param("otherID")
    
    // Validate UUID format
    if !validation.IsValidUUID(otherID) {
        response.ErrorResponse(c, errors.NewAppError(
            errors.INVALID_USER_ID,
            "Invalid user ID format",
            nil,
        ))
        return
    }
    
    // Call service
    messages, err := h.service.GetConversation(userID, otherID, 50)
    if err != nil {
        response.ErrorResponse(c, err)
        return
    }
    
    response.SuccessResponse(c, map[string]interface{}{
        "messages": messages,
        "otherUser": userInfo,
    })
}
```

### 3. Repository Layer Error Handling

**In repository methods:**
```go
func (r *ChatRepository) GetConversation(userID1, userID2 string, limit int) ([]models.Message, error) {
    if userID1 == "" || userID2 == "" {
        return nil, errors.NewAppError(errors.INVALID_INPUT, "User IDs cannot be empty", nil)
    }
    
    cursor, err := r.collection.Find(ctx, filter, opts)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return []models.Message{}, nil // Empty conversation is valid
        }
        return nil, errors.NewAppError(errors.DATABASE_ERROR, "Failed to query conversations", err)
    }
    
    // Process results...
    return messages, nil
}
```

## Error Response Examples

### Success Response
```json
{
    "success": true,
    "data": {
        "messages": [...],
        "otherUser": {...}
    },
    "timestamp": "2025-06-01T10:30:00Z"
}
```

### Error Response
```json
{
    "success": false,
    "errorCode": "INVALID_USER_ID",
    "errorMessage": "Invalid user ID format",
    "timestamp": "2025-06-01T10:30:00Z"
}
```

## HTTP Status Code Mapping

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| INVALID_INPUT | 400 | Bad Request |
| INVALID_USER_ID | 400 | Bad Request |
| MESSAGE_TOO_LONG | 400 | Bad Request |
| MESSAGE_EMPTY | 400 | Bad Request |
| UNAUTHORIZED | 401 | Unauthorized |
| INVALID_TOKEN | 401 | Unauthorized |
| TOKEN_EXPIRED | 401 | Unauthorized |
| MESSAGE_NOT_FOUND | 404 | Not Found |
| CONVERSATION_NOT_FOUND | 404 | Not Found |
| INTERNAL_SERVER_ERROR | 500 | Internal Server Error |
| DATABASE_ERROR | 500 | Internal Server Error |
| EXTERNAL_SERVICE_ERROR | 502 | Bad Gateway |
| WEBSOCKET_UPGRADE_FAILED | 500 | Internal Server Error |

## Logging Standards

### 1. Service Layer Logging
```go
logger.WithContext("ChatService").Infof("Sending message from %s to %s", message.FromID, message.ToID)
logger.WithContext("ChatService").Errorf("Failed to save message: %v", err)
```

### 2. Handler Layer Logging
```go
logger.WithContext("ChatHandler").Infof("GET /conversations/%s - User: %s", otherID, userID)
logger.WithContext("ChatHandler").Warnf("Invalid UUID format: %s", otherID)
```

### 3. Repository Layer Logging
```go
logger.WithContext("ChatRepository").Debugf("Querying conversation between %s and %s", userID1, userID2)
logger.WithContext("ChatRepository").Errorf("Database query failed: %v", err)
```

## Validation System

### Message Validation
```go
type ValidationResult struct {
    IsValid bool     `json:"isValid"`
    Errors  []string `json:"errors"`
}

func ValidateMessage(message *models.Message) error {
    result := &ValidationResult{IsValid: true, Errors: []string{}}
    
    // Content validation
    if strings.TrimSpace(message.Content) == "" {
        result.IsValid = false
        result.Errors = append(result.Errors, "Message content cannot be empty")
    }
    
    if len(message.Content) > 1000 {
        result.IsValid = false
        result.Errors = append(result.Errors, "Message content too long (max 1000 characters)")
    }
    
    // UUID validation
    if !IsValidUUID(message.FromID) || !IsValidUUID(message.ToID) {
        result.IsValid = false
        result.Errors = append(result.Errors, "Invalid user ID format")
    }
    
    if !result.IsValid {
        return errors.NewAppError(errors.INVALID_INPUT, strings.Join(result.Errors, "; "), nil)
    }
    
    return nil
}
```

## WebSocket Error Handling

### Client Error Responses
```go
type WSErrorResponse struct {
    Type    string `json:"type"`
    Error   string `json:"error"`
    Code    string `json:"code"`
}

func (ws *WebSocketService) sendErrorToClient(conn *websocket.Conn, err error) {
    errorResponse := WSErrorResponse{
        Type:  "error",
        Error: err.Error(),
        Code:  "WEBSOCKET_ERROR",
    }
    
    if appErr, ok := err.(*errors.AppError); ok {
        errorResponse.Code = string(appErr.Code)
    }
    
    conn.WriteJSON(errorResponse)
}
```

## Testing Error Handling

### Unit Test Example
```go
func TestChatHandler_ErrorHandling(t *testing.T) {
    t.Run("InvalidUserID", func(t *testing.T) {
        // Setup
        w := httptest.NewRecorder()
        c, _ := gin.CreateTestContext(w)
        c.Params = gin.Params{{Key: "otherID", Value: "invalid-uuid"}}
        
        // Execute
        handler.GetConversation(c)
        
        // Assert
        assert.Equal(t, http.StatusBadRequest, w.Code)
        
        var response response.APIResponse
        json.Unmarshal(w.Body.Bytes(), &response)
        assert.False(t, response.Success)
        assert.Equal(t, string(errors.INVALID_USER_ID), response.ErrorCode)
    })
}
```

## Best Practices

1. **Always use AppError for business logic errors**
2. **Preserve original error context with cause wrapping**
3. **Use appropriate error codes for different scenarios**
4. **Log errors at the appropriate level (Debug, Info, Warn, Error)**
5. **Never expose internal error details to clients**
6. **Validate input at service boundaries**
7. **Use structured logging with context information**
8. **Test error scenarios comprehensively**

## Migration from Legacy Error Handling

When updating existing code:

1. Replace `gin.H{"error": "message"}` with `response.ErrorResponse(c, appError)`
2. Replace `log.Printf` with structured logging using the logger package
3. Add input validation using the validation package
4. Wrap repository errors with appropriate AppError instances
5. Update tests to check for structured error responses

This error handling system provides consistency, maintainability, and better debugging capabilities across the entire chat service.
