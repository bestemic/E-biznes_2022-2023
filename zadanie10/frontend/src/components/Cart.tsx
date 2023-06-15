import {CartItem} from "../interfaces/CartItemInterface";
import sendCart from "../api/CartApi";
import React, {useContext} from "react";
import CartContext from "../context/CartContext";
import {useNavigate} from "react-router-dom";

export const Cart = () => {
    const {cart, addProduct, removeProduct} = useContext(CartContext)!;
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendCart(cart)
            .then((res) => {
                navigate('/payments', {
                    state: {
                        toPay: res
                    }
                })
            })
            .catch(console.log);
    };

    return (
        <div>
            <h2>Koszyk</h2>
            <ul>
                {cart.map((item: CartItem) => (
                    <li key={item.id}>
                        {item.name} - {item.price} zł x {item.quantity} szt.
                        <button onClick={() => addProduct(item)}>+</button>
                        <button onClick={() => removeProduct(item.id)}>-</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleSubmit}>Prześlij koszyk</button>
        </div>
    )
}