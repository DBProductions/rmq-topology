---
title: AlternateMessage
kind: class
longname: AlternateMessage
description: Message object between exchange and exchange.
---

# AlternateMessage

**Extends:&#x20;**[`BaseMessage`](/basemessage)

<SourceLink href="/source/messages/alternatemessage-js/#L15" label="alternatemessage.js:15" />

Message object between exchange and exchange.

**Properties**

- `targetX` (number) — x of the binding destination
- `targetY` (number) — y of the binding destination

---

## Constructor

<Signature
  code="new AlternateMessage(
	x: number,
	y: number,
	exchange: Exchange,
	fillColor: string,
): AlternateMessage"
/>

**Parameters**

- `x` (number) — x position of the message
- `y` (number) — y position of the message
- `exchange` ([Exchange](/exchange)) — Binding object
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
