import { notifications_selectors } from "../selectors/notifications_selectors"
import { transaction_selectors } from "../selectors/transaction_selectors"


describe('homework №5 02.05', () => {
    const userA = {
        username: 'Tavares_Barrows',
        password: 's3cret',
        firstName: "Arely",
        lastName: "Kertzmann",
        email: "Aniya_Powlowski36@hotmail.com",
        phoneNumber: "537-041-4355",
    }

    const userB = {
        username: 'Jessyca.Kuhic',
        password: 's3cret',
        firstName: "Devon",
        lastName: "Becker",
        email: "Jordy37@yahoo.com",
        phoneNumber: "277-189-3402",
    }

    const userC = {
            firstName: 'Kaylin',
            lastName: 'Homenick',
            username: 'Allie2',
            password: 's3cret',
            email: 'Rebeca35@yahoo.com',
            phoneNumber: '072-208-4283',
          }

    const paymentData = {
        amount: 100,
        note: 'For Porche 911'
    }

    const commentInput = 'Expecto Patronum'

    beforeEach('visiting sign in page', () => {
        cy.intercept("GET", "/notifications*").as("getNotifications");
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("PATCH", "/notifications/*").as("updateNotification");
        cy.intercept("POST", "/comments/*").as("postComment");2
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("GET", "/transactions").as("listTransaction");
        cy.ui_login(userA);
    })

    it('1. When user A likes a transaction of user B, user B should get notification that user A liked transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, userB);
        cy.ui_logout();
        cy.ui_login(userB);
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait("@listTransaction")
        cy.get(transaction_selectors.transaction_list)
            .contains(`${userA.firstName} ${userA.lastName} paid ${userB.firstName} ${userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.like_btn).should('be.visible').click()
        cy.get(notifications_selectors.like_count).should('be.visible').and('have.text','1 ')
        cy.ui_logout()
        cy.ui_login(userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userB.firstName} ${userB.lastName} liked a transaction.Dismiss`)
    })

    it('2. When user C likes a transaction between user A and user B, user A and user B should get notifications that user C liked transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, userB);
        cy.ui_logout();
        cy.ui_login(userC);
        cy.get(transaction_selectors.transaction_list)
            .contains(`${userA.firstName} ${userA.lastName} paid ${userB.firstName} ${userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.like_btn).should('be.visible').click()
        cy.get(notifications_selectors.like_count).should('be.visible').and('have.text','1 ')
        cy.ui_logout()
        cy.ui_login(userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userC.firstName} ${userC.lastName} liked a transaction.Dismiss`)
        cy.ui_logout();
        cy.ui_login(userB)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userC.firstName} ${userC.lastName} liked a transaction.Dismiss`)
    })

    it('3. When user A comments on a transaction of user B, user B should get notification that User A commented on their transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, userB);
        cy.ui_logout();
        cy.ui_login(userB);
        cy.get(transaction_selectors.mine_btn).click()
        cy.wait("@listTransaction")
        cy.get(transaction_selectors.transaction_list)
            .contains(`${userA.firstName} ${userA.lastName} paid ${userB.firstName} ${userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.comment_input).type(commentInput).type('{enter}')
        cy.wait("@postComment");
        cy.get(notifications_selectors.comment_list)
            .children()
            .should('have.text',commentInput)
        cy.ui_logout();
        cy.ui_login(userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userB.firstName} ${userB.lastName} commented on a transaction.Dismiss`)
    })

    it('4. When user C comments on a transaction between user A and user B, user A and B should get notifications that user C commented on their transaction', () => {
        transaction_selectors.createPaidTransaction(paymentData, userB);
        cy.ui_logout();
        cy.ui_login(userC);
        cy.get(transaction_selectors.transaction_list)
            .contains(`${userA.firstName} ${userA.lastName} paid ${userB.firstName} ${userB.lastName}`)
            .first()
            .click({force: true});
        cy.get(notifications_selectors.comment_input).type(commentInput).type('{enter}')
        cy.wait("@postComment");
        cy.get(notifications_selectors.comment_list)
            .children()
            .should('have.text',commentInput)
        cy.ui_logout();
        cy.ui_login(userA)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userC.firstName} ${userC.lastName} commented on a transaction.Dismiss`)
        cy.ui_logout()
        cy.ui_login(userB)
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
            .should('be.visible')
            .children()
            .first()
            .should('have.text',`${userC.firstName} ${userC.lastName} commented on a transaction.Dismiss`)
    })

    it('5. When user A sends a payment to user B, user B should be notified of payment', () => {
        transaction_selectors.createPaidTransaction(paymentData, userB);
        cy.ui_logout();
        cy.ui_login(userB);
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
        .should('be.visible')
        .children()
        .first()
        .should('have.text',`${userB.firstName} ${userB.lastName} received payment.Dismiss`)
    })

    it('6. When user A sends a payment request to user C, user C should be notified of request from user A', () => {
        transaction_selectors.createRequestTransaction(paymentData, userC);
        cy.ui_logout();
        cy.ui_login(userB);
        cy.get(notifications_selectors.notifications_btn).click()
        cy.wait('@getNotifications')
        cy.get(notifications_selectors.notifications_list)
        .should('be.visible')
        .children()
        .first()
        .should('have.text',`${userA.firstName} ${userA.lastName} requested payment.Dismiss`)
    })
})