import { bank_accounts_selectors } from "../selectors/bank_accounts_selectors";
import { home_page_selectors } from "../selectors/home_page_selectors";
import { helper_functions } from "../helpers/helper_functions";

describe('UI checks for bank accounts; Bank account create/delete actions', () => {
    const userInfo = {
        firstName: 'Lionel',
        lastName: 'Messi',
        username: helper_functions.generateUserName(),
        password: 'qwerty123',
    };

    const BAinfo = {
        bankName: 'Los Angeles Bank',
        routingNumber: '123456789',
        accountNumber: '987654321',
        id: ''
    }
    
      before('Generate new user for tests', () => {
        cy.api_signup(userInfo);
        cy.api_login(userInfo);
        cy.ui_onbording();
        cy.api_logout();
    })

    beforeEach('GraphQL querries + login and procced to bank accouts page', () => {
        cy.api_login(userInfo);
        cy.get(home_page_selectors.ba_btn).click()
        cy.intercept("POST", '/graphql', (req) => {
            const { body } = req;

            if (body.hasOwnProperty("operationName") && body.operationName === "ListBankAccount") {
                req.alias = "gqlListBankAccountQuery";
              }
  
            if (body.hasOwnProperty("operationName") && body.operationName === "CreateBankAccount") {
                req.alias = "gqlCreateBankAccountMutation";
             }
  
            if (body.hasOwnProperty("operationName") && body.operationName === "DeleteBankAccount") {
                req.alias = "gqlDeleteBankAccountMutation";
            }
        })
    })
    
    it('1. User should be able to create a new BA', () => {
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.create_ba_form).should('be.visible')
        cy.get(bank_accounts_selectors.bankName_input).should('be.visible').type(BAinfo.bankName)
        cy.get(bank_accounts_selectors.routingNumber_input).should('be.visible').type(BAinfo.routingNumber)
        cy.get(bank_accounts_selectors.accountNumber_input).should('be.visible').type(BAinfo.accountNumber)
        cy.get(bank_accounts_selectors.ba_save_btn).should('be.visible').click()
        cy.wait("@gqlCreateBankAccountMutation")
            .its("response.body.data.createBankAccount.bankName")
            .should("equal", BAinfo.bankName)
        cy.get(bank_accounts_selectors.ba_list).should("contain", BAinfo.bankName);
    })

    it('2. Should display "Must contain at least 5 characters" for the "Bank name" field', () => {
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
        cy.get(bank_accounts_selectors.bankName_input).should('be.visible').type('1')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bankName_input).type('2')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bankName_input).type('3')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bankName_input).type('4')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bankName_input).type('5')
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
        cy.get(bank_accounts_selectors.bankName_input).type('Bank')
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
    })

    it('3. Should display "Enter a bank name" for the "Bank name" field', () => {
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.bankName_input).clear().blur()
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Enter a bank name')
    })

     it('4. Should display "Must contain a valid routing number" for the "Routing number" field', () =>{
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.routingNumber_error).should('not.exist')
        cy.get(bank_accounts_selectors.routingNumber_input).type('1')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routingNumber_input).type('2345678')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routingNumber_input).type('9')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.routingNumber_input).type('1')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routingNumber_input).type('123')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
    }) 

    it('5. Should display "Enter a valid bank routing number" for the "Routing number" field', () =>{
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.routingNumber_input).clear().blur()
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Enter a valid bank routing number')
    })

    it('6. Should display "Must contain at least 9 digits" for the "Account number" field', () =>{
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.accountNumber_error).should('not.exist')
        cy.get(bank_accounts_selectors.accountNumber_input).type('1')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain at least 9 digits')
        cy.get(bank_accounts_selectors.accountNumber_input).type('2345678')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain at least 9 digits')
        cy.get(bank_accounts_selectors.accountNumber_input).type('9')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.accountNumber_input).type('012')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.accountNumber_input).type('3')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain no more than 12 digits')
        cy.get(bank_accounts_selectors.accountNumber_input).type('456')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain no more than 12 digits')
    }) 

    it('7. Should display "Enter a valid bank account number" for the "Account number" field', () =>{
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.accountNumber_input).clear().blur()
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Enter a valid bank account number')
    })


    it('8. User should be able to delete BA', () => {
    cy.get(bank_accounts_selectors.ba_delete_btn).should('be.visible').last().click();
        cy.wait("@gqlDeleteBankAccountMutation")
            .its("response.body.data.deleteBankAccount")
            .should("equal", true);
        cy.get(bank_accounts_selectors.ba_list).children().contains("Deleted");
    })

})