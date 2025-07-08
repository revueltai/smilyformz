<script setup lang="ts">
  import { ref, nextTick, onMounted, watch } from 'vue'
  import { useGameStore } from '@/stores/game.store'
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
  const isCharacterVisible = ref(false)

  const { posX, moveLeft, moveRight, centerCharacter, resetCharacterAnimation } =
    useMovementCharacter(props.boardRef, characterRef)

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

  function handleCharacterCenteringOnStart(isGameStarted: boolean) {
    if (isGameStarted) {
      nextTick(() => {
        centerCharacter()
        setTimeout(() => (isCharacterVisible.value = true), 100)
      })
    } else {
      isCharacterVisible.value = false
    }
  }

  function handleCharacterReset(isGameStarted: boolean) {
    if (!isGameStarted) {
      resetCharacterAnimation()
    }
  }

  watch(
    () => gameStore.isGameStarted,
    (isGameStarted) => {
      handleCharacterCenteringOnStart(isGameStarted)
      handleCharacterReset(isGameStarted)
    },
  )

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
    class="absolute bottom-34 left-0 transition-all duration-300 ease-in-out"
    :class="{ 'opacity-0': !isCharacterVisible, 'opacity-100': isCharacterVisible }"
    :style="{ transform: `translateX(${posX}px)` }"
  >
    <div class="relative w-full h-full">
      <Tile
        :size="gameStore.tileSize"
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
