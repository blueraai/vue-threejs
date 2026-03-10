---
title: 'v9 Migration Guide'
description: Changes and new features with v9
---

This is a compatibility release which brings further performance, stability, and type improvements.

## Features

### useLoader Accepts Loader Instance

`useLoader` now supports re-use of external loader instances for more controlled pooling and setup.

```js
import { GLTFLoader } from 'three/addons'
import { useLoader } from '@vue-three/fiber'

// Inside a component rendered within Canvas:
const gltf = useLoader(GLTFLoader, '/path/to/model.glb')

// or,

const loader = new GLTFLoader()
const gltf = useLoader(loader, '/path/to/model.glb')
```

### Factory extend Signature

`extend` can now produce a component when a three.js class is passed to it individually instead of a catalog of named classes. This is backwards compatible and reduces TypeScript boilerplate and namespace collisions. We recommend libraries migrate to this signature so internal components don't clash with user-land declarations.

```ts
import { OrbitControls } from 'three/addons'
import { type ThreeElement, type ThreeElements } from '@vue-three/fiber'

declare module '@vue-three/fiber' {
  interface ThreeElements {
    orbitControls: ThreeElement<typeof OrbitControls>
  }
}

extend({ OrbitControls })
```

```vue
<template>
  <orbitControls :args="[camera, gl.domElement]" />
</template>
```

Or using the factory signature:

```ts
const Controls = extend(OrbitControls)
```

```vue
<template>
  <Controls :args="[camera, gl.domElement]" />
</template>
```

### Async GL prop

The Canvas GL prop accepts constructor parameters, properties, or a renderer instance via a callback. The callback now passes constructor parameters instead of just a canvas reference.

```diff
<Canvas
  gl={{ reverseDepthBuffer: true }}
- gl={(canvas) => new WebGLRenderer({ canvas })}
+ gl={(props) => new WebGLRenderer(props)}
>
```

Further, a callback passed to GL can now return a promise for async constructors like `WebGPURenderer` (see [WebGPU](#webgpu)).

```ts
<Canvas
  :gl="async (props) => {
    // ...
    return renderer
  }"
>
```

## WebGPU

Recent Three.js now includes a WebGPU renderer. While still a work in progress and not fully backward-compatible with all of Three's features, the renderer requires an async initialization method. V3F streamlines this by allowing the gl prop to return a promise.

```vue
<script setup lang="ts">
import * as THREE from 'three/webgpu'
import * as TSL from 'three/tsl'
import { Canvas, extend, useFrame, useThree } from '@vue-three/fiber'

extend(THREE as any)
</script>

<template>
  <Canvas
    :gl="async (props) => {
      const renderer = new THREE.WebGPURenderer(props as any)
      await renderer.init()
      return renderer
    }">
    <mesh>
      <meshBasicNodeMaterial />
      <boxGeometry />
    </mesh>
  </Canvas>
</template>
```

## Fixes

### Color Management of Textures

Automatic sRGB conversion of texture props has been removed. Color textures are now handled automatically for built-in materials, aligning with vanilla Three.js behavior. This prevents issues where data textures (e.g., normals or displacement) become corrupted or non-linear. For custom materials or shaders, annotate color textures with `texture.colorSpace = THREE.SRGBColorSpace` or `:texture-colorSpace="THREE.SRGBColorSpace"` in templates.

For more details, see https://threejs.org/docs/#manual/en/introduction/Color-management.

### Suspense and Side-Effects

The handling of Suspense and fallback content has improved. Side-effects like attach and constructor effects (e.g., controls adding event listeners) no longer fire repeatedly without proper cleanup during suspension.

```vue
<script setup lang="ts">
import { useThree } from '@vue-three/fiber'
import { OrbitControls } from 'three/addons'
import { extend, ThreeElement } from '@vue-three/fiber'

extend({ OrbitControls })

const camera = useThree((state) => state.camera)
const gl = useThree((state) => state.gl)
</script>

<template>
  <Suspense>
    <!-- Will only initialize when tree is connected to screen -->
    <orbitControls :args="[camera, gl.domElement]" />
    <AsyncComponent />
  </Suspense>
</template>
```

### Swapping with args and primitives

Swapping elements when changing the `args` or primitive `object` prop has been improved for structured children like arrays or iterators. Previously, primitives sharing an object could update out of order or be removed from the scene along with their children.

Swapping behavior has been improved to correctly handle structured children and prevent out-of-order updates.

## TypeScript Changes

### Props renamed to CanvasProps

Canvas `Props` is now called `CanvasProps` for clarity.

```diff
-function Canvas(props: Props)
+function Canvas(props: CanvasProps)
```

### Dynamic Types

Since v8, we've added a catalog of known elements to a `ThreeElements` interface, and with v9 automatically map three API to types. As types are now dynamically mapped, hardcoded exports like `MeshProps` have been removed, and can be accessed as `ThreeElements['mesh']`. Helper types like `Color` or `Vector3` remain to reflect the shorthand expression API.

```diff
-import { MeshProps } from '@vue-three/fiber'
-type Props = MeshProps

+import { ThreeElements } from '@vue-three/fiber'
+type Props = ThreeElements['mesh']
```

### Node Helpers

Specialized `Node` type helpers for extending elements (`Node`, `Object3DNode`, `BufferGeometryNode`, `MaterialNode`, `LightNode`) are removed and combined into 'ThreeElement', which accepts a single type representing the extended element instance.

```ts
import { type ThreeElement } from '@vue-three/fiber'

declare module '@vue-three/fiber' {
  interface ThreeElements {
    customElement: ThreeElement<typeof CustomElement>
  }
}

extend({ CustomElement })
```

### ThreeElements

`ThreeElements` is an interface and is the current way of declaring or accessing element types within V3F. All types belonging to V3F are accessible from `ThreeElements`.

```diff
-import { type Node } from '@vue-three/fiber'
-
-declare global {
-  namespace JSX {
-    interface IntrinsicElements {
-      customElement: Node<CustomElement, typeof CustomElement>
-    }
-  }
-}
-
-extend({ CustomElement })

+import { type ThreeElement } from '@vue-three/fiber'
+
+declare module '@vue-three/fiber' {
+  interface ThreeElements {
+    customElement: ThreeElement<typeof CustomElement>
+  }
+}
+
+extend({ CustomElement })
```

## Testing

### Act

`act` can be used for all renderers. It will return the contents of a passed async callback like before and recursively flush async effects to synchronously test output.

```ts
import { createRoot } from '@vue-three/fiber'

const store = await act(async () => createRoot(canvas).render(h(App)))
console.log(store.getState())
```
