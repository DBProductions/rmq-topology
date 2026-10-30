---
title: Scene
kind: class
longname: Scene
description: The scene includes the actors and call their update and render methods.
---

# Scene

<SourceLink href="/source/scene-js/#L11" label="scene.js:11" />

The scene includes the actors and call their update and render methods.

---

## Constructor

<Signature code="new Scene(ctx: *, width: number, height: number): Scene" />

**Parameters**

- `ctx` (\*) — context of the canvas
- `width` (number) — width of the canvas
- `height` (number) — height of the canvas

---

## Instance Methods

<MemberHeading id="addactor" depth="3" name="addActor" sig="addActor(actor: Object)" />

<MemberMeta sourceHref="/source/scene-js/#L25" sourceLabel="scene.js:25" />

Add an actor to the scene.

**Parameters**

- `actor` (Object)

<MemberHeading id="removeactor" depth="3" name="removeActor" sig="removeActor(actor: Object)" />

<MemberMeta sourceHref="/source/scene-js/#L34" sourceLabel="scene.js:34" />

Remove an actor from the scene.

**Parameters**

- `actor` (Object)

<MemberHeading id="getidinscene" depth="3" name="getIdInScene" sig="getIdInScene(id: string)" />

<MemberMeta sourceHref="/source/scene-js/#L46" sourceLabel="scene.js:46" />

Get object to id from scene.

**Parameters**

- `id` (string)

<MemberHeading id="getobjectsinscene" depth="3" name="getObjectsInScene" sig="getObjectsInScene(obj: string)" />

<MemberMeta sourceHref="/source/scene-js/#L61" sourceLabel="scene.js:61" />

Get objects based on the obj constructor.

**Parameters**

- `obj` (string)

<MemberHeading id="purge" depth="3" name="purge" sig="purge()" />

<MemberMeta sourceHref="/source/scene-js/#L74" sourceLabel="scene.js:74" />

Empty the scene with setting and empty list as actors.

<MemberHeading id="update" depth="3" name="update" sig="update(dt: number)" />

<MemberMeta sourceHref="/source/scene-js/#L83" sourceLabel="scene.js:83" />

Iterates over the actors and call their update method.

**Parameters**

- `dt` (number)

<MemberHeading id="render" depth="3" name="render" sig="render(dt: number)" />

<MemberMeta sourceHref="/source/scene-js/#L94" sourceLabel="scene.js:94" />

It renders first the binding and then the rest for a better visual effect.

**Parameters**

- `dt` (number)
