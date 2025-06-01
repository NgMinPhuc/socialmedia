package tests

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/handlers"
	"github.com/socialmedia/chat-service/internal/models"
	"github.com/socialmedia/chat-service/internal/repository"
	"github.com/socialmedia/chat-service/internal/response"
	"github.com/socialmedia/chat-service/internal/service"
)

// MockChatRepository for testing
type MockChatRepository struct {
	mock.Mock
}

func (m *MockChatRepository) SaveMessage(message *models.Message) error {
	args := m.Called(message)
	return args.Error(0)
}

func (m *MockChatRepository) GetConversation(userID1, userID2 string, limit int) ([]*models.Message, error) {
	args := m.Called(userID1, userID2, limit)
	return args.Get(0).([]*models.Message), args.Error(1)
}

func (m *MockChatRepository) MarkAsRead(fromUserID, toUserID string) error {
	args := m.Called(fromUserID, toUserID)
	return args.Error(0)
}

func (m *MockChatRepository) GetUnreadCount(userID string) (int64, error) {
	args := m.Called(userID)
	return args.Get(0).(int64), args.Error(1)
}

// MockExternalService for testing
type MockExternalService struct {
	mock.Mock
}

func (m *MockExternalService) GetUserInfo(userID string) (map[string]interface{}, error) {
	args := m.Called(userID)
	return args.Get(0).(map[string]interface{}), args.Error(1)
}

func (m *MockExternalService) GetUsersInfo(userIDs []string) (map[string]map[string]interface{}, error) {
	args := m.Called(userIDs)
	return args.Get(0).(map[string]map[string]interface{}), args.Error(1)
}

func TestChatHandler_ErrorHandling(t *testing.T) {
	gin.SetMode(gin.TestMode)

	// Setup mocks
	mockRepo := new(MockChatRepository)
	mockExternal := new(MockExternalService)
	
	chatService := service.NewChatService(mockRepo)
	chatHandler := handlers.NewChatHandler(chatService)

	t.Run("GetConversation_InvalidUserID", func(t *testing.T) {
		// Setup
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{
			{Key: "otherID", Value: "invalid-uuid"},
		}
		c.Set("userID", "550e8400-e29b-41d4-a716-446655440000")

		// Execute
		chatHandler.GetConversation(c)

		// Assert
		assert.Equal(t, http.StatusBadRequest, w.Code)
		
		var response response.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "ERROR", response.Code)
		assert.Contains(t, response.Message, "Invalid user ID")
	})

	t.Run("GetConversation_RepositoryError", func(t *testing.T) {
		// Setup
		mockRepo.On("GetConversation", mock.AnythingOfType("string"), mock.AnythingOfType("string"), mock.AnythingOfType("int")).
			Return([]*models.Message{}, mongo.ErrNoDocuments)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{
			{Key: "otherID", Value: "550e8400-e29b-41d4-a716-446655440001"},
		}
		c.Set("userID", "550e8400-e29b-41d4-a716-446655440000")

		// Execute
		chatHandler.GetConversation(c)

		// Assert
		assert.Equal(t, http.StatusNotFound, w.Code)
		
		var response response.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "ERROR", response.Code)
		assert.Contains(t, response.Message, "not found")

		mockRepo.AssertExpectations(t)
	})

	t.Run("GetConversation_Success", func(t *testing.T) {
		// Setup
		messages := []*models.Message{
			{
				FromID:    "550e8400-e29b-41d4-a716-446655440000",
				ToID:      "550e8400-e29b-41d4-a716-446655440001",
				Content:   "Hello",
				Read:      false,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
		}

		mockRepo.On("GetConversation", mock.AnythingOfType("string"), mock.AnythingOfType("string"), mock.AnythingOfType("int")).
			Return(messages, nil)

		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Params = gin.Params{
			{Key: "otherID", Value: "550e8400-e29b-41d4-a716-446655440001"},
		}
		c.Set("userID", "550e8400-e29b-41d4-a716-446655440000")

		// Execute
		chatHandler.GetConversation(c)

		// Assert
		assert.Equal(t, http.StatusOK, w.Code)
		
		var response response.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "SUCCESS", response.Code)
		assert.NotNil(t, response.Data)

		mockRepo.AssertExpectations(t)
	})
}

func TestErrorHandling_AppError(t *testing.T) {
	t.Run("NewAppError_Basic", func(t *testing.T) {
		appErr := errors.NewAppError(errors.DatabaseOperationFailed, "Database operation failed")

		assert.Equal(t, errors.DatabaseOperationFailed, appErr.Code)
		assert.Equal(t, "Database operation failed", appErr.Message)
		assert.Contains(t, appErr.Error(), "Database operation failed")
	})

	t.Run("NewAppError_Simple", func(t *testing.T) {
		appErr := errors.NewAppError(errors.InvalidRequest, "Invalid input provided")

		assert.Equal(t, errors.InvalidRequest, appErr.Code)
		assert.Equal(t, "Invalid input provided", appErr.Message)
		assert.Equal(t, "Invalid input provided", appErr.Error())
	})
}

func TestResponsePackage(t *testing.T) {
	gin.SetMode(gin.TestMode)

	t.Run("SuccessResponse", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		data := map[string]string{"message": "success"}
		response.SuccessResponse(c, data)

		assert.Equal(t, http.StatusOK, w.Code)
		
		var apiResponse response.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &apiResponse)
		assert.NoError(t, err)
		assert.Equal(t, "SUCCESS", apiResponse.Code)
		assert.NotNil(t, apiResponse.Data)
	})

	t.Run("ErrorResponse", func(t *testing.T) {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)

		appErr := errors.NewAppError(errors.InvalidRequest, "Invalid input")
		response.ErrorResponse(c, appErr)

		assert.Equal(t, http.StatusBadRequest, w.Code)
		
		var apiResponse response.APIResponse
		err := json.Unmarshal(w.Body.Bytes(), &apiResponse)
		assert.NoError(t, err)
		assert.Equal(t, "ERROR", apiResponse.Code)
		assert.Contains(t, apiResponse.Message, "Invalid input")
	})
}

func TestIntegration_ChatService(t *testing.T) {
	// This test requires a running MongoDB instance
	if testing.Short() {
		t.Skip("Skipping integration test in short mode")
	}

	// Setup test database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		t.Skip("MongoDB not available for integration test")
	}
	defer client.Disconnect(ctx)

	testDB := client.Database("chatDB_test")
	
	// Clean up test database
	defer func() {
		testDB.Drop(ctx)
	}()

	// Setup components
	chatRepo := repository.NewChatRepository(testDB)
	mockExternal := new(MockExternalService)
	chatService := service.NewChatService(chatRepo, mockExternal)

	t.Run("SendMessage_Integration", func(t *testing.T) {
		userInfo := map[string]interface{}{
			"id":       "550e8400-e29b-41d4-a716-446655440001",
			"username": "testuser",
		}
		mockExternal.On("GetUserInfo", "550e8400-e29b-41d4-a716-446655440001").
			Return(userInfo, nil)

		message := &models.Message{
			FromID:    "550e8400-e29b-41d4-a716-446655440000",
			ToID:      "550e8400-e29b-41d4-a716-446655440001",
			Content:   "Integration test message",
			Timestamp: time.Now(),
			IsRead:    false,
		}

		err := chatService.SendMessage(message)
		assert.NoError(t, err)
		assert.NotEmpty(t, message.ID)

		mockExternal.AssertExpectations(t)
	})
}
