package controllers

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"zadanie4/models"
)

type CartController struct{}

func (w *CartController) CreateCart(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	var cart models.Cart

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&cart); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	db.Create(&cart)

	return c.JSON(http.StatusCreated, &cart)
}

func (w *CartController) GetCart(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var cart models.Cart

	db.First(&cart, id)

	if cart.ID == 0 {
		return c.JSON(http.StatusNotFound, "Cart with id "+c.Param("id")+" not found")
	}

	return c.JSON(http.StatusOK, &cart)
}

func (w *CartController) UpdateCart(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	id, _ := strconv.Atoi(c.Param("id"))
	var currentCart models.Cart
	var cart models.Cart

	db.First(&currentCart, id)

	if currentCart.ID == 0 {
		return c.JSON(http.StatusNotFound, "Cart with id "+c.Param("id")+" not found")
	}

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&cart); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	currentCart.Amount = cart.Amount
	currentCart.Description = cart.Description
	db.Save(&currentCart)

	return c.JSON(http.StatusOK, &currentCart)
}

func (w *CartController) DeleteCart(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var cart models.Cart

	db.First(&cart, id)
	if cart.ID == 0 {
		return c.JSON(http.StatusNotFound, "Cart with id "+c.Param("id")+" not found")
	}

	db.Delete(&models.Cart{}, id)

	return c.NoContent(http.StatusOK)
}

func (w *CartController) GetAllCarts(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	var carts []models.Cart
	db.Find(&carts)

	return c.JSON(http.StatusOK, &carts)
}
