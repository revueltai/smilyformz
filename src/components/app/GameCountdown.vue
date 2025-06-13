<script setup lang="ts">
  import { ref, onMounted } from 'vue'

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
    }, 4000)
  })
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-0 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-0 opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center bg-slate-900/50 z-50"
    >
      <div
        class="text-6xl font-bold text-shadow-lg animate-bounce"
        :class="message === 'go' ? 'text-lime-200 uppercase' : 'text-white'"
      >
        {{ $t(message) }}
      </div>
    </div>
  </Transition>
</template>
