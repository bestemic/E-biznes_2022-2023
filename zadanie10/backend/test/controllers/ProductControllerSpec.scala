package controllers

import data.ProductsData
import models.Product
import org.mockito.Mockito._
import org.scalatestplus.mockito.MockitoSugar
import org.scalatestplus.play._
import org.scalatestplus.play.guice.GuiceOneAppPerTest
import play.api.libs.json.Json
import play.api.test.Helpers._
import play.api.test._

class ProductControllerSpec extends PlaySpec with GuiceOneAppPerTest with MockitoSugar {

  implicit val productFormat = Json.format[Product]

  "ProductController" should {

    "return a list of products when the product list is not empty" in {
      val products = List(
        Product(1, "First", 10),
        Product(2, "Second", 20)
      )

      val mockProductsData = mock[ProductsData]
      when(mockProductsData.getAllProducts).thenReturn(products)

      val controller = new ProductController(stubControllerComponents(), mockProductsData)
      val request = FakeRequest(GET, "/products")
      val result = controller.getAll()(request)

      status(result) mustBe OK
      contentAsJson(result) mustBe Json.toJson(products)
    }

    "return NoContent when the product list is empty" in {
      val mockProductsData = mock[ProductsData]
      when(mockProductsData.getAllProducts).thenReturn(List.empty[Product])

      val controller = new ProductController(stubControllerComponents(), mockProductsData)
      val request = FakeRequest(GET, "/products")
      val result = controller.getAll()(request)

      status(result) mustBe NO_CONTENT
    }
  }
}