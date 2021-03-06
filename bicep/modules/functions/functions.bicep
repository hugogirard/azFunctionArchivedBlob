param location string
param suffix string
param strDocumentKey string
param strDocumentName string

var seederFunctionAppName = 'fnc-seeder-${suffix}'
var hostingPlanNameSeeder = 'plan-seeder-${suffix}'
var archiverProcessor = 'fnc-processor-${suffix}'
var hostingArchiverProcessor = 'plan-processor-${suffix}'

resource strSeeder 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'strseed${suffix}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource strProcessor 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'strproc${suffix}'
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource sdHostingSeeder 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: hostingPlanNameSeeder
  location: location
  sku: {
    tier: 'Dynamic'
    name: 'Y1'
  }
}

resource sdHostingProcessor 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: hostingArchiverProcessor
  location: location
  sku: {
    tier: 'Dynamic'
    name: 'Y1'
  }
}

resource fnSeeder 'Microsoft.Web/sites@2018-11-01' = {
  name: seederFunctionAppName
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: sdHostingSeeder.id
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
          value: insight.properties.InstrumentationKey
        }          
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: insight.properties.ConnectionString
        }      
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strSeeder.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strSeeder.listKeys().keys[0].value}'
        }
        {
          name: 'DocumentStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strDocumentName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strDocumentKey}'
        }        
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strSeeder.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strSeeder.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: 'seederapp092'
        }              
      ]
    }
  }
}

resource fnPRocessor 'Microsoft.Web/sites@2018-11-01' = {
  name: archiverProcessor
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: sdHostingProcessor.id
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
          value: insight.properties.InstrumentationKey
        }          
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: insight.properties.ConnectionString
        }      
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strProcessor.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strProcessor.listKeys().keys[0].value}'
        }    
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strProcessor.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strProcessor.listKeys().keys[0].value}'
        }
        {
          name: 'STORAGE_DOCUMENT_CNXSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${strDocumentName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${strDocumentKey}'
        }            
        {
          name: 'SrvBusCnxString'
          value: ''
        }
        {
          name: 'CosmosDBCnxString'
          value: ''
        }
        {
          name: 'STR_ACCOUNT_NAME'
          value: strProcessor.name
        }
        {
          name: 'ACCOUNT_KEY'
          value: strProcessor.listKeys().keys[0].value
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: 'processorapp092'
        }               
      ]
    }
  }
}


resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2020-03-01-preview' = {
  name: 'log-wrk-${suffix}'
  location: location
  properties: {
    retentionInDays: 30
  }
}

resource insight 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appinsight-${suffix}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}


output functionSeederName string = fnSeeder.name
