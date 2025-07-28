package controllers

import (
	"net/http"
	"taskmanager-backend/config"
	"taskmanager-backend/models"

	"github.com/gin-gonic/gin"
)

func GetTaskStatistics(c *gin.Context) {
	var total, inProgress, done, overdue, todo int64

	config.DB.Model(&models.Task{}).Count(&total)
	config.DB.Model(&models.Task{}).Where("status = ?", "In Progress").Count(&inProgress)
	config.DB.Model(&models.Task{}).Where("status = ?", "Todo").Count(&todo)
	config.DB.Model(&models.Task{}).Where("status = ?", "Done").Count(&done)
	config.DB.Model(&models.Task{}).Where("deadline < NOW() AND status != ?", "Done").Count(&overdue)

	stats := models.TaskStats{
		Total:     total,
		InProgress: inProgress,
		Done:  done,
		Overdue:    overdue,
		Todo:		todo,
	}

	c.JSON(http.StatusOK, stats)
}
