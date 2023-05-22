import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom'
import {Payments} from "../components/Payments"
import {CartContext} from "../context/CartContext"
import * as PaymentApi from '../api/PaymentApi';
import {act} from "react-dom/test-utils";


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: jest.fn().mockReturnValue({state: {toPay: 100}}),
}));

describe("Cart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render component correctly", () => {
        const {getByLabelText, getByText, container} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Payments/>
            </CartContext.Provider>
        )

        const h3Element = container.querySelector('h3')
        expect(h3Element).toBeInTheDocument()

        if (h3Element !== null) {
            expect(h3Element.textContent).toContain('100')
        }

        expect(getByLabelText("Numer karty kredytowej:")).toBeInTheDocument();
        expect(getByLabelText("Ważność:")).toBeInTheDocument();
        expect(getByLabelText("CVC:")).toBeInTheDocument();
        expect(getByText("Zapłać")).toBeInTheDocument();

        const inputElements = container.querySelectorAll('input')
        expect(inputElements[0].type).toBe('text')
        expect(inputElements[1].type).toBe('text')
        expect(inputElements[2].type).toBe('number')
        expect(inputElements[2].min).toBe('0')
    });

    it("should update  state on input change", () => {
        const {container} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Payments/>
            </CartContext.Provider>
        )

        const creditCardNumberInput = container.querySelectorAll('input')[0]
        const expirationDateInput = container.querySelectorAll('input')[1]
        const cvcInput = container.querySelectorAll('input')[2]

        fireEvent.change(creditCardNumberInput, {target: {value: "1234567890"}});
        fireEvent.change(expirationDateInput, {target: {value: "12/24"}});
        fireEvent.change(cvcInput, {target: {value: "123"}});

        expect(creditCardNumberInput.value).toBe("1234567890");
        expect(expirationDateInput.value).toBe("12/24");
        expect(cvcInput.value).toBe("123");
    });

    it("should clear products on form submission", async () => {
        jest.spyOn(PaymentApi, 'default').mockResolvedValue("Payment successful");
        const clearProductsMock = jest.fn();

        const {getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: clearProductsMock,
                cart: []
            }}>
                <Payments/>
            </CartContext.Provider>
        )

        await act(async () => {
            fireEvent.click(getByText("Zapłać"));
        });
        expect(clearProductsMock).toHaveBeenCalled();
    });

    it("should submit the form and call makePayment with success", async () => {
        const makePaymentMock = jest.spyOn(PaymentApi, 'default').mockResolvedValue("Payment successful");

        const {getByLabelText, getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn,
                cart: []
            }}>
                <Payments/>
            </CartContext.Provider>
        )

        fireEvent.change(getByLabelText("Numer karty kredytowej:"), {target: {value: "1234567890"}});
        fireEvent.change(getByLabelText("Ważność:"), {target: {value: "12/24"}});
        fireEvent.change(getByLabelText("CVC:"), {target: {value: "123"}});

        await act(async () => {
            fireEvent.click(getByText("Zapłać"));
        });

        expect(makePaymentMock).toHaveBeenCalledWith({
            creditCardNumber: "1234567890",
            expirationDate: "12/24",
            cvc: 123,
            toPay: 100,
        });

        await act(async () => {
            await Promise.resolve();
        });

        expect(getByText("Payment successful")).toBeInTheDocument();
    });

    test("handles payments failure", async () => {
        jest.spyOn(PaymentApi, 'default').mockImplementation(() => Promise.reject(new Error("Failed")));
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

        const {getByText} = render(
            <CartContext.Provider value={{
                addProduct: jest.fn,
                removeProduct: jest.fn,
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Payments/>
            </CartContext.Provider>
        )

        await act(async () => {
            fireEvent.click(getByText("Zapłać"));
        });

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(new Error("Failed"));
    });
})