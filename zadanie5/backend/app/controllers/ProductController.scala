package controllers

import models.Product
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject._
import scala.collection.mutable


@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val productList = new mutable.ListBuffer[Product]()
  productList += Product(1, "Toothbrush", 12)
  productList += Product(2, "Headphones", 90)
  productList += Product(3, "T-shirt", 50)
  productList += Product(4, "Smartphone case", 200)
  productList += Product(5, "Picture frame", 14)

  implicit val productFormat = Json.format[Product]

  def getAll: Action[AnyContent] = Action {
    if (productList.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(productList))
    }
  }
}