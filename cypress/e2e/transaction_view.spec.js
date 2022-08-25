import { notifications_selectors } from "../selectors/notifications_selectors"
import { transaction_selectors } from "../selectors/transaction_selectors"
import users from '../fixtures/users.json'


describe('Homework 4.08', () => {

    const paymentData = {
        amount: 100,
        note: 'For Porche 911'
    }

    const commentInput = 'Expecto Patronum 123'

    before('Create test trasaction', () => {
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.api_login(users.userA);
        transaction_selectors.createPaidTransaction(paymentData, users.userB)
        cy.api_logout()
    })

    beforeEach('Log in + incercept', () => {
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("POST", "/comments/*").as("postComment");
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("GET", "/transactions").as("listTransaction");
        cy.api_login(users.userA);
        
    })

    it('1. transactions navigation tabs should be hidden on a transaction view page', () => {
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} paid ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(transaction_selectors.transaction_tabs).should('not.exist')
    })

    it('2. User should be able to like a transaction', () => {
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} paid ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.like_btn).should('be.visible').click()
        cy.get(notifications_selectors.like_count).should('be.visible').and('have.text','1 ')
    })

    it('3. User should be able to comment on a transaction', () => {
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} paid ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.comment_input).type(commentInput + '{enter}')
        cy.wait("@postComment");
        cy.get(notifications_selectors.comment_list)
            .children()
            .should('have.text',commentInput)
    })

    it('4. User should be able to accept a transaction request', () => {
        transaction_selectors.createRequestTransaction(paymentData, users.userB)
        cy.api_switchUser(users.userB)
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} requested ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(transaction_selectors.accept_request_btn).should('be.visible').click()
        cy.intercept("GET", "/transactions/*",req => {
            delete req.headers['if-none-match']
        }).as("getTransaction");
        cy.reload()
        cy.wait("@getTransaction").its("response").then( (response) => {
            expect(response.statusCode).to.eq(200) 
            expect(response.body.transaction.requestStatus).to.eq('accepted');
            })
        })

    it('5. User should be able to reject a transaction request', () => {
        transaction_selectors.createRequestTransaction(paymentData, users.userB)
        cy.api_switchUser(users.userB)
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} requested ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(transaction_selectors.reject_request_btn).should('be.visible').click()
        cy.intercept("GET", "/transactions/*",req => {
            delete req.headers['if-none-match']
          }).as("getTransaction");
        cy.reload()
        cy.wait("@getTransaction").its("response").then( (response) => {
            expect(response.statusCode).to.eq(200) 
            expect(response.body.transaction.requestStatus).to.eq('rejected');
            })
        })

    it('6. Accept/reject buttons shouldnt exist on completed request', () => {
        transaction_selectors.createRequestTransaction(paymentData, users.userB)
        cy.api_switchUser(users.userB)
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait('@listTransaction')
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} requested ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(transaction_selectors.accept_request_btn).should('be.visible').click()
        cy.get(transaction_selectors.accept_request_btn).should('not.exist')
        cy.get(transaction_selectors.request_btn).should('not.exist')
    })   
})
