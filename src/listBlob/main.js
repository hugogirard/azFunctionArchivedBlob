const { ContainerClient  } = require('@azure/storage-blob');
require('dotenv').config();

async function main() {

    try {
        await withPages();
        //await withIterator();

    } catch (error) {
        console.error(error.message);
    }
}

async function withPages(){

    const strCnxString = process.env.CONNECTION_STRING;
    const containerName = process.env.CONTAINER_NAME || "";
    const blobName = "00026d41-1bed-43de-8c92-0307d940d5b7.pdf";
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