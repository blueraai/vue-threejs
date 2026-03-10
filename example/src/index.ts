import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/demo/Test' },
    { path: '/demo/:name', component: () => import('./DemoView.vue') },
  ],
})

createApp(App).use(router).mount('#root')
