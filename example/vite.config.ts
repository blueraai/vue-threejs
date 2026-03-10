import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// Lowercase Three.js / V3F element names the JSX compiler would
// otherwise feed into resolveComponent(). Mixed-case tags (e.g.
// ambientLight, meshStandardMaterial) are caught by the regex;
// the purely-lowercase ones still need to be listed here.
const V3F_INTRINSICS = new Set(['color', 'group', 'line', 'mesh', 'points', 'primitive', 'sprite'])

export default defineConfig({
  optimizeDeps: {
    exclude: ['@vue-three/fiber'],
  },
  plugins: [
    vue(),
    vueJsx({
      // Treat Three.js / V3F element tags as custom elements so the JSX
      // compiler emits plain string vnodes instead of resolveComponent().
      // Two patterns:
      //   1. camelCase tags (start lowercase, contain uppercase): ambientLight, meshStandardMaterial, …
      //   2. Known lowercase V3F intrinsics: mesh, group, primitive, …
      isCustomElement: (tag: string) => V3F_INTRINSICS.has(tag) || (/^[a-z]/.test(tag) && /[A-Z]/.test(tag)),
    }),
  ],
})
