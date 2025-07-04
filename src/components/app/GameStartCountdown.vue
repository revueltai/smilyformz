<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import GameCountdown from './GameCountdown.vue'
  import { useSoundStore } from '@/stores/sounds.store'

  type CountdownMessage = 'ready' | 'go'

  const emit = defineEmits<{
    (e: 'complete'): void
  }>()

  const soundStore = useSoundStore()

  const message = ref<CountdownMessage>('ready')
  const isVisible = ref(true)
  const textColor = ref('text-white')

  onMounted(() => {
    soundStore.playSound('gameCountdownStart')

    setTimeout(() => {
      message.value = 'go'
      textColor.value = 'text-lime-200'
    }, 1500)

    setTimeout(() => {
      isVisible.value = false
      emit('complete')
    }, 2500)
  })
</script>

<template>
  <GameCountdown
    v-if="isVisible"
    :message="message"
    :text-color="textColor"
  />
</template>
