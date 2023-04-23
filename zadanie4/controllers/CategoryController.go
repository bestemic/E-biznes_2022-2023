package controllers

import (
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
	"zadanie4/models"
)

type CategoryController struct{}

func (w *CategoryController) CreateCategory(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	var category models.Category

	if err := c.Bind(&category); err != nil {
		fmt.Println("here")
		return c.JSON(http.StatusBadRequest, err)
	}

	if validationErr := validate.Struct(&category); validationErr != nil {
		fmt.Println("or here")
		return c.JSON(http.StatusBadRequest, "Error")
	}

	db.Create(&category)

	return c.JSON(http.StatusCreated, &category)
}

func (w *CategoryController) GetCategory(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category

	db.Preload("Products").First(&category, id)

	if category.ID == 0 {
		return c.JSON(http.StatusNotFound, "Category with id "+c.Param("id")+" not found")
	}

	return c.JSON(http.StatusOK, &category)
}

func (w *CategoryController) UpdateCategory(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	id, _ := strconv.Atoi(c.Param("id"))
	var currentCategory models.Category
	var category models.Category

	db.First(&currentCategory, id)

	if currentCategory.ID == 0 {
		return c.JSON(http.StatusNotFound, "Category with id "+c.Param("id")+" not found")
	}

	if err := c.Bind(&category); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&category); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	currentCategory.Name = category.Name
	currentCategory.Description = category.Description
	db.Save(&currentCategory)

	return c.JSON(http.StatusOK, &currentCategory)
}

func (w *CategoryController) DeleteCategory(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, _ := strconv.Atoi(c.Param("id"))
	var category models.Category

	db.First(&category, id)
	if category.ID == 0 {
		return c.JSON(http.StatusNotFound, "Category with id "+c.Param("id")+" not found")
	}

	var productsCount int64
	db.Model(&models.Product{}).Where("category_id = ?", category.ID).Count(&productsCount)

	if productsCount > 0 {
		return c.JSON(http.StatusConflict, "Cannot delete category with existing products")
	}

	db.Delete(&models.Category{}, id)

	return c.NoContent(http.StatusOK)
}

func (w *CategoryController) GetAllCategories(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	var categories []models.Category
	db.Preload("Products").Find(&categories)

	return c.JSON(http.StatusOK, &categories)
}
