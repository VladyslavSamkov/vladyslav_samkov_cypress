import { sign_up_selectors as sign_up_selectors } from "../selectors/sign_up_selectors";
import { sign_in_selectors as sign_in_selectors } from "../selectors/sign_in_selectors";
import { home_page_selectors as home_page_selectors } from "../selectors/home_page_selectors";
import { onboarding_selectors as onboarding_selectors } from "../selectors/onboarding_selectors";

Cypress.Commands.add('ui_login',(userInfo) => {
    cy.intercept("POST", "/login").as("login");
    cy.visit('/signin');
    cy.get(sign_in_selectors.username_field).type(userInfo.username);
    cy.get(sign_in_selectors.password_field).type(userInfo.password);
    cy.get(sign_in_selectors.signin_btn).should('be.enabled').click();
    cy.wait('@login').its('response.statusCode').should('equal',200);
    cy.get(onboarding_selectors.get_started_popup).should('not.exist')
    });

Cypress.Commands.add('ui_signup', (userInfo) => {
    cy.visit('/signup');
    cy.intercept("POST", "/users").as("signup");
    cy.get(sign_up_selectors.firstName).type(userInfo.firstName);
    cy.get(sign_up_selectors.lastName).type(userInfo.lastName);
    cy.get(sign_up_selectors.userName).type(userInfo.username);
    cy.get(sign_up_selectors.password).type(userInfo.password);
    cy.get(sign_up_selectors.confirmPassword).type(userInfo.password);
    cy.get(sign_up_selectors.sign_up_btn).should('be.enabled').click()
    cy.wait("@signup").its('response.statusCode').should('equal',201);
    cy.url().should('contain', '/signin')
    });

Cypress.Commands.add('ui_onbording', () => {
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
    }),

Cypress.Commands.add('ui_logout', () => {
    cy.intercept('POST', '/logout').as('logout')
    cy.get(home_page_selectors.logout_btn).click()
    cy.url().should('contain', 'signin')
    })
