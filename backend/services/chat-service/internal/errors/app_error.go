package errors

import (
	"fmt"
	"log"
)

// AppError represents a custom application error
type AppError struct {
	Code    ErrorCode `json:"code"`
	Message string    `json:"message"`
	Cause   error     `json:"-"`
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("%s: %s (caused by: %v)", e.Code, e.Message, e.Cause)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap returns the underlying error
func (e *AppError) Unwrap() error {
	return e.Cause
}

// NewAppError creates a new application error
func NewAppError(code ErrorCode, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
	}
}

// NewAppErrorWithCause creates a new application error with a cause
func NewAppErrorWithCause(code ErrorCode, message string, cause error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Cause:   cause,
	}
}

// WrapError wraps an existing error with an application error
func WrapError(code ErrorCode, cause error) *AppError {
	info := GetErrorInfo(code)
	return &AppError{
		Code:    code,
		Message: info.Message,
		Cause:   cause,
	}
}

// LogError logs an error with context
func LogError(err error, context string) {
	if appErr, ok := err.(*AppError); ok {
		if appErr.Cause != nil {
			log.Printf("[ERROR] %s - %s: %s (caused by: %v)", context, appErr.Code, appErr.Message, appErr.Cause)
		} else {
			log.Printf("[ERROR] %s - %s: %s", context, appErr.Code, appErr.Message)
		}
	} else {
		log.Printf("[ERROR] %s - %v", context, err)
	}
}

// LogWarning logs a warning message
func LogWarning(message string, context string) {
	log.Printf("[WARNING] %s - %s", context, message)
}

// LogInfo logs an info message
func LogInfo(message string, context string) {
	log.Printf("[INFO] %s - %s", context, message)
}

// IsAppError checks if an error is an AppError
func IsAppError(err error) (*AppError, bool) {
	if appErr, ok := err.(*AppError); ok {
		return appErr, true
	}
	return nil, false
}
