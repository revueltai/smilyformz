<script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { isEmptyArray } from '@/utils'
  import { useGameStore } from '@/stores/game.store'
  import GameTilesRow from '@/components/app/GameTilesRow.vue'
  import { useTileGeneration } from '@/composables/useTileGeneration'
  import { useRowAnimation } from '@/composables/useRowAnimation'
  import type { RefElement } from '@/components/shared/types'
  import { GAME_ROWS_COUNT } from '@/configs/constants'

  const gameStore = useGameStore()
  const rowsAreAnimated = ref(false)
  const container = ref<RefElement>(null)
  const { rows, initializeRows, resetTileGeneration, initializeCompleted } = useTileGeneration()
  const { startAnimation, resetRowAnimation, positionRows } = useRowAnimation()

  function animateRows() {
    rowsAreAnimated.value = true
    const rowIds = rows.value.map((row) => row.id)

    // Ensure we have valid row IDs before starting animation
    if (rowIds.length > 0) {
      startAnimation(rowIds)
    }
  }

  function resetGameTiles() {
    rowsAreAnimated.value = false
    resetTileGeneration()
    resetRowAnimation()
  }

  async function reinitializeGameTiles() {
    initializeRows()

    // Wait for initialization to complete
    while (!initializeCompleted.value) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    await updateRowPositioning()
  }

  async function updateRowPositioning() {
    await nextTick()
    // Position rows immediately after creation to hide them before game starts
    const rowIds = rows.value.map((row) => row.id)
    positionRows(rowIds)
  }

  watch(
    () => gameStore.isGameStarted,
    async (isGameStarted) => {
      if (isGameStarted) {
        // Always reinitialize when game starts to ensure clean state
        await reinitializeGameTiles()
        await nextTick()

        if (!isEmptyArray(rows.value) && !rowsAreAnimated.value) {
          animateRows()
        }

        return
      }

      if (rowsAreAnimated.value) {
        resetGameTiles()
      }
    },
  )

  watch(
    () => initializeCompleted.value,
    async (completed) => {
      if (completed && gameStore.isGameStarted && !rowsAreAnimated.value) {
        await nextTick()

        if (!isEmptyArray(rows.value)) {
          animateRows()
        }
      }
    },
  )

  onMounted(() => reinitializeGameTiles())
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
        :class="{ 'opacity-0': !rowsAreAnimated }"
      />
    </div>
  </div>
</template>
