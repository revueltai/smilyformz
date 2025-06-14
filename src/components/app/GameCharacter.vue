<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { useMovementCharacter } from '@/composables/useMovementCharacter'
  import { isMobile } from '@/utils'
  import GameControls from '@/components/app/GameControls.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { RefElement } from '@/components/shared/types'
  import type { Ref } from 'vue'

  const props = defineProps<{
    boardRef: RefElement
    activeTileColor: string
  }>()

  const gameStore = useGameStore()

  const { setCharacterHitArea } = useCollisionDetection()

  const characterRef = ref<RefElement>(null)
  const characterHitAreaRef = ref<RefElement>(null)

  const { x, moveLeft, moveRight } = useMovementCharacter(props.boardRef, characterRef)

  function handleMoveLeft() {
    if (!gameStore.isGameStarted) {
      return
    }

    moveLeft()
  }

  function handleMoveRight() {
    if (!gameStore.isGameStarted) {
      return
    }

    moveRight()
  }

  onMounted(async () => await nextTick(() => setCharacterHitArea(characterHitAreaRef.value)))
</script>

<template>
  <GameControls
    v-if="isMobile()"
    :disabled="!gameStore.isGameStarted"
    @move-left="handleMoveLeft"
    @move-right="handleMoveRight"
  />

  <div
    ref="characterRef"
    class="absolute bottom-24 left-0 transition-transform duration-100"
    :style="{ transform: `translateX(${x}px)` }"
  >
    <div class="relative w-full h-full">
      <Tile
        shape="circle"
        expression="exp1"
        :shape-color="activeTileColor"
      />

      <div
        ref="characterHitAreaRef"
        class="w-8 h-8 bg-rose-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      />
    </div>
  </div>
</template>
