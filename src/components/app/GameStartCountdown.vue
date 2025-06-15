<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import GameCountdown from './GameCountdown.vue'

  type CountdownMessage = 'ready' | 'go'

  const props = defineProps<{
    onComplete: () => void
  }>()

  const message = ref<CountdownMessage>('ready')
  const isVisible = ref(true)

  onMounted(() => {
    setTimeout(() => (message.value = 'go'), 1500)

    setTimeout(() => {
      isVisible.value = false
      props.onComplete()
    }, 1000)
  })
</script>

<template>
  <GameCountdown
    v-if="isVisible"
    :message="message"
    text-color="text-lime-200"
  />
</template>
