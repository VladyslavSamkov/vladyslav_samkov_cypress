import {sigh_in_selectors as sigh_in_selectors} from "../selectors/sigh_in_selectors";

describe('UI tests for sign in page',
    () => {

        before('visiting sign in page', () => {
            cy.visit('/');
        })

        it('1.should show typeable Username field"', () => {
            cy.get(sigh_in_selectors.username_field)
                .should('be.visible')
                .type('Hello World!')
                .clear();
        })

        it('2.should show typeable Password field', () => {
            cy.get(sigh_in_selectors.password_field)
                .should('be.visible')
                .type('Hello World!')
                .clear();
        })

        it('3.1 should show Username placeholder', () => {
            cy.get(sigh_in_selectors.username_lable)
                .should('have.text', `Username`); // максимально в этом не уверен но хз как привильно
        })

        it('3.2 should show Password placeholder', () => {
            cy.get(sigh_in_selectors.password_lable)
                .should('have.text', `Password`); // максимально в этом не уверен но хз как привильно
        })

        it('4.1 Error message for missed user name', () => {
            cy.get(sigh_in_selectors.password_field).click();
            cy.get(sigh_in_selectors.username_helper_text)
                .should('be.visible')
                .and('contain', 'Username is required')
                .and('have.css', 'color', '#f44336');
        })

        it('4.2 Error message not appears', () => {
            cy.get(sigh_in_selectors.password_field).type('Hello World!');
            cy.get(sigh_in_selectors.password_field).click();
            cy.get(sigh_in_selectors.username_helper_text)
                .should('not.be.visible');
        })

        it('5.1 Remember me disabled by default', () => {
            cy.get(sigh_in_selectors.remember_me_checkbox)
                .should('not.be.checked');
        })

        it('5.2 Check "Remember me" checkbox', () => {
            cy.get(sigh_in_selectors.remember_me_checkbox)
                .check()
                .should('be.checked');
            cy.get(sigh_in_selectors.remember_me_checkbox)
                .uncheck()
                .should('not.be.checked');
        })

        it('6.1 Should show disabled by default sign in btn', () => {
            cy.get(sigh_in_selectors.signin_btn)
                .should('be.disabled');
        })

        it('6.2 Should be enabled when username and password filled', () => {
            cy.get(sigh_in_selectors.password_field).type('Hello World!');
            cy.get(sigh_in_selectors.username_field).type('Hello World!');
            cy.get(sigh_in_selectors.signin_btn)
                .should('be.enabled');
        })

        it('7. Should have Dont have an account? Sign Up clickable link under Sign in btn', () => {
            cy.get(sigh_in_selectors.signup_link)
                .should('be.visible')
                .should('contain', 'Don\'t have an account? Sign Up')
                .click();
            cy.url().should('contain', '/sighup');
            cy.go('back');
        })

        it('8. Should show Cypress copyright link that leads to \'https://www.cypress.io/\'', () => {
            cy.get(sigh_in_selectors.license)
                .should('be.visible')
                .click();
            cy.url().should('contain', 'https://www.cypress.io');
            cy.visit('/');
        })
    })