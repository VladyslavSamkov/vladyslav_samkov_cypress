import { home_page_selectors } from "../selectors/home_page_selectors"
import { transaction_selectors } from "../selectors/transaction_selectors"


describe('homework 26.7', () => {
    const userInfo = {
        username: 'Tavares_Barrows',
        password: 's3cret',
        firstName: "Arely",
        lastName: "Kertzmann",
        email: "Aniya_Powlowski36@hotmail.com",
        phoneNumber: "537-041-4355",
    }

    const receiverUserInfo = {
        username: 'Jessyca.Kuhic',
        password: 's3cret',
        firstName: "Devon",
        lastName: "Becker",
        email: "Jordy37@yahoo.com",
        phoneNumber: "277-189-3402",
    }

    const paymentData = {
        amount: 100,
        note: 'For Porche 911'
    }

    const searchAttrs = [
        "firstName",
        "lastName",
        "username",
        "email",
        "phoneNumber",
      ];

    beforeEach('visiting sign in page', () => {
        cy.intercept("POST", "/transactions").as("createTransaction");
        cy.intercept("GET", "/users").as("getUsers");
        cy.intercept("GET", "/checkAuth").as("checkAuth");
        cy.intercept("GET", "/users/search*").as("usersSearch");
        cy.intercept("GET", "/transactions/*").as("updateTransaction");
        cy.intercept("GET", "/transactions").as("listTransaction")
        cy.ui_login(userInfo);
        cy.get(transaction_selectors.new_transaction_btn).click();
        cy.wait("@getUsers");

    })

    it('1. Navigates to the new transaction form, selects a user and submits a transaction payment', () => {
        transaction_selectors.createPaidTransaction(paymentData, receiverUserInfo)
    })

    it('2. Navigates to the new transaction form, selects a user and submits a transaction request', () => {
        transaction_selectors.createRequestTransaction(paymentData, receiverUserInfo)
    })
    
    it('3. Displays new transaction errors', () => {
        cy.get(transaction_selectors.user_devon_backer).should('be.visible').click()
        cy.get(transaction_selectors.add_amount_field).click().blur()
        cy.get(transaction_selectors.add_amount_error)
            .should('be.visible')
            .and('have.text','Please enter a valid amount')
        cy.get(transaction_selectors.add_a_note_field).click().blur()
        cy.get(transaction_selectors.add_a_note_error)
            .should('be.visible')
            .and('have.text','Please enter a note')
        cy.get(transaction_selectors.request_btn).should('be.disabled')
        cy.get(transaction_selectors.pay_btn).should('be.disabled')    
    })

    it('4. submits a transaction payment and verifies the deposit for the receiver', () => {
        let payerStartBalance, receiverStartBalance
        cy.ui_logout()
        cy.ui_login(receiverUserInfo);
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '');
            x = x.replace('.', '');
            receiverStartBalance = x;     
        });
        cy.ui_logout();
        cy.ui_login(userInfo);
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '')
            x = x.replace('.', '')
            payerStartBalance = x;
        });
        cy.get(transaction_selectors.new_transaction_btn).click();
        cy.wait("@getUsers");
        transaction_selectors.createPaidTransaction(paymentData, receiverUserInfo);
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '');
            x = x.replace('.', '');
            let updatedBalance = Number(payerStartBalance) - paymentData.amount * 100;
            expect(x).to.equal(updatedBalance.toString());
        });
        cy.ui_logout();
        cy.ui_login(receiverUserInfo);
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '');
            x = x.replace('.', '');
            let updatedBalance = Number(receiverStartBalance) + paymentData.amount * 100;
            expect(x).to.equal(updatedBalance.toString());
        });
    })    

    it('5. Submits a transaction request and accepts the request for the receiver', () => {
        let payerStartBalance
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '');
            x = x.replace('.', '');
            payerStartBalance = x;     
        });
        cy.get(transaction_selectors.new_transaction_btn).click();
        transaction_selectors.createRequestTransaction(paymentData)
        cy.ui_logout();
        cy.ui_login(receiverUserInfo);
        cy.get(transaction_selectors.mine_btn).should('be.visible').click()
        cy.wait("@listTransaction")
        cy.get(transaction_selectors.transaction_list)
            .children()
            .first()
            .should('contain',paymentData.note)
            .click()
        cy.get(transaction_selectors.accept_request_btn).should('be.visible').click()
        cy.ui_logout()
        cy.ui_login(userInfo)
        cy.get(transaction_selectors.user_balance).invoke("text").then((x) => {
            x = x.replace(',', '');
            x = x.replace('$', '');
            x = x.replace('.', '');
            let updatedBalance = Number(payerStartBalance) + paymentData.amount * 100;
            expect(x).to.equal(updatedBalance.toString());
        })
        })
        
    context ("6. searches for a user by attribute", () => {
        searchAttrs.forEach((attr) => {
            it(`Searches for a user by "${attr}" attribute`, () => {
            cy.get(transaction_selectors.search_input).type(receiverUserInfo[attr]);
            cy.wait("@usersSearch")
                .its("response.body.results")
                .should("have.length.gt", 0)
                .its("length")
                .then((resultsN) => {
                  cy.get(transaction_selectors.user_list_item)
                    .should("have.length", resultsN)
                    .first()
                    .contains(receiverUserInfo[attr]);
                });
            cy.focused().clear();
            cy.get(transaction_selectors.search_input).should("be.empty");
            });
          });
        })
})