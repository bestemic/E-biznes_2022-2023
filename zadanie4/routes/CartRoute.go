package routes

import (
	"github.com/labstack/echo/v4"
	"zadanie4/controllers"
)

func CartRoute(e *echo.Echo) {
	cartController := controllers.CartController{}

	e.GET("/carts", cartController.GetAllCarts)
	e.POST("/carts", cartController.CreateCart)
	e.GET("/carts/:id", cartController.GetCart)
	e.PUT("/carts/:id", cartController.UpdateCart)
	e.DELETE("/carts/:id", cartController.DeleteCart)
}
