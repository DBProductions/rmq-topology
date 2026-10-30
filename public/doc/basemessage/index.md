---
title: BaseMessage
kind: class
longname: BaseMessage
description: Base message class for other messages.
---

# BaseMessage

**Extends:&#x20;**[`Base`](/base)

<SourceLink href="/source/messages/basemessage-js/#L19" label="basemessage.js:19" />

Base message class for other messages.

**Properties**

- `id` (string) — unique identifier
- `x` (number) — x position
- `y` (number) — y position
- `message` (Object) — message object
  - `message.headers` (Object) — message headers
  - `message.body` (Object) — message body

---

## Constructor

<Signature
  code="new BaseMessage(
	x: number,
	y: number,
	radius: integer,
	fillStyle: string,
): BaseMessage"
/>

**Parameters**

- `x` (number) — x position
- `y` (number) — y position
- `radius` (integer) — radius of the circle
- `fillStyle` (string) — hex color code to fill the circle

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

Moves the message toward a target position. Calls onArrival when reached.

**Parameters**

- `targetX` (number)
- `targetY` (number)
- `onArrival` (function)

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/messages/basemessage-js/#L55" sourceLabel="basemessage.js:55" />

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
