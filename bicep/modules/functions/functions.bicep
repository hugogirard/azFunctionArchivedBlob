param location string
param suffix string

var seederFunctionAppName = 'fnc-seeder-${suffix}'
var hostingPlanName = 'plan-seeder-${suffix}'

resource strSeeder 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'strseed${suffix}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource sdHosting 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: hostingPlanName
  location: location
  properties: {
  }
  sku: {
    tier: 'Dynamic'
    name: 'Y1'
  }
}

resource fnSeeder 'Microsoft.Web/sites@2021-01-15' = {
  name: seederFunctionAppName
  location: location
  kind: 'funtionapp'
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }    
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~14'
        }      
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: '~14'
        }                             
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: insight.properties.InstrumentationKey
        }          
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: insight.properties.ConnectionString
        }      
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strSeeder.name};AccountKey=${}'
        }                    
      ]
    }
  }
}

resource insight 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appinsight-${suffix}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}
