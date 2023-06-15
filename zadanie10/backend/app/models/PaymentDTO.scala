package models

case class PaymentDTO(creditCardNumber: String, expirationDate: String, cvc: Int, toPay: Int)