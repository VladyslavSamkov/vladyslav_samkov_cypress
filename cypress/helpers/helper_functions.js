export const helper_functions = {
    generateUserName() {
        const n1 = ["Blue ", "Green", "Red", "Orange", "Violet", "Indigo", "Yellow "];
        const n2 = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Zero"]
        return n1[parseInt(Math.random() * n1.length)] + '-' + n2[parseInt(Math.random() * n2.length)];
    }
} 