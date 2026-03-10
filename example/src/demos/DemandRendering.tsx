import { Canvas, watchInvalidate } from '@vue-three/fiber'
import { defineComponent, ref } from 'vue'

const Product = defineComponent({
  props: {
    color: { type: String, default: 'orange' },
  },
  setup(props) {
    // Re-render whenever color changes — no wasted frames between changes
    watchInvalidate(() => props.color)

    return () => (
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial color={props.color} />
      </mesh>
    )
  },
})

const colors = ['#4488ff', '#ff4444', '#44ff44', '#ff8800', '#8844ff', '#ff44aa']

export default defineComponent({
  setup() {
    const color = ref(colors[0])
    let colorIndex = 0

    const cycleColor = () => {
      colorIndex = (colorIndex + 1) % colors.length
      color.value = colors[colorIndex]
    }

    return () => (
      <Canvas frameloop="demand" onClick={cycleColor}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Product color={color.value} />
      </Canvas>
    )
  },
})
