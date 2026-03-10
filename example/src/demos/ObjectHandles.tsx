import { Canvas, useFrame, useObjectRef } from '@vue-three/fiber'
import { defineComponent, watch } from 'vue'
import type { Mesh } from 'three'

const Cube = defineComponent({
  setup() {
    const cube = useObjectRef<Mesh>()

    useFrame((_, delta) => {
      if (cube.object.value) {
        cube.object.value.rotation.x += delta
        cube.object.value.rotation.y += delta * 0.5
      }
    })

    // Respond to mount/unmount lifecycle
    watch(cube.mounted, (mounted) => {
      console.log(mounted ? 'Cube mounted' : 'Cube unmounted')
    })

    // Log the raw THREE.Mesh when it becomes available
    watch(cube.object, (mesh) => {
      if (mesh) {
        console.log('Raw THREE.Mesh:', mesh)
        console.log('World position:', mesh.getWorldPosition(mesh.position.clone()))
      }
    })

    return () => (
      <mesh ref={cube.ref}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    )
  },
})

export default defineComponent({
  setup() {
    return () => (
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Cube />
      </Canvas>
    )
  },
})
