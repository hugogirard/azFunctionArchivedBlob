const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {

    const payload = context.df.getInput();

    const result = yield context.df.callActivity("ProcessPageBlob",{
        rootFolder: payload.rootFolder,
        destinationContainer: payload.destinationContainer,
        deadLetterFolder: payload.deadLetterFolder
    });
    context.log.info(`Documents processed result: ${JSON.stringify(result)}`);
    
    // If no blob got processed sleep
    if (result.nbrProcessed === 0){
        yield context.df.createTimer(new Date(context.df.currentUtcDateTime.getTime() + 30000));        
    }

    // Continue processing documents
    yield context.df.continueAsNew();

});