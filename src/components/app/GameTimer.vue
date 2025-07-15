<script setup lang="ts">
  import { useGameStore } from '@/stores/game.store'

  const gameStore = useGameStore()
</script>

<template>
  <div
    v-if="gameStore.isIndestructibleActive"
    class="absolute top-20 right-4 z-30 flex items-center justify-center border border-slate-400 rounded-full bg-white text-slate-800 font-bold shadow-lg w-12 h-12 p-3"
  >
    {{ gameStore.indestructibleTimeRemaining }}
  </div>
</template>
