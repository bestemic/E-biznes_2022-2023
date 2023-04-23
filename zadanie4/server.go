package main

import (
	"github.com/labstack/echo/v4"
	"zadanie4/database"
	"zadanie4/routes"
)

func main() {
	e := echo.New()

	db := database.Connect()

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("db", db)
			return next(c)
		}
	})

	routes.ProductRoute(e)
	routes.CartRoute(e)
	routes.CategoryRoute(e)

	e.Logger.Fatal(e.Start(":1323"))
}
