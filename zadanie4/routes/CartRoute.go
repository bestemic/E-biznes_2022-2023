package routes

import (
	"github.com/labstack/echo/v4"
	"zadanie4/controllers"
)

func CartRoute(e *echo.Echo) {
	productController := controllers.CartController{}

	e.GET("/carts", productController.GetAllCarts)
	e.POST("/carts", productController.CreateCart)
	e.GET("/carts/:id", productController.GetCart)
	e.PUT("/carts/:id", productController.UpdateCart)
	e.DELETE("/carts/:id", productController.DeleteCart)
}
