package controllers

import models.{Cart, CartDTO}
import play.api.libs.json._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject._
import scala.collection.mutable


@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val cartList = new mutable.ListBuffer[Cart]()
  cartList += Cart(1, 2, 3)
  cartList += Cart(2, 1, 1)

  implicit val cartFormat = Json.format[Cart]
  implicit val cartDtoFormat = Json.format[CartDTO]


  def getAll(): Action[AnyContent] = Action {
    if (cartList.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(cartList))
    }
  }

  def get(id: Long): Action[AnyContent] = Action {
    val foundCart = cartList.find(_.id == id)
    foundCart match {
      case Some(cart) => Ok(Json.toJson(cart))
      case None => NotFound
    }
  }

  def add(): Action[AnyContent] = Action { implicit request =>
    val content = request.body
    val jsonObject = content.asJson
    val cartDtoList: Option[CartDTO] =
      jsonObject.flatMap(
        Json.fromJson[CartDTO](_).asOpt
      )

    cartDtoList match {
      case Some(cartDto) =>
        var nextId: Long = 1
        if (cartList.nonEmpty) {
          nextId = cartList.map(_.id).max + 1
        }
        val newCart = Cart(nextId, cartDto.productId, cartDto.amount)
        cartList += newCart
        Created(Json.toJson(newCart))
      case None =>
        BadRequest
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCart = cartList.find(_.id == id)
    foundCart match {
      case Some(cart) =>
        val content = request.body
        val jsonObject = content.asJson
        val cartDtoList: Option[CartDTO] =
          jsonObject.flatMap(
            Json.fromJson[CartDTO](_).asOpt
          )

        cartDtoList match {
          case Some(cartDto) =>
            cartList -= cart
            val newCart = Cart(id, cartDto.productId, cartDto.amount)
            cartList += newCart
            Ok(Json.toJson(newCart))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action {
    val foundCart = cartList.find(_.id == id)
    foundCart match {
      case Some(cart) =>
        cartList -= cart
        Ok
      case None => NotFound
    }
  }
}