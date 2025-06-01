package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/response"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"No authorization header provided",
			))
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Invalid authorization header format",
			))
			c.Abort()
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		if tokenString == "" {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Empty token in authorization header",
			))
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.NewAppError(errors.Unauthorized, "Invalid signing method")
			}
			return []byte(jwtSecret), nil
		})

		if err != nil {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Invalid token",
			))
			c.Abort()
			return
		}

		if !token.Valid {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Token is not valid",
			))
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Invalid token claims format",
			))
			c.Abort()
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			response.ErrorResponse(c, errors.NewAppError(
				errors.Unauthorized,
				"Invalid user ID in token claims",
			))
			c.Abort()
			return
		}

		// Set user ID in context for use in handlers
		c.Set("user_id", userID)
		
		// Optional: Set additional claims if needed
		if username, exists := claims["username"]; exists {
			c.Set("username", username)
		}
		
		c.Next()
	}
}
