<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import CharacterMessage from './index.vue'
  import { Bus } from '@/services/Bus.service'

  const messages = ref<Array<{ id: number; message?: string }>>([])
  let messageId = 0

  function showMessage(payload: { message?: string }) {
    const id = messageId++
    messages.value.push({ id, message: payload.message })
  }

  function removeMessage(id: number) {
    const index = messages.value.findIndex((msg) => msg.id === id)

    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  onMounted(() => Bus.on('characterMessage', showMessage))

  onUnmounted(() => Bus.off('characterMessage', showMessage))
</script>

<template>
  <div class="character-messages-container">
    <CharacterMessage
      v-for="message in messages"
      :key="message.id"
      :message="message.message || ''"
      :on-complete="() => removeMessage(message.id)"
    />
  </div>
</template>

<style scoped>
  .character-messages-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 40;
  }
</style>
