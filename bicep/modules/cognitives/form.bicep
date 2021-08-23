param location string
param suffix string


resource form 'Microsoft.CognitiveServices/accounts@2021-04-30' = {
  name: 'frm${suffix}'
  location: location
  sku: {
    name: 'S0'
  }
  properties: {
    publicNetworkAccess: 'Enabled'
  }
}
