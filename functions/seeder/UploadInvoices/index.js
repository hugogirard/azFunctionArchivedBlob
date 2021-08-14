const fs = require('fs');

module.exports = async function (context) {

    try {
        
        const data = await fs.readFile('template/Invoice_Template.pdf');

        context.bindings.outputBlob = data;

    } catch (error) {
        context.log.error(`Cannot write file`);
    }

    return;

    //return `Hello ${context.bindings.name}!`;
};