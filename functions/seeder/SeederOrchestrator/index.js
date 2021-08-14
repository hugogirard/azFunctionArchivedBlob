const df = require("durable-functions");
const { v4: uuidv4 } = require('uuid');

//const _blobServiceClient = new BlobServiceClient();

module.exports = df.orchestrator(function* (context) {
    const outputs = [];

    const input = context.df.getInput();

    const iterations = input['nbrDocuments'];

    const filename = `${uuidv4()}.pdf`;

    // for (let index = 0; index < iterations; index++) {
    //     const filename = `${uuidv4()}.pdf`;
    //     outputs.push(filename);
    // }

    input['filename'] = filename;

    yield context.df.callActivity('UploadInvoices');

    outputs.push(JSON.stringify(input));



    // outputs.push(yield context.df.callActivity("UploadInvoices", "Tokyo"));
    // outputs.push(yield context.df.callActivity("UploadInvoices", "Seattle"));
    // outputs.push(yield context.df.callActivity("UploadInvoices", "London"));

    return outputs;
});