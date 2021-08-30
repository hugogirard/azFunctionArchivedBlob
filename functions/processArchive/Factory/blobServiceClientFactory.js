const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const instance = null;
module.exports = () => {
    if (instance === null) {
        const sharedKeyCredential = new StorageSharedKeyCredential(process.env.STR_ACCOUNT_NAME, process.env.ACCOUNT_KEY);
        instance = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );                
    }
    return instance;
};
