package controllers

import models.{Category, CategoryDTO}
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject._
import scala.collection.mutable


@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val categoryList = new mutable.ListBuffer[Category]()
  categoryList += Category(1, "clothes", "Example desc cloths")
  categoryList += Category(2, "electronics", "Example desc electronics")

  implicit val categoryFormat = Json.format[Category]
  implicit val categoryDtoFormat = Json.format[CategoryDTO]


  def getAll(): Action[AnyContent] = Action {
    if (categoryList.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(categoryList))
    }
  }

  def get(id: Long): Action[AnyContent] = Action {
    val foundCategory = categoryList.find(_.id == id)
    foundCategory match {
      case Some(category) => Ok(Json.toJson(category))
      case None => NotFound
    }
  }

  def add(): Action[AnyContent] = Action { implicit request =>
    val content = request.body
    val jsonObject = content.asJson
    val categoryDtoList: Option[CategoryDTO] =
      jsonObject.flatMap(
        Json.fromJson[CategoryDTO](_).asOpt
      )

    categoryDtoList match {
      case Some(categoryDto) =>
        var nextId: Long = 1
        if(categoryList.nonEmpty){
          nextId = categoryList.map(_.id).max + 1
        }
        val newCategory = Category(nextId, categoryDto.name, categoryDto.description)
        categoryList += newCategory
        Created(Json.toJson(newCategory))
      case None =>
        BadRequest
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCategory = categoryList.find(_.id == id)
    foundCategory match {
      case Some(category) =>
        val content = request.body
        val jsonObject = content.asJson
        val categoryDtoList: Option[CategoryDTO] =
          jsonObject.flatMap(
            Json.fromJson[CategoryDTO](_).asOpt
          )

        categoryDtoList match {
          case Some(categoryDto) =>
            categoryList -= category
            val newCategory = Category(id, categoryDto.name, categoryDto.description)
            categoryList += newCategory
            Ok(Json.toJson(newCategory))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action {
    val foundCategory = categoryList.find(_.id == id)
    foundCategory match {
      case Some(category) =>
        categoryList -= category
        Ok
      case None => NotFound
    }
  }
}