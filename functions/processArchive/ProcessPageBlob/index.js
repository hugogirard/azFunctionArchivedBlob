const ContainerClient = require('../Factory/containerClientFactory');
const storageCopy = require('./storageCopy');

module.exports = async function (context) {
    
    const sourceContainerClient = ContainerClient(context.bindings.inputs.rootFolder);
    const destContainerClient = ContainerClient(context.bindings.inputs.destinationContainer);
    const deadLetterFolder = ContainerClient(context.bindings.inputs.deadLetterFolder);
    const outputs = {
        nbrProcessed: 0,
        nbrErrors: 0
    };
    //context.bindings.outputSbQueue = [];
    try {        
        // Process one page at the time
        for await (const response of sourceContainerClient.listBlobsFlat().byPage()) {
            outputs.nbrProcessed = response.segment.blobItems.length;
            for (const blob of response.segment.blobItems) {            
                try {

                    let resultCopy = await storageCopy(blob,destContainerClient);
                    let cannotProcessDocument = false;

                    if (resultCopy.statusCode === 202){
                        outputs.nbrProcessed += 1;
                        //context.bindings.outputSbQueue.push(urlBlob);
                    } else if (resultCopy.error === null) {
                        resultCopy = await storageCopy(blob,deadLetterFolder);
                        if (resultCopy != 202)
                            cannotProcessDocument = true;                        
                    } else {
                        cannotProcessDocument = true;                        
                    }              

                    if (cannotProcessDocument) {
                        outputs.nbrErrors += 1;
                        context.log.error(`Cannot move blob to dead letter: ${blob.name}`);
                    }

                } catch (error) {                    
                    context.log.error(error.message);
                }                
            }
        }
    } catch (error) {
        outputs.nbrErrors += 1;
        context.log.error(error.message);
    }

    return outputs;

};