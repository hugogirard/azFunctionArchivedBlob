const { ContainerClient, BlobServiceClient, StorageSharedKeyCredential  } = require('@azure/storage-blob');
require('dotenv').config();

async function main() {

    try {
        await queryAsync();
        //await tagBlobs();
        
    } catch (error) {
        console.error(error.message);
    }
}

async function queryAsync() {
    const query = `"processed" = 'true'`;
    const account = process.env.STR_ACCOUNT_NAME;

    const sharedKeyCredential = new StorageSharedKeyCredential(account, process.env.ACCOUNT_KEY);
    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
      );

    for await (const taggedBlobItem of blobServiceClient.findBlobsByTags(query)) {
        console.log(taggedBlobItem);
    }
}

async function tagBlobs(){

    const strCnxString = process.env.CONNECTION_STRING;
    const containerName = process.env.CONTAINER_NAME || "";
    const blobName = "001c2429-e208-48ea-acb1-e43c7d9615b4.pdf";
    const containerClient = new ContainerClient(strCnxString,containerName);    

    const blobClient = containerClient.getBlobClient(blobName);

    const tagResponse = await blobClient.getTags();
    
    if (tagResponse._response.status === 200 && !tagResponse.tags.hasOwnProperty('processed')) {
        const tags = {
            'processed': 'true'
        };
    
        const response = await blobClient.setTags(tags);
    
        // Do something
        if (!response._response.status === 204) {
    
        }
    }
}

main().catch((err) => {
    console.error("Error running main:",err.message);
});