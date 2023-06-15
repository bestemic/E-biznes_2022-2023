package controllers

import data.ProductsData
import models.Product
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject._


@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents,  productsData: ProductsData) extends BaseController {

  implicit val productFormat = Json.format[Product]

  def getAll: Action[AnyContent] = Action {
    val productList = productsData.getAllProducts

    if (productList.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(productList))
    }
  }
}