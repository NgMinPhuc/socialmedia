package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/socialmedia/chat-service/internal/errors"
)

// UserInfo represents basic user information from user service
type UserInfo struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar,omitempty"`
	FullName string `json:"fullName,omitempty"`
}

// ExternalService handles communication with other services
type ExternalService struct {
	httpClient  *http.Client
	userService string
}

// NewExternalService creates a new external service handler
func NewExternalService(userServiceURL string) *ExternalService {
	return &ExternalService{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
		userService: userServiceURL,
	}
}

// GetUserInfo fetches user information from user service
func (s *ExternalService) GetUserInfo(ctx context.Context, userID string) (*UserInfo, error) {
	if userID == "" {
		return nil, errors.NewAppError(errors.InvalidUserID, "User ID cannot be empty")
	}

	url := fmt.Sprintf("%s/api/v1/users/%s", s.userService, userID)
	
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, errors.WrapError(errors.InternalServerError, err)
	}

	// Add timeout to request context
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	req = req.WithContext(ctx)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		errors.LogError(err, "ExternalService.GetUserInfo - HTTP request")
		return nil, errors.WrapError(errors.InternalServerError, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, errors.NewAppError(errors.NotFound, "User not found")
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.NewAppError(errors.InternalServerError, fmt.Sprintf("User service returned status: %d", resp.StatusCode))
	}

	var apiResponse struct {
		Code    string   `json:"code"`
		Message string   `json:"message"`
		Data    UserInfo `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		errors.LogError(err, "ExternalService.GetUserInfo - JSON decode")
		return nil, errors.WrapError(errors.InternalServerError, err)
	}

	if apiResponse.Code != "SUCCESS" {
		return nil, errors.NewAppError(errors.InternalServerError, "Failed to get user info: "+apiResponse.Message)
	}

	errors.LogInfo("User info retrieved successfully for user: "+userID, "ExternalService.GetUserInfo")
	return &apiResponse.Data, nil
}

// GetMultipleUsersInfo fetches information for multiple users
func (s *ExternalService) GetMultipleUsersInfo(ctx context.Context, userIDs []string) (map[string]*UserInfo, error) {
	if len(userIDs) == 0 {
		return make(map[string]*UserInfo), nil
	}

	userInfoMap := make(map[string]*UserInfo)
	
	// Fetch user info concurrently with goroutines
	type result struct {
		userID   string
		userInfo *UserInfo
		err      error
	}

	resultChan := make(chan result, len(userIDs))

	for _, userID := range userIDs {
		go func(id string) {
			userInfo, err := s.GetUserInfo(ctx, id)
			resultChan <- result{userID: id, userInfo: userInfo, err: err}
		}(userID)
	}

	// Collect results
	for i := 0; i < len(userIDs); i++ {
		res := <-resultChan
		if res.err != nil {
			errors.LogError(res.err, "ExternalService.GetMultipleUsersInfo - User: "+res.userID)
			// Continue with other users even if one fails
			continue
		}
		userInfoMap[res.userID] = res.userInfo
	}

	errors.LogInfo(fmt.Sprintf("Retrieved info for %d out of %d users", len(userInfoMap), len(userIDs)), "ExternalService.GetMultipleUsersInfo")
	return userInfoMap, nil
}

// ValidateUser checks if a user exists
func (s *ExternalService) ValidateUser(ctx context.Context, userID string) (bool, error) {
	userInfo, err := s.GetUserInfo(ctx, userID)
	if err != nil {
		if appErr, ok := errors.IsAppError(err); ok && appErr.Code == errors.NotFound {
			return false, nil
		}
		return false, err
	}
	return userInfo != nil, nil
}
