import type { VNode } from 'vue'
import { Scene } from 'three'
import THREE from 'three'

import { extend, _roots as mockRoots, createRoot, reconciler, act, Instance } from '@vue-three/fiber'

import { toTree } from './helpers/tree'
import { toGraph } from './helpers/graph'

import { createCanvas } from './createTestCanvas'
import { createEventFirer } from './fireEvent'

import type { CreateOptions, Renderer } from './types/public'
import { wrapFiber } from './createTestInstance'
import { waitFor, WaitOptions } from './helpers/waitFor'

// Extend catalogue for render API in tests.
const threeModule: Record<string, unknown> = THREE
extend(threeModule)

const create = async (element: VNode, options?: Partial<CreateOptions>): Promise<Renderer> => {
  const canvas = createCanvas(options)

  const _root = createRoot(canvas)
  await _root.configure({
    frameloop: 'never',
    // TODO: remove and use default behavior
    size: {
      width: options?.width ?? 1280,
      height: options?.height ?? 800,
      top: 0,
      left: 0,
    },
    ...options,
    events: undefined,
  })

  const _store = mockRoots.get(canvas)!.store

  await act(async () => _root.render(element))
  const sceneObject: Instance<Scene>['object'] = _store.getState().scene
  const _scene = sceneObject.__v3f!

  return {
    scene: wrapFiber(_scene),
    async unmount() {
      await act(async () => {
        _root.unmount()
      })
    },
    getInstance() {
      // Bail if canvas is unmounted
      if (!mockRoots.has(canvas)) return null

      // Traverse fiber nodes for V3F root
      const root = { current: mockRoots.get(canvas)!.fiber.current }
      while (!root.current.child?.stateNode) root.current = root.current.child

      // Return V3F instance from root
      return reconciler.getPublicRootInstance(root)
    },
    async update(newElement: VNode) {
      if (!mockRoots.has(canvas)) return console.warn('VTTR: attempted to update an unmounted root!')

      await act(async () => {
        _root.render(newElement)
      })
    },
    toTree() {
      return toTree(_scene)
    },
    toGraph() {
      return toGraph(_scene)
    },
    fireEvent: createEventFirer(act, _store),
    async advanceFrames(frames: number, delta: number | number[] = 1) {
      const state = _store.getState()
      const storeSubscribers = state.internal.subscribers

      const promises: Promise<void>[] = []

      storeSubscribers.forEach((subscriber) => {
        for (let i = 0; i < frames; i++) {
          if (Array.isArray(delta)) {
            const deltaArr: number[] = delta
            promises.push(
              new Promise(() => subscriber.ref.current(state, deltaArr[i] || deltaArr[deltaArr.length - 1])),
            )
          } else {
            const deltaNum: number = delta
            promises.push(new Promise(() => subscriber.ref.current(state, deltaNum)))
          }
        }
      })

      Promise.all(promises)
    },
  }
}

export { create, act, waitFor }
export type { WaitOptions }

export type {
  MockSyntheticEvent,
  CreateOptions,
  Renderer,
  SceneGraphItem,
  SceneGraph,
  TreeNode,
  Tree,
} from './types/public'
export { VueThreeTestInstance } from './types/public'
export default { create, act, waitFor }
