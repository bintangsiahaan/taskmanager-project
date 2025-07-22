package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "taskmanager-backend/config"
    "taskmanager-backend/models"
)

func CreateTask(c *gin.Context) {
    var input models.Task
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Default status jika kosong
    if input.Status == "" {
        input.Status = "Todo"
    }

    if err := config.DB.Create(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
        return
    }

    c.JSON(http.StatusCreated, input)
}

func GetTasks(c *gin.Context) {
    var tasks []models.Task
    if err := config.DB.Find(&tasks).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
        return
    }

    c.JSON(http.StatusOK, tasks)
}

func UpdateTask(c *gin.Context) {
    id := c.Param("id")

    var task models.Task
    if err := config.DB.First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    var input models.Task
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    task.Title = input.Title
    task.Description = input.Description
    task.Status = input.Status
    task.Deadline = input.Deadline
    task.AssigneeID = input.AssigneeID

    if err := config.DB.Save(&task).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
        return
    }

    c.JSON(http.StatusOK, task)
}


func DeleteTask(c *gin.Context) {
    id := c.Param("id")

    if err := config.DB.Delete(&models.Task{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

func GetTaskByID(c *gin.Context) {
    id := c.Param("id")

    var task models.Task
    if err := config.DB.First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    c.JSON(http.StatusOK, task)
}

