<script setup lang="ts">
defineProps<{
  cols?: number
}>()
</script>

<template>
  <div class="grid-container" :style="{ gridTemplateColumns: `repeat(${cols || 3}, 1fr)` }">
    <slot />
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.grid-container :deep(li) {
  list-style: none;
}

@media (max-width: 640px) {
  .grid-container {
    grid-template-columns: 1fr !important;
  }
}
</style>
