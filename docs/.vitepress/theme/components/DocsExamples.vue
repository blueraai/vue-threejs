<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { codeToHtml } from 'shiki'
import GlassFlowerDemo from './GlassFlowerDemo'
// @ts-expect-error raw import resolved by Vite
import glassFlowerSource from './GlassFlowerDemo.tsx?raw'

// ---------------------------------------------------------------------------
// Raw source imports via import.meta.glob (Vite resolves these at build time)
// ---------------------------------------------------------------------------
const rawModules = import.meta.glob('../../../../example/src/demos/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** Extract demo name from glob path */
function sourceFor(name: string): string {
  for (const [path, content] of Object.entries(rawModules)) {
    if (path.endsWith(`/${name}.tsx`)) return content
  }
  return `// Source not found for ${name}`
}

// ---------------------------------------------------------------------------
// Demo registry
// ---------------------------------------------------------------------------

interface DemoEntry {
  title: string
  height: number
  description: string
  component: ReturnType<typeof defineAsyncComponent> | ReturnType<(typeof import('vue'))['defineComponent']>
  source: string
  originalDemo?: {
    label: string
    url: string
  }
}

const demos: Record<string, DemoEntry> = {
  Compose: {
    title: 'DOM + 3D Composer',
    height: 640,
    description:
      'Vue-native DOM/3D composition: provide/inject bridges a sidebar and overlay controls into the scene, watchInvalidate drives demand rendering, and postprocessing effects toggle reactively. One Vue app, two render targets, zero iframes.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/Compose')),
    source: sourceFor('Compose'),
  },
  GlassFlower: {
    title: 'GlassFlower',
    height: 640,
    description: 'GLTF model with HDRI lighting, physically-based glass material, postprocessing, and orbit controls.',
    component: GlassFlowerDemo,
    source: glassFlowerSource,
  },
  SpaceGame: {
    title: 'Space Game',
    height: 620,
    description:
      'Procedural starfield, spline track, ship steering, enemy drones, rocks, score HUD, and click-to-fire gameplay.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/SpaceGame')),
    source: sourceFor('SpaceGame'),
    originalDemo: {
      label: 'Original React version',
      url: 'https://codesandbox.io/s/i2160',
    },
  },
  Test: {
    title: 'Test',
    height: 420,
    description:
      'Foundational conditional rendering, ref lifecycle, and interaction behavior. This is the minimal sanity-check scene for the renderer itself.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/Test')),
    source: sourceFor('Test'),
  },
  ClickAndHover: {
    title: 'Click & Hover',
    height: 420,
    description:
      'Pointer events, click handling, and mixing declarative nodes with primitive Three objects in one scene.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/ClickAndHover')),
    source: sourceFor('ClickAndHover'),
  },
  ContextMenuOverride: {
    title: 'Context Menu Override',
    height: 380,
    description:
      'Custom right-click interactions in 3D space, including suppressing the browser context menu and mapping it to scene behavior.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/ContextMenuOverride')),
    source: sourceFor('ContextMenuOverride'),
  },
  SceneServices: {
    title: 'Scene Services',
    height: 520,
    description:
      'Shared state across the scene and the DOM overlay using provide/inject. Click a shape to select it, then drive the selection state from the overlay controls.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/SceneServices')),
    source: sourceFor('SceneServices'),
  },
  DomOverlay: {
    title: 'DOM Overlay',
    height: 460,
    description:
      'Canvas overlay slots keep the 3D scene and the interface in one Vue app. Adjust the color and speed in the overlaid controls and the scene updates immediately.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/DomOverlay')),
    source: sourceFor('DomOverlay'),
  },
  ObjectHandles: {
    title: 'Object Handles',
    height: 420,
    description:
      'useObjectRef gives you explicit access to the raw THREE object while keeping the authoring model declarative. This is the preferred imperative pattern for new code.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/ObjectHandles')),
    source: sourceFor('ObjectHandles'),
  },
  DemandRendering: {
    title: 'Demand Rendering',
    height: 420,
    description:
      'watchInvalidate pairs Vue reactivity with frameloop="demand" so the scene only redraws when state actually changes. Use the overlay button or click the torus knot to cycle colors.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/DemandRendering')),
    source: sourceFor('DemandRendering'),
  },
  AutoDispose: {
    title: 'Auto Dispose',
    height: 420,
    description:
      'Automatic disposal of Three objects when conditional scene branches unmount, with interaction-driven state changes to prove cleanup stays correct.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/AutoDispose')),
    source: sourceFor('AutoDispose'),
  },
  Layers: {
    title: 'Layers',
    height: 420,
    description:
      'Selective visibility with Three.js layers and camera filtering, demonstrated as timed visibility swaps.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/Layers')),
    source: sourceFor('Layers'),
  },
  MultiMaterial: {
    title: 'Multi Material',
    height: 520,
    description:
      'Multiple material slots on one geometry, shared material reuse, and dynamic geometry/material replacement.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/MultiMaterial')),
    source: sourceFor('MultiMaterial'),
  },
  MultiRender: {
    title: 'Multi Render',
    height: 560,
    description:
      'Two independent Canvas instances on one page, showing separate stores, renderers, and lifecycle timing in the same Vue view.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/MultiRender')),
    source: sourceFor('MultiRender'),
  },
  Pointcloud: {
    title: 'Pointcloud',
    height: 460,
    description:
      'A custom shader-driven interactive point cloud with per-point hover feedback using buffer geometry and raycaster indices.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/Pointcloud')),
    source: sourceFor('Pointcloud'),
  },
  Reparenting: {
    title: 'Reparenting',
    height: 460,
    description:
      'Dynamic createPortal reparenting without destroying objects, useful for scene graph orchestration and view transitions.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/Reparenting')),
    source: sourceFor('Reparenting'),
  },
  ResetProps: {
    title: 'Reset Props',
    height: 480,
    description:
      'Adaptive DPR, dynamic geometry replacement, and prop-reset behavior under ongoing animation and interaction.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/ResetProps')),
    source: sourceFor('ResetProps'),
  },
  SceneSwap: {
    title: 'Scene Swap',
    height: 460,
    description:
      'Swap entire scene branches without remounting the Canvas. This is a lightweight example of scene-level transitions and view switching.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/SceneSwap')),
    source: sourceFor('SceneSwap'),
  },
  LoaderTransition: {
    title: 'Loader Transition',
    height: 460,
    description:
      'A Vue-first loading flow with a visible placeholder and an explicit transition into the loaded content, without leaning on Suspense semantics.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/LoaderTransition')),
    source: sourceFor('LoaderTransition'),
  },
  ScreenCapture: {
    title: 'Screen Capture',
    height: 420,
    description:
      'Frame-synchronized screenshot capture using render lifecycle composables, proving scene updates are committed before pixels are read.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/ScreenCapture')),
    source: sourceFor('ScreenCapture'),
  },
  StopPropagation: {
    title: 'Stop Propagation',
    height: 460,
    description:
      'Nested pointer interactions with stopPropagation, demonstrating event routing and hover behavior across scene hierarchies.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/StopPropagation')),
    source: sourceFor('StopPropagation'),
  },
  SVGRenderer: {
    title: 'SVG Renderer',
    height: 460,
    description:
      'Alternative renderer support with Three.js SVGRenderer instead of WebGL, showing the renderer abstraction is not WebGL-only.',
    component: defineAsyncComponent(() => import('../../../../example/src/demos/SVGRenderer')),
    source: sourceFor('SVGRenderer'),
  },
}

