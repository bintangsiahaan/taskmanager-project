package models

import (
    "time"
)

type Task struct {
    ID          uint      `gorm:"primaryKey"`
    Title       string    `gorm:"not null"`
    Description string
    Status      string    `gorm:"type:varchar(20);default:'Todo'"` // Todo, In Progress, Done
    Deadline    time.Time
    AssigneeID  uint
    UserID      uint      `gorm:"not null"`
}
