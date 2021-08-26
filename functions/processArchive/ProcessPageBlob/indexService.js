

class IndexingService {
    constructor(containerClient) {
        this.containerClient = containerClient;
    }

    async setTags(blobName){

        const appendBlob = this.containerClient.getAppendBlobClient(blobName);

        const tags = await appendBlob.getTags();
    }
}

module.exports = IndexingService;