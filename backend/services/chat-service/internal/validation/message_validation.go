package validation

import (
	"regexp"
	"strings"
	"unicode/utf8"

	"github.com/socialmedia/chat-service/internal/errors"
)

const (
	MaxMessageLength = 1000
	MinMessageLength = 1
)

// MessageValidation contains validation rules for messages
type MessageValidation struct{}

// NewMessageValidation creates a new message validator
func NewMessageValidation() *MessageValidation {
	return &MessageValidation{}
}

// ValidateMessageContent validates message content
func (v *MessageValidation) ValidateMessageContent(content string) error {
	if content == "" || strings.TrimSpace(content) == "" {
		return errors.NewAppError(errors.MessageEmpty, "Message content cannot be empty")
	}

	if utf8.RuneCountInString(content) > MaxMessageLength {
		return errors.NewAppError(errors.MessageTooLong, "Message content exceeds maximum length of 1000 characters")
	}

	if utf8.RuneCountInString(content) < MinMessageLength {
		return errors.NewAppError(errors.MessageEmpty, "Message content is too short")
	}

	return nil
}

// ValidateUserID validates user ID format (UUID)
func (v *MessageValidation) ValidateUserID(userID string) error {
	if userID == "" {
		return errors.NewAppError(errors.InvalidUserID, "User ID cannot be empty")
	}

	// UUID regex pattern
	uuidPattern := `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`
	matched, err := regexp.MatchString(uuidPattern, userID)
	if err != nil {
		return errors.WrapError(errors.ValidationFailed, err)
	}

	if !matched {
		return errors.NewAppError(errors.InvalidUserID, "User ID must be a valid UUID")
	}

	return nil
}

// ValidateConversationParticipants validates conversation participants
func (v *MessageValidation) ValidateConversationParticipants(participants []string) error {
	if len(participants) < 2 {
		return errors.NewAppError(errors.ValidationFailed, "Conversation must have at least 2 participants")
	}

	// Check for duplicate participants
	seen := make(map[string]bool)
	for _, participant := range participants {
		if err := v.ValidateUserID(participant); err != nil {
			return err
		}

		if seen[participant] {
			return errors.NewAppError(errors.ValidationFailed, "Duplicate participants are not allowed")
		}
		seen[participant] = true
	}

	return nil
}

// ValidationResult represents validation results
type ValidationResult struct {
	IsValid bool              `json:"isValid"`
	Errors  map[string]string `json:"errors,omitempty"`
}

// NewValidationResult creates a new validation result
func NewValidationResult() *ValidationResult {
	return &ValidationResult{
		IsValid: true,
		Errors:  make(map[string]string),
	}
}

// AddError adds an error to the validation result
func (vr *ValidationResult) AddError(field, message string) {
	vr.IsValid = false
	vr.Errors[field] = message
}

// HasErrors checks if there are any validation errors
func (vr *ValidationResult) HasErrors() bool {
	return !vr.IsValid
}

// ValidateMessageRequest validates a complete message request
func ValidateMessageRequest(fromID, toID, content string) *ValidationResult {
	validator := NewMessageValidation()
	result := NewValidationResult()

	// Validate sender ID
	if err := validator.ValidateUserID(fromID); err != nil {
		result.AddError("fromId", err.Error())
	}

	// Validate recipient ID
	if err := validator.ValidateUserID(toID); err != nil {
		result.AddError("toId", err.Error())
	}

	// Validate content
	if err := validator.ValidateMessageContent(content); err != nil {
		result.AddError("content", err.Error())
	}

	// Check if sender and recipient are different
	if fromID == toID {
		result.AddError("participants", "Sender and recipient cannot be the same")
	}

	return result
}
