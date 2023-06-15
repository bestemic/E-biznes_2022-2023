import React, {useContext, useState} from "react";
import {PaymentFormData} from "../interfaces/PaymentInterface";
import makePayment from "../api/PaymentApi";
import {useLocation} from "react-router-dom";
import CartContext from "../context/CartContext";


export const Payments = () => {
    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        creditCardNumber: '',
        expirationDate: '',
        cvc: 0,
        toPay: 0
    });
    const [message, setMessage] = useState<string>('');
    const {state: {toPay = 0}} = useLocation();
    const {clearProducts} = useContext(CartContext)!;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setPaymentData(values => ({...values, [name]: value}));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        paymentData.cvc = parseInt(String(paymentData.cvc));
        paymentData.toPay = toPay;
        makePayment(paymentData)
            .then((res) => setMessage(res))
            .catch(console.log);
        clearProducts()
    };

    if (message) {
        return <div>{message}</div>;
    }

    return (
        <div>
            <h3>Do zapłaty {toPay}</h3>
            <form onSubmit={handleSubmit}>
                <label>Numer karty kredytowej:
                    <input
                        type="text"
                        name="creditCardNumber"
                        value={paymentData.creditCardNumber || ""}
                        onChange={handleChange}
                    />
                </label>
                <label>Ważność:
                    <input
                        type="text"
                        name="expirationDate"
                        value={paymentData.expirationDate || ""}
                        onChange={handleChange}
                    />
                </label>
                <label>CVC:
                    <input
                        type="number"
                        name="cvc"
                        min="0"
                        value={paymentData.cvc || ""}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Zapłać</button>
            </form>
        </div>
    )
}