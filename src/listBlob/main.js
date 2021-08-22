const { ContainerClient  } = require('@azure/storage-blob');
const fs = require('fs').promises;
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

    const containerClient = new ContainerClient(strCnxString,containerName);    
    let iterator = await containerClient.listBlobsFlat().byPage();
    let response = await iterator.next();
    if (response.done()){
        
    }
    //for await (const response of containerClient.listBlobsFlat().byPage({ maxPageSize: 20 })) {
        for (const blob of response.segment.blobItems) {
          console.log(`Blob ${i++}: ${blob.name}`);
        }
      //}
    
}

async function withIterator() {

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