const df = require("durable-functions");

module.exports = async function (context, req) {

    if (!req.body.rootFolder || !req.body.destinationContainer || !req.body.deadLetterFolder) {
        context.log.error('Invalid inputs parameters');
        throw new Error('Invalid inputs parameters');
    }
        
    const client = df.getClient(context);

    const instanceId = await client.startNew('ArchiverOrchestrator',undefined,req.body);

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};