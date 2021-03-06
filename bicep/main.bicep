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

module bus 'modules/bus/servicebus.bicep' = {
  name: 'bus'
  params: {
    location: location
    suffix: suffix
  }
}

module cosmos 'modules/cosmos/cosmos.bicep' = {
  name: 'cosmos'
  params: {
    location: location
    suffix: suffix
  }
}

output functionSeederName string = function.outputs.functionSeederName
