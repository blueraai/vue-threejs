# vue-three-fiber

`vue-three-fiber` is a Vue 3 custom renderer for [Three.js](https://threejs.org/).

It provides declarative Three.js scene authoring for Vue with explicit object handles, render lifecycle composables, DOM/scene slot composition, and reactive demand-render helpers.

Requires `vue >= 3.3` and `three >= 0.156`.

## Why

- Declarative Three.js scene authoring with Vue components and composables
- Familiar core APIs: `Canvas`, `useFrame`, `useThree`, `useLoader`, `createPortal`
- Vue-native additions: `useObjectRef`, `useRenderCommit`, `useNextFrame`, `watchInvalidate`
- DOM and 3D stay in one app through slots and `provide` / `inject`
- Demand rendering, loader caching, portals, and a test renderer are included

## Installation

```bash
npm install @vue-three/fiber three
```

## Quick Start

Composables like `useFrame` and `useObjectRef` must be used inside components rendered within `<Canvas>`.

`RotatingBox.vue`:

```vue
<script setup lang="ts">
import type { Mesh } from 'three'
import { useFrame, useObjectRef } from '@vue-three/fiber'

const box = useObjectRef<Mesh>()

useFrame((_, delta) => {
  if (box.object.value) {
    box.object.value.rotation.x += delta
    box.object.value.rotation.y += delta * 0.5
  }
})
</script>

<template>
  <mesh :ref="box.ref">
    <boxGeometry />
    <meshStandardMaterial color="orange" />
  </mesh>
</template>
```

`App.vue`:

```vue
<script setup lang="ts">
import { Canvas } from '@vue-three/fiber'
import RotatingBox from './RotatingBox.vue'
</script>

<template>
  <Canvas>
    <ambientLight :intensity="0.5" />
    <pointLight :position="[10, 10, 10]" />
    <RotatingBox />
  </Canvas>
</template>
```

## Core APIs

- `Canvas`: sets up the renderer, scene, camera, events, and slots
- `useFrame(callback, priority?)`: run logic on each rendered frame
- `useThree(selector?)`: access renderer state as reactive `ShallowRef`s
- `useLoader(loader, input, extensions?, onProgress?)`: load and cache assets
- `useObjectRef<T>()`: get raw `THREE.Object3D` access without relying on proxy identity
- `useRenderCommit()`: wait for Vue flush plus scene render
- `useNextFrame()`: wait for the next rendered frame
- `useAfterRender(callback)`: register a Vue-scoped post-render callback
- `watchInvalidate(source, options?)`: connect Vue reactivity to `frameloop="demand"`
- `createPortal(...)`: render into another scene container
- `flushSync(fn)`: compatibility export for synchronous scene flushing

## Compatibility Notes

- Template refs are proxy-backed handles, not raw `THREE.Object3D` identity. Property access, method calls, and `instanceof` work directly. Use `useObjectRef` when you need the actual object.
- Vue Suspense keeps previous content visible during async re-entrance. Use explicit loading and scene transition patterns when you need tighter control.
- For new async coordination code, prefer `useRenderCommit` and `useNextFrame` over centering everything on `flushSync`.

## Docs

- [Introduction](https://docs.pmnd.rs/vue-three-fiber/getting-started/introduction)
- [Vue Divergences](https://docs.pmnd.rs/vue-three-fiber/advanced/vue-divergences)
- [Object Handles](https://docs.pmnd.rs/vue-three-fiber/tutorials/object-handles)
- [Demand Rendering](https://docs.pmnd.rs/vue-three-fiber/tutorials/demand-rendering)
- [DOM Overlays](https://docs.pmnd.rs/vue-three-fiber/tutorials/dom-overlays)
- [Scene Transitions](https://docs.pmnd.rs/vue-three-fiber/tutorials/scene-transitions)

## Status

The current direction is:

- explicit documentation for renderer constraints and platform behaviors
- Vue-native APIs for object access, async render coordination, and DOM/scene composition
- a standalone Vue/Three authoring model rather than inherited framework branding

## Credits

Built within the [Poimandres](https://github.com/pmndrs) ecosystem.
