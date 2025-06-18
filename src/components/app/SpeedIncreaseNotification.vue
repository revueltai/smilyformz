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
