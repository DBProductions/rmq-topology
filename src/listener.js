import { addNewComponent } from './utils/common'

import {
  exportTopology,
  exportCurl,
  exportRabbitmqadmin,
  exportTerraform,
  exportAsyncApi
} from './utils/exports'

import {
  sendSettingsForm,
  hideSettings,
  changeSettingsTab
} from './utils/settings'

import {
  sendProducerForm,
  hideProducer,
  deleteProducerForm
} from './utils/producer'

import {
  sendConsumerForm,
  hideConsumer,
  deleteConsumerForm
} from './utils/consumer'

import {
  sendExchangeForm,
  hideExchange,
  deleteExchangeForm
} from './utils/exchange'

import { sendQueueForm, hideQueue, deleteQueueForm } from './utils/queue'

import {
  sendBindingForm,
  hideBinding,
  deleteBindingForm
} from './utils/binding'

const eventListener = [
  {
    selector: '#newComponent',
    event: 'change',
    handler: addNewComponent
  }
]
// --- Export ---
eventListener.push(
  {
    selector: '#export',
    event: 'click',
    handler: exportTopology
  },
  {
    selector: '#generateCurl',
    event: 'click',
    handler: exportCurl
  },
  {
    selector: '#generateRabbitmqadmin',
    event: 'click',
    handler: exportRabbitmqadmin
  },
  {
    selector: '#generateTerraform',
    event: 'click',
    handler: exportTerraform
  },
  {
    selector: '#generateAsyncApi',
    event: 'click',
    handler: exportAsyncApi
  }
)
// --- Producer ---
eventListener.push(
  {
    selector: '#sendProducerForm',
    event: 'click',
    handler: sendProducerForm
  },
  {
    selector: '#cancelProducerForm',
    event: 'click',
    handler: hideProducer
  },
  {
    selector: '#deleteProducerForm',
    event: 'click',
    handler: deleteProducerForm
  }
)
// --- Consumer ---
eventListener.push(
  {
    selector: '#sendConsumerForm',
    event: 'click',
    handler: sendConsumerForm
  },
  {
    selector: '#cancelConsumerForm',
    event: 'click',
    handler: hideConsumer
  },
  {
    selector: '#deleteConsumerForm',
    event: 'click',
    handler: deleteConsumerForm
  }
)
// --- Exchange ---
eventListener.push(
  {
    selector: '#sendExchangeForm',
    event: 'click',
    handler: sendExchangeForm
  },
  {
    selector: '#cancelExchangeForm',
    event: 'click',
    handler: hideExchange
  },
  {
    selector: '#deleteExchangeForm',
    event: 'click',
    handler: deleteExchangeForm
  }
)
// --- Queue ---
eventListener.push(
  {
    selector: '#sendQueueForm',
    event: 'click',
    handler: sendQueueForm
  },
  {
    selector: '#cancelQueueForm',
    event: 'click',
    handler: hideQueue
  },
  {
    selector: '#deleteQueueForm',
    event: 'click',
    handler: deleteQueueForm
  }
)
// --- Binding ---
eventListener.push(
  {
    selector: '#sendBindingForm',
    event: 'click',
    handler: sendBindingForm
  },
  {
    selector: '#cancelBindingForm',
    event: 'click',
    handler: hideBinding
  },
  {
    selector: '#deleteBindingForm',
    event: 'click',
    handler: deleteBindingForm
  }
)
// --- Settings ---
eventListener.push(
  {
    selector: '#settingsTabs',
    event: 'click',
    handler: changeSettingsTab
  },
  {
    selector: '#sendSettingsForm',
    event: 'click',
    handler: sendSettingsForm
  },
  {
    selector: '#cancelSettingsForm',
    event: 'click',
    handler: cancelSettingsForm
  }
)

eventListener.forEach((v) => {
  document.querySelector(v.selector).addEventListener(v.event, v.handler)
})

export {}
