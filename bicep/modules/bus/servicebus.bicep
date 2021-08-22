param location string
param suffix string

resource serviceBusNamespace 'Microsoft.ServiceBus/namespaces@2017-04-01' = {
  name: 'srvbus-${suffix}'
  location: location
  sku: {
    name: 'Standard'
  }
}

resource serviceBusQueue 'Microsoft.ServiceBus/namespaces/queues@2017-04-01' = {
  name: '${serviceBusNamespace.name}/processedFiles'
  properties: {
    maxDeliveryCount: 3
  }
}
