import { user_settings_selectors } from "../selectors/user_settings_selectors";
import users from '../fixtures/users.json'

describe('Homework 9.08', () => {

    beforeEach('Log in and procced to settings page + incercept', () => {
        cy.intercept("PATCH", "/users/*").as("updateUser");
        cy.intercept("GET", "/checkAuth",req => {
            delete req.headers['if-none-match']
          }).as("userProfile");
        cy.api_login(users.userA);
        cy.get(user_settings_selectors.my_account_btn).click()
        cy.url().should("contain", "/user/settings");
    })

    after('Return to default userInfo', () => {
        cy.get(user_settings_selectors.firstName_input).clear().type(users.userA.firstName);
        cy.get(user_settings_selectors.lastName_input).clear().type(users.userA.lastName);
        cy.get(user_settings_selectors.email_input).clear().type(users.userA.email);
        cy.get(user_settings_selectors.phone_input).clear().type(users.userA.phoneNumber);
        cy.get(user_settings_selectors.save_btn).click()
    })

    it('1. Should render the user settings form', () => {
        cy.get(user_settings_selectors.user_settings_form).should('be.visible')
        cy.get(user_settings_selectors.firstName_input).should("be.visible");
        cy.get(user_settings_selectors.lastName_input).should("be.visible");
        cy.get(user_settings_selectors.email_input).should("be.visible");
        cy.get(user_settings_selectors.phone_input).should("be.visible");
    })

    it('2. Should display user setting form errors', () => {
        cy.get(user_settings_selectors.firstName_input).clear().blur();
        cy.get(user_settings_selectors.firstName_error)
            .should("be.visible")
            .and("have.text", "Enter a first name");
        cy.get(user_settings_selectors.lastName_input).clear().blur();
        cy.get(user_settings_selectors.lastName_error)
            .should("be.visible")
            .and("have.text", "Enter a last name");
        cy.get(user_settings_selectors.email_input).clear().blur();
        cy.get(user_settings_selectors.email_error)
            .should("be.visible")
            .and("have.text", "Enter an email address");
        cy.get(user_settings_selectors.email_input).clear().type('Expecto patronum');
        cy.get(user_settings_selectors.email_error)
            .should("be.visible")
            .and("have.text", "Must contain a valid email address");
        cy.get(user_settings_selectors.phone_input).clear().blur();
        cy.get(user_settings_selectors.phone_error)
            .should("be.visible")
            .and("have.text", "Enter a phone number");
        cy.get(user_settings_selectors.phone_input).clear().type("099");
        cy.get(user_settings_selectors.phone_error)
            .should("be.visible")
            .and("have.text", "Phone number is not valid");
        cy.get(user_settings_selectors.save_btn).should("be.disabled");
    })

    it('3. User should be able to update all settings in once', () => {
        cy.get(user_settings_selectors.firstName_input).clear().type(users.userB.firstName);
        cy.get(user_settings_selectors.lastName_input).clear().type(users.userB.lastName);
        cy.get(user_settings_selectors.email_input).clear().type(users.userB.email);
        cy.get(user_settings_selectors.phone_input).clear().type(users.userB.phoneNumber);
        cy.get(user_settings_selectors.save_btn).click()
        cy.wait("@userProfile").its('response').then((response) => {
            expect(response.body.user.firstName).to.eq(users.userB.firstName);
            expect(response.body.user.lastName).to.eq(users.userB.lastName);
            expect(response.body.user.email).to.eq(users.userB.email);
            expect(response.body.user.phoneNumber).to.eq(users.userB.phoneNumber);
        })
        cy.reload()
        cy.get(user_settings_selectors.firstName_input).should('have.value',(users.userB.firstName));
        cy.get(user_settings_selectors.lastName_input).should('have.value',(users.userB.lastName));
        cy.get(user_settings_selectors.email_input).should('have.value',(users.userB.email));
        cy.get(user_settings_selectors.phone_input).should('have.value',(users.userB.phoneNumber));
    })

    it('4. User should be able to update first name', () => {
        cy.get(user_settings_selectors.firstName_input).clear().type(users.userC.firstName);
        cy.get(user_settings_selectors.save_btn).click()
        cy.wait("@userProfile").its('response').then((response) => {
            expect(response.body.user.firstName).to.eq(users.userC.firstName);
        })
        cy.reload()
        cy.get(user_settings_selectors.firstName_input).should('have.value',(users.userC.firstName));
    })

    it('5. User should be able to update last name', () => {
        cy.get(user_settings_selectors.lastName_input).clear().type(users.userC.lastName);
        cy.get(user_settings_selectors.save_btn).click()
        cy.wait("@userProfile").its('response').then((response) => {
            expect(response.body.user.lastName).to.eq(users.userC.lastName);
        })
        cy.reload()
        cy.get(user_settings_selectors.lastName_input).should('have.value',(users.userC.lastName));
    })

    it('6. User should be able to update email', () => {
        cy.get(user_settings_selectors.email_input).clear().type(users.userC.email);
        cy.get(user_settings_selectors.save_btn).click()
        cy.wait("@userProfile").its('response').then((response) => {
            expect(response.body.user.email).to.eq(users.userC.email);
        })
        cy.reload()
        cy.get(user_settings_selectors.email_input).should('have.value',(users.userC.email));
    })

    it('7. User should be able to update phone number', () => {
        cy.get(user_settings_selectors.phone_input).clear().type(users.userC.phoneNumber);
        cy.get(user_settings_selectors.save_btn).click()
        cy.wait("@userProfile").its('response').then((response) => {
            expect(response.body.user.phoneNumber).to.eq(users.userC.phoneNumber);
        })
        cy.reload()
        cy.get(user_settings_selectors.phone_input).should('have.value',(users.userC.phoneNumber));
    })

})