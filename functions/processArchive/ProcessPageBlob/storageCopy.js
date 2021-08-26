

module.exports = async (blobToCopy,containerClient) => {

    const result = {
        statusCode: null,
        error: null
    };

    try {
        const destBlob = containerClient.getBlobClient(blobToCopy.name);
        let responseCopy = await destBlob.beginCopyFromURL(blobToCopy.url);
        let responseStatus = (await responseCopy.pollUntilDone());
        result.statusCode = responseStatus._response.status;
                    
        return result
    } catch (error) {
        result.statusCode = 500;
        result.error = error;
        return result;
    }

};