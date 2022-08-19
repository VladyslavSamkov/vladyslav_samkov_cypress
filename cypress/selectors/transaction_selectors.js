export const transaction_selectors = {
    users_list: '[data-test="users-list"]',
    user_list_item: '[data-test*="user-list-item"]',
    add_amount_field: '#amount',
    add_amount_error: '#transaction-create-amount-input-helper-text',
    add_a_note_field: '#transaction-create-description-input',
    add_a_note_error: '#transaction-create-description-input-helper-text',
    user_devon_backer: '[data-test="user-list-item-tsHF6_D5oQ"]',
    pay_btn: '[data-test="transaction-create-submit-payment"]',
    request_btn: '[data-test="transaction-create-submit-request"]',
    success_message: '.MuiGrid-justify-content-xs-center .MuiTypography-root',
    success_alert: '[data-test="alert-bar-success"]',
    user_balance: '[data-test="sidenav-user-balance"]',
    mine_btn: '[data-test="nav-personal-tab"]',
    transaction_list: '[data-test="transaction-list"]',
    accept_request_btn: '[data-test*="transaction-accept-request"]',
    reject_request_btn: '[data-test*="transaction-reject-request"]',
    search_input: '[data-test="user-list-search-input"]',
    new_transaction_btn: '[data-test="nav-top-new-transaction"]',
    transaction_tabs: '[data-test="nav-transaction-tabs"]',
    createPaidTransaction(paymentData, receiverUserInfo) {
        cy.get(transaction_selectors.new_transaction_btn).click();
        cy.get(transaction_selectors.user_list_item).contains(`${receiverUserInfo.firstName} ${receiverUserInfo.lastName}`).click({force: true})
        cy.get(transaction_selectors.add_amount_field).should('be.visible').type(paymentData.amount),
        cy.get(transaction_selectors.add_a_note_field).should('be.visible').type(paymentData.note),
        cy.get(transaction_selectors.pay_btn).should('be.visible').click()
        cy.wait("@createTransaction").its("response").then( (response) => {
            expect(response.statusCode).to.eq(200)    
            expect(response.body.transaction.amount).to.eq(paymentData.amount * 100);
            expect(response.body.transaction.description).to.eq(paymentData.note);
            expect(response.body.transaction.status).to.eq('complete');
            })
        cy.wait("@checkAuth")
        cy.get(transaction_selectors.success_alert)
            .should('be.visible')
            .and('have.text','Transaction Submitted!')
        cy.get(transaction_selectors.success_message).contains('Paid')
    },
    createRequestTransaction(paymentData, receiverUserInfo) {
        cy.get(transaction_selectors.new_transaction_btn).click();
        cy.get(transaction_selectors.user_list_item).contains(`${receiverUserInfo.firstName} ${receiverUserInfo.lastName}`).click({force: true})
        cy.get(transaction_selectors.add_amount_field).should('be.visible').type(paymentData.amount),
        cy.get(transaction_selectors.add_a_note_field).should('be.visible').type(paymentData.note),
        cy.get(transaction_selectors.request_btn).should('be.visible').click()
        cy.wait("@createTransaction").its("response").then( (response) => {
            expect(response.statusCode).to.eq(200)    
            expect(response.body.transaction.amount).to.eq(paymentData.amount * 100)
            expect(response.body.transaction.description).to.eq(paymentData.note)
            expect(response.body.transaction.status).to.eq('pending')
            })
        cy.wait("@checkAuth")
        cy.get(transaction_selectors.success_alert)
            .should('be.visible')
            .and('have.text','Transaction Submitted!')
        cy.get(transaction_selectors.success_message).contains('Requested')
    }
}