---
title: Additional Exports
---

| export               | usage                                                          |
| -------------------- | -------------------------------------------------------------- |
| `addEffect`          | Adds a global render callback which is called each frame       |
| `addAfterEffect`     | Adds a global after-render callback which is called each frame |
| `addTail`            | Adds a global callback which is called when rendering stops    |
| `buildGraph`         | Collects nodes and materials from a THREE.Object3D             |
| `flushGlobalEffects` | Flushes global render-effects for when manually driving a loop |
| `invalidate`         | Forces view global invalidation                                |
| `advance`            | Advances the frameloop (given that it's set to 'never')        |
| `extend`             | Extends the native-object catalogue                            |
| `createPortal`       | Creates a portal (re-parenting for the scene graph)            |
| `createRoot`         | Creates a root that can render three content into a canvas     |
| `events`             | Dom pointer-event system                                       |
| `applyProps`         | `applyProps(element, props)` sets element properties,          |
| `useInstanceHandle`  | Exposes renderer-internal local state from the instance        |
| `flushSync`          | Synchronously flushes pending reactive updates to the scene    |
| `useObjectRef`       | Typed ref callback for direct THREE.Object3D access            |
| `useAfterRender`     | Vue-scoped post-render callback, cleaned up on unmount         |
| `useNextFrame`       | Returns a function that resolves after one rendered frame      |
| `useRenderCommit`    | Waits for Vue updates and scene to commit                      |
| `watchInvalidate`    | Watches reactive sources and invalidates the render on change  |
