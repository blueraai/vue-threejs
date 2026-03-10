<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
  className?: string
}>()
</script>

<template>
  <img :src="src" :alt="alt" :width="width" :height="height" :class="className" loading="lazy" />
</template>
