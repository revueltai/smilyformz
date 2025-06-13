<script setup lang="ts">
  import { ref } from 'vue'
  import { isMobile } from '@/utils'
  import { useMovement } from '@/composables/useMovement'
  import Tile from '@/components/app/Tile.vue'
  import GameControls from '@/components/app/GameControls.vue'

  defineProps<{
    activeTileColor: string
  }>()

  const boardRef = ref<HTMLElement | null>(null)
  const characterRef = ref<HTMLElement | null>(null)

  const { x, moveLeft, moveRight } = useMovement(boardRef, characterRef)

  function handleMoveLeft() {
    moveLeft()
  }

  function handleMoveRight() {
    moveRight()
  }
</script>

<template>
  <div class="relative h-full w-full">
    <GameControls
      v-if="isMobile"
      @move-left="handleMoveLeft"
      @move-right="handleMoveRight"
    />

    <div
      ref="boardRef"
      class="relative h-full w-full"
    >
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
