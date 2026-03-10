<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { DemoPanel, Dot, Loading, Page } from './components'
import * as demos from './demos'

const route = useRoute()
const dev = new URLSearchParams(location.search).get('dev')
const compName = computed(() => {
  const name = route.params.name
  return typeof name === 'string' ? name : 'Test'
})
</script>

<template>
  <Page>
    <Suspense>
      <template #fallback>
        <Loading />
      </template>
      <router-view />
    </Suspense>
    <template v-if="dev === null">
      <DemoPanel>
        <Dot
          v-for="[name] in Object.entries(demos)"
          :key="name"
          :to="`/demo/${name}`"
          :style="{ background: compName === name ? 'salmon' : '#fff' }" />
      </DemoPanel>
      <span style="color: white">{{ compName }}</span>
    </template>
  </Page>
</template>
