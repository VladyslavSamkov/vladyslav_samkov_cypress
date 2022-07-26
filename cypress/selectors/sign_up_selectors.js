export const sign_up_selectors = {
    firstName: '#firstName',
    lastName: '#lastName',
    userName: '#username',
    password: '#password',
    confirmPassword: '#confirmPassword',
    sign_up_btn: '[data-test="signup-submit"]',
    generateUserName() {
        const n1 = ["Blue ", "Green", "Red", "Orange", "Violet", "Indigo", "Yellow "];
        const n2 = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Zero"]
        return n1[parseInt(Math.random() * n1.length)] + '-' + n2[parseInt(Math.random() * n2.length)];
    }
}
