import Api from "./Api";
import {Product} from "../interfaces/ProductInterface";


const getProducts = async (): Promise<Product[]> => {
    return Api.get('/products')
        .then((res) => {
            return res.data;
        });
}

export default getProducts