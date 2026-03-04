import { defineComponent, ref, h } from 'vue'
import { Camera, Scene, Raycaster, Mesh, Loader, BoxGeometry, MeshBasicMaterial } from 'three'
import { useFrame, useLoader, useThree } from '@vue-three/fiber'

import VueThreeTestRenderer from '../index'

describe('VueThreeTestRenderer Hooks', () => {
  it('can handle useThree hook', async () => {
    let result: {
      camera: Camera
      scene: Scene
      raycaster: Raycaster
      size: { width: number; height: number }
    } = {
      camera: undefined!,
      scene: undefined!,
      raycaster: undefined!,
      size: undefined!,
    }

    const Component = defineComponent({
      setup() {
        const res = useThree((state) => ({
          camera: state.camera,
          scene: state.scene,
          size: state.size,
          raycaster: state.raycaster,
        }))

        result = res

        return () => h('group')
      },
    })

    await VueThreeTestRenderer.create(h(Component), { width: 1280, height: 800 })

    expect(result.camera instanceof Camera).toBeTruthy()
    expect(result.scene instanceof Scene).toBeTruthy()
    expect(result.raycaster instanceof Raycaster).toBeTruthy()
    expect(result.size).toEqual({ height: 800, width: 1280, top: 0, left: 0 })
  })

  it('can handle useLoader hook', async () => {
    const MockMesh = new Mesh()
    class TestLoader extends Loader<Mesh, string> {
      load(url: string, onLoad: (mesh: Mesh) => void): void {
        onLoad(MockMesh)
      }
    }

    const Component = defineComponent({
      setup() {
        const model = useLoader(TestLoader, '/suzanne.glb')

        return () => h('primitive', { object: model })
      },
    })

    const renderer = await VueThreeTestRenderer.create(h(Component))
    expect(renderer.scene.children[0].instance).toBe(MockMesh)
  })

  it('can handle useFrame hook using test renderers advanceFrames function', async () => {
    const Component = defineComponent({
      setup() {
        const meshRef = ref<Mesh>(null!)
        useFrame((_, delta) => {
          meshRef.value.rotation.x += delta
        })

        return () => h('mesh', { ref: meshRef }, [h('boxGeometry', { args: [2, 2] }), h('meshBasicMaterial')])
      },
    })

    const renderer = await VueThreeTestRenderer.create(h(Component))

    expect(renderer.scene.children[0].instance.rotation.x).toEqual(0)

    await VueThreeTestRenderer.act(async () => {
      await renderer.advanceFrames(2, 1)
    })

    expect(renderer.scene.children[0].instance.rotation.x).toEqual(2)
  })
})
