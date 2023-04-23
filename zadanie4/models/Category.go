package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name        string    `json:"name" validate:"required"`
	Description string    `json:"description" validate:"required"`
	Products    []Product `gorm:"foreignKey:CategoryID"`
}