type DemoKey = keyof typeof demos
const demoKeys = Object.keys(demos) as DemoKey[]

// ---------------------------------------------------------------------------
// Hash ↔ demo key helpers
// ---------------------------------------------------------------------------

/** Convert PascalCase key to kebab-case slug for the URL hash */
function toSlug(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/** Reverse lookup: slug → demo key */
const slugToKey: Record<string, DemoKey> = {}
for (const key of Object.keys(demos)) {
  slugToKey[toSlug(key)] = key as DemoKey
}

function keyFromHash(): DemoKey | null {
  const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : ''
  return slugToKey[hash] ?? null
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const selected = ref<DemoKey>('Compose')
const selectedDemo = computed(() => demos[selected.value])

const selectedIndex = computed(() => demoKeys.indexOf(selected.value))
const totalDemos = demoKeys.length

/** Whether the modal is open */
const modalOpen = ref(false)

/** Whether the demo picker dropdown is open */
const pickerOpen = ref(false)

function openModal(key: DemoKey) {
  selected.value = key
  viewTab.value = 'demo'
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  pickerOpen.value = false
}

function navigatePrev() {
  const idx = selectedIndex.value
  selected.value = demoKeys[idx > 0 ? idx - 1 : demoKeys.length - 1]
}

function navigateNext() {
  const idx = selectedIndex.value
  selected.value = demoKeys[idx < demoKeys.length - 1 ? idx + 1 : 0]
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (pickerOpen.value) {
      pickerOpen.value = false
    } else if (modalOpen.value) {
      closeModal()
    }
    return
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    navigatePrev()
  }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    navigateNext()
  }
  if (e.key === 'Enter' && !modalOpen.value) {
    openModal(selected.value)
  }
}

