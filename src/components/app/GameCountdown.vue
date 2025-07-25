<script setup lang="ts">
  defineProps<{
    message: string
    textColor?: string
  }>()
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
      class="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-50 pointer-events-none"
    >
      <div
        class="text-5xl font-bold text-shadow-lg uppercase countdown-text"
        :class="textColor || 'text-white'"
      >
        {{ $t(message) }}
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .countdown-text {
    animation: bounceStrong 1000ms infinite;
  }
</style>
