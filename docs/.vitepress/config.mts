import { defineConfig } from 'vitepress'

const base = process.env.VITEPRESS_BASE || '/'

export default defineConfig({
  base,
  title: 'Vue Three Fiber',
  description: 'A Vue 3 renderer for Three.js',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'API', link: '/API/canvas' },
      { text: 'Tutorials', link: '/tutorials/basic-animations' },
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started/introduction' },
          { text: 'Installation', link: '/getting-started/installation' },
          { text: 'Your First Scene', link: '/getting-started/your-first-scene' },
          { text: 'Examples', link: '/getting-started/examples' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'Canvas', link: '/API/canvas' },
          { text: 'Composables', link: '/API/hooks' },
          { text: 'Events', link: '/API/events' },
          { text: 'Objects', link: '/API/objects' },
          { text: 'Testing', link: '/API/testing' },
          { text: 'TypeScript', link: '/API/typescript' },
          { text: 'Additional Exports', link: '/API/additional-exports' },
        ],
      },
      {
        text: 'Tutorials',
        items: [
          { text: 'Basic Animations', link: '/tutorials/basic-animations' },
          { text: 'Events & Interaction', link: '/tutorials/events-and-interaction' },
          { text: 'How It Works', link: '/tutorials/how-it-works' },
          { text: 'Loading Models', link: '/tutorials/loading-models' },
          { text: 'Loading Textures', link: '/tutorials/loading-textures' },
          { text: 'Object Handles', link: '/tutorials/object-handles' },
          { text: 'Demand Rendering', link: '/tutorials/demand-rendering' },
          { text: 'DOM Overlays', link: '/tutorials/dom-overlays' },
          { text: 'Scene Transitions', link: '/tutorials/scene-transitions' },
          { text: 'v9 Migration Guide', link: '/tutorials/v9-migration-guide' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Pitfalls', link: '/advanced/pitfalls' },
          { text: 'Scaling Performance', link: '/advanced/scaling-performance' },
          { text: 'Vue Divergences', link: '/advanced/vue-divergences' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/chrisbraddock/vue-three-fiber' }],
  },
})
