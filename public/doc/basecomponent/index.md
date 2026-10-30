---
title: BaseComponent
kind: class
longname: BaseComponent
description: Base component class for other components. It generates the UUID to identify the component and set default values.
---

# BaseComponent

**Extends:&#x20;**[`Base`](/base)

<SourceLink href="/source/basecomponent-js/#L12" label="basecomponent.js:12" />

Base component class for other components. It generates the UUID to identify the component and set default values.

---

## Constructor

<Signature code="new BaseComponent(x: number, y: number): BaseComponent" />

**Parameters**

- `x` (number) — x position
- `y` (number) — y position

---

## Instance Methods

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
