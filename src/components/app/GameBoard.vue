<script setup lang="ts">
  import { ref } from 'vue'
  import GameCharacter from '@/components/app/GameCharacter.vue'
  import GameTiles from '@/components/app/GameTiles.vue'
  import type { RefElement } from '@/components/shared/types'

  defineProps<{
    activeTileColor: string
    isPaused?: boolean
  }>()

  const boardRef = ref<RefElement>(null)
</script>

<template>
  <div class="relative h-full w-full">
    <div
      ref="boardRef"
      class="relative h-full w-full overflow-hidden bg-white"
    >
      <GameTiles />

      <GameCharacter
        v-if="boardRef"
        :boardRef="boardRef"
        :active-tile-color="activeTileColor"
      />
    </div>
  </div>
</template>
