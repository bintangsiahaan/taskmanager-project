package models

import (
    "time"
)

type Task struct {
    ID          uint      `gorm:"primaryKey"`
    Title       string    `gorm:"not null"`
    Description string
    Status      string    `gorm:"type:varchar(20);default:'Todo'"`
    Deadline    time.Time
    AssigneeID  uint      `json:"assignee_id"`
    Assignee    *User     `gorm:"foreignKey:AssigneeID" json:"Assignee"`
}

