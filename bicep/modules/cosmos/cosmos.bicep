param location string
param suffix string

var databaseName = 'archiving'

resource cosmos 'Microsoft.DocumentDB/databaseAccounts@2020-04-15' = {
  name: 'cosmosdb-${suffix}'
  location: location
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        isZoneRedundant: false
      }
    ]
  }
}

resource cosmosdb 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2020-04-01' = {
  name: '${cosmos.name}/${databaseName}'
  properties: {
    resource: {
      id: databaseName
    }
    options: {
      throughput: 400
    }
  }
}
