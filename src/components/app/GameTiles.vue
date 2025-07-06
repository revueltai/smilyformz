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
  const { rows, initializeRows, resetTileGeneration } = useTileGeneration()
  const { startAnimation, resetRowAnimation, positionRows } = useRowAnimation()

  function animateRows() {
    rowsAreAnimated.value = true
    const rowIds = rows.value.map((row) => row.id)
    startAnimation(rowIds)
  }

  function resetGameTiles() {
    rowsAreAnimated.value = false
    resetTileGeneration()
    resetRowAnimation()
  }

  async function reinitializeGameTiles() {
    if (container.value) {
      initializeRows(GAME_ROWS_COUNT)
      await updateRowPositioning()
    }
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
        if (isEmptyArray(rows.value)) {
          await reinitializeGameTiles()
          await nextTick()

          if (!isEmptyArray(rows.value) && !rowsAreAnimated.value) {
            animateRows()
          }
        } else if (!rowsAreAnimated.value) {
          animateRows()
        }

        return
      }

      if (rowsAreAnimated.value) {
        resetGameTiles()
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
