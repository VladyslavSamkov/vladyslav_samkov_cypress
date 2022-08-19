import { sign_up_selectors as sign_up_selectors } from "../selectors/sign_up_selectors";
import { sign_in_selectors as sign_in_selectors } from "../selectors/sign_in_selectors";
import { helper_functions } from "../helpers/helper_functions";

describe('UI tests for sign in, sign up pages and onboarding process', () => {
    const userInfo = {
        firstName: 'Elon',
        lastName: 'Mask',
        username: helper_functions.generateUserName(),
        password: 'qwerty123',
    }

    /*const userInfo = {
        username: 'Tavares_Barrows',
        password: 's3cret',
        firstName: "Arely",
        lastName: "Kertzmann",
        email: "Aniya_Powlowski36@hotmail.com",
        phoneNumber: "537-041-4355",
    }*/

    beforeEach('visiting sign in page', () => {
        cy.visit('/');
    })

    it('1. Should show typeable Username field"', () => {
        cy.get(sign_in_selectors.username_field)
            .should('be.visible')
            .type('Hello World!')
            .clear();
    })

    it('2. Should show typeable Password field', () => {
        cy.get(sign_in_selectors.password_field)
            .should('be.visible')
            .type('Hello World!')
            .clear();
        })

    it('3. Should show Username placeholder', () => {
        cy.get(sign_in_selectors.username_lable)
            .should('have.text', `Username`);
        cy.get(sign_in_selectors.password_lable)
            .should('have.text', `Password`);
        
    })

    it('4. Should show "Username is required" error message for missed user name', () => {
        cy.get(sign_in_selectors.password_field).click();
        cy.get(sign_in_selectors.username_helper_text)
            .should('be.visible')
            .and('contain', 'Username is required')
            .and('have.css', 'color', 'rgb(244, 67, 54)');
    })

    it('5. Check/uncheck "Remember me" checkbox', () => {
        cy.get(sign_in_selectors.remember_me_checkbox)
            .check()
            .should('be.checked');
        cy.get(sign_in_selectors.remember_me_checkbox)
            .uncheck()
            .should('not.be.checked');
    })

    it('6. "Sign in" btn should be disabled by default', () => {
        cy.get(sign_in_selectors.signin_btn)
            .should('be.enabled');
    })

    it('7. "Dont have an account? Sign Up clickable" link should exist under "Sign in" btn', () => {
        cy.get(sign_in_selectors.signup_link)
            .should('be.visible')
            .should('contain', 'Don\'t have an account? Sign Up')
            .click();
        cy.url().should('contain', '/signup');
    })

    it('8. Should show Cypress copyright link that leads to \'https://www.cypress.io/\'', () => {
        cy.get(sign_in_selectors.license)
            .should('be.visible')
            .and('have.attr','href','https://cypress.io')
            .and("have.attr", "target", "_blank")
    })

    it('9. Should allow a user to sign-up', () => {
        cy.ui_signup(userInfo)
    })
    
    it('10. Should allow a user to login for newly created account.',() => {
        cy.ui_login(userInfo)
    })

    it('11. Should allow user to pass onboarding process', ()=>{
        cy.ui_login(userInfo)
        cy.ui_onbording()
    })
    
    it('12. Should allow user to logout',() => {
        cy.api_login(userInfo)
        cy.ui_logout()
    })
    
    it('13. Should display login error with invalid username on the Sign in page',() => {
        cy.get(sign_in_selectors.username_field).type('InvalidName')
        cy.get(sign_in_selectors.password_field).type(userInfo.password)
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')
    })
    
    it('14. Should display login error with invalid password on the Sign in page',() => {
        cy.get(sign_in_selectors.username_field).type(userInfo.username)
        cy.get(sign_in_selectors.password_field).type('1234566789')
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')    
    })
    
    it('15. Should display login error with both invalid password and username inputs on Sign in page',() => {
        cy.get(sign_in_selectors.username_field).type('InvalidName')
        cy.get(sign_in_selectors.password_field).type('1234566789')
        cy.get(sign_in_selectors.signin_btn).click()
        cy.get(sign_in_selectors.signin_error)
            .should('be.visible')
            .and('have.text','Username or password is invalid')
    })

    it('16. Should display "Password must contain at least 4 characters" error for the password field on Sign in page',() => {
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
    })
    
    it('17. Should appear "First Name is required" error for first name field on the Sign up page', () => {
        cy.visit('/signup')
        cy.get(sign_up_selectors.firstName).click().blur()
        cy.get(sign_up_selectors.firstname_error)
            .should('be.visible')
            .and('have.text','First Name is required')
        cy.get(sign_up_selectors.firstName).type('AnyName')
        cy.get(sign_up_selectors.firstname_error).should('not.exist')
    })
    
    it('18. Should appear "Last Name is required" error for last name field on the Sign up page', () => {
        cy.visit('/signup')
        cy.get(sign_up_selectors.lastName).click().blur()
        cy.get(sign_up_selectors.lastName_error)
            .should('be.visible')
            .and('have.text','Last Name is required')
    })
    
    it('19. Should appear "Username is required" error for user name field on the Sign up page', () => {
        cy.visit('/signup')
        cy.get(sign_up_selectors.userName).click().blur()
        cy.get(sign_up_selectors.userName_error)
            .should('be.visible')
            .and('have.text','Username is required')
    })
    
    
    it('20. Should appear "Enter your password" error for password field on the Sign up page', () => {
        cy.visit('/signup')
        cy.get(sign_up_selectors.password).click().blur()
        cy.get(sign_up_selectors.password_error)
            .should('be.visible')
            .and('have.text','Enter your password')
    })
    
    it('21. Should appear "Password must contain at least 4 characters" error for password field on the Sign up page', () => {
        cy.visit('/signup')
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
    
    it('22. Should appear "Password does not match" error for confirm password field on the Sign up page', () => {
        cy.visit('/signup')
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
