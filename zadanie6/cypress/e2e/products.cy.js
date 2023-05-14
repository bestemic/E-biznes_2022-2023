describe('/ page test', () => {

    it('Should load main page', () => {
        cy.visit('http://localhost:5173/')
        cy.get('div.app').should('exist')
        cy.get('nav').should('exist')
        cy.get('nav a').should('have.length', 2)
    })

    it('Should send empty cart', () => {
        cy.visit('http://localhost:5173/cart')

        cy.get('div > ul > li').should('not.exist')

        cy.contains('Prześlij koszyk').click()

        cy.url().should('include', '/payments');
        cy.get('h3').should('have.text', 'Do zapłaty 0')
    })

    it('Should made payment', () => {
        cy.visit('http://localhost:5173/cart')
        cy.contains('Prześlij koszyk').click()

        cy.get('input[name="creditCardNumber"]')
            .type('123456789')

        cy.get('input[name="expirationDate"]')
            .type('04/22')

        cy.get('input[name="creditCardNumber"]')
            .type('123456789')

        cy.get('input[name="cvc"]')
            .type('12')

        cy.contains('Zapłać').click()
        cy.get('.app > div').should('have.text', 'Transakcja zaakceptowana')
    })

    it('Should move from products to cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('li:contains("Koszyk")').click()
        cy.url().should('include', '/cart');
    })

    it('Should move from cart to products', () => {
        cy.visit('http://localhost:5173/cart')

        cy.get('li:contains("Produkty")').click()
        cy.url().should('include', '/');
    })

    it('Should add products to cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('tr').contains('td', 'Smartphone case').parent('tr').find('button').click()
        cy.get('li:contains("Koszyk")').click()

        cy.get('li:contains("Toothbrush")').should('exist')
        cy.get('li:contains("Smartphone case")').should('exist')
    })

    it('Should add two products of same type to cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('li:contains("Koszyk")').click()

        cy.get('li:contains("Toothbrush")').contains('2 szt').should('exist')
    })

    it('Should increase product amount in cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('li:contains("Koszyk")').click()

        cy.get('li:contains("Toothbrush")').contains('+').click()
        cy.get('li:contains("Toothbrush")').contains('2 szt').should('exist')
    })

    it('Should decrease product amount in cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('li:contains("Koszyk")').click()

        cy.get('li:contains("Toothbrush")').contains('-').click()
        cy.get('li:contains("Toothbrush")').contains('1 szt').should('exist')
    })

    it('Should remove product from cart', () => {
        cy.visit('http://localhost:5173/')

        cy.get('tr').contains('td', 'Toothbrush').parent('tr').find('button').click()
        cy.get('li:contains("Koszyk")').click()

        cy.get('li:contains("Toothbrush")').contains('-').click()
        cy.get('li:contains("Toothbrush")').should('not.exist')
    })
})