import { bank_accounts_selectors } from "../selectors/bank_accounts_selectors";
import { home_page_selectors } from "../selectors/home_page_selectors";
import { auth_helpers } from  "../helpers/auth_helpers"

describe('HW3, create,delete, display errors for bank accounts', () => {
    const userInfo = {
        firstName: 'Lionel',
        lastName: 'Messi',
        username: auth_helpers.generateUserName(),
        password: 'qwerty123',
    };

    const BAinfo = {
        bank_name: 'Los Angeles Bank',
        routing_number: '123456789',
        account_number: '987654321'
    }
    
    before('Visiting bank account page on newly added user', () => {
        cy.reload()
        cy.ui_signup(userInfo);
        cy.ui_login(userInfo);
        cy.ui_onbording();
        cy.get(home_page_selectors.ba_btn).click()
    })

    beforeEach('GraphQL querries', () => {
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
    it('1. User should be able to create new BA', () => {
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.create_ba_form).should('be.visible')
        cy.get(bank_accounts_selectors.bank_name_input).should('be.visible').type(BAinfo.bank_name)
        cy.get(bank_accounts_selectors.routing_number_input).should('be.visible').type(BAinfo.routing_number)
        cy.get(bank_accounts_selectors.account_number_input).should('be.visible').type(BAinfo.account_number)
        cy.get(bank_accounts_selectors.ba_save_btn).should('be.visible').click()
        cy.wait("@gqlCreateBankAccountMutation")
            .its("response.body.data.createBankAccount.bankName")
            .should("equal", BAinfo.bank_name)
        cy.get(bank_accounts_selectors.ba_list).should("contain", BAinfo.bank_name);
    })

    it('2.1 Check that for Bank name field , at least 5 characters error appear', () => {
        cy.get(bank_accounts_selectors.ba_create_btn).should('be.visible').click()
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
        cy.get(bank_accounts_selectors.bank_name_input).should('be.visible').type('1')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bank_name_input).type('2')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bank_name_input).type('3')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bank_name_input).type('4')
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Must contain at least 5 characters')
        cy.get(bank_accounts_selectors.bank_name_input).type('5')
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
        cy.get(bank_accounts_selectors.bank_name_input).type('Bank')
        cy.get(bank_accounts_selectors.ba_name_error).should('not.exist')
    })

    it('2.2 Check that for bank name, enter a bank name error apppear', () => {
        cy.get(bank_accounts_selectors.bank_name_input).clear().blur()
        cy.get(bank_accounts_selectors.ba_name_error)
            .should('be.visible')
            .and('have.text','Enter a bank name')
    })

     it('2.3 Check that for routing number field error message appear when number lenght !=9', () =>{
        cy.get(bank_accounts_selectors.routingNumber_error).should('not.exist')
        cy.get(bank_accounts_selectors.routing_number_input).type('1')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routing_number_input).type('2345678')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routing_number_input).type('9')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.routing_number_input).type('1')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
        cy.get(bank_accounts_selectors.routing_number_input).type('123')
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Must contain a valid routing number')
    }) 

    it('2.4 Check that for routing number error appear when number are empty', () =>{
        cy.get(bank_accounts_selectors.routing_number_input).clear().blur()
        cy.get(bank_accounts_selectors.routingNumber_error)
            .should('be.visible')
            .and('have.text','Enter a valid bank routing number')
    })

    it('2.5 Check that for account number field error message appear in case number lenght < 9 and > 12', () =>{
        cy.get(bank_accounts_selectors.accountNumber_error).should('not.exist')
        cy.get(bank_accounts_selectors.account_number_input).type('1')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain at least 9 digits')
        cy.get(bank_accounts_selectors.account_number_input).type('2345678')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain at least 9 digits')
        cy.get(bank_accounts_selectors.account_number_input).type('9')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.account_number_input).type('012')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('not.exist')
        cy.get(bank_accounts_selectors.account_number_input).type('3')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain no more than 12 digits')
        cy.get(bank_accounts_selectors.account_number_input).type('456')
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Must contain no more than 12 digits')
    }) 

    it('2.6 Check that for account number error appear when number are empty', () =>{
        cy.get(bank_accounts_selectors.account_number_input).clear().blur()
        cy.get(bank_accounts_selectors.accountNumber_error)
            .should('be.visible')
            .and('have.text','Enter a valid bank account number')
    })


    it('3. User should be able to delete BA', () => {
        cy.go('back')
        cy.get(bank_accounts_selectors.ba_delete_btn).should('be.visible').last().click();
        cy.wait("@gqlDeleteBankAccountMutation")
            .its("response.body.data.deleteBankAccount")
            .should("equal", true);
        //cy.wait("@gqlListBankAccountQuery").its('response.body.data.listBankAccount[1].isDeleted').should('have.text','true')
        //will fail due to list of bank accounts falling down after delete
    })

})