

module.exports = async (blobToCopy,containerClient) => {

    const result = {
        statusCode: null,
        error: null
    };

    try {
        const destBlob = containerClient.getBlobClient(blobToCopy.name);
        let responseCopy = await destBlob.beginCopyFromURL(blobToCopy.url);
        let responseStatus = (await responseCopy.pollUntilDone());

        if (responseStatus._response.status != 202) {
            result.statusCode = responseStatus._response.status;
        }

        return result
    } catch (error) {
        result.statusCode = 500;
        result.error = error;
        return result;
    }

};