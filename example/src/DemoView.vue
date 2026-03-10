<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Error as ErrorDisplay } from './components'
import * as demos from './demos'

type DemoEntry = { Component: ReturnType<typeof import('vue')['defineAsyncComponent']>; description?: string }

const route = useRoute()
const compName = computed(() => {
  const name = route.params.name
  return typeof name === 'string' ? name : 'Test'
})
const entry = computed(() => {
  return (demos as Record<string, DemoEntry>)[compName.value] ?? null
})
const CurrentDemo = computed(() => entry.value?.Component ?? null)
const description = computed(() => entry.value?.description ?? null)
</script>

<template>
  <component :is="CurrentDemo" v-if="CurrentDemo" />
  <ErrorDisplay v-else>Demo "{{ compName }}" not found.</ErrorDisplay>
  <div v-if="description" class="demo-description">
    {{ description }}
  </div>
</template>

<style scoped>
.demo-description {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 720px;
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.7);
  color: #ddd;
  font-family: sans-serif;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 6px;
  pointer-events: none;
  text-align: center;
}
</style>
