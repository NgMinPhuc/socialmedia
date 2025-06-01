package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/socialmedia/chat-service/internal/errors"
)

// APIResponse represents a standard API response
type APIResponse struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   interface{} `json:"error,omitempty"`
}

// SuccessResponse sends a successful response
func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Code:    "SUCCESS",
		Message: "Operation completed successfully",
		Data:    data,
	})
}

// SuccessResponseWithMessage sends a successful response with custom message
func SuccessResponseWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, APIResponse{
		Code:    "SUCCESS",
		Message: message,
		Data:    data,
	})
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, err error) {
	if appErr, ok := errors.IsAppError(err); ok {
		errorInfo := errors.GetErrorInfo(appErr.Code)
		c.JSON(errorInfo.HTTPStatus, APIResponse{
			Code:    string(appErr.Code),
			Message: appErr.Message,
			Error:   appErr.Message,
		})
		return
	}

	// Handle non-AppError errors
	c.JSON(http.StatusInternalServerError, APIResponse{
		Code:    string(errors.InternalServerError),
		Message: "An unexpected error occurred",
		Error:   err.Error(),
	})
}

// ErrorResponseWithCode sends an error response with specific error code
func ErrorResponseWithCode(c *gin.Context, code errors.ErrorCode, message string) {
	errorInfo := errors.GetErrorInfo(code)
	if message == "" {
		message = errorInfo.Message
	}
	
	c.JSON(errorInfo.HTTPStatus, APIResponse{
		Code:    string(code),
		Message: message,
		Error:   message,
	})
}

// ValidationErrorResponse sends a validation error response
func ValidationErrorResponse(c *gin.Context, validationErrors map[string]string) {
	c.JSON(http.StatusBadRequest, APIResponse{
		Code:    string(errors.ValidationFailed),
		Message: "Validation failed",
		Error:   validationErrors,
	})
}

// BadRequestResponse sends a bad request response
func BadRequestResponse(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, APIResponse{
		Code:    string(errors.InvalidRequest),
		Message: message,
		Error:   message,
	})
}

// UnauthorizedResponse sends an unauthorized response
func UnauthorizedResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Authentication required"
	}
	c.JSON(http.StatusUnauthorized, APIResponse{
		Code:    string(errors.Unauthorized),
		Message: message,
		Error:   message,
	})
}

// ForbiddenResponse sends a forbidden response
func ForbiddenResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Access denied"
	}
	c.JSON(http.StatusForbidden, APIResponse{
		Code:    string(errors.Forbidden),
		Message: message,
		Error:   message,
	})
}

// NotFoundResponse sends a not found response
func NotFoundResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Resource not found"
	}
	c.JSON(http.StatusNotFound, APIResponse{
		Code:    string(errors.NotFound),
		Message: message,
		Error:   message,
	})
}

// InternalServerErrorResponse sends an internal server error response
func InternalServerErrorResponse(c *gin.Context, message string) {
	if message == "" {
		message = "Internal server error"
	}
	c.JSON(http.StatusInternalServerError, APIResponse{
		Code:    string(errors.InternalServerError),
		Message: message,
		Error:   message,
	})
}
