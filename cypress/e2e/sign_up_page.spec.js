import { sign_up_selectors as sign_up_selectors } from "../selectors/sign_up_selectors";
import { sign_in_selectors as sign_in_selectors } from "../selectors/sign_in_selectors";
import { home_page_selectors as home_page_selectors } from "../selectors/home_page_selectors";
import { onboarding_selectors as onboarding_selectors } from "../selectors/onboarding_selectors";

describe('Sign up, login, logout checks', () => {
    const newUserInfo = {
        firstName: 'Elon',
        lastName: 'Mask',
        username: sign_up_selectors.generateUserName(),
        password: 'qwerty123',
    }
    const existingUserInfo = {
        username: 'Messi10',
        password: 'qwerty123',
    }

    it('1. should allow a visitor to sign-up', () => {
        cy.visit('/signup');
        cy.intercept("POST", "/users").as("signup");
        cy.get(sign_up_selectors.firstName).type(newUserInfo.firstName);
        cy.get(sign_up_selectors.lastName).type(newUserInfo.lastName);
        cy.get(sign_up_selectors.userName).type(newUserInfo.username);
        cy.get(sign_up_selectors.password).type(newUserInfo.password);
        cy.get(sign_up_selectors.confirmPassword).type(newUserInfo.password);
        cy.get(sign_up_selectors.sign_up_btn).should('be.enabled').click()
        cy.wait("@signup").its('response.statusCode').should('equal',201);
        cy.url().should('contain', '/signin')
    })

    it('2. should allow a visitor to login for newly created account.',() => {
        cy.visit('/');
        cy.intercept("POST", "/login").as("login");
        cy.get(sign_in_selectors.username_field).type(newUserInfo.username);
        cy.get(sign_in_selectors.password_field).type(newUserInfo.password);
        cy.get(sign_in_selectors.signin_btn).should('be.enabled').click();
        cy.wait('@login').its('response.statusCode').should('equal',200);
        cy.get(onboarding_selectors.get_started_popup).should('exist')
    })

    it('2.1 Onboarding process', ()=>{
        cy.get(onboarding_selectors.get_started_popup).should('be.visible')
        cy.get(onboarding_selectors.popup_title)
            .should('have.text','Get Started with Real World App')
        cy.get(onboarding_selectors.next_btn)
            .should('be.visible')
            .click()
        cy.get(onboarding_selectors.BA_bankName).should('be.visible').type('BName')
        cy.get(onboarding_selectors.BA_routingNumber).should('be.visible').type('123456789')
        cy.get(onboarding_selectors.BA_accountNumber).should('be.visible').type('987654321')
        cy.get(onboarding_selectors.BA_save_btn)
            .should('be.visible')
            .click()
        cy.get(onboarding_selectors.popup_title).should('have.text','Finished')
        cy.get(onboarding_selectors.next_btn)
            .should('be.visible')
            .click()
        cy.get(onboarding_selectors.get_started_popup).should('not.exist')
    })

    it('2.2 Should allow a visitor to login for existing account.',() => {
        cy.visit('/signin');
        cy.intercept("POST", "/login").as("login");
        cy.get(sign_in_selectors.username_field).type(existingUserInfo.username);
        cy.get(sign_in_selectors.password_field).type(existingUserInfo.password);
        cy.get(sign_in_selectors.signin_btn).should('be.enabled').click();
        cy.wait('@login').its('response.statusCode').should('equal',200);
        cy.get(onboarding_selectors.get_started_popup).should('not.exist')
    })

    it('3 User should be able to logout',() => {
        cy.intercept('POST', '/logout').as('logout')
        cy.get(home_page_selectors.logout_btn).click()
        cy.url().should('contain', 'signin')
    })
})
