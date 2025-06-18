<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import GameCountdown from './GameCountdown.vue'
  import { getRandomNumber } from '@/utils'

  const props = defineProps<{
    onComplete: () => void
  }>()

  const isVisible = ref(true)
  const message = computed(() => {
    return `gameOverMessage${getRandomNumber(1, 3)}`
  })

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
    :message="message"
    text-color="text-rose-200"
  />
</template>
