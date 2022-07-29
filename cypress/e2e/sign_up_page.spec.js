import { sign_up_selectors as sign_up_selectors } from "../selectors/sign_up_selectors";
import { sign_in_selectors as sign_in_selectors } from "../selectors/sign_in_selectors";
import { auth_helpers } from "../helpers/auth_helpers";

describe('Sign up, login, logout, onboarding checks', () => {
    const userInfo = {
        firstName: 'Elon',
        lastName: 'Mask',
        username: auth_helpers.generateUserName(),
        password: 'qwerty123',
    }

    it('1. should allow a visitor to sign-up', () => {
        cy.ui_signup(userInfo)
    })

    it('2. should allow a visitor to login for newly created account.',() => {
        cy.ui_login(userInfo)
    })

    it('2.1 Onboarding process', ()=>{
        cy.ui_onbording()
    })

    it('3 User should be able to logout',() => {
        cy.ui_logout()
    })

    it('4.1 Should display login error with invalid username',() => {
        cy.visit('/')
        cy.get(sign_in_selectors.username_field).type('InvalidName')
        cy.get(sign_in_selectors.password_field).type(userInfo.password)
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')
        cy.reload()

    })

    it('4.2 Should display login error with invalid password',() => {
        cy.get(sign_in_selectors.username_field).type(userInfo.username)
        cy.get(sign_in_selectors.password_field).type('1234566789')
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')
        cy.reload()

    })

    it('4.3 Should display login error with both invalid password and usernmae',() => {
        cy.get(sign_in_selectors.username_field).type('InvalidName')
        cy.get(sign_in_selectors.password_field).type('1234566789')
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')
        cy.reload()

    })
    it('4.4 Should display error in case password have less then 4 characters',() => {
        cy.get(sign_in_selectors.password_field).click().blur()
        cy.get(sign_in_selectors.password_field).type('1').blur()
        cy.get(sign_in_selectors.password_char_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_in_selectors.password_field).type('2').blur()
        cy.get(sign_in_selectors.password_char_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_in_selectors.password_field).type('3').blur()
        cy.get(sign_in_selectors.password_char_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_in_selectors.password_field).type('4').blur()
        cy.get(sign_in_selectors.password_char_error).should('not.exist')
        cy.get(sign_in_selectors.password_field).type('5').blur()
        cy.get(sign_in_selectors.password_char_error).should('not.exist')
        cy.reload()
    })

    it('5.1 Should appear error for not entered first name', () => {
        cy.visit('/signup')
        cy.get(sign_up_selectors.firstName).click().blur()
        cy.get(sign_up_selectors.firstname_error)
            .should('be.visible')
            .and('have.text','First Name is required')
        cy.get(sign_up_selectors.firstName).type('AnyName')
        cy.get(sign_up_selectors.firstname_error).should('not.exist')

    })

    it('5.2 Should appear error for not entered last name', () => {
        cy.get(sign_up_selectors.lastName).click().blur()
        cy.get(sign_up_selectors.lastName_error)
            .should('be.visible')
            .and('have.text','Last Name is required')
    })

    it('5.3 Should appear error for not entered Username name', () => {
        cy.get(sign_up_selectors.userName).click().blur()
        cy.get(sign_up_selectors.userName_error)
            .should('be.visible')
            .and('have.text','Username is required')
    })


    it('5.4 Should appear error for not entered password', () => {
        cy.get(sign_up_selectors.password).click().blur()
        cy.get(sign_up_selectors.password_error)
            .should('be.visible')
            .and('have.text','Enter your password')
    })

    it('5.5 Should display error in case password have less then 4 characters', () => {
        cy.get(sign_up_selectors.password).click().blur()
        cy.get(sign_up_selectors.password).type('1').blur()
        cy.get(sign_up_selectors.password_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_up_selectors.password).type('2').blur()
        cy.get(sign_up_selectors.password_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_up_selectors.password).type('3').blur()
        cy.get(sign_up_selectors.password_error)
            .should('be.visible')
            .and('have.text','Password must contain at least 4 characters')
        cy.get(sign_up_selectors.password).type('4').blur()
        cy.get(sign_up_selectors.password_error).should('not.exist')
        cy.get(sign_up_selectors.password).type('5').blur()
        cy.get(sign_up_selectors.password_error).should('not.exist')
    })

    it('5.6 Should appear error for not matched and missed password', () => {
        cy.get(sign_up_selectors.confirmPassword).click().blur()
        cy.get(sign_up_selectors.confirmPassword_error)
            .should('be.visible')
            .and('have.text','Confirm your password')
        cy.get(sign_up_selectors.confirmPassword).type('WrongPassword')
        cy.get(sign_up_selectors.confirmPassword_error)
            .should('be.visible')
            .and('have.text','Password does not match')
    })

    })

