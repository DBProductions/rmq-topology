import {
    sendProducerForm,
    hideProducer,
    deleteProducerForm,
    sendConsumerForm,
    hideConsumer,
    deleteConsumerForm,
    sendExchangeForm,
    hideExchange,
    deleteExchangeForm,
    sendQueueForm,
    hideQueue,
    deleteQueueForm,
    sendBindingForm,
    hideBinding,
    deleteBindingForm
  } from './utils'

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

export {}