param location string
param suffix string

resource strDocument 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'strdoc${suffix}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

output storageName string = strDocument.name
output strKey string = strDocument.listKeys().keys[0].value
