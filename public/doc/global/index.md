---
title: Globals
kind: global
longname: Globals
---

# Globals

---

## Instance Methods

<MemberHeading id="populatebindingdestination" depth="3" name="populateBindingDestination" sig="populateBindingDestination(selectedId: string)" />

<MemberMeta sourceHref="/source/utils/binding-js/#L11" sourceLabel="binding.js:11" />

Populates the destination select with either exchanges or queues, based on the selected destination type. Preserves the current selection when the id is still present in the new list.

**Parameters**

- `selectedId` (string) — id to preselect, if present

<MemberHeading id="changebindingdestinationtype" depth="3" name="changeBindingDestinationType" sig="changeBindingDestinationType()" />

<MemberMeta sourceHref="/source/utils/binding-js/#L42" sourceLabel="binding.js:42" />

Changes the destination type of the binding form. Re-populates the destination select with exchanges or queues.

<MemberHeading id="displaybinding" depth="3" name="displayBinding" sig="displayBinding(binding: Binding)" />

<MemberMeta sourceHref="/source/utils/binding-js/#L53" sourceLabel="binding.js:53" />

Display the form to create or edit binding component.

**Parameters**

- `binding` ([Binding](/binding)) — Binding object

<MemberHeading id="sendbindingform" depth="3" name="sendBindingForm" sig="sendBindingForm(e: object)" />

<MemberMeta sourceHref="/source/utils/binding-js/#L103" sourceLabel="binding.js:103" />

Sends the form to create or edit an binding component.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="hidebinding" depth="3" name="hideBinding" sig="hideBinding(e: object)" />

<MemberMeta sourceHref="/source/utils/binding-js/#L156" sourceLabel="binding.js:156" />

Reset form values and remove CSS class from the binding panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="deletebindingform" depth="3" name="deleteBindingForm" sig="deleteBindingForm(e: object)" />

<MemberMeta sourceHref="/source/utils/binding-js/#L178" sourceLabel="binding.js:178" />

Removes a binding.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="mouseuponcanvas" depth="3" name="mouseUpOnCanvas" sig="mouseUpOnCanvas(e: object)" />

<MemberMeta sourceHref="/source/utils/canvas-js/#L26" sourceLabel="canvas.js:26" />

Handles mouse up event on the canvas to stop dragging of actors.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="mousedownoncanvas" depth="3" name="mouseDownOnCanvas" sig="mouseDownOnCanvas(e: object)" />

<MemberMeta sourceHref="/source/utils/canvas-js/#L43" sourceLabel="canvas.js:43" />

Handles mouse down event on the canvas to start dragging without hover effect of actors.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="mousemoveoncanvas" depth="3" name="mouseMoveOnCanvas" sig="mouseMoveOnCanvas(e: object)" />

<MemberMeta sourceHref="/source/utils/canvas-js/#L60" sourceLabel="canvas.js:60" />

Handles mouse move event on the canvas to dragged actor.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="clickoncanvas" depth="3" name="clickOnCanvas" sig="clickOnCanvas(e: object)" />

<MemberMeta sourceHref="/source/utils/canvas-js/#L119" sourceLabel="canvas.js:119" />

Handles click event on the canvas and displays the specific Form to edit the component.

**Parameters**

- `e` (object) — Event object

<MemberHeading
  id="linepointnearestmouse"
  depth="3"
  name="linepointNearestMouse"
  sig="linepointNearestMouse(
	line: object,
	x: number,
	y: number,
): object"
/>

<MemberMeta sourceHref="/source/utils/common-js/#L23" sourceLabel="common.js:23" />

Calculates the point on the line that's nearest to the mouse position.

https\://stackoverflow\.com/questions/24043967/detect-if-mouse-is-over-an-object-inside-canvas

**Parameters**

- `line` (object) — line with start and end point (x1,y1,x2,y2)
- `x` (number) — x position
- `y` (number) — y position

**Returns**

- `object`

