<script setup lang="ts">
  import { ref } from 'vue'
  import { isMobile } from '@/utils'
  import { useMovementCharacter } from '@/composables/useMovementCharacter'
  import Tile from '@/components/app/tile/Tile.vue'
  import GameControls from '@/components/app/GameControls.vue'
  import GameTiles from '@/components/app/GameTiles.vue'
  import { useGameStore } from '@/stores/gameStore'

  defineProps<{
    activeTileColor: string
  }>()

  const gameStore = useGameStore()
  const boardRef = ref<HTMLElement | null>(null)
  const characterRef = ref<HTMLElement | null>(null)

  const { x, moveLeft, moveRight } = useMovementCharacter(boardRef, characterRef)

  function handleMoveLeft() {
    if (!gameStore.isGameStarted) return
    moveLeft()
  }

  function handleMoveRight() {
    if (!gameStore.isGameStarted) return
    moveRight()
  }
</script>

<template>
  <div class="relative h-full w-full">
    <GameControls
      v-if="isMobile"
      :disabled="!gameStore.isGameStarted"
      @move-left="handleMoveLeft"
      @move-right="handleMoveRight"
    />

    <div
      ref="boardRef"
      class="relative h-full w-full overflow-hidden"
    >
      <GameTiles />

      <div
        id="character"
        ref="characterRef"
        class="absolute bottom-24 left-0 transition-transform duration-100"
        :style="{ transform: `translateX(${x}px)` }"
      >
        <Tile
          shape="circle"
          expression="exp1"
          :shape-color="activeTileColor"
        />
      </div>
    </div>
  </div>
</template>
