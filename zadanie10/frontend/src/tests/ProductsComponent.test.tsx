import {fireEvent, render} from '@testing-library/react'
import '@testing-library/jest-dom'

import {ProductContext} from '../context/ProductContext'
import {CartContext} from '../context/CartContext'
import {Products} from "../components/Products"


test('renders only table header when no products', () => {
    const {container} = render(
        <ProductContext.Provider value={{products: []}}>
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    expect(container.querySelector('tr')).toBeInTheDocument()

    const thElements = container.querySelectorAll('th')
    expect(thElements).toHaveLength(2)

    const [first, second] = thElements
    expect(first).toHaveTextContent('Nazwa')
    expect(second).toHaveTextContent('Cena')

    expect(container.querySelectorAll('td')).toHaveLength(0)
})

test('renders empty product list message when there are no products', () => {
    const {getByText, container} = render(
        <ProductContext.Provider value={{products: []}}>
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    expect(getByText('Brak dostępnych produktów')).toBeInTheDocument()
    expect(container.querySelector('tbody')).toBeEmptyDOMElement()
})

test('renders product list correctly', () => {
    const products = [
        {id: 1, name: 'Product 1', price: 10},
        {id: 2, name: 'Product 2', price: 20},
    ]

    const {container, getByText} = render(
        <ProductContext.Provider value={{products}}>
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    const trElements = container.querySelectorAll('tbody tr')
    expect(trElements).toHaveLength(2)

    trElements.forEach((trElement) => {
        const tdElements = trElement.querySelectorAll('td')
        expect(tdElements).toHaveLength(3)

        const button = tdElements[2].querySelector('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent('Add product to cart')
    })

    expect(getByText('Product 1')).toBeInTheDocument()
    expect(getByText('10')).toBeInTheDocument()
    expect(getByText('Product 2')).toBeInTheDocument()
    expect(getByText('20')).toBeInTheDocument()
})

test('not show empty message when products available', () => {
    const products = [
        {id: 1, name: 'Product 1', price: 10}
    ]

    const {container, queryByText} = render(
        <ProductContext.Provider value={{products}}>
            <CartContext.Provider value={{
                addProduct: jest.fn(),
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    const tbody = container.querySelector('tbody')
    expect(tbody).not.toBeNull()
    if (tbody !== null) {
        expect(tbody.childElementCount).toBeGreaterThan(0)
    }
    expect(queryByText('Brak dostępnych produktów')).toBeNull()
})

test('calls addProduct function with correct product when button is clicked', () => {
    const products = [
        {id: 1, name: 'Product 1', price: 10},
        {id: 2, name: 'Product 2', price: 20},
    ]

    const addProductMock = jest.fn()

    const {getAllByText} = render(
        <ProductContext.Provider value={{products}}>
            <CartContext.Provider value={{
                addProduct: addProductMock,
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    const buttons = getAllByText('Add product to cart')

    expect(addProductMock).toHaveBeenCalledTimes(0)

    fireEvent.click(buttons[0])
    expect(addProductMock).toHaveBeenCalledTimes(1)
    expect(addProductMock).toHaveBeenLastCalledWith(products[0])

    fireEvent.click(buttons[1])
    expect(addProductMock).toHaveBeenCalledTimes(2)
    expect(addProductMock).toHaveBeenLastCalledWith(products[1])
})

test('does not call addProduct function when no products', () => {
    const addProductMock = jest.fn()

    const {queryByText} = render(
        <ProductContext.Provider value={{products: []}}>
            <CartContext.Provider value={{
                addProduct: addProductMock,
                removeProduct: jest.fn(),
                clearProducts: jest.fn(),
                cart: []
            }}>
                <Products/>
            </CartContext.Provider>
        </ProductContext.Provider>
    )

    const button = queryByText('Add product to cart')
    expect(button).not.toBeInTheDocument()
    expect(addProductMock).not.toHaveBeenCalled()
})