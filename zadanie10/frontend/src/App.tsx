import './App.css'
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {Products} from "./components/Products";
import {Payments} from "./components/Payments";
import {Cart} from "./components/Cart";
import {ProductContextProvider} from "./context/ProductContext";
import {CartContextProvider} from "./context/CartContext";

function App() {
    return (
        <div className="app">
            <ProductContextProvider>
                <CartContextProvider>
                    <BrowserRouter>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Produkty</Link>
                                </li>
                                <li>
                                    <Link to="/cart">Koszyk</Link>
                                </li>
                            </ul>
                        </nav>

                        <Routes>
                            <Route path="/" element={<Products/>}/>
                            <Route path="/payments" element={<Payments/>}/>
                            <Route path="/cart" element={<Cart/>}/>
                        </Routes>
                    </BrowserRouter>
                </CartContextProvider>
            </ProductContextProvider>
        </div>
    )
}

export default App
