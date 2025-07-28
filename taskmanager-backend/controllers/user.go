package controllers

import (
    "net/http"
    "taskmanager-backend/config"
    "taskmanager-backend/models"

    "github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
    var users []models.User
    if err := config.DB.Find(&users).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
        return
    }

    var response []gin.H
    for _, user := range users {
        response = append(response, gin.H{
            "id":    user.ID,
            "name":  user.Name,
            "email": user.Email,
        })
    }

    c.JSON(http.StatusOK, response)
}
