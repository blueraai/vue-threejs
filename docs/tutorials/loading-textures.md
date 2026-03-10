---
title: 'Loading Textures'
description: Let's load some fancy textures.
---

> All textures used in this chapter were downloaded from [cc0textures](https://cc0textures.com/).

## Using `TextureLoader` and `useLoader`

To load the textures we will use the `TextureLoader` from three.js in combination with `useLoader` that will allow us to pass the location of the texture and get the map back.

It's better to explain with code, let's say you downloaded [this texture](https://cc0textures.com/view?id=PavingStones092) and placed it in the public folder of your site, to get the color map from it you could do:

```js
const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
```

Let's then with this information create a small scene where we can use this texture:

```vue
<script setup>
import { Canvas, useLoader } from '@vue-three/fiber'
import { TextureLoader } from 'three'

const colorMap = useLoader(TextureLoader, 'PavingStones092_1K_Color.jpg')
</script>

<template>
  <Canvas>
    <Suspense>
      <ambientLight :intensity="0.2" />
      <directionalLight />
      <mesh>
        <sphereGeometry :args="[1, 32, 32]" />
        <meshStandardMaterial />
      </mesh>
    </Suspense>
  </Canvas>
</template>
```

If everything went according to plan, you should now be able to apply this texture to the sphere like so:

```vue
<template>
  <meshStandardMaterial :map="colorMap" />
</template>
```

Awesome! That works but we have a lot more textures to import and do we have to create a different useLoader for each of them?

That's the great part! You don't, the second argument is an array where you can pass all the textures you have and the maps will be returned and ready to use:

```js
const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])
```

Now we can place them in our mesh like so:

```vue
<template>
  <meshStandardMaterial
    :map="colorMap"
    :displacementMap="displacementMap"
    :normalMap="normalMap"
    :roughnessMap="roughnessMap"
    :aoMap="aoMap" />
</template>
```

The displacement will probably be too much, usually setting it to 0.2 will make it look good. Our final code would look something like:

```vue
<script setup>
import { useLoader } from '@vue-three/fiber'
import { TextureLoader } from 'three'

const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])
</script>

<template>
  <mesh>
    <!-- Width and height segments for displacementMap -->
    <sphereGeometry :args="[1, 100, 100]" />
    <meshStandardMaterial
      :displacementScale="0.2"
      :map="colorMap"
      :displacementMap="displacementMap"
      :normalMap="normalMap"
      :roughnessMap="roughnessMap"
      :aoMap="aoMap" />
  </mesh>
</template>
```

## Using `useTexture`

Another way to import these is using `useTexture` from [`@vue-three/drei`](https://github.com/pmndrs/drei), that will make it slightly easier and there is no need to import the `TextureLoader`, our code would look like:

```js
import { useTexture } from '@vue-three/drei'

const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useTexture([
  'PavingStones092_1K_Color.jpg',
  'PavingStones092_1K_Displacement.jpg',
  'PavingStones092_1K_Normal.jpg',
  'PavingStones092_1K_Roughness.jpg',
  'PavingStones092_1K_AmbientOcclusion.jpg',
])
```

You can also use object-notation which is the most convenient:

```vue
<script setup>
import { useTexture } from '@vue-three/drei'

const props = useTexture({
  map: 'PavingStones092_1K_Color.jpg',
  displacementMap: 'PavingStones092_1K_Displacement.jpg',
  normalMap: 'PavingStones092_1K_Normal.jpg',
  roughnessMap: 'PavingStones092_1K_Roughness.jpg',
  aoMap: 'PavingStones092_1K_AmbientOcclusion.jpg',
})
</script>

<template>
  <mesh>
    <sphereGeometry :args="[1, 32, 32]" />
    <meshStandardMaterial v-bind="props" />
  </mesh>
</template>
```

You can play with the sandbox and see how it looks:

<Codesandbox id="rusfd" />
