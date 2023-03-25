package controllers

import models.{Product, ProductDTO}
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject._
import scala.collection.mutable


@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val productList = new mutable.ListBuffer[Product]()
  productList += Product(1, "prod 1", 1, 12)
  productList += Product(2, "prod 2", 2, 1)

  implicit val productFormat = Json.format[Product]
  implicit val productDtoFormat = Json.format[ProductDTO]


  def getAll(): Action[AnyContent] = Action {
    if (productList.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(productList))
    }
  }

  def get(id: Long): Action[AnyContent] = Action {
    val foundProduct = productList.find(_.id == id)
    foundProduct match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound
    }
  }

  def add(): Action[AnyContent] = Action { implicit request =>
    val content = request.body
    val jsonObject = content.asJson
    val productDtoList: Option[ProductDTO] =
      jsonObject.flatMap(
        Json.fromJson[ProductDTO](_).asOpt
      )

    productDtoList match {
      case Some(productDto) =>
        var nextId: Long = 1
        if (productList.nonEmpty) {
          nextId = productList.map(_.id).max + 1
        }
        val newProduct = Product(nextId, productDto.name, productDto.categoryId, productDto.price)
        productList += newProduct
        Created(Json.toJson(newProduct))
      case None =>
        BadRequest
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundProduct = productList.find(_.id == id)
    foundProduct match {
      case Some(product) =>
        val content = request.body
        val jsonObject = content.asJson
        val productDtoList: Option[ProductDTO] =
          jsonObject.flatMap(
            Json.fromJson[ProductDTO](_).asOpt
          )

        productDtoList match {
          case Some(productDto) =>
            productList -= product
            val newProduct = Product(id, productDto.name, productDto.categoryId, productDto.price)
            productList += newProduct
            Ok(Json.toJson(newProduct))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action {
    val foundProduct = productList.find(_.id == id)
    foundProduct match {
      case Some(product) =>
        productList -= product
        Ok
      case None => NotFound
    }
  }
}