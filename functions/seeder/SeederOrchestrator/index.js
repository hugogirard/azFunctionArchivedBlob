const df = require("durable-functions");
const { v4: uuidv4 } = require('uuid');

module.exports = df.orchestrator(function* (context) {
    const outputs = {};

    const payload = context.df.getInput();
    const containerName = payload.containerName;
    
    const tasks = [];
    for (let index = 0; index < payload.nbrDocuments; index++) {

        const filename = `${uuidv4()}.pdf`;      
        const input = {
            containerName: containerName,
            filename: filename
        };

        tasks.push(context.df.callActivity('UploadInvoices',input));
    }

    const results = yield context.df.Task.all(tasks);
    context.log.info(results);

    const documentsInError = results.filter(r => r.isSuccess === false);
    const successDocument = results.filter(r => r.isSuccess).length;
    
    outputs.totalDocumentProcess = payload.nbrDocuments;
    outputs.totalSuccessDocument = successDocument;
    outputs.totalErrorDocument = documentsInError.lenght;
    outputs.documentInErrors = documentsInError;

    return outputs;
});