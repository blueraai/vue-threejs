import { defineAsyncComponent } from 'vue'

const AutoDispose = {
  Component: defineAsyncComponent(() => import('./AutoDispose')),
  description:
    'Automatic cleanup of THREE.js objects when components unmount. Two boxes alternate visibility on click — the hidden one is properly disposed. Hover changes color. Verifies V3F prevents memory leaks during conditional rendering.',
}
const ClickAndHover = {
  Component: defineAsyncComponent(() => import('./ClickAndHover')),
  description:
    'Pointer and click events on 3D objects, plus mixing declarative components with pre-instantiated THREE.js objects via <primitive>. Left box (JSX): hover for hot pink, click to scale. Right box (primitive Group): click logs to console. Both bob up and down.',
}
const ContextMenuOverride = {
  Component: defineAsyncComponent(() => import('./ContextMenuOverride')),
  description:
    'Custom right-click handling on 3D objects with default context menu suppression. Right-click the blue box to toggle it to hot pink. Demonstrates ThreeEvent.nativeEvent.preventDefault() for custom interaction patterns.',
}
const Layers = {
  Component: defineAsyncComponent(() => import('./Layers')),
  description:
    'Three.js Layers API for selective object visibility per camera. A light-blue box and aquamarine sphere alternate visibility every 1 second using layer toggling. No user interaction — objects swap automatically.',
}
const MultiMaterial = {
  Component: defineAsyncComponent(() => import('./MultiMaterial')),
  description:
    'Multiple materials per geometry (material arrays), material reuse across components, and dynamic material swaps. Shows a box with 6 colored faces, material slot toggling, two spheres sharing one material, and dynamic geometry replacement. All animations are automatic.',
}
const MultiRender = {
  Component: defineAsyncComponent(() => import('./MultiRender')),
  description:
    'Multiple independent Canvas instances on the same page. Two viewports stacked vertically — top has a rotating cube, bottom appears after 500ms with a static cube. Each Canvas has its own renderer, state, and frame loop.',
}
const Pointcloud = {
  Component: defineAsyncComponent(() => import('./Pointcloud')),
  description:
    'High-performance point cloud with 1000 interactive particles using BufferGeometry and a custom shader material. Hover over individual hot-pink points to turn them white. Uses raycaster index for per-point hit detection without individual meshes.',
}
const Reparenting = {
  Component: defineAsyncComponent(() => import('./Reparenting')),
  description:
    'createPortal() API for dynamic scene graph reparenting. A colorful icosahedron jumps between left and right positions every second by switching parent groups. Click the icosahedron to scale it 2x. Objects move without destroy/recreate.',
}
const ResetProps = {
  Component: defineAsyncComponent(() => import('./ResetProps')),
  description:
    'Adaptive pixel ratio and performance monitoring. A red sphere (hover to scale) with a group containing a cube that toggles to icosahedron every second. Demonstrates dynamic DPR switching (1x/2x) based on performance.current to maintain frame rates.',
}
const StopPropagation = {
  Component: defineAsyncComponent(() => import('./StopPropagation')),
  description:
    'Pointer event propagation control in nested 3D hierarchies. Left group: nested spheres with stopPropagation preventing parent handlers. Right group: circle and sphere respond to hover (color changes). Check console for event propagation logs.',
}
const SVGRenderer = {
  Component: defineAsyncComponent(() => import('./SVGRenderer')),
  description:
    'Alternative renderer support — Three.js SVGRenderer instead of WebGL. A rotating torus knot rendered as vector SVG paths. Hover to change from hot pink to orange. Demonstrates V3F flexibility with any Three.js-compatible renderer via the gl prop.',
}
const Test = {
  Component: defineAsyncComponent(() => import('./Test')),
  description:
    'Foundational conditional rendering and lifecycle test. Left orange box is always present and rotating. Right sky-blue box appears at 500ms, disappears at 2s, reappears at 4s. Click either box to scale. Hover for color change. Tests ref-driven visibility and cleanup.',
}
const ScreenCapture = {
  Component: defineAsyncComponent(() => import('./ScreenCapture')),
  description:
    'useRenderCommit() composable for frame-synchronized canvas capture. A rotating gold dodecahedron — click to cycle through 10 colors and auto-download a PNG screenshot. Demonstrates waiting for Vue flush + Three.js render before reading pixels.',
}
const ObjectHandles = {
  Component: defineAsyncComponent(() => import('./ObjectHandles')),
  description:
    'useObjectRef<T>() composable for typed access to raw THREE.js objects (bypassing the Vue Proxy wrapper). A rotating orange box with ambient, spot, and point lights. Console logs confirm mount/unmount lifecycle tracking and direct object property access.',
}
const DemandRendering = {
  Component: defineAsyncComponent(() => import('./DemandRendering')),
  description:
    'On-demand rendering with frameloop="demand" — only re-renders when state changes, saving CPU/GPU. A blue torus knot sits static until clicked, cycling through 6 colors. Each click triggers exactly one re-render via invalidate().',
}
const DomOverlay = {
  Component: defineAsyncComponent(() => import('./DomOverlay')),
  description:
    'DOM overlay UI on top of 3D canvas via the #overlay slot. A rotating orange cube with a dark control panel (top-left) containing a color picker and speed slider (0-5). Change color to recolor the cube; adjust speed (0-5) to control rotation. Shows seamless 2D/3D integration with pointer-events routing.',
}
const SceneSwap = {
  Component: defineAsyncComponent(() => import('./SceneSwap')),
  description:
    'Hot-swapping entire scene content without unmounting Canvas. A rotating blue cube OR a rotating hot-pink sphere — click the button (top-left) to toggle between them. Demonstrates clean scene transitions for multi-view applications.',
}
const LoaderTransition = {
  Component: defineAsyncComponent(() => import('./LoaderTransition')),
  description:
    'Manual loading state transitions (Vue-idiomatic alternative to Suspense). Shows a gray wireframe box placeholder for 2 seconds, then transitions to a blue torus knot. Click "Reload" in the overlay panel to restart the sequence.',
}
const SceneServices = {
  Component: defineAsyncComponent(() => import('./SceneServices')),
  description:
    'Vue provide/inject for shared scene services across components. Three selectable shapes (cube, sphere, torus) with an overlay control panel (top-right). Click objects to select — selected objects scale up, spin faster, and change to the highlight color. Use the color picker to change the highlight color for all selected objects.',
}

export {
  AutoDispose,
  ClickAndHover,
  ContextMenuOverride,
  DemandRendering,
  DomOverlay,
  Layers,
  LoaderTransition,
  MultiMaterial,
  MultiRender,
  ObjectHandles,
  Pointcloud,
  Reparenting,
  ResetProps,
  SceneServices,
  SceneSwap,
  StopPropagation,
  SVGRenderer,
  Test,
  ScreenCapture,
}
