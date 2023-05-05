import React, {useCallback, useMemo, useState} from 'react';
import {Product} from '../interfaces/ProductInterface';
import {CartItem} from '../interfaces/CartItemInterface';
import {CartContextState} from '../interfaces/CartContextStateInterface';

export const CartContext = React.createContext<CartContextState | undefined>(undefined);

type Props = {
    children: React.ReactNode;
};

export const CartContextProvider = ({children}: Props) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addProduct = useCallback((product: Product) => {
        const existingProduct = cart.find((i) => i.id === product.id);

        if (existingProduct) {
            setCart((prevItems) =>
                prevItems.map((i) =>
                    i.id === product.id ? {...i, quantity: i.quantity + 1} : i
                )
            );
        } else {
            setCart((prevItems) => [...prevItems, {...product, quantity: 1}]);
        }
    }, [cart]);

    const removeProduct = useCallback((id: number) => {
        setCart((prevItems) => prevItems.map((item) => {
            if (item.id === id) {
                return {...item, quantity: item.quantity - 1};
            } else {
                return item;
            }
        }).filter((i) => i.quantity > 0));
    }, []);

    const clearProducts = useCallback(() => {
        setCart([]);
    }, []);

    const providerValue = useMemo<CartContextState>(() => ({
        cart,
        addProduct,
        removeProduct,
        clearProducts
    }), [addProduct, cart, removeProduct, clearProducts])

    return <CartContext.Provider value={providerValue}>{children}</CartContext.Provider>;
};

export default CartContext;
