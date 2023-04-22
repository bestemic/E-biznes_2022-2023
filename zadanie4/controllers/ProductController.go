package controllers

import (
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"zadanie4/models"
)

type ProductController struct{}

func (w *ProductController) CreateProduct(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	var product models.Product

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&product); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	db.Create(&product)

	return c.JSON(http.StatusCreated, &product)
}

func (w *ProductController) GetProduct(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product

	db.First(&product, id)

	if product.ID == 0 {
		return c.JSON(http.StatusNotFound, "Product with id "+c.Param("id")+" not found")
	}

	return c.JSON(http.StatusOK, &product)
}

func (w *ProductController) UpdateProduct(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	id, _ := strconv.Atoi(c.Param("id"))
	var currentProduct models.Product
	var product models.Product

	db.First(&currentProduct, id)

	if currentProduct.ID == 0 {
		return c.JSON(http.StatusNotFound, "Product with id "+c.Param("id")+" not found")
	}

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&product); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	currentProduct.Price = product.Price
	currentProduct.Name = product.Name
	db.Save(&currentProduct)

	return c.JSON(http.StatusOK, &currentProduct)
}

func (w *ProductController) DeleteProduct(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var product models.Product

	db.First(&product, id)
	if product.ID == 0 {
		return c.JSON(http.StatusNotFound, "Product with id "+c.Param("id")+" not found")
	}

	db.Delete(&models.Product{}, id)

	return c.NoContent(http.StatusOK)
}

func (w *ProductController) GetAllProducts(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	var products []models.Product
	db.Find(&products)

	return c.JSON(http.StatusOK, &products)
}
