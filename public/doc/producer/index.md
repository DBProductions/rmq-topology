---
title: Producer
kind: class
longname: Producer
description: Producer class represents a component that publishs against exchanges.
---

# Producer

**Extends:&#x20;**[`BaseComponent`](/basecomponent)

<SourceLink href="/source/producer-js/#L36" label="producer.js:36" />

Producer class represents a component that publishs against exchanges.

**Properties**

- `width` (number) — Width of the square
- `height` (number) — Height of the square

---

## Constructor

<Signature
  code="new Producer(
	x: number,
	y: number,
	name: string,
	publishes: object | Array,
): Producer"
/>

**Parameters**

- `x` (number) — x position of the producer
- `y` (number) — y position of the producer
- `name` (string) — optional identifier
- `publishes` (object | Array) — list of exchanges to publish to

---

## Instance Methods

<MemberHeading id="removeexchange" depth="3" name="removeExchange" sig="removeExchange(exchange: Exchange)" />

<MemberMeta sourceHref="/source/producer-js/#L57" sourceLabel="producer.js:57" />

Removes the exchange from the list.

**Parameters**

- `exchange` ([Exchange](/exchange)) — Exchange object

<MemberHeading
  id="addmessagetoexchange"
  depth="3"
  name="addMessageToExchange"
  sig="addMessageToExchange(
	exchange: Exchange,
	routingKey: string,
	message: Object,
)"
/>

<MemberMeta sourceHref="/source/producer-js/#L72" sourceLabel="producer.js:72" />

Adds a message to an exchange.

**Parameters**

- `exchange` ([Exchange](/exchange)) — Exchange object
- `routingKey` (string) — routing key
- `message` (Object) — JSON message with headers and body

<MemberHeading
  id="exchangewithroutingkeyexists"
  depth="3"
  name="exchangeWithRoutingKeyExists"
  sig="exchangeWithRoutingKeyExists(
	exchange: Exchange,
	routingKey: string,
)"
/>

<MemberMeta sourceHref="/source/producer-js/#L121" sourceLabel="producer.js:121" />

Checks for exchange in combination with routing key to exists.

**Parameters**

- `exchange` ([Exchange](/exchange)) — Exchange object
- `routingKey` (string) — routing key

<MemberHeading id="update" depth="3" name="update" sig="update(dt: number)" />

<MemberMeta sourceHref="/source/producer-js/#L138" sourceLabel="producer.js:138" />

Determines at which time a new message be published.

**Parameters**

- `dt` (number) — delta time from the timer

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/producer-js/#L178" sourceLabel="producer.js:178" />

Render the producer and draw lines to every exchange from the list.

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
