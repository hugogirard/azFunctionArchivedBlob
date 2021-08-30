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

resource queueSender 'Microsoft.ServiceBus/namespaces/queues/authorizationRules@2021-01-01-preview' = {
  name: '${serviceBusNamespace.name}/${serviceBusQueue.name}/funcSender'
  properties: {
    rights: [
      'Send'
    ]
  }
}


