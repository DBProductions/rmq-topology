---
title: Queue
kind: class
longname: Queue
description: Queue class represents a component which keeps the messages until they are consumed.
---

# Queue

**Extends:&#x20;**[`BaseComponent`](/basecomponent)

<SourceLink href="/source/queue-js/#L23" label="queue.js:23" />

Queue class represents a component which keeps the messages until they are consumed.

**Properties**

- `bindings` (object) — List of bindings to the queue
- `consumers` (object) — List of connected consumers
- `messages` (object) — List of messages in the queue

---

## Constructor

<Signature
  code="new Queue(
	x: number,
	y: number,
	name: string,
	type: string,
	ttl: number,
	dlx: Exchange,
	dlxrk: string,
	maxLength: number,
): Queue"
/>

**Parameters**

- `x` (number) — x position of the queue
- `y` (number) — y position of the queue
- `name` (string) — optional identifier
- `type` (string) — optional identifier, `quorum` as default
- `ttl` (number) — `x-message-ttl` Argument of the queue
- `dlx` ([Exchange](/exchange)) — Exchange object as `x-dead-letter-exchange` argument
- `dlxrk` (string) — String as `x-dead-letter-routing-key` argument
- `maxLength` (number) — `x-max-length` argument of the queue

---

## Instance Methods

<MemberHeading id="addconsumer" depth="3" name="addConsumer" sig="addConsumer(consumer: Consumer)" />

<MemberMeta sourceHref="/source/queue-js/#L43" sourceLabel="queue.js:43" />

Adds a consumer to the queue.

**Parameters**

- `consumer` ([Consumer](/consumer)) — Consumer object

<MemberHeading id="removeconsumer" depth="3" name="removeConsumer" sig="removeConsumer(consumer: Consumer)" />

<MemberMeta sourceHref="/source/queue-js/#L73" sourceLabel="queue.js:73" />

Removes a consumer from the queue.

**Parameters**

- `consumer` ([Consumer](/consumer)) — Consumer object

<MemberHeading id="messagearrived" depth="3" name="messageArrived" sig="messageArrived(msg: QueueMessage)" />

<MemberMeta sourceHref="/source/queue-js/#L89" sourceLabel="queue.js:89" />

Handler for arriving messages.

**Parameters**

- `msg` ([QueueMessage](/queuemessage)) — QueueMessage object

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
