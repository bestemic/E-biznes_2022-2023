package data

import com.google.inject.ImplementedBy
import models.Product

@ImplementedBy(classOf[ProductsDataImpl])
trait ProductsData {
  def getAllProducts: List[Product]
}

class ProductsDataImpl extends ProductsData {
  private val productList = List(
    Product(1, "Toothbrush", 12),
    Product(2, "Headphones", 90),
    Product(3, "T-shirt", 50),
    Product(4, "Smartphone case", 200),
    Product(5, "Picture frame", 14)
  )

  def getAllProducts: List[Product] = productList
}