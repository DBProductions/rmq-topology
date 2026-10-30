---
title: Base
kind: class
longname: Base
description: Base class for all other components.
---

# Base

<SourceLink href="/source/base-js/#L8" label="base.js:8" />

Base class for all other components.

---

## Constructor

<Signature code="new Base(x: number, y: number): Base" />

**Parameters**

- `x` (number) — x position
- `y` (number) — y position

---

## Instance Methods

<MemberHeading id="addtoscene" depth="3" name="addToScene" sig="addToScene(scene: Scene): object" />

<MemberMeta sourceHref="/source/base-js/#L19" sourceLabel="base.js:19" />

Add an object as actor to scene.

**Parameters**

- `scene` ([Scene](/scene)) — scene on canvas

**Returns**

- `object` — this

<MemberHeading id="createuuid" depth="3" name="createUUID" sig="createUUID(): string" />

<MemberMeta sourceHref="/source/base-js/#L31" sourceLabel="base.js:31" />

Generates an UUID, used to identify every object in the scene.\
https\://www\.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-253.php

**Returns**

- `string`
