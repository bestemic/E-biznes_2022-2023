package routes

import (
	"github.com/labstack/echo/v4"
	"zadanie4/controllers"
)

func CategoryRoute(e *echo.Echo) {
	categoryController := controllers.CategoryController{}

	e.GET("/categories", categoryController.GetAllCategories)
	e.POST("/categories", categoryController.CreateCategory)
	e.GET("/categories/:id", categoryController.GetCategory)
	e.PUT("/categories/:id", categoryController.UpdateCategory)
	e.DELETE("/categories/:id", categoryController.DeleteCategory)
}
