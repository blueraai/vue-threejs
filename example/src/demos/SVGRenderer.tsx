import { Canvas, useFrame } from '@vue-three/fiber'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { Mesh } from 'three'
import { SVGRenderer } from 'three-stdlib'

const TorusKnot = defineComponent({
  setup() {
    const hovered = ref(false)
    const meshRef = ref<Mesh | null>(null)

    useFrame((state) => {
      const t = state.clock.elapsedTime / 2
      if (meshRef.value) meshRef.value.rotation.set(t, t, t)
    })

    return () => (
      <mesh ref={meshRef} onPointerOver={() => (hovered.value = true)} onPointerOut={() => (hovered.value = false)}>
        <torusKnotGeometry args={[10, 3, 128, 16]} />
        <meshBasicMaterial color={hovered.value ? 'orange' : 'hotpink'} />
      </mesh>
    )
  },
})

const svgRenderer = new SVGRenderer()
svgRenderer.domElement.style.position = 'absolute'
svgRenderer.domElement.style.top = '0'
svgRenderer.domElement.style.left = '0'

// Wrap the SVG element in an HTMLDivElement so it can be used for event sourcing
const eventWrapper = document.createElement('div')
eventWrapper.style.position = 'absolute'
eventWrapper.style.top = '0'
eventWrapper.style.left = '0'
eventWrapper.style.width = '100%'
eventWrapper.style.height = '100%'
eventWrapper.appendChild(svgRenderer.domElement)

export default defineComponent({
  setup() {
    onMounted(() => {
      document.body.appendChild(eventWrapper)
    })
    onUnmounted(() => {
      document.body.removeChild(eventWrapper)
    })

    return () => (
      <Canvas gl={svgRenderer} camera={{ position: [0, 0, 50] }} eventSource={eventWrapper}>
        <color attach="background" args={['#dedddf']} />
        <TorusKnot />
      </Canvas>
    )
  },
})