<MemberHeading id="createtopology" depth="3" name="createTopology" sig="createTopology(ctx: object, conf: object)" />

<MemberMeta sourceHref="/source/utils/common-js/#L43" sourceLabel="common.js:43" />

Creates the topology shown on the canvas. A new scene with timer plus the parts defined in the configuration.

**Parameters**

- `ctx` (object) — canvas context
- `conf` (object) — configuration as JSON

<MemberHeading id="displayform" depth="3" name="displayForm" sig="displayForm(form: string)" />

<MemberMeta sourceHref="/source/utils/common-js/#L142" sourceLabel="common.js:142" />

Adds the CSS class to the selected one and remove it from all other ones.

**Parameters**

- `form` (string)

<MemberHeading id="addnewcomponent" depth="3" name="addNewComponent" sig="addNewComponent(e: object)" />

<MemberMeta sourceHref="/source/utils/common-js/#L161" sourceLabel="common.js:161" />

Decides which component have to be displayed to get created.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="findcircle" depth="3" name="findCircle" sig="findCircle(val: object, mx: number, my: number): object" />

<MemberMeta sourceHref="/source/utils/common-js/#L194" sourceLabel="common.js:194" />

Current mouse position inside of a cirle.

**Parameters**

- `val` (object) — can be Exchange or Queue object
- `mx` (number) — x position of the mouse
- `my` (number) — y position of the mouse

**Returns**

- `object`

<MemberHeading id="findsquare" depth="3" name="findSquare" sig="findSquare(val: object, mx: number, my: number): object" />

<MemberMeta sourceHref="/source/utils/common-js/#L212" sourceLabel="common.js:212" />

Current mouse position inside of a square.

**Parameters**

- `val` (object) — can be Producer or Consumer object
- `mx` (number) — x position of the mouse
- `my` (number) — y position of the mouse

**Returns**

- `object`

<MemberHeading id="findline" depth="3" name="findLine" sig="findLine(val: Binding, mx: number, my: number): object" />

<MemberMeta sourceHref="/source/utils/common-js/#L234" sourceLabel="common.js:234" />

Current mouse position over a line.

**Parameters**

- `val` ([Binding](/binding)) — Binding object
- `mx` (number) — x position of the mouse
- `my` (number) — y position of the mouse

**Returns**

- `object`

<MemberHeading id="findposition" depth="3" name="findPosition" sig="findPosition(e: object, line: *): object" />

<MemberMeta sourceHref="/source/utils/common-js/#L273" sourceLabel="common.js:273" />

Find the actor in the scene from the current mouse position.

**Parameters**

- `e` (object) — Event object
- `line` (\*, default: false)

**Returns**

- `object`

<MemberHeading id="displayconsumer" depth="3" name="displayConsumer" sig="displayConsumer(consumer: Consumer)" />

<MemberMeta sourceHref="/source/utils/consumer-js/#L8" sourceLabel="consumer.js:8" />

Display the form to create or edit consumer component.

**Parameters**

- `consumer` ([Consumer](/consumer)) — Consumer object

<MemberHeading id="hideconsumer" depth="3" name="hideConsumer" sig="hideConsumer(e: object)" />

<MemberMeta sourceHref="/source/utils/consumer-js/#L75" sourceLabel="consumer.js:75" />

Reset form values and remove CSS class from the consumer panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="sendconsumerform" depth="3" name="sendConsumerForm" sig="sendConsumerForm(e: object)" />

<MemberMeta sourceHref="/source/utils/consumer-js/#L89" sourceLabel="consumer.js:89" />

Sends the form to create or edit a consumer component.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="deleteconsumerform" depth="3" name="deleteConsumerForm" sig="deleteConsumerForm(e: object)" />

<MemberMeta sourceHref="/source/utils/consumer-js/#L152" sourceLabel="consumer.js:152" />

Remove consumer from the scene, render and remove CSS class from the consumer panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="displayexchange" depth="3" name="displayExchange" sig="displayExchange(exchange: Exchange)" />

<MemberMeta sourceHref="/source/utils/exchange-js/#L8" sourceLabel="exchange.js:8" />

Displays the form to create or edit exchange component.

**Parameters**

- `exchange` ([Exchange](/exchange)) — Exchange object

<MemberHeading id="sendexchangeform" depth="3" name="sendExchangeForm" sig="sendExchangeForm(e: object)" />

<MemberMeta sourceHref="/source/utils/exchange-js/#L68" sourceLabel="exchange.js:68" />

Sends the form to create or edit an exchange component.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="hideexchange" depth="3" name="hideExchange" sig="hideExchange(e: object)" />

<MemberMeta sourceHref="/source/utils/exchange-js/#L123" sourceLabel="exchange.js:123" />

Resets form values and remove CSS class from the exchange panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="deleteexchangeform" depth="3" name="deleteExchangeForm" sig="deleteExchangeForm(e: object)" />

<MemberMeta sourceHref="/source/utils/exchange-js/#L141" sourceLabel="exchange.js:141" />

Remove exchange from the scene, from the producers and the bindings to the exchange. Renders and removes CSS class from the exchange panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading
  id="finddestinationindex"
  depth="3"
  name="findDestinationIndex"
  sig="findDestinationIndex(
	exchanges: Array.<object>,
	queues: Array.<object>,
	val: object,
): number"
/>

<MemberMeta sourceHref="/source/utils/exports-js/#L14" sourceLabel="exports.js:14" />

Resolves the index of a binding destination, looking it up in the list of exchanges when the binding targets an exchange, otherwise in the queues.

**Parameters**

- `exchanges` (Array.\<object>) — actors of type Exchange
- `queues` (Array.\<object>) — actors of type Queue
- `val` (object) — Binding actor

**Returns**

- `number`

<MemberHeading id="exporttopology" depth="3" name="exportTopology" sig="exportTopology(e: object)" />

<MemberMeta sourceHref="/source/utils/exports-js/#L24" sourceLabel="exports.js:24" />

Export topology as config.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="exportcurl" depth="3" name="exportCurl" sig="exportCurl(e: object)" />

<MemberMeta sourceHref="/source/utils/exports-js/#L126" sourceLabel="exports.js:126" />

Export topology as curl statements.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="exportrabbitmqadmin" depth="3" name="exportRabbitmqadmin" sig="exportRabbitmqadmin(e: object)" />

<MemberMeta sourceHref="/source/utils/exports-js/#L201" sourceLabel="exports.js:201" />

Export topology as rabbitmqadmin statements.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="exportterraform" depth="3" name="exportTerraform" sig="exportTerraform(e: object)" />

<MemberMeta sourceHref="/source/utils/exports-js/#L272" sourceLabel="exports.js:272" />

Export topology as Terraform.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="exportasyncapi" depth="3" name="exportAsyncApi" sig="exportAsyncApi(e: object)" />

<MemberMeta sourceHref="/source/utils/exports-js/#L394" sourceLabel="exports.js:394" />

Export topology as AsyncApi.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="displayproducer" depth="3" name="displayProducer" sig="displayProducer(producer: Producer)" />

<MemberMeta sourceHref="/source/utils/producer-js/#L8" sourceLabel="producer.js:8" />

Display the form to create or edit a producer component.

**Parameters**

- `producer` ([Producer](/producer)) — Producer object

<MemberHeading id="sendproducerform" depth="3" name="sendProducerForm" sig="sendProducerForm(e: object)" />

<MemberMeta sourceHref="/source/utils/producer-js/#L85" sourceLabel="producer.js:85" />

Sends the form to create or edit a producer component.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="hideproducer" depth="3" name="hideProducer" sig="hideProducer(e: object)" />

<MemberMeta sourceHref="/source/utils/producer-js/#L165" sourceLabel="producer.js:165" />

