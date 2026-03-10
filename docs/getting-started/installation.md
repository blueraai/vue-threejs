---
title: Installation
description: Learn how to install vue-three-fiber
---

```bash
npm install three @vue-three/fiber
```

> [!WARNING]
> Fiber is compatible with Vue 3. It is a Vue renderer, similar to how vue-dom works for the browser.

Getting started with Vue Three Fiber is not nearly as hard as you might have thought, but various frameworks may require particular attention.

We've put together guides for getting started with each popular framework:

- Vite.js
- Nuxt
- CDN w/o build tools

## Vite.js

`vite` will work out of the box.

```bash
# Create app
npm create vite my-app

# Select vue as framework

# Install dependencies
cd my-app
npm install three @vue-three/fiber

# Start development server
npm run dev
```

## Nuxt

It should work out of the box but you will encounter untranspiled add-ons in the three.js ecosystem, in that case,

You may need to add three to the `transpile` option in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  build: {
    transpile: ['three'],
  },
})
```

## Without build tools

You can use Vue Three Fiber with browser-ready ES Modules from [esm.sh](https://esm.sh).

```html
<div id="app"></div>
<canvas id="canvas"></canvas>

<script type="module">
  import { createApp, ref, h } from 'https://esm.sh/vue'
  import { createRoot, extend } from 'https://esm.sh/@vue-three/fiber'
  import * as THREE from 'https://esm.sh/three'

  extend(THREE)

  const root = createRoot(document.getElementById('canvas'))
  await root.configure({ camera: { position: [0, 0, 5] } })

  const App = {
    setup() {
      return () =>
        h('mesh', {}, [h('boxGeometry', { args: [1, 1, 1] }), h('meshStandardMaterial', { color: 'orange' })])
    },
  }

  root.render(h(App))
</script>
```
