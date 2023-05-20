describe('xcom page', () => {

    it('Should load main page', () => {
        cy.visit('https://www.x-kom.pl')
        cy.get('.sc-an0bcv-3').should('exist').and('have.text', 'Dostosowujemy się do Ciebie')
        cy.contains('W porządku').should('exist');
        cy.contains('W porządku').click();
        cy.get('.sc-an0bcv-3').should('not.exist')
    })

    it('Should move to login page', () => {
        cy.visit('https://www.x-kom.pl')
        cy.contains('W porządku').click();

        cy.contains('Twoje konto').should('exist')
        cy.contains('Twoje konto').click()

        cy.url().should('contain', 'logowanie');
        cy.get('.sc-dscwo7-1').should('exist').and('have.text', 'Zaloguj się')
    })

    it('Should inform when incorrect credentials', () => {
        cy.visit('https://www.x-kom.pl/logowanie')

        cy.get('form input[name="login"]')
            .should('be.visible')
            .and('have.value', '')
            .type('test')
            .should('have.value', 'test')

        cy.get('form input[name="password"]')
            .should('be.visible')
            .and('have.value', '')
            .type('test')
            .should('have.value', 'test')

        cy.get('button')
            .contains('Zaloguj się')
            .click()

        cy.get('form span')
            .should('exist')
            .and('contain.text', 'Sprawdź, czy adres e-mail i hasło są poprawne')
    })

    it('Should inform when missing credentials', () => {
        cy.visit('https://www.x-kom.pl/logowanie')

        cy.get('button')
            .contains('Zaloguj się')
            .click()

        cy.contains('Podaj login lub e-mail')
            .should('exist')

        cy.contains('Wpisz hasło. Pole nie może być puste')
            .should('exist')

        cy.get('form input[name="login"]')
            .type('email')
            .should('have.value', 'email')

        cy.get('button')
            .contains('Zaloguj się')
            .click()

        cy.contains('Wpisz hasło. Pole nie może być puste')
            .should('exist')

        cy.get('form input[name="password"]')
            .type('password')
            .should('have.value', 'password')

        cy.get('form input[name="login"]')
            .clear()
            .should('have.value', '')

        cy.get('button')
            .contains('Zaloguj się')
            .click()

        cy.contains('Podaj login lub e-mail')
            .should('exist')
    })

    it('Should move to register page', () => {
        cy.visit('https://www.x-kom.pl/logowanie')

        cy.contains('Nie masz konta?')
            .should('exist')

        cy.contains('Załóż konto')
            .should('exist')
            .click()

        cy.url()
            .should('contain', 'rejestracja');

        cy.get('form button')
            .contains('Załóż konto')
            .should('exist')
    })

    it('Should inform when missing fields in register', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('button')
            .contains('Załóż konto')
            .click()

        cy.get('span:contains("Pole jest wymagane. Uzupełnij dane.")')
            .should('have.length', 2);

        cy.contains('Wpisz adres e-mail.')
            .should('exist')

        cy.contains('Wpisz hasło. Powinno składać się minimum z 8 znaków.')
            .should('exist')
    })

    it('Should fill registration form', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('form input[name="firstName"]')
            .should('be.visible')
            .and('have.value', '')
            .type('test')
            .should('have.value', 'test')

        cy.get('form input[name="lastName"]')
            .should('be.visible')
            .and('have.value', '')
            .type('test')
            .should('have.value', 'test')

        cy.get('form input[name="email"]')
            .should('be.visible')
            .and('have.value', '')
            .type('test@test.com')
            .should('have.value', 'test@test.com')

        cy.get('form input[name="password"]')
            .should('be.visible')
            .and('have.value', '')
            .type('12345678')
            .should('have.value', '12345678')

        cy.get('button')
            .contains('Załóż konto')
            .click()

        cy.get('input[type="checkbox"]')
            .first()
            .click({force: true});

        cy.get('span')
            .filter((index, element) => Cypress.$(element).text() !== '*')
            .each((span) => {
                cy.wrap(span).should('not.have.css', 'color', 'rgb(180, 3, 28)')
            })
    })

    it('Should inform about bad values in registration form', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('form input[name="firstName"]')
            .type('1')
            .blur();

        cy.contains('Wpisz poprawne imię')
            .should('exist')

        cy.get('form input[name="lastName"]')
            .type('1')
            .blur();

        cy.contains('Wpisz poprawne nazwisko')
            .should('exist')

        cy.get('form input[name="email"]')
            .type('1')
            .blur();

        cy.contains('Adres e-mail jest niepoprawny. Adres musi mieć jeden znak @.')
            .should('exist')

        cy.get('form input[name="email"]')
            .type('1@')
            .blur();

        cy.contains('Adres e-mail jest niepoprawny. Sprawdź, czy dobrze wpisujesz domenę (np. gmail.com, wp.pl).')
            .should('exist')

        cy.get('form input[name="password"]')
            .type('1')
            .blur();

        cy.contains('Hasło powinno mieć minimum 8 znaków')
            .should('exist')
    })

    it('Should mark all checkbox automatically', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('input[type="checkbox"]')
            .first()
            .click({force: true})

        cy.get('input[type="checkbox"]')
            .should('be.checked')
    })

    it('Should unmark all checkbox automatically', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('input[type="checkbox"]')
            .first()
            .click({force: true})

        cy.get('input[type="checkbox"]')
            .should('be.checked')

        cy.get('input[type="checkbox"]')
            .first()
            .click({force: true})

        cy.get('input[type="checkbox"]')
            .should('not.be.checked')
    })

    it('Should show hidden password', () => {
        cy.visit('https://www.x-kom.pl/rejestracja')

        cy.get('form input[name="password"]')
            .should('have.attr', 'type', 'password')

        cy.contains('Pokaż')
            .click()

        cy.get('form input[name="password"]')
            .should('have.attr', 'type', 'text')
    })

    it('Should add product to cart', () => {
        cy.visit('https://www.x-kom.pl/g-2/c/1333-notebooki-laptopy-17.html')
        cy.contains('W porządku').click()

        cy.get('button[title="Dodaj do koszyka"]')
            .first()
            .click()

        cy.get('.modal--after-open')
            .should('exist')
            .contains('Przejdź do koszyka')
            .click()

        cy.url()
            .should('include', 'koszyk')

        cy.get('ul[data-name="basketProductList"')
            .should('exist')
            .children('li')
            .should('have.length', 1)
    })

    it('Should delete product from cart', () => {
        cy.visit('https://www.x-kom.pl/g-2/c/1333-notebooki-laptopy-17.html')
        cy.contains('W porządku').click()

        cy.get('button[title="Dodaj do koszyka"]')
            .first()
            .click()

        cy.get('.modal--after-open')
            .contains('Przejdź do koszyka')
            .click()

        cy.get('button[data-name="removeFromBasketButton"')
            .should('exist')
            .click({force: true})

        cy.get('ul[data-name="basketProductList"')
            .should('not.exist')
    })

    it('Should choose amount of product from list', () => {
        cy.visit('https://www.x-kom.pl/g-2/c/1333-notebooki-laptopy-17.html')
        cy.contains('W porządku').click()

        cy.get('button[title="Dodaj do koszyka"]')
            .first()
            .click()

        cy.get('.modal--after-open')
            .contains('Przejdź do koszyka')
            .click()

        cy.get('button[data-action="addToWishlist"')
            .should('exist')
            .click({force: true})

        cy.get('.dialog--after-open')
            .should('exist')
            .contains('Zapisz na liście')
            .should('exist')

        cy.get('.dialog--after-open')
            .get('input[type="checkbox"]')
            .should('be.checked')
    })

    it('Should close popup after adding product', () => {
        cy.visit('https://www.x-kom.pl/g-2/c/1333-notebooki-laptopy-17.html')
        cy.contains('W porządku').click()

        cy.get('button[title="Dodaj do koszyka"]')
            .first()
            .click()

        cy.get('button[title="Zamknij"]')
            .click()

        cy.get('.modal--after-open')
            .should('not.exist')
    })

    it('Should have empty cart at start', () => {
        cy.visit('https://www.x-kom.pl')
        cy.contains('W porządku').click()

        cy.contains('Koszyk')
            .click()

        cy.get('ul[data-name="basketProductList"')
            .should('not.exist')

        cy.get('span[data-name="emptyBasket"')
            .should('exist')
    })

    it('Should open product', () => {
        cy.visit('https://www.x-kom.pl/g-6/c/31-myszki.html')
        cy.contains('W porządku').click()

        cy.get('[data-name="productCard"]')
            .first()
            .click()

        cy.url()
            .should('contain', '/p/')
    })

    it('Should find mouses with given buttons', () => {
        cy.visit('https://www.x-kom.pl/g-6/c/31-myszki.html')
        cy.contains('W porządku').click()

        cy.get(':nth-child(13) > :nth-child(3) > .sc-cs8ibv-2 > .sc-15ih3hi-0')
            .click()

        cy.get(':nth-child(4) > .sc-3qnozx-3')
            .check({force: true})

        cy.wait(10000)


        cy.get('.sc-1yu46qn-3 > .sc-2ride2-0 > .sc-1yu46qn-10 > .sc-vb9gxz-0 > :nth-child(3)')
            .each((liElement) => {
                cy.wrap(liElement).invoke('text').should('eq', 'Liczba przycisków: 4');
            })
    })

    it('Should open image modal', () => {
        cy.visit('https://www.x-kom.pl/p/69022-myszka-bezprzewodowa-logitech-m185-szara.html')
        cy.contains('W porządku').click()

        cy.get('img[alt="Logitech M185 szara - 69022 - zdjęcie"]')
            .click()

        cy.get('.modal--after-open')
            .should('exist')
            .contains('Zdjęcia produktu')
            .should('exist')
    })

    it('Should mode to opinins tab', () => {
        cy.visit('https://www.x-kom.pl/p/69022-myszka-bezprzewodowa-logitech-m185-szara.html')
        cy.contains('W porządku').click()

        cy.get('.sc-1bker4h-10 > .sc-1s1zksu-0 > .sc-1bker4h-0 a')
            .click({force: true})

        cy.url()
            .should('include', '#Opinie')
    })
})
