package controllers

import models.PaymentDTO
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}

import javax.inject.{Inject, Singleton}

@Singleton
class PaymentController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  implicit val PaymentDTOFormat = Json.format[PaymentDTO]

  def pay: Action[AnyContent] = Action { implicit request =>
    val content = request.body
    val jsonObject = content.asJson
    val paymentDtoList: Option[PaymentDTO] =
      jsonObject.flatMap(
        Json.fromJson[PaymentDTO](_).asOpt
      )

    paymentDtoList match {
      case Some(paymentDto) =>
        println("==========================")
        println("Numer karty " + paymentDto.creditCardNumber)
        println("Data wygaśnięcia " + paymentDto.expirationDate)
        println("CVC " + paymentDto.cvc)
        println("Kwota " + paymentDto.toPay)
        println("==========================")
        Ok(Json.toJson("Transakcja zaakceptowana"))
      case None =>
        BadRequest
    }
  }
}