import React, {useEffect, useMemo, useState} from 'react';
import {Product} from "../interfaces/ProductInterface";
import getProducts from "../api/ProductsApi";
import {ShopContextState} from "../interfaces/ShopContextStateInterface";
import * as dayjs from 'dayjs'

console.log(dayjs())

export const ProductContext = React.createContext<ShopContextState | undefined>(undefined);

type Props = {
    children: React.ReactNode;
};

export const ProductContextProvider = ({children}: Props) => {

    const [products, setProducts] = useState<Product[]>([]);

    const providerValue = useMemo<ShopContextState>(() => ({
        products,
    }), [products]);

    useEffect(() => {
        getProducts()
            .then((products) => setProducts(products))
            .catch(console.log);
    }, []);

    return (
        <ProductContext.Provider value={providerValue}>{children}</ProductContext.Provider>
    );
};

export default ProductContext;