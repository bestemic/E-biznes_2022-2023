package controllers

import models.CartItemDTO
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject.{Inject, Singleton}

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  implicit val cartItemDtoFormat = Json.format[CartItemDTO]

  def send: Action[AnyContent] = Action { implicit request =>
    val content = request.body
    val jsonObject = content.asJson

    val cartItemDtoList: Option[List[CartItemDTO]] =
      jsonObject.flatMap(
        Json.fromJson[List[CartItemDTO]](_).asOpt
      )

    cartItemDtoList match {
      case Some(cartItemList) =>
        var sum = 0
        cartItemList.foreach(item => sum += (item.price * item.quantity))
        Ok(Json.toJson(sum))
      case None =>
        BadRequest
    }
  }
}