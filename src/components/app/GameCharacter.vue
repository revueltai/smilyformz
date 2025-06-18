<script setup lang="ts">
  import { ref, nextTick, onMounted, computed } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { useMovementCharacter } from '@/composables/useCharacterAnimation'
  import { isMobile } from '@/utils'
  import GameControls from '@/components/app/GameControls.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { RefElement } from '@/components/shared/types'

  const props = defineProps<{
    boardRef: RefElement
    activeTileColor: string
  }>()

  const gameStore = useGameStore()

  const { setCharacterHitArea } = useCollisionDetection()

  const characterRef = ref<RefElement>(null)
  const characterHitAreaRef = ref<RefElement>(null)

  // Calculate tile width: shape size (80px) + padding (32px) = 112px
  const tileWidth = computed(() => {
    const shapeSize = 80 // sm size from TileShape.vue
    const padding = 32 // p-4 = 16px on each side
    return shapeSize + padding
  })

  const tilesGap = 8
  const { x, moveLeft, moveRight } = useMovementCharacter(
    tileWidth.value + tilesGap,
    props.boardRef,
    characterRef,
  )

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
        :id="gameStore.character.id"
        :shape="gameStore.character.shape"
        :expression="gameStore.character.expression"
        :shape-color="gameStore.character.shapeColor"
      />

      <div
        ref="characterHitAreaRef"
        class="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      />
    </div>
  </div>
</template>
