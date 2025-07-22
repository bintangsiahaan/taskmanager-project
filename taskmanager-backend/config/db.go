package config

import (
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
    dsn := "host=localhost user=taskmanager password=taskmanager dbname=taskmanager port=5432 sslmode=disable search_path=taskschema"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect to database: " + err.Error())
    }

    DB = db
    fmt.Println("Database connected!")
}
