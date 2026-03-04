import { defineComponent, h } from 'vue'

import VueThreeTestRenderer from '../index'
import type { MockSyntheticEvent } from '../index'

describe('VueThreeTestRenderer Events', () => {
  it('should fire an event', async () => {
    const handlePointerDown = jest.fn().mockImplementationOnce((event: MockSyntheticEvent) => {
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

  it('should not throw if the handle name is incorrect', async () => {
    const handlePointerDown = jest.fn()

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn())

    const Component = defineComponent({
      setup() {
        return () =>
          h('mesh', { onPointerDown: handlePointerDown }, [h('boxGeometry', { args: [2, 2] }), h('meshBasicMaterial')])
      },
    })

    const { scene, fireEvent } = await VueThreeTestRenderer.create(h(Component))

    expect(async () => await fireEvent(scene.children[0], 'onPointerUp')).not.toThrow()

    expect(handlePointerDown).not.toHaveBeenCalled()

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1)
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Handler for onPointerUp was not found. You must pass event names in camelCase or name of the handler https://github.com/pmndrs/vue-three-fiber/blob/master/packages/test-renderer/markdown/vttr.md#create-fireevent',
    )
  })
})
