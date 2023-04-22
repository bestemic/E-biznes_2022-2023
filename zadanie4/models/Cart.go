package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	Amount      int    `json:"amount" validate:"required"`
	Description string `json:"description" validate:"required"`
}
