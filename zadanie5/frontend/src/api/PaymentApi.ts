import Api from "./Api";
import {PaymentFormData} from "../interfaces/PaymentInterface";


const makePayment = async (data: PaymentFormData): Promise<string> => {
    return Api.post('/payment', data)
        .then((res) => {
            return res.data;
        });
}

export default makePayment