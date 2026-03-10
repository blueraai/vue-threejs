---
title: 'Events and Interaction'
description: Let's make our meshes react to user input.
---

This tutorial will assume some Vue knowledge, and will be based on [this starter codesandbox](https://codesandbox.io/s/getting-started-01-12q81?from-embed), so just fork it and follow along!

After we have our continuous loop running the next step would be to allow our mesh to react to user interaction, so in this part let's attach a click handler to the cube and make it bigger on click.

## User Interaction

Any Object3D that has a raycast method can receive a large number of events, for instance a mesh:

```vue
<template>
  <mesh
    @click="(e) => console.log('click')"
    @context-menu="(e) => console.log('context menu')"
    @double-click="(e) => console.log('double click')"
    @wheel="(e) => console.log('wheel spins')"
    @pointer-up="(e) => console.log('up')"
    @pointer-down="(e) => console.log('down')"
    @pointer-over="(e) => console.log('over')"
    @pointer-out="(e) => console.log('out')"
    @pointer-enter="(e) => console.log('enter')"
    @pointer-leave="(e) => console.log('leave')"
    @pointer-move="(e) => console.log('move')"
    @pointer-missed="() => console.log('missed')"
    @update="(self) => console.log('props have been updated')" />
</template>
```

From this we can see that what we need to do is use the `@click` event we use on any DOM element to react to a user clicking the mesh.

Let's add it then:

```vue
<template>
  <mesh @click="() => alert('Hellooo')">
    <boxGeometry />
    <meshPhongMaterial color="royalblue" />
  </mesh>
</template>
```

We did it! We created the most boring interaction in the story of 3D and we made an alert show up. Now let's make it actually animate our mesh.

Let's start by setting some state to check if the mesh is active:

```vue
<script setup>
import { ref } from 'vue'

const active = ref(false)
</script>
```

After we have this we can set the scale with a ternary operator like so:

```vue
<template>
  <mesh :scale="active ? 1.5 : 1" @click="active = !active">
    <boxGeometry />
    <meshPhongMaterial color="royalblue" />
  </mesh>
</template>
```

If you try to click on your mesh now, it scales up and down. We just made our first interactive 3D mesh!

What we did in this chapter was:

- Attached a click handler to our mesh
- Added some reactive state to track if the mesh is currently active
- Changed the scale based on that state

<Codesandbox id="98ppy" />

**Exercises**

- Change other props of the mesh like the `position` or even the `color` of the material.
- Use `@pointer-over` and `@pointer-out` to change the props of the mesh on hover events.

## Next steps

We just made our mesh react to user interaction but it looks pretty bland without any transition, right?
In the next chapter let's integrate an animation library into our project to make this into an actual animation.
