import Api from "./Api";
import {CartItem} from "../interfaces/CartItemInterface";


const sendCart = async (data: CartItem[]): Promise<number> => {
    return Api.post('/cart', data)
        .then((res) => {
            return res.data;
        });
}

export default sendCart