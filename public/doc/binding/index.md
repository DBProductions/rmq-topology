---
title: Binding
kind: class
longname: Binding
description: Binging class represents the binding between an exchange and a queue, or between two exchanges.
---

# Binding

**Extends:&#x20;**[`BaseComponent`](/basecomponent)

<SourceLink href="/source/binding-js/#L14" label="binding.js:14" />

Binging class represents the binding between an exchange and a queue, or between two exchanges.

---

## Constructor

<Signature
  code="new Binding(
	source: object,
	destination: object,
	routingKey: string,
): Binding"
/>

**Parameters**

- `source` (object)
- `destination` (object)
- `routingKey` (string) — used routing key

---

## Instance Methods

<MemberHeading id="setcoords" depth="3" name="setCoords" sig="setCoords()" />

<MemberMeta sourceHref="/source/binding-js/#L31" sourceLabel="binding.js:31" />

Sets x1, x2, y1 and y2 for the source and destination property.

<MemberHeading id="drawlabel" depth="3" name="drawLabel" sig="drawLabel(text: string)" />

<MemberMeta sourceHref="/source/binding-js/#L43" sourceLabel="binding.js:43" />

http\://phrogz.net/tmp/canvas_rotated_text.html

**Parameters**

- `text` (string) — text to draw as label

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/binding-js/#L61" sourceLabel="binding.js:61" />

Renders the line between bind components. Exchange-to-exchange bindings are rendered dashed to distinguish them.

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
