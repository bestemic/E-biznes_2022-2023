package scopes

import "gorm.io/gorm"

func WithProduct(db *gorm.DB) *gorm.DB {
	return db.Preload("Products")
}
