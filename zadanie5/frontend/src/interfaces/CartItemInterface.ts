import {Product} from "./ProductInterface";

export interface CartItem extends Product {
    quantity: number;
}