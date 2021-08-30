const ContainerClient = require('../Factory/containerClientFactory');
const storageCopy = require('./storageCopy');
const IndexService = require('./indexService');
const indexService = new IndexService();

module.exports = async function (context) {
    
    const sourceContainerClient = ContainerClient(context.bindings.inputs.rootFolder);
    const destContainerClient = ContainerClient(context.bindings.inputs.destinationContainer);
    const deadLetterFolder = ContainerClient(context.bindings.inputs.deadLetterFolder);
    
    const outputs = {
        id: context.bindingData.instanceId,
        nbrProcessed: 0,
        nbrErrors: 0,
        rootFolder: context.bindings.inputs.rootFolder,
        startTime: new Date(new Date().toUTCString()),
        endTime: null
    };
    context.bindings.outputSbQueue = [];
    try {        
        // Process one page at the time
        for await (const response of sourceContainerClient.listBlobsFlat().byPage()) {
            outputs.nbrProcessed = response.segment.blobItems.length;
            for (const blob of response.segment.blobItems) {            
                try {
                    let blobClient = sourceContainerClient.getBlobClient(blob.name);
                    let blobEntity = {
                        name: blobClient.name,
                        url: blobClient.url
                    }
                    
                    const success = await indexService.setTags(context.bindings.inputs.rootFolder,
                                                               blobEntity.name,
                                                               context.log);

                    if (!success) {
                        cannotProcessDocument = true;
                    }

                    let resultCopy = await storageCopy(blobEntity,destContainerClient);
                    let cannotProcessDocument = false;

                    if (resultCopy.statusCode === 202){
                        outputs.nbrProcessed += 1;
                        context.bindings.outputSbQueue.push(blobEntity.url);
                    } else if (resultCopy.error === null) {
                        resultCopy = await storageCopy(blobEntity,deadLetterFolder);
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

    outputs.endTime = new Date(new Date().toUTCString());
    context.bindings.processTracking = JSON.stringify(outputs);

    return obj = {
        nbrProcessed: outputs.nbrProcessed
    };

};