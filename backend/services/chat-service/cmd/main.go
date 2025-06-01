package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/socialmedia/chat-service/internal/config"
	"github.com/socialmedia/chat-service/internal/errors"
	"github.com/socialmedia/chat-service/internal/handlers"
	"github.com/socialmedia/chat-service/internal/middleware"
	"github.com/socialmedia/chat-service/internal/repository"
	"github.com/socialmedia/chat-service/internal/response"
	"github.com/socialmedia/chat-service/internal/service"
)

func main() {
	// Try to load YAML config first, fallback to .env
	var mongoURI, port, jwtSecret string
	var allowOrigins []string
	
	if config.AppConfig != nil {
		log.Println("Using YAML configuration")
		mongoURI = config.AppConfig.Database.MongoDB.URI
		port = config.AppConfig.Server.Port
		jwtSecret = config.AppConfig.Security.JWT.Secret
		allowOrigins = config.AppConfig.CORS.AllowedOrigins
	} else {
		log.Println("Using .env configuration")
		// Load .env file as fallback
		if err := godotenv.Load(); err != nil {
			log.Printf("Warning: .env file not found")
		}
		
		mongoURI = os.Getenv("MONGODB_URI")
		if mongoURI == "" {
			mongoURI = "mongodb://localhost:27017/chatDB"
		}
		
		port = os.Getenv("PORT")
		if port == "" {
			port = "8084"
		}
		
		jwtSecret = os.Getenv("JWT_SECRET")
		allowOrigins = []string{os.Getenv("ALLOW_ORIGINS")}
		if allowOrigins[0] == "" {
			allowOrigins = []string{"http://localhost:3000"}
		}
	}

	// MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			log.Printf("Error disconnecting from MongoDB: %v", err)
		}
	}()

	// Ping MongoDB
	if err := mongoClient.Ping(ctx, nil); err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}
	log.Println("Successfully connected to MongoDB")

	db := mongoClient.Database("chatDB")

	// Initialize components with improved error handling
	chatRepo := repository.NewChatRepository(db)
	chatService := service.NewChatService(chatRepo)
	chatHandler := handlers.NewChatHandler(chatService)
	healthHandler := handlers.NewHealthHandler(mongoClient)

	// Initialize Eureka client
	var eurekaClient *config.EurekaClient
	if config.AppConfig != nil {
		// Use YAML config for Eureka
		eurekaClient = config.NewEurekaClientWithConfig(
			config.AppConfig.Eureka.Server,
			config.AppConfig.Eureka.Instance.AppName,
			config.AppConfig.Eureka.Instance.InstanceID,
			config.AppConfig.Eureka.Instance.IPAddress,
			config.AppConfig.Eureka.Instance.Port,
			config.AppConfig.Eureka.Instance.HealthCheckURL,
			config.AppConfig.Eureka.Instance.StatusPageURL,
			config.AppConfig.Eureka.Instance.HomePageURL,
		)
	} else {
		// Use default Eureka config
		eurekaClient = config.NewEurekaClient()
	}
	
	if err := eurekaClient.Register(); err != nil {
		log.Printf("Warning: Failed to register with Eureka: %v", err)
	} else {
		log.Println("Successfully registered with Eureka service registry")
	}

	// Graceful shutdown handler
	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
		<-sigChan
		log.Println("Shutting down chat service...")
		if err := eurekaClient.Deregister(); err != nil {
			log.Printf("Error deregistering from Eureka: %v", err)
		} else {
			log.Println("Successfully deregistered from Eureka")
		}
		os.Exit(0)
	}()

	// Setup Gin router with error handling middleware
	router := gin.Default()
	
	// Global error handling middleware
	router.Use(func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Panic recovered: %v", r)
				response.ErrorResponse(c, errors.NewAppError(
					errors.InternalServerError,
					"Internal server error occurred",
				))
			}
		}()
		c.Next()
	})

	// Health check endpoints (no auth required)
	router.GET("/chat/health", healthHandler.Health)
	router.GET("/chat/health/info", healthHandler.Info)
	router.GET("/chat/health/live", healthHandler.LivenessProbe)
	router.GET("/chat/health/ready", healthHandler.ReadinessProbe)

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Middleware
	router.Use(middleware.AuthMiddleware(jwtSecret))
	api := router.Group("/api/chat")
	{
		api.GET("/ws", chatHandler.WebSocket)
		api.GET("/conversations/:otherID", chatHandler.GetConversation)
		api.POST("/conversations/:fromID/read", chatHandler.MarkAsRead)
		api.GET("/unread", chatHandler.GetUnreadCount)
	}

	// Start server
	log.Printf("Starting chat service on port %s with enhanced error handling", port)
	log.Printf("MongoDB URI: %s", mongoURI)
	log.Printf("JWT Secret configured: %t", jwtSecret != "")
	log.Printf("CORS allowed origins: %v", allowOrigins)
	
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
