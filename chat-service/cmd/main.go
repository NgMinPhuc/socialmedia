package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/socialmedia/chat-service/internal/config"

	"github.com/socialmedia/chat-service/internal/handlers"
	"github.com/socialmedia/chat-service/internal/middleware"
	"github.com/socialmedia/chat-service/internal/repository"
	"github.com/socialmedia/chat-service/internal/service"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer mongoClient.Disconnect(ctx)

	// Ping MongoDB
	if err := mongoClient.Ping(ctx, nil); err != nil {
		log.Fatal(err)
	}

	db := mongoClient.Database("chat_service")

	// Initialize components
	chatRepo := repository.NewChatRepository(db)
	chatService := service.NewChatService(chatRepo)
	chatHandler := handlers.NewChatHandler(chatService)
	healthHandler := handlers.NewHealthHandler(mongoClient)

	// Initialize Eureka client
	eurekaClient := config.NewEurekaClient()
	if err := eurekaClient.Register(); err != nil {
		log.Printf("Warning: Failed to register with Eureka: %v", err)
	}

	// Graceful shutdown handler
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan
		if err := eurekaClient.Deregister(); err != nil {
			log.Printf("Error deregistering from Eureka: %v", err)
		}
		os.Exit(0)
	}()

	// Setup Gin router
	router := gin.Default()

	// Health check endpoints (no auth required)
	router.GET("/health", healthHandler.Health)
	router.GET("/health/info", healthHandler.Info)
	router.GET("/health/live", healthHandler.LivenessProbe)
	router.GET("/health/ready", healthHandler.ReadinessProbe)

	// CORS middleware
	allowOrigins := strings.Split(os.Getenv("ALLOW_ORIGINS"), ",")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Middleware
	router.Use(middleware.AuthMiddleware())
	api := router.Group("/api/chat")
	{
		api.GET("/ws", chatHandler.WebSocket)
		api.GET("/conversations/:otherID", chatHandler.GetConversation)
		api.POST("/conversations/:fromID/read", chatHandler.MarkAsRead)
		api.GET("/unread", chatHandler.GetUnreadCount)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}

	log.Printf("Starting chat service on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
