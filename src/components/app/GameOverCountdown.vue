<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import GameCountdown from './GameCountdown.vue'

  const props = defineProps<{
    onComplete: () => void
  }>()

  const isVisible = ref(true)

  onMounted(() => {
    setTimeout(() => {
      isVisible.value = false
      props.onComplete()
    }, 2000)
  })
</script>

<template>
  <GameCountdown
    v-if="isVisible"
    message="gameOverMessage"
    text-color="text-rose-200"
  />
</template>
