import { notifications_selectors } from "../selectors/notifications_selectors"
import { transaction_selectors } from "../selectors/transaction_selectors"
import users from '../fixtures/users.json'


describe('homework №5 02.05', () => {

    const paymentData = {
        amount: 400,
        note: 'Miroslav Klose'
    }

    const commentInput = 'Expecto Patronum'

    beforeEach('visiting sign in page', () => {
        cy.intercept("GET", "/notifications*").as("getNotifications");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("PATCH", "/notifications/*").as("updateNotification");
        cy.intercept("POST", "/comments/*").as("postComment");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("GET", "/transactions").as("listTransaction");
        cy.api_login(users.userA);
    })

    it('1. When user A likes a transaction of user B, user B should get notification that user A liked transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, users.userB);
        cy.api_switchUser(users.userB)
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait("@listTransaction")
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} paid ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.like_btn).should('be.visible').click()
        cy.get(notifications_selectors.like_count).should('be.visible').and('have.text','1 ')
        cy.api_switchUser(users.userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userB.firstName} ${users.userB.lastName} liked a transaction.Dismiss`)
    })

    it('2. When user C likes a transaction between user A and user B, user A and user B should get notifications that user C liked transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, users.userB);
        cy.api_switchUser(users.userC)
        cy.get('@transactionId').then((transactionId) => {
            cy.visit(`/transaction/${transactionId}`);
        })
        cy.get(notifications_selectors.like_btn).should('be.visible').click()
        cy.get(notifications_selectors.like_count).should('be.visible').and('have.text','1 ')
        cy.api_switchUser(users.userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userC.firstName} ${users.userC.lastName} liked a transaction.Dismiss`)
        cy.api_switchUser(users.userB)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userC.firstName} ${users.userC.lastName} liked a transaction.Dismiss`)
    })

    it('3. When user A comments on a transaction of user B, user B should get notification that User A commented on their transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, users.userB);
        cy.api_switchUser(users.userB)
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait("@listTransaction")
        cy.get(transaction_selectors.transaction_list)
            .contains(`${users.userA.firstName} ${users.userA.lastName} paid ${users.userB.firstName} ${users.userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.comment_input).type(commentInput).type('{enter}')
        cy.wait("@postComment");
        cy.get(notifications_selectors.comment_list)
            .children()
            .should('have.text',commentInput)
        cy.api_switchUser(users.userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userB.firstName} ${users.userB.lastName} commented on a transaction.Dismiss`)
    })

    it('4. When user C comments on a transaction between user A and user B, user A and B should get notifications that user C commented on their transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, users.userB);
        cy.api_switchUser(users.userC)
        cy.get('@transactionId').then((transactionId) => {
            cy.visit(`/transaction/${transactionId}`);
        })
        cy.get(notifications_selectors.comment_input).type(commentInput).type('{enter}')
        cy.wait("@postComment");
        cy.get(notifications_selectors.comment_list)
            .children()
            .should('have.text',commentInput)
        cy.api_switchUser(users.userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userC.firstName} ${users.userC.lastName} commented on a transaction.Dismiss`)
        cy.api_switchUser(users.userB)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${users.userC.firstName} ${users.userC.lastName} commented on a transaction.Dismiss`)
    })

    it('5. When user A sends a payment to user B, user B should be notified of payment', () => {
        transaction_selectors.createPaidTransaction(paymentData, users.userB);
        cy.api_switchUser(users.userB)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
        .should('be.visible')
        .children()
        .first()
        .should('have.text',`${users.userB.firstName} ${users.userB.lastName} received payment.Dismiss`)
    })

    it('6. When user A sends a payment request to user C, user C should be notified of request from user A', () => {
        transaction_selectors.createRequestTransaction(paymentData, users.userC);
        cy.api_switchUser(users.userC)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
        .should('be.visible')
        .children()
        .first()
        .should('have.text',`${users.userA.firstName} ${users.userA.lastName} requested payment.Dismiss`)
    })
})