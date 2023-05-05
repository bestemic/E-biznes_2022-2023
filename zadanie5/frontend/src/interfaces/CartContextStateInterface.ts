import {CartItem} from "./CartItemInterface";
import {Product} from "./ProductInterface";

export interface CartContextState {
    cart: CartItem[];
    addProduct: (product: Product) => void;
    removeProduct: (id: number) => void;
    clearProducts: () => void;
}