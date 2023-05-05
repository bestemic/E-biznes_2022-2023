import {useContext} from "react";
import {Product} from "../interfaces/ProductInterface";
import ProductContext from "../context/ProductContext";
import CartContext from "../context/CartContext";


export const Products = () => {
    const {products} = useContext(ProductContext)!;
    const {addProduct} = useContext(CartContext)!;

    return (
        <div>
            <div className="products">
                <table>
                    <thead>
                    <tr>
                        <th>Nazwa</th>
                        <th>Cena</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product: Product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                <button onClick={() => addProduct(product)}>Add product to cart</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}