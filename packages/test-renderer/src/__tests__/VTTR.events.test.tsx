import { defineComponent, h } from 'vue'

import VueThreeTestRenderer, { type MockSyntheticEvent } from '../index'

describe('VueThreeTestRenderer Events', () => {
  it('should fire an event', async () => {
    const handlePointerDown = vi.fn().mockImplementationOnce((event: MockSyntheticEvent) => {
      expect(() => event.stopPropagation()).not.toThrow()
      expect(event.offsetX).toEqual(640)
      expect(event.offsetY).toEqual(400)
    })

    const Component = defineComponent({
      setup() {
        return () =>
          h('mesh', { onPointerDown: handlePointerDown }, [h('boxGeometry', { args: [2, 2] }), h('meshBasicMaterial')])
      },
    })

    const { scene, fireEvent } = await VueThreeTestRenderer.create(h(Component))

    const eventData = {
      offsetX: 640,
      offsetY: 400,
    }

    await fireEvent(scene.children[0], 'onPointerDown', eventData)

    expect(handlePointerDown).toHaveBeenCalledTimes(1)

    await fireEvent(scene.children[0], 'pointerDown')

    expect(handlePointerDown).toHaveBeenCalledTimes(2)
  })

  it('should ignore valid runtime events that have no matching object handler', async () => {
    const handlePointerDown = vi.fn()

    const Component = defineComponent({
      setup() {
        return () =>
          h('mesh', { onPointerDown: handlePointerDown }, [h('boxGeometry', { args: [2, 2] }), h('meshBasicMaterial')])
      },
    })

    const { scene, fireEvent } = await VueThreeTestRenderer.create(h(Component))

    expect(async () => await fireEvent(scene.children[0], 'onPointerUp')).not.toThrow()

    expect(handlePointerDown).not.toHaveBeenCalled()
  })
})
