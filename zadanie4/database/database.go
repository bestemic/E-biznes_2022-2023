package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"zadanie4/models"
)

func Connect() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("data.db"))

	if err != nil {
		panic("Failed to connect with database")
	}

	db.AutoMigrate(&models.Product{})
	db.AutoMigrate(&models.Cart{})

	return db
}
