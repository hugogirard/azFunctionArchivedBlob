const ContainerClient = require('../Factory/containerClientFactory');
const BlobServiceClient = require('../Factory/blobServiceClientFactory');

class IndexingService {
    async setTags(containerName,blobName,logger){

        try {

            const containerClient = ContainerClient(containerName);

            const blobClient = containerClient.getBlobClient(blobName);
    
            const tagResponse = await blobClient.getTags();
    
            if (tagResponse._response.status === 200 && !tagResponse.tags.hasOwnProperty('processed')) {
    
                const tags = {
                    'processed': 'true'
                };
            
                const response = await blobClient.setTags(tags);
                        
                if (!response._response.status === 204) {
                    logger.error(`Cannot process blob --> ${blobName} with statusCode: ${response._response.status}`);
                    return false;
                }
    
                return true;
            }                    
        } catch (error) {
            logger.error(error.message);
            return false;
        }


    }

    async getTaggedBlob(query) {
        
        const blobServiceClient = BlobServiceClient();
        const blobs = [];
        for await (const taggedBlobItem of blobServiceClient.findBlobsByTags(query)) {
            blob.push(taggedBlobItem);
        }

        return blobs;
    }
}

module.exports = IndexingService;