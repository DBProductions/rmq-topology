---
title: QueueMessage
kind: class
longname: QueueMessage
description: Message object between queue and consumer.
---

# QueueMessage

**Extends:&#x20;**[`BaseMessage`](/basemessage)

<SourceLink href="/source/messages/queuemessage-js/#L19" label="queuemessage.js:19" />

Message object between queue and consumer.

**Properties**

- `targetX` (number) — x of the consumer
- `targetY` (number) — y of the consumer

---

## Constructor

<Signature
  code="new QueueMessage(
	x: number,
	y: number,
	queue: Queue,
	consumer: Consumer,
	fillStyle: string,
	message: Object,
	routingKey: string,
	exchange: Exchange,
): QueueMessage"
/>

**Parameters**

- `x` (number) — x position of the message
- `y` (number) — y position of the message
- `queue` ([Queue](/queue)) — Queue object
- `consumer` ([Consumer](/consumer)) — Consumer object
- `fillStyle` (string)
- `message` (Object) — message object with headers and body
- `routingKey` (string) — routing key used to deliver the message
- `exchange` ([Exchange](/exchange)) — exchange that routed the message

---

## Instance Methods

<MemberHeading id="setconsumer" depth="3" name="setConsumer" sig="setConsumer(consumer: Consumer)" />

<MemberMeta sourceHref="/source/messages/queuemessage-js/#L44" sourceLabel="queuemessage.js:44" />

Sets the consumer with coordinates.

**Parameters**

- `consumer` ([Consumer](/consumer)) — Consumer object

<MemberHeading
  id="movetotarget"
  depth="3"
  name="moveToTarget"
  sig="moveToTarget(
	targetX: number,
	targetY: number,
	onArrival: function,
)"
/>

<MemberMeta sourceHref="/source/messages/basemessage-js/#L40" sourceLabel="basemessage.js:40" />

_Inherited from `BaseMessage#moveToTarget`_

Moves the message toward a target position. Calls onArrival when reached.

**Parameters**

- `targetX` (number)
- `targetY` (number)
- `onArrival` (function)

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/messages/basemessage-js/#L55" sourceLabel="basemessage.js:55" />

_Inherited from `BaseMessage#render`_

Renders a circle representing the message.

<MemberHeading id="addtoscene" depth="3" name="addToScene" sig="addToScene(scene: Scene): object" />

<MemberMeta sourceHref="/source/base-js/#L19" sourceLabel="base.js:19" />

_Inherited from `Base#addToScene`_

Add an object as actor to scene.

**Parameters**

- `scene` ([Scene](/scene)) — scene on canvas

**Returns**

- `object` — this

<MemberHeading id="createuuid" depth="3" name="createUUID" sig="createUUID(): string" />

<MemberMeta sourceHref="/source/base-js/#L31" sourceLabel="base.js:31" />

_Inherited from `Base#createUUID`_

Generates an UUID, used to identify every object in the scene.\
https\://www\.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-253.php

**Returns**

- `string`
