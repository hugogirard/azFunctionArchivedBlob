param location string

var suffix = uniqueString(resourceGroup().id)

module str 'modules/storage/storage.bicep' = {
  name: 'str'
  params: {
    location: location
    suffix: suffix
  }
}

module function 'modules/functions/functions.bicep' = {
  name: 'function'
  params: {
    location: location
    suffix: suffix
    strDocumentKey: str.outputs.strKey
    strDocumentName: str.outputs.storageName
  }
}

output functionSeederName string = function.outputs.functionSeederName
