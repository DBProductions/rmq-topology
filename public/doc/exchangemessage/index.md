---
title: ExchangeMessage
kind: class
longname: ExchangeMessage
description: Message object between producer and exchange. The exchange receives this messages and route with another message.
---

# ExchangeMessage

**Extends:&#x20;**[`BaseMessage`](/basemessage)

<SourceLink href="/source/messages/exchangemessage-js/#L19" label="exchangemessage.js:19" />

Message object between producer and exchange.\
The exchange receives this messages and route with another message.

**Properties**

- `targetX` (number) — x of the exchange
- `targetY` (number) — y of the exchange

---

## Constructor

<Signature
  code="new ExchangeMessage(
	x: number,
	y: number,
	exchange: Exchange,
	routingKey: string,
	rejected: boolean,
	radius: number,
	fillColor: string,
): ExchangeMessage"
/>

**Parameters**

- `x` (number) — x position of the message
- `y` (number) — y position of the message
- `exchange` ([Exchange](/exchange)) — Exchange object
- `routingKey` (string) — routing key of the message
- `rejected` (boolean) — rejected message
- `radius` (number) — radius of the circle
- `fillColor` (string) — hex color code to fill the circle

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
