package errors

import "net/http"

// ErrorCode represents application error codes
type ErrorCode string

const (
	// General errors
	InternalServerError ErrorCode = "INTERNAL_SERVER_ERROR"
	InvalidRequest     ErrorCode = "INVALID_REQUEST"
	Unauthorized       ErrorCode = "UNAUTHORIZED"
	Forbidden          ErrorCode = "FORBIDDEN"
	NotFound           ErrorCode = "NOT_FOUND"
	
	// Chat specific errors
	MessageNotFound        ErrorCode = "MESSAGE_NOT_FOUND"
	ConversationNotFound   ErrorCode = "CONVERSATION_NOT_FOUND"
	InvalidMessageContent  ErrorCode = "INVALID_MESSAGE_CONTENT"
	MessageTooLong         ErrorCode = "MESSAGE_TOO_LONG"
	MessageEmpty           ErrorCode = "MESSAGE_EMPTY"
	UserNotInConversation  ErrorCode = "USER_NOT_IN_CONVERSATION"
	ConversationExists     ErrorCode = "CONVERSATION_EXISTS"
	InvalidUserID          ErrorCode = "INVALID_USER_ID"
	
	// WebSocket errors
	WebSocketUpgradeFailed ErrorCode = "WEBSOCKET_UPGRADE_FAILED"
	WebSocketNotConnected  ErrorCode = "WEBSOCKET_NOT_CONNECTED"
	InvalidWebSocketMessage ErrorCode = "INVALID_WEBSOCKET_MESSAGE"
	
	// Database errors
	DatabaseConnectionFailed ErrorCode = "DATABASE_CONNECTION_FAILED"
	DatabaseOperationFailed  ErrorCode = "DATABASE_OPERATION_FAILED"
	
	// Validation errors
	ValidationFailed       ErrorCode = "VALIDATION_FAILED"
	InvalidMessageFormat   ErrorCode = "INVALID_MESSAGE_FORMAT"
	MissingRequiredField   ErrorCode = "MISSING_REQUIRED_FIELD"
)

// ErrorInfo contains error details
type ErrorInfo struct {
	Code       ErrorCode `json:"code"`
	Message    string    `json:"message"`
	HTTPStatus int       `json:"-"`
}

// GetErrorInfo returns error information for a given error code
func GetErrorInfo(code ErrorCode) ErrorInfo {
	errorMap := map[ErrorCode]ErrorInfo{
		InternalServerError: {
			Code:       InternalServerError,
			Message:    "An internal server error occurred",
			HTTPStatus: http.StatusInternalServerError,
		},
		InvalidRequest: {
			Code:       InvalidRequest,
			Message:    "Invalid request format or parameters",
			HTTPStatus: http.StatusBadRequest,
		},
		Unauthorized: {
			Code:       Unauthorized,
			Message:    "Authentication required",
			HTTPStatus: http.StatusUnauthorized,
		},
		Forbidden: {
			Code:       Forbidden,
			Message:    "Access denied",
			HTTPStatus: http.StatusForbidden,
		},
		NotFound: {
			Code:       NotFound,
			Message:    "Resource not found",
			HTTPStatus: http.StatusNotFound,
		},
		MessageNotFound: {
			Code:       MessageNotFound,
			Message:    "Message not found",
			HTTPStatus: http.StatusNotFound,
		},
		ConversationNotFound: {
			Code:       ConversationNotFound,
			Message:    "Conversation not found",
			HTTPStatus: http.StatusNotFound,
		},
		InvalidMessageContent: {
			Code:       InvalidMessageContent,
			Message:    "Invalid message content",
			HTTPStatus: http.StatusBadRequest,
		},
		MessageTooLong: {
			Code:       MessageTooLong,
			Message:    "Message content exceeds maximum length",
			HTTPStatus: http.StatusBadRequest,
		},
		MessageEmpty: {
			Code:       MessageEmpty,
			Message:    "Message content cannot be empty",
			HTTPStatus: http.StatusBadRequest,
		},
		UserNotInConversation: {
			Code:       UserNotInConversation,
			Message:    "User is not a participant in this conversation",
			HTTPStatus: http.StatusForbidden,
		},
		ConversationExists: {
			Code:       ConversationExists,
			Message:    "Conversation already exists",
			HTTPStatus: http.StatusConflict,
		},
		InvalidUserID: {
			Code:       InvalidUserID,
			Message:    "Invalid user ID format",
			HTTPStatus: http.StatusBadRequest,
		},
		WebSocketUpgradeFailed: {
			Code:       WebSocketUpgradeFailed,
			Message:    "Failed to upgrade connection to WebSocket",
			HTTPStatus: http.StatusBadRequest,
		},
		WebSocketNotConnected: {
			Code:       WebSocketNotConnected,
			Message:    "WebSocket connection not established",
			HTTPStatus: http.StatusBadRequest,
		},
		InvalidWebSocketMessage: {
			Code:       InvalidWebSocketMessage,
			Message:    "Invalid WebSocket message format",
			HTTPStatus: http.StatusBadRequest,
		},
		DatabaseConnectionFailed: {
			Code:       DatabaseConnectionFailed,
			Message:    "Database connection failed",
			HTTPStatus: http.StatusServiceUnavailable,
		},
		DatabaseOperationFailed: {
			Code:       DatabaseOperationFailed,
			Message:    "Database operation failed",
			HTTPStatus: http.StatusInternalServerError,
		},
		ValidationFailed: {
			Code:       ValidationFailed,
			Message:    "Input validation failed",
			HTTPStatus: http.StatusBadRequest,
		},
		InvalidMessageFormat: {
			Code:       InvalidMessageFormat,
			Message:    "Invalid message format",
			HTTPStatus: http.StatusBadRequest,
		},
		MissingRequiredField: {
			Code:       MissingRequiredField,
			Message:    "Required field is missing",
			HTTPStatus: http.StatusBadRequest,
		},
	}

	if info, exists := errorMap[code]; exists {
		return info
	}

	// Default error if code not found
	return ErrorInfo{
		Code:       InternalServerError,
		Message:    "Unknown error occurred",
		HTTPStatus: http.StatusInternalServerError,
	}
}
