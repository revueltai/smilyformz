<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import GameCountdown from './GameCountdown.vue'
  import { useSoundStore } from '@/stores/sounds.store'

  const props = defineProps<{
    onComplete?: () => void
  }>()

  const soundStore = useSoundStore()

  const isVisible = ref(true)

  onMounted(() => {
    soundStore.playSound('gameSpeedIncrease')

    setTimeout(() => {
      isVisible.value = false

      if (props.onComplete) {
        props.onComplete()
      }
    }, 1500)
  })
</script>

<template>
  <GameCountdown
    v-if="isVisible"
    message="faster"
    text-color="text-white"
  />
</template>