Reset form values and remove CSS class from the producer panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="deleteproducerform" depth="3" name="deleteProducerForm" sig="deleteProducerForm(e: object)" />

<MemberMeta sourceHref="/source/utils/producer-js/#L186" sourceLabel="producer.js:186" />

Remove producer from the scene, render and remove CSS class from the producer panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="displayqueue" depth="3" name="displayQueue" sig="displayQueue(queue: Queue)" />

<MemberMeta sourceHref="/source/utils/queue-js/#L8" sourceLabel="queue.js:8" />

Display the form to create or edit queue component.

**Parameters**

- `queue` ([Queue](/queue)) — Queue object

<MemberHeading id="sendqueueform" depth="3" name="sendQueueForm" sig="sendQueueForm(e: object)" />

<MemberMeta sourceHref="/source/utils/queue-js/#L68" sourceLabel="queue.js:68" />

Sends the form to create or edit an queue component.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="hidequeue" depth="3" name="hideQueue" sig="hideQueue(e: object)" />

<MemberMeta sourceHref="/source/utils/queue-js/#L123" sourceLabel="queue.js:123" />

Reset form values and remove CSS class from the queue panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="deletequeueform" depth="3" name="deleteQueueForm" sig="deleteQueueForm(e: object)" />

<MemberMeta sourceHref="/source/utils/queue-js/#L143" sourceLabel="queue.js:143" />

Removes queue from the scene, render and remove CSS class from the queue panel.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="getsettings" depth="3" name="getSettings" sig="getSettings(): object" />

<MemberMeta sourceHref="/source/utils/settings-js/#L20" sourceLabel="settings.js:20" />

Gets the settings from loacalStorage and parse it as JSON.

**Returns**

- `object` — settings - settings as JSON from localStorage.

<MemberHeading id="setsettings" depth="3" name="setSettings" sig="setSettings(settings: object)" />

<MemberMeta sourceHref="/source/utils/settings-js/#L35" sourceLabel="settings.js:35" />

Sets the current settings in localStorage.

**Parameters**

- `settings` (object) — settings as JSON to set in localStorage.

<MemberHeading id="changesettingstab" depth="3" name="changeSettingsTab" sig="changeSettingsTab(Event: Object)" />

<MemberMeta sourceHref="/source/utils/settings-js/#L44" sourceLabel="settings.js:44" />

Hide and show tab links and the content for it.

**Parameters**

- `Event` (Object)

<MemberHeading id="displaysettings" depth="3" name="displaySettings" sig="displaySettings(binding: Binding)" />

<MemberMeta sourceHref="/source/utils/settings-js/#L79" sourceLabel="settings.js:79" />

Display the form to edit settings.

**Parameters**

- `binding` ([Binding](/binding)) — Binding object

<MemberHeading id="sendsettingsform" depth="3" name="sendSettingsForm" sig="sendSettingsForm(e: object)" />

<MemberMeta sourceHref="/source/utils/settings-js/#L104" sourceLabel="settings.js:104" />

Sends the form to set settings.

**Parameters**

- `e` (object) — Event object

<MemberHeading id="hidesettings" depth="3" name="hideSettings" sig="hideSettings(e: object)" />

<MemberMeta sourceHref="/source/utils/settings-js/#L136" sourceLabel="settings.js:136" />

Reset form values and remove CSS class from the settings panel.

**Parameters**

- `e` (object) — Event object

## Other

<MemberHeading id="examples" depth="3" name="Examples" sig="Examples: Object.<string, {description: string, producers: Array.<Object>, consumers: Array.<Object>, exchanges: Array.<Object>, queues: Array.<Object>, bindings: Array.<Object>}>" />

<MemberMeta sourceHref="/source/examples-js/#L10" sourceLabel="examples.js:10" />

Pre-built topology examples shown in the example selector.

Each entry is a full topology config object with a description, producers, consumers, exchanges, queues and bindings. The objects can be passed directly to [createTopology](/global#createtopology).
