const { ContainerClient  } = require('@azure/storage-blob');

module.exports = async function (context) {
    return `Hello ${context.bindings.name}!`;
};