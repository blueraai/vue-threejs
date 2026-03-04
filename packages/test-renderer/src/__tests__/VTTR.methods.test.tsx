import { defineComponent, h } from 'vue'

import VueThreeTestRenderer from '../index'

describe('VueThreeTestRenderer instance methods', () => {
  const ExampleComponent = defineComponent({
    setup() {
      return () =>
        h('group', null, [
          h('mesh', { name: 'mesh_01' }, [
            h('boxGeometry', { args: [2, 2] }),
            h('meshStandardMaterial', { color: 0x0000ff }),
          ]),
          h('mesh', { name: 'mesh_02' }, [
            h('boxGeometry', { args: [2, 2] }),
            h('meshBasicMaterial', { color: 0x0000ff }),
          ]),
        ])
    },
  })

  it('should pass the parent', async () => {
    const { scene } = await VueThreeTestRenderer.create(h(ExampleComponent))

    expect(scene.parent).toBeNull()

    expect(scene.children[0].parent).toBeDefined()
    expect(scene.children[0].parent!.type).toEqual('Scene')
  })

  it('searches via .find() / .findAll()', async () => {
    const { scene } = await VueThreeTestRenderer.create(h(ExampleComponent))

    const foundByName = scene.find((node) => node.instance.name === 'mesh_01')

    expect(foundByName.type).toEqual('Mesh')

    const foundAllByColor = scene.findAll((node) => node.props.color === 0x0000ff)

    expect(foundAllByColor).toHaveLength(2)
    expect(foundAllByColor[0].type).toEqual('MeshStandardMaterial')
    expect(foundAllByColor[1].type).toEqual('MeshBasicMaterial')

    const foundAllByType = scene.findAll((node) => node.type === 'InstancedMesh')

    expect(foundAllByType).toHaveLength(0)
    expect(foundAllByType).toEqual([])

    expect(() => scene.find((node) => node.props.color === 0x0000ff)).toThrow()
  })

  it('searches via .findByType() / findAllByType()', async () => {
    const { scene } = await VueThreeTestRenderer.create(h(ExampleComponent))

    const foundByStandardMaterial = scene.findByType('MeshStandardMaterial')

    expect(foundByStandardMaterial).toBeDefined()

    const foundAllByMesh = scene.findAllByType('Mesh')

    expect(foundAllByMesh).toHaveLength(2)
    expect(foundAllByMesh[0].instance.name).toEqual('mesh_01')
    expect(foundAllByMesh[1].instance.name).toEqual('mesh_02')

    const foundAllByBoxBufferGeometry = scene.findAllByType('BoxBufferGeometry')

    expect(foundAllByBoxBufferGeometry).toHaveLength(0)
    expect(foundAllByBoxBufferGeometry).toEqual([])

    expect(() => scene.findByType('BufferGeometry')).toThrow()
  })

  it('searches via .findByProps() / .findAllByProps()', async () => {
    const { scene } = await VueThreeTestRenderer.create(h(ExampleComponent))

    const foundByName = scene.findByProps({
      name: 'mesh_01',
    })

    expect(foundByName.type).toEqual('Mesh')

    const foundAllByColor = scene.findAllByProps({
      color: 0x0000ff,
    })

    expect(foundAllByColor).toHaveLength(2)
    expect(foundAllByColor[0].type).toEqual('MeshStandardMaterial')
    expect(foundAllByColor[1].type).toEqual('MeshBasicMaterial')

    const foundAllByColorAndName = scene.findAllByProps({
      color: 0x0000ff,
      name: 'mesh_01',
    })

    expect(foundAllByColorAndName).toHaveLength(0)
    expect(foundAllByColorAndName).toEqual([])

    expect(() => scene.findByProps({ color: 0x0000ff })).toThrow()
  })

  it('searches RegExp via .findByProps() / .findAllByProps()', async () => {
    const { scene } = await VueThreeTestRenderer.create(h(ExampleComponent))

    const single = scene.findByProps({
      name: /^mesh_01$/,
    })

    expect(single.type).toEqual('Mesh')

    const multiple = scene.findAllByProps({
      name: /^mesh_\d+$/,
    })

    expect(multiple.length).toEqual(2)
  })
})
