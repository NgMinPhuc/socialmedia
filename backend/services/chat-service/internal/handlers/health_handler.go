package handlers

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/response"
	"go.mongodb.org/mongo-driver/mongo"
)

type HealthHandler struct {
	mongoClient *mongo.Client
}

func NewHealthHandler(mongoClient *mongo.Client) *HealthHandler {
	return &HealthHandler{
		mongoClient: mongoClient,
	}
}

// Health returns a basic health check response
func (h *HealthHandler) Health(c *gin.Context) {
	response.SuccessResponse(c, gin.H{
		"status":    "UP",
		"service":   "chat-service",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Info returns detailed service information
func (h *HealthHandler) Info(c *gin.Context) {
	response.SuccessResponse(c, gin.H{
		"app": gin.H{
			"name":        "chat-service",
			"version":     "1.0.0",
			"description": "Social Media Chat Service",
			"language":    "Go",
			"framework":   "Gin",
		},
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// LivenessProbe checks if the service is alive
func (h *HealthHandler) LivenessProbe(c *gin.Context) {
	response.SuccessResponse(c, gin.H{
		"status":    "UP",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// ReadinessProbe checks if the service is ready to accept traffic
func (h *HealthHandler) ReadinessProbe(c *gin.Context) {
	// Check MongoDB connection with timeout
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	err := h.mongoClient.Ping(ctx, nil)
	if err != nil {
		errors.LogError(errors.WrapError(errors.DatabaseConnectionFailed, err), "HealthHandler.ReadinessProbe")
		response.ErrorResponseWithCode(c, errors.DatabaseConnectionFailed, "Database connection failed")
		return
	}

	response.SuccessResponse(c, gin.H{
		"status":    "UP",
		"database":  "connected",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
