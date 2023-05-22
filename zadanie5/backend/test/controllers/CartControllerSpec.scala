package controllers

import models.CartItemDTO
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.libs.json.Json
import play.api.test.Helpers._
import play.api.test._

class CartControllerSpec extends PlaySpec with GuiceOneAppPerTest {

  implicit val cartItemDtoFormat = Json.format[CartItemDTO]

  "CartController" should {

    "return sum to pay for valid cart items with one quantity" in {
      val controller = app.injector.instanceOf[CartController]
      val validCartItems = List(
        CartItemDTO(1, "Item1", 10, 1),
        CartItemDTO(2, "Item2", 5, 1),
        CartItemDTO(3, "Item3", 8, 1)
      )
      val validRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(validCartItems))
      val validResult = controller.send()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson(23)
    }

    "return value to pay for one item" in {
      val controller = app.injector.instanceOf[CartController]
      val validCartItems = List(
        CartItemDTO(1, "Item1", 10, 1)
      )
      val validRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(validCartItems))
      val validResult = controller.send()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson(10)
    }

    "return correct value to pay for one item with multiple quantity" in {
      val controller = app.injector.instanceOf[CartController]
      val validCartItems = List(
        CartItemDTO(1, "Item1", 10, 5)
      )
      val validRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(validCartItems))
      val validResult = controller.send()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson(50)
    }

    "return correct value to pay for multiple item with multiple quantity" in {
      val controller = app.injector.instanceOf[CartController]
      val validCartItems = List(
        CartItemDTO(1, "Item1", 10, 5),
        CartItemDTO(2, "Item2", 5, 10),
      )
      val validRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(validCartItems))
      val validResult = controller.send()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson(100)
    }

    "return zero when no items send" in {
      val controller = app.injector.instanceOf[CartController]
      val validCartItems = List()
      val validRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(validCartItems))
      val validResult = controller.send()(validRequest)

      status(validResult) mustBe OK
      contentAsJson(validResult) mustBe Json.toJson(0)
    }

    "return BadRequest for empty request body" in {
      val controller = app.injector.instanceOf[CartController]
      val emptyRequest = FakeRequest(POST, "/cart").withJsonBody(Json.obj())
      val emptyResult = controller.send()(emptyRequest)

      status(emptyResult) mustBe BAD_REQUEST
    }

    "return BadRequest for invalid request body" in {
      val controller = app.injector.instanceOf[CartController]
      val invalidCartItems = List("apples", "oranges", "pears")

      val invalidRequest = FakeRequest(POST, "/cart").withJsonBody(Json.toJson(invalidCartItems))
      val invalidResult = controller.send()(invalidRequest)

      status(invalidResult) mustBe BAD_REQUEST
    }
  }
}