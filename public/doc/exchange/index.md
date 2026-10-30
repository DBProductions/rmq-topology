---
title: Exchange
kind: class
longname: Exchange
description: Exchange class represents a component which receives messages and route them to queues.
---

# Exchange

**Extends:&#x20;**[`BaseComponent`](/basecomponent)

<SourceLink href="/source/exchange-js/#L35" label="exchange.js:35" />

Exchange class represents a component which receives messages and route them to queues.

**Properties**

- `radius` (number) — Has a constant value of 15
- `bindings` (object) — List of bindings to the exchange

---

## Constructor

<Signature
  code="new Exchange(
	x: number,
	y: number,
	name: string,
	type: string,
	alternate: Exchange,
): Exchange"
/>

**Parameters**

- `x` (number) — x position of the exchange
- `y` (number) — y position of the exchange
- `name` (string) — identifier
- `type` (string) — exchange type, `direct` as default
- `alternate` ([Exchange](/exchange)) — alternate exchange

---

## Instance Methods

<MemberHeading id="setalternate" depth="3" name="setAlternate" sig="setAlternate(alternate: Exchange)" />

<MemberMeta sourceHref="/source/exchange-js/#L49" sourceLabel="exchange.js:49" />

Sets alternate exchange for exchange.

**Parameters**

- `alternate` ([Exchange](/exchange)) — alternate exchange

<MemberHeading id="removebinding" depth="3" name="removeBinding" sig="removeBinding(binding: Binding)" />

<MemberMeta sourceHref="/source/exchange-js/#L58" sourceLabel="exchange.js:58" />

Removes a binding from the exchange.

**Parameters**

- `binding` ([Binding](/binding)) — Binding object

<MemberHeading id="messagearrived" depth="3" name="messageArrived" sig="messageArrived(msg: ExchangeMessage | BindingMessage)" />

<MemberMeta sourceHref="/source/exchange-js/#L82" sourceLabel="exchange.js:82" />

Handler for arriving messages.

Routes only over outbound bindings so an exchange-to-exchange binding is not echoed back to its source. Incoming messages carry their routing key and accumulate depth per exchange hop; the chain is aborted once the maximum depth is exceeded to guard against binding cycles.

**Parameters**

- `msg` ([ExchangeMessage](/exchangemessage) | [BindingMessage](/bindingmessage))

<MemberHeading id="render" depth="3" name="render" sig="render()" />

<MemberMeta sourceHref="/source/exchange-js/#L155" sourceLabel="exchange.js:155" />

Render the exchange.

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
