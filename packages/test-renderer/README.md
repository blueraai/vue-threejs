# Vue Three Test Renderer

[![Version](https://img.shields.io/npm/v/@vue-three/test-renderer?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/@vue-three/test-renderer)
[![Downloads](https://img.shields.io/npm/dt/@vue-three/test-renderer.svg?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/@vue-three/test-renderer)
[![Twitter](https://img.shields.io/twitter/follow/pmndrs?label=%40pmndrs&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000)](https://twitter.com/pmndrs)
[![Twitter](https://img.shields.io/twitter/follow/_josh_ellis_?label=%40_josh_ellis_&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000)](https://twitter.com/_josh_ellis_)
[![Discord](https://img.shields.io/discord/740090768164651008?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=000000)](https://discord.gg/ZZjjNvJ)

`@vue-three/test-renderer` is a Vue testing renderer for threejs in node.

```bash
yarn add @vue-three/fiber three
yarn add -D @vue-three/test-renderer
```

---

## The problem

You've written a complex and amazing webgl experience using [`@vue-three/fiber`](https://github.com/chrisbraddock/vue-three-fiber) and you want to test it to make sure it works even after you add even more features.

You go to use `vue-test-utils` but hang on, `THREE` elements aren't in the DOM! You decide to use `@vue-three/test-renderer` you can see the container & the canvas but you can't see the tree for the scene!? That's because `@vue-three/fiber` renders to a different root with it's own reconciler.

## The solution

You use `@vue-three/test-renderer`, an experimental Vue renderer using `@vue-three/fiber` under the hood to expose the scene graph wrapped in a test instance providing helpful utilities to test with.

Essentially, this package makes it easy to grab a snapshot of the Scene Graph rendered by `three` without the need for webgl & browser.

---

## Usage

RTTR is testing library agnostic, so we hope that it works with libraries such as [`jest`](https://jestjs.io/), [`jasmine`](https://jasmine.github.io/) etc.

```tsx
import VueThreeTestRenderer from '@vue-three/test-renderer'

const renderer = await VueThreeTestRenderer.create(
  <mesh>
    <boxGeometry args={[2, 2]} />
    <meshStandardMaterial
      args={[
        {
          color: 0x0000ff,
        },
      ]}
    />
  </mesh>,
)

// assertions using the TestInstance & Scene Graph
console.log(renderer.toGraph())
```

---

## API

- [Vue Three Test Renderer API](/packages/test-renderer/markdown/rttr.md)
- [Vue Three Test Instance API](/packages/test-renderer/markdown/rttr-instance.md)
