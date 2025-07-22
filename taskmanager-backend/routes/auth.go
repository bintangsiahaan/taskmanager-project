package routes

import (
    "github.com/gin-gonic/gin"
    "taskmanager-backend/controllers"
)

func AuthRoutes(r *gin.Engine) {
    r.POST("/register", controllers.Register)
    r.POST("/login", controllers.Login)
}
