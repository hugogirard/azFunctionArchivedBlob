const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const account = process.env.STR_ACCOUNT_NAME;
const instance = null;
module.exports = () => {
    if (instance === null) {
        const sharedKeyCredential = new StorageSharedKeyCredential(account, process.env.ACCOUNT_KEY);
        instance = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );                
    }
    return instance;
};
