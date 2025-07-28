package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "taskmanager-backend/config"
    "taskmanager-backend/models"
    "time"
)

func CreateTask(c *gin.Context) {
    var input models.Task

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if input.Status == "" {
        input.Status = "Todo"
    }

    if err := config.DB.Create(&input).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
        return
    }

    var createdTask models.Task
    if err := config.DB.Preload("Assignee").First(&createdTask, input.ID).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch created task with assignee"})
        return
    }

    c.JSON(http.StatusCreated, createdTask)
}


func GetTasks(c *gin.Context) {
    var tasks []models.Task
    db := config.DB

    // Ambil query parameters
    status := c.Query("status")
    due := c.Query("due")

    if status != "" {
        db = db.Where("status = ?", status)
    }

    if due != "" {
        now := time.Now()
        var start, end time.Time

        switch due {
        case "today":
            start = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
            end = start.Add(24 * time.Hour)
        case "this_week":
            weekday := int(now.Weekday())
            if weekday == 0 {
                weekday = 7 // Sunday
            }
            start = time.Date(now.Year(), now.Month(), now.Day()-weekday+1, 0, 0, 0, 0, now.Location())
            end = start.AddDate(0, 0, 7)
        case "this_month":
            start = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
            end = start.AddDate(0, 1, 0)
        case "overdue":
            db = db.Where("deadline IS NOT NULL AND deadline < ?", now)
        }

        // Jika bukan overdue, filter antara start dan end
        if due != "overdue" {
            db = db.Where("deadline IS NOT NULL AND deadline >= ? AND deadline < ?", start, end)
        }
    }

    if err := db.Preload("Assignee").Find(&tasks).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
        return
    }

    c.JSON(http.StatusOK, tasks)
}


func GetTaskByID(c *gin.Context) {
    id := c.Param("id")

    var task models.Task
    if err := config.DB.Preload("Assignee").First(&task, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
        return
    }

    c.JSON(http.StatusOK, task)
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
