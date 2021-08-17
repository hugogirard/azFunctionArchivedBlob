const { ContainerClient  } = require('@azure/storage-blob');
const fs = require('fs').promises;

require('dotenv').config();

async function main() {

    const strCnxString = process.env.CONNECTION_STRING;
    const containerName = process.env.CONTAINER_NAME || "";
        
    const containerClient = new ContainerClient(strCnxString,containerName);
    
    const fileName = './pointer.txt';
    let marker = null;

    try {
        marker = await fs.readFile(fileName,'utf8');
    } catch { // if the file doesn't exist we don't care
        
    }

    // if (fs.existsSync(fileName)){
    //     marker = await fs.readFile(fileName,'utf8');
    // }

    let iterator = null;
    
    if (!marker){
        iterator = containerClient.listBlobsFlat().byPage({ maxPageSize: 1 });
    } else {
        iterator = containerClient.listBlobsFlat().byPage({ continuationToken: marker, maxPageSize: 1 });
    }


    let response = await iterator.next();
    if (!response.done) {
        for (const blob of response.value.segment.blobItems) {
            console.log(`${blob.name}`);            
        }
    }
    marker = response.value.continuationToken;
    await fs.writeFile(fileName,marker);
}

main().catch((err) => {
    console.error("Error running main:",err.message);
});