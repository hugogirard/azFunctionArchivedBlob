param location string

var suffix = uniqueString(resourceGroup().id)

module function 'modules/functions/functions.bicep' = {
  name: 'function'
  params: {
    location: location
    suffix: suffix
  }
}
