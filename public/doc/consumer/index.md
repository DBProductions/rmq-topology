---
title: Consumer
kind: class
longname: Consumer
description: Consumer class represents a component which consumes messages from a queue.
---

# Consumer

**Extends:&#x20;**[`BaseComponent`](/basecomponent)

<SourceLink href="/source/consumer-js/#L19" label="consumer.js:19" />

Consumer class represents a component which consumes messages from a queue.

**Properties**

- `arrivedMessages` (number) — Number of arrived messages
- `width` (number) — Width of the square
- `height` (number) — Height of the square
- `queues` (object) — List of queues to the consumer

---

## Constructor

<Signature
  code="new Consumer(
	x: number,
	y: number,
	name: string,
	consumes: *,
	mode: string,
): Consumer"
/>

**Parameters**

- `x` (number) — x position of the consumer
- `y` (number) — y position of the consumer
- `name` (string) — optional identifier
- `consumes` (\*)
- `mode` (string) — ack or reject

---

## Instance Methods

<MemberHeading id="addqueue" depth="3" name="addQueue" sig="addQueue(queue: Queue)" />

<MemberMeta sourceHref="/source/consumer-js/#L35" sourceLabel="consumer.js:35" />

Adds a queue to the list.

**Parameters**

- `queue` ([Queue](/queue)) — Queue object

<MemberHeading id="removequeue" depth="3" name="removeQueue" sig="removeQueue(queue: Queue)" />

<MemberMeta sourceHref="/source/consumer-js/#L48" sourceLabel="consumer.js:48" />

Removes a queue from the list or empty the list.

**Parameters**

- `queue` ([Queue](/queue)) — Queue object

<MemberHeading id="messagearrived" depth="3" name="messageArrived" sig="messageArrived(msg: QueueMessage)" />

<MemberMeta sourceHref="/source/consumer-js/#L64" sourceLabel="consumer.js:64" />

Handler for arriving messages. Checks the mode and reject or count the arrived messages and remove it from the scene.

**Parameters**

- `msg` ([QueueMessage](/queuemessage)) — message object

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/consumer-js/#L80" sourceLabel="consumer.js:80" />

Render the consumer and draw lines to every queue from the list.

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
