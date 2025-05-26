package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	c.JSON(http.StatusOK, gin.H{
		"status": "UP",
	})
}

// Info returns detailed service information
func (h *HealthHandler) Info(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"app": gin.H{
			"name":    "chat-service",
			"version": "1.0.0",
		},
	})
}

// LivenessProbe checks if the service is alive
func (h *HealthHandler) LivenessProbe(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "UP",
	})
}

// ReadinessProbe checks if the service is ready to accept traffic
func (h *HealthHandler) ReadinessProbe(c *gin.Context) {
	// Check MongoDB connection
	err := h.mongoClient.Ping(c, nil)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "DOWN",
			"reason": "Database connection failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "UP",
	})
}