/** Which inner tab is active: 'demo' or 'source' */
const viewTab = ref<'demo' | 'source'>('demo')

/** Cached highlighted HTML per demo key */
const highlightCache = new Map<string, string>()

/** Current highlighted HTML to render */
const highlightedHtml = shallowRef('')

/** Whether we're currently highlighting */
const highlighting = ref(false)

// Sync selected → hash (skip during programmatic back/forward updates)
let suppressHashSync = false
watch(selected, (key) => {
  viewTab.value = 'demo'
  pickerOpen.value = false
  if (!suppressHashSync && typeof window !== 'undefined') {
    history.replaceState(null, '', `#${toSlug(key)}`)
  }
})

// Sync hash → selected on back/forward navigation
function onHashChange() {
  const key = keyFromHash()
  if (key && key !== selected.value) {
    suppressHashSync = true
    selected.value = key
    suppressHashSync = false
  }
}

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  window.addEventListener('keydown', onKeydown)
  // Read hash on mount (handles SSR hydration and SPA navigation)
  const fromHash = keyFromHash()
  if (fromHash) {
    suppressHashSync = true
    selected.value = fromHash
    modalOpen.value = true
    suppressHashSync = false
  } else {
    history.replaceState(null, '', `#${toSlug(selected.value)}`)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange)
  window.removeEventListener('keydown', onKeydown)
})

// Close picker on outside click
function onPickerBackdrop() {
  pickerOpen.value = false
}

function selectDemo(key: string) {
  selected.value = key
  pickerOpen.value = false
}

// Highlight source on demand
watch(
  [selected, viewTab],
  async ([key, tab]) => {
    if (tab !== 'source') return

    // Use cache if available
    if (highlightCache.has(key)) {
      highlightedHtml.value = highlightCache.get(key)!
      return
    }

    highlighting.value = true
    try {
      const source = demos[key as DemoKey].source
      const html = await codeToHtml(source, {
        lang: 'tsx',
        themes: {
          light: 'github-light',
          dark: 'github-dark-dimmed',
        },
      })
      highlightCache.set(key, html)
      highlightedHtml.value = html
    } finally {
      highlighting.value = false
    }
  },
  { immediate: true },
)

// Line count for display
const lineCount = computed(() => {
  const source = demos[selected.value as DemoKey]?.source
  return source ? source.split('\n').length : 0
})

// ---------------------------------------------------------------------------
// stats.js — mrdoob's standard FPS/MS/MB panel
// Lazy-imported to avoid SSR failures (stats.js touches DOM at import time).
// ---------------------------------------------------------------------------
import { addEffect, addAfterEffect } from '@bluera/vue-threejs'

const stageEl = ref<HTMLElement | null>(null)
let stats: any = null
let unsubBefore: (() => void) | null = null
let unsubAfter: (() => void) | null = null

function initStats(container: HTMLElement) {
  import('stats.js').then((mod) => {
    const Stats = mod.default
    stats = new Stats()
    stats.showPanel(0)
    stats.dom.style.position = 'absolute'
    stats.dom.style.top = '0'
    stats.dom.style.right = '0'
    stats.dom.style.left = 'auto'
    stats.dom.style.pointerEvents = 'none'
    stats.dom.style.zIndex = '10'
    container.appendChild(stats.dom)

    unsubBefore = addEffect(() => {
      stats?.begin()
    })
    unsubAfter = addAfterEffect(() => {
      stats?.end()
    })
  })
}

function teardownStats() {
  unsubBefore?.()
  unsubAfter?.()
  stats?.dom?.remove()
  stats = null
  unsubBefore = null
  unsubAfter = null
}

// Watch the template ref — it only resolves after ClientOnly renders
watch(stageEl, (el) => {
  if (el && !stats) initStats(el)
})

onBeforeUnmount(teardownStats)
</script>

