package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"taskmanager-backend/config"
	"taskmanager-backend/models"
	"taskmanager-backend/routes"
)

func main() {
	r := gin.Default()

	// ✅ Konfigurasi CORS eksplisit
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// ✅ Inisialisasi DB
	config.ConnectDB()
	config.DB.AutoMigrate(&models.User{}, &models.Task{})

	// ✅ Routes
	routes.AuthRoutes(r)
	routes.TaskRoutes(r)
	routes.UserRoutes(r)

	// ✅ Root test endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Task Manager Backend Ready!"})
	})

	r.Run() // default :8080
}
