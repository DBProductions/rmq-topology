---
title: RejectMessage
kind: class
longname: RejectMessage
description: Message object when a message gets rejected from consumer.
---

# RejectMessage

**Extends:&#x20;**[`BaseMessage`](/basemessage)

<SourceLink href="/source/messages/rejectmessage-js/#L14" label="rejectmessage.js:14" />

Message object when a message gets rejected from consumer.

**Properties**

- `targetX` (number) — x of the consumer
- `targetY` (number) — y of the consumer

---

## Constructor

<Signature
  code="new RejectMessage(
	x: number,
	y: number,
	queue: Queue,
): RejectMessage"
/>

**Parameters**

- `x` (number) — x position of the message
- `y` (number) — y position of the message
- `queue` ([Queue](/queue)) — Queue object

---

## Instance Methods

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