<template>
  <div class="docs-examples" tabindex="0">
    <!-- Inline preview (small) — visible when modal is closed -->
    <div v-if="!modalOpen" class="de-preview">
      <div ref="stageEl" class="de-preview__stage">
        <ClientOnly>
          <component :is="selectedDemo.component" />
        </ClientOnly>

        <!-- Edge arrows (hover-reveal, outside canvas interaction area) -->
        <button type="button" class="de-preview__arrow de-preview__arrow--left" @click.stop="navigatePrev">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12 4L6 10L12 16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <button type="button" class="de-preview__arrow de-preview__arrow--right" @click.stop="navigateNext">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8 4L14 10L8 16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <!-- Footer bar: title + counter + expand -->
      <div class="de-preview__bar">
        <div class="de-preview__info">
          <span class="de-preview__counter">{{ selectedIndex + 1 }}/{{ totalDemos }}</span>
          <span class="de-preview__title">{{ selectedDemo.title }}</span>
        </div>
        <div class="de-preview__actions">
          <span class="de-preview__hint">use arrow keys</span>
          <button type="button" class="de-preview__expand" @click="openModal(selected)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 6V2H6M10 2H14V6M14 10V14H10M6 14H2V10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            Open
          </button>
        </div>
      </div>

      <p class="de-preview__desc">{{ selectedDemo.description }}</p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="de-backdrop" @click.self="closeModal">
        <div class="de-modal">
          <!-- Header: tabs + picker + close -->
          <div class="de-modal__header">
            <div class="de-modal__tabs">
              <button
                type="button"
                class="de-modal__tab"
                :class="{ 'de-modal__tab--active': viewTab === 'demo' }"
                @click="viewTab = 'demo'">
                Demo
              </button>
              <button
                type="button"
                class="de-modal__tab"
                :class="{ 'de-modal__tab--active': viewTab === 'source' }"
                @click="viewTab = 'source'">
                Source
                <span class="de-modal__tab-badge">TSX</span>
              </button>
            </div>

            <!-- Compact nav: prev / dropdown selector / next -->
            <div class="de-nav">
              <button type="button" class="de-nav__arrow" @click="navigatePrev">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 3L5 8L10 13"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>

              <button type="button" class="de-nav__selector" @click="pickerOpen = !pickerOpen">
                <span class="de-nav__count">{{ selectedIndex + 1 }}/{{ totalDemos }}</span>
                <span class="de-nav__title">{{ selectedDemo.title }}</span>
                <svg
                  class="de-nav__chevron"
                  :class="{ 'de-nav__chevron--open': pickerOpen }"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none">
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>

              <button type="button" class="de-nav__arrow" @click="navigateNext">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 3L11 8L6 13"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>

              <!-- Dropdown picker -->
              <div v-if="pickerOpen" class="de-picker__backdrop" @click="onPickerBackdrop" />
              <div v-if="pickerOpen" class="de-picker">
                <button
                  v-for="(demo, key) in demos"
                  :key="key"
                  type="button"
                  class="de-picker__item"
                  :class="{ 'de-picker__item--active': selected === key }"
                  @click="selectDemo(key)">
                  <span class="de-picker__item-title">{{ demo.title }}</span>
                </button>
              </div>
            </div>

            <button type="button" class="de-modal__close" @click="closeModal">&times;</button>
          </div>

          <!-- Demo stage — completely clean, no overlays -->
          <div v-show="viewTab === 'demo'" class="de-stage">
            <ClientOnly>
              <component :is="selectedDemo.component" />
            </ClientOnly>
          </div>

          <!-- Source view -->
          <div v-show="viewTab === 'source'" class="de-code">
            <div class="de-code__header">
              <span class="de-code__filename">{{ selected }}.tsx</span>
              <span class="de-code__lines">{{ lineCount }} lines</span>
            </div>
            <div v-if="highlighting" class="de-code__loading">Loading syntax highlighting...</div>
            <div v-else class="de-code__container" v-html="highlightedHtml" />
          </div>

          <!-- Description -->
          <div class="de-meta">
            <p>{{ selectedDemo.description }}</p>
            <p v-if="selectedDemo.originalDemo" class="de-meta__credit">
              {{ selectedDemo.originalDemo.label }}:
              <a :href="selectedDemo.originalDemo.url" target="_blank" rel="noreferrer noopener">
                {{ selectedDemo.originalDemo.url }}
              </a>
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.docs-examples {
  display: grid;
  gap: 0.75rem;
  outline: none;
}

/* =========================================================================
   INLINE PREVIEW
   ========================================================================= */

.de-preview {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.de-preview:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.de-preview__stage {
  position: relative;
  width: 100%;
  height: 340px;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 45%),
    linear-gradient(180deg, #12131b 0%, #191b24 100%);
}

/* Edge arrows — invisible until stage hover */
.de-preview__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 64px;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.25s ease,
    background 0.15s ease;
}

.de-preview__arrow--left {
  left: 0;
  border-radius: 0 8px 8px 0;
}

