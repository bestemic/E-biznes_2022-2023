package routes

import (
	"github.com/labstack/echo/v4"
	"zadanie4/controllers"
)

func ProductRoute(e *echo.Echo) {
	productController := controllers.ProductController{}

	e.GET("/products", productController.GetAllProducts)
	e.POST("/products", productController.CreateProduct)
	e.GET("/products/:id", productController.GetProduct)
	e.PUT("/products/:id", productController.UpdateProduct)
	e.DELETE("/products/:id", productController.DeleteProduct)
}
