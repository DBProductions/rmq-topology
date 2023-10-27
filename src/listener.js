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

// --- Producer ---
document
  .querySelector('#sendProducerForm')
  .addEventListener('click', sendProducerForm)

document
  .querySelector('#cancelProducerForm')
  .addEventListener('click', hideProducer)

document
  .querySelector('#deleteProducerForm')
  .addEventListener('click', deleteProducerForm)

// --- Consumer ---
document
  .querySelector('#sendConsumerForm')
  .addEventListener('click', sendConsumerForm)

document
  .querySelector('#cancelConsumerForm')
  .addEventListener('click', hideConsumer)

document
  .querySelector('#deleteConsumerForm')
  .addEventListener('click', deleteConsumerForm)

// --- Exchange ---
document
  .querySelector('#sendExchangeForm')
  .addEventListener('click', sendExchangeForm)

document
  .querySelector('#cancelExchangeForm')
  .addEventListener('click', hideExchange)

document
  .querySelector('#deleteExchangeForm')
  .addEventListener('click', deleteExchangeForm)

// --- Queue ---
document
  .querySelector('#sendQueueForm')
  .addEventListener('click', sendQueueForm)

document.querySelector('#cancelQueueForm').addEventListener('click', hideQueue)

document
  .querySelector('#deleteQueueForm')
  .addEventListener('click', deleteQueueForm)

// --- Binding ---
document
  .querySelector('#sendBindingForm')
  .addEventListener('click', sendBindingForm)

document
  .querySelector('#cancelBindingForm')
  .addEventListener('click', hideBinding)

document
  .querySelector('#deleteBindingForm')
  .addEventListener('click', deleteBindingForm)

// --- Settings ---
document
  .querySelector('#settingsTabs')
  .addEventListener('click', changeSettingsTab)

document
  .querySelector('#sendSettingsForm')
  .addEventListener('click', sendSettingsForm)

document
  .querySelector('#cancelSettingsForm')
  .addEventListener('click', hideSettings)

export {}
