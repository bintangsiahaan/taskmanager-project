package routes

import (
    "github.com/gin-gonic/gin"
    "taskmanager-backend/controllers"
    "taskmanager-backend/middleware"
)

func UserRoutes(r *gin.Engine) {
    user := r.Group("/users")
    user.Use(middleware.AuthMiddleware())
    {
        user.GET("/", controllers.GetUsers)
    }
}
