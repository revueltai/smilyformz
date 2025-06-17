<script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { isEmptyArray } from '@/utils'
  import { useGameStore } from '@/stores/gameStore'
  import GameTilesRow from '@/components/app/GameTilesRow.vue'
  import { useTileGeneration } from '@/composables/useTileGeneration'
  import { useRowAnimation } from '@/composables/useRowAnimation'
  import type { RefElement } from '@/components/shared/types'

  const gameStore = useGameStore()
  const rowsAreAnimated = ref(false)
  const container = ref<RefElement>(null)
  const { rows, initializeRows, initializeRowsPosition } = useTileGeneration()
  const { startAnimation } = useRowAnimation()

  function animateRows() {
    rowsAreAnimated.value = true
    const rowIds = rows.value.map((row) => row.id)
    startAnimation(rowIds)
  }

  watch(
    () => gameStore.isGameStarted,
    (isGameStarted) => {
      if (!isEmptyArray(rows.value) && isGameStarted && !rowsAreAnimated.value) {
        animateRows()
      }
    },
  )

  onMounted(async () => {
    if (container.value) {
      initializeRows(5)
      nextTick(() => initializeRowsPosition())
    }
  })
</script>

<template>
  <div class="absolute inset-0">
    <div
      ref="container"
      class="relative w-full h-full overflow-hidden"
    >
      <GameTilesRow
        v-for="row in rows"
        :key="row.id"
        :ref="row.id"
        :id="row.id"
        :tiles="row.tiles"
        class="absolute"
      />
    </div>
  </div>
</template>
