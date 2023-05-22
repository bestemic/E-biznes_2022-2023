package controllers

import models.PaymentDTO
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.libs.json.Json
import play.api.test.Helpers._
import play.api.test._

class PaymentControllerSpec extends PlaySpec with GuiceOneAppPerTest {

  implicit val PaymentDTOFormat = Json.format[PaymentDTO]

  "PaymentController" should {

    "return correct message for valid payment data" in {
      val controller = app.injector.instanceOf[PaymentController]
      val validPaymentData = PaymentDTO("1234567812345678", "12/25", 123, 100)
      val validRequest = FakeRequest(POST, "/payment").withJsonBody(Json.toJson(validPaymentData))
      val validResult = controller.pay()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson("Transakcja zaakceptowana")
    }

    "return BadRequest for empty request body" in {
      val controller = app.injector.instanceOf[PaymentController]
      val emptyRequest = FakeRequest(POST, "/payment").withJsonBody(Json.obj())
      val emptyResult = controller.pay()(emptyRequest)

      status(emptyResult) mustBe BAD_REQUEST
    }

    "return BadRequest for incorrect request body" in {
      val controller = app.injector.instanceOf[PaymentController]
      val invalidPaymentData = List(1, 2, 3)
      val invalidRequest = FakeRequest().withJsonBody(Json.toJson(invalidPaymentData))
      val invalidResult = controller.pay()(invalidRequest)

      status(invalidResult) mustBe BAD_REQUEST
    }
  }
}