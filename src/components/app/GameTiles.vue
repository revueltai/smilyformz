<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import GameTilesRow from '@/components/app/GameTilesRow.vue'
  import { useTileGeneration } from '@/composables/useTileGeneration'

  const container = ref<HTMLElement | null>(null)
  const { rows, initializeRows } = useTileGeneration()

  onMounted(() => {
    if (container.value) {
      initializeRows(5) // Initialize with 5 rows
    }
  })
</script>

<template>
  <div
    ref="container"
    class="relative w-full h-full overflow-hidden"
  >
    <GameTilesRow
      v-for="(row, index) in rows"
      :key="index"
      :tiles="row"
      class="absolute w-full"
    />
  </div>
</template>

<style scoped>
  div {
    will-change: transform;
  }
</style>
