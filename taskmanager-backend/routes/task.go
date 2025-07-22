package routes

import (
    "github.com/gin-gonic/gin"
    "taskmanager-backend/controllers"
    "taskmanager-backend/middleware"
)

func TaskRoutes(r *gin.Engine) {
    task := r.Group("/tasks")
    task.Use(middleware.AuthMiddleware())
    {
        task.GET("/", controllers.GetTasks)
        task.GET("/:id", controllers.GetTaskByID) // ✅ Tambahkan ini
        task.POST("/", controllers.CreateTask)
        task.PUT("/:id", controllers.UpdateTask)
        task.DELETE("/:id", controllers.DeleteTask)
    }
}