.de-preview__arrow--right {
  right: 0;
  border-radius: 8px 0 0 8px;
}

.de-preview__stage:hover .de-preview__arrow {
  opacity: 1;
}

.de-preview__arrow:hover {
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
}

/* Footer bar */
.de-preview__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.de-preview__info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.de-preview__counter {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.de-preview__title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.de-preview__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.de-preview__hint {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.01em;
}

.de-preview__expand {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    color 0.15s ease,
    background 0.15s ease;
}

.de-preview__expand:hover {
  border-color: #e8755a;
  color: #e8755a;
}

/* Description below the bar */
.de-preview__desc {
  margin: 0;
  padding: 8px 14px 10px;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* =========================================================================
   MODAL BACKDROP
   ========================================================================= */

.de-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
}

/* =========================================================================
   MODAL
   ========================================================================= */

.de-modal {
  width: 92vw;
  height: 92vh;
  max-width: 1280px;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}

/* --- Modal header --- */

.de-modal__header {
  display: flex;
  align-items: center;
  padding: 0 8px 0 0;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
  gap: 0;
}

.de-modal__tabs {
  display: flex;
}

.de-modal__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border: none;
  background: none;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition:
    color 0.18s ease,
    border-color 0.18s ease;
}

.de-modal__tab:hover {
  color: var(--vp-c-text-1);
}

.de-modal__tab--active {
  color: #e8755a;
  border-bottom-color: #e8755a;
}

.de-modal__tab-badge {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  line-height: 1.4;
}

/* --- Compact nav (center of header) --- */

.de-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  margin-right: 8px;
  position: relative;
}

.de-nav__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  border-radius: 6px;
  transition:
    background 0.12s ease,
    color 0.12s ease;
}

.de-nav__arrow:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.de-nav__selector {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 4px 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
  max-width: 260px;
}

.de-nav__selector:hover {
  border-color: var(--vp-c-text-3);
}

.de-nav__count {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.de-nav__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.de-nav__chevron {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
}

.de-nav__chevron--open {
  transform: rotate(180deg);
}

/* --- Dropdown picker --- */

.de-picker__backdrop {
  position: fixed;
  inset: 0;
  z-index: 49;
}

.de-picker {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  width: 280px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  padding: 4px;
}

.de-picker__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px 10px;
  border: none;
  background: none;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
  border-radius: 6px;
  text-align: left;
  transition:
    background 0.1s ease,
    color 0.1s ease;
}

.de-picker__item:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.de-picker__item--active {
  color: #e8755a;
  background: rgba(232, 117, 90, 0.08);
}

.de-picker__item--active:hover {
  background: rgba(232, 117, 90, 0.14);
}

.de-picker__item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Close button --- */

.de-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  color: var(--vp-c-text-3);
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 6px;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.de-modal__close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* =========================================================================
   DEMO STAGE (modal) — completely clean, no overlays
   ========================================================================= */

.de-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 45%),
    linear-gradient(180deg, #12131b 0%, #191b24 100%);
}

/* =========================================================================
   META
   ========================================================================= */

.de-meta {
  padding: 10px 18px 12px;
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.de-meta p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  line-height: 1.5;
}

.de-meta__credit {
  margin-top: 0.3rem !important;
  font-size: 0.78rem !important;
  color: var(--vp-c-text-3) !important;
}

.de-meta__credit a {
  color: #e8755a;
  word-break: break-all;
}

/* =========================================================================
   CODE VIEW
   ========================================================================= */

.de-code {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  background: var(--vp-c-bg-soft);
}

.de-code__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.de-code__filename {
  font-family: var(--vp-font-family-mono);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.de-code__lines {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.de-code__loading {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.de-code__container {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

/* Style the shiki output to match VitePress code blocks */
.de-code__container :deep(pre) {
  margin: 0;
  padding: 1rem;
  background: transparent !important;
  overflow-x: auto;
}

.de-code__container :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.65;
}

/* Shiki dual-theme: light mode uses --shiki-light, dark mode uses --shiki-dark */
.de-code__container :deep(.shiki) {
  background-color: transparent !important;
}

.de-code__container :deep(.shiki span) {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

:root.dark .de-code__container :deep(.shiki span),
.dark .de-code__container :deep(.shiki span) {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}

/* =========================================================================
   RESPONSIVE
   ========================================================================= */

@media (max-width: 640px) {
  .de-modal {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    border: none;
  }

  .de-preview__hint {
    display: none;
  }

  .de-nav__selector {
    max-width: 160px;
  }
}
</style>
