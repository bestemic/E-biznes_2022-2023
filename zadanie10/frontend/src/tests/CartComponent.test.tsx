import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom'

import {CartContext} from '../context/CartContext'
import {Cart} from "../components/Cart"
import * as CartApi from "../api/CartApi";
import {act} from "react-dom/test-utils";

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')),
    useNavigate: () => mockedUsedNavigate,
}))

describe("Cart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders empty cart', () => {
        const {container} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Cart/>
            </CartContext.Provider>
        )

        expect(container.querySelector('h2')).toHaveTextContent('Koszyk')
        expect(container.querySelectorAll('li')).toHaveLength(0)
    })

    test("renders cart with items", () => {
        const cartItems = [
            {id: 1, name: "Product 1", price: 10, quantity: 2},
            {id: 2, name: "Product 2", price: 20, quantity: 1},
        ];

        const {getByText, container} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: cartItems
            }}>
                <Cart/>
            </CartContext.Provider>
        )

        const liElements = container.querySelectorAll('li')
        expect(liElements).toHaveLength(2)

        liElements.forEach((liElement) => {
            const buttons = liElement.querySelectorAll('button')
            expect(buttons).toHaveLength(2)

            expect(buttons[0]).toHaveTextContent('+')
            expect(buttons[1]).toHaveTextContent('-')
        })

        expect(getByText("Product 1 - 10 zł x 2 szt.")).toBeInTheDocument();
        expect(getByText("Product 2 - 20 zł x 1 szt.")).toBeInTheDocument();
    });

    test("increase product quantity in cart", async () => {
        const cartItems = [
            {id: 1, name: "Product 1", price: 10, quantity: 1}
        ];

        const addProductMock = jest.fn();

        const {getAllByText} = render(
            <CartContext.Provider value={{
                addProduct: addProductMock,
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: cartItems
            }}>
                <Cart/>
            </CartContext.Provider>
        )

        const buttons = getAllByText('+')

        fireEvent.click(buttons[0])
        expect(addProductMock).toHaveBeenCalledTimes(1)
        expect(addProductMock).toHaveBeenLastCalledWith({id: 1, name: "Product 1", price: 10, quantity: 1})
    });

    test("decrease product quantity in cart", async () => {
        const cartItems = [
            {id: 1, name: "Product 1", price: 10, quantity: 2}
        ];

        const removeProductMock = jest.fn();

        const {getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn,
                removeProduct: removeProductMock,
                clearProducts: jest.fn(),
                cart: cartItems
            }}>
                <Cart/>
            </CartContext.Provider>
        )

        const button = getByText('-')

        fireEvent.click(button)
        expect(removeProductMock).toHaveBeenCalledTimes(1)
        expect(removeProductMock).toHaveBeenCalledWith(1)
    });

    test("submits cart and navigates to payments", async () => {
        const cartItems = [
            {id: 1, name: "Product 1", price: 10, quantity: 2},
            {id: 2, name: "Product 2", price: 20, quantity: 1},
        ];

        const sendCartMock = jest.spyOn(CartApi, 'default').mockImplementation(() => Promise.resolve(40));

        const {getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn,
                removeProduct: jest.fn,
                clearProducts: jest.fn(),
                cart: cartItems
            }}>
                <Cart/>
            </CartContext.Provider>
        )
        const button = getByText("Prześlij koszyk")
        expect(button).toBeInTheDocument()

        await act(async () => {
            fireEvent.click(button);
        });

        expect(sendCartMock).toHaveBeenCalledTimes(1);
        expect(sendCartMock).toHaveBeenCalledWith(cartItems);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/payments", {
            state: {
                toPay: 40,
            },
        });
    });

    test("handles cart submission failure", async () => {
        const cartItems = [
            {id: 1, name: "Product 1", price: 10, quantity: 2},
            {id: 2, name: "Product 2", price: 20, quantity: 1},
        ];

        const sendCartMock = jest.spyOn(CartApi, 'default').mockImplementation(() => Promise.reject(new Error("Failed")));
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

        const {getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn,
                removeProduct: jest.fn,
                clearProducts: jest.fn(),
                cart: cartItems
            }}>
                <Cart/>
            </CartContext.Provider>
        )

        await act(async () => {
            fireEvent.click(getByText("Prześlij koszyk"));
        });

        expect(sendCartMock).toHaveBeenCalledTimes(1);
        expect(sendCartMock).toHaveBeenCalledWith(cartItems);
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(new Error("Failed"));
    });
})