import users from '../fixtures/users.json'


describe("HW9 api checks", () => {
    
    const BAinfo = {
        bankName: 'Los Angeles Bank',
        routingNumber: '123456789',
        accountNumber: '987654321',
        id: ''
    }
    
    const contactID = 'qwerty123'

    beforeEach('', () => {
        cy.api_login(users.userA);
    })

    it("1. create_bank_account_API(bankName, accountNumber, routingNumber) [POST /bankAccounts]", () => {
        cy.create_bank_account_API(BAinfo).then((response) => {
            BAinfo.id = response.body.account.id;
        });
    });

    it("2. delete_bank_account_API(bankAccountId) [DELETE /contacts/:bankAccountId]", () => {
        cy.delete_bank_account_API(BAinfo.id);
    });

    it("3. add_contact_API(userId) [POST /contacts]", () => {
        cy.add_contact_API(contactID);
    });

    it("4. delete_contact(userId) [DELETE /contacts/:contactId]", () => {
        cy.delete_contact_API(contactID);
    });
})