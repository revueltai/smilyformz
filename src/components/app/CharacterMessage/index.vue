<script setup lang="ts">
  import { getRandomNumber } from '@/utils'
  import { ref, onMounted } from 'vue'
  import { useSoundStore } from '@/stores/sounds.store'

  const props = withDefaults(
    defineProps<{
      message: string
      showVisualEffects?: boolean
      onComplete?: () => void
    }>(),
    {
      showVisualEffects: false,
    },
  )

  const soundStore = useSoundStore()

  const totalMessages = 15
  const isVisible = ref(true)
  const randomMessage = ref(props.message || `motivationMessage${getRandomNumber(totalMessages)}`)

  onMounted(() => {
    soundStore.playSound('gameMotivationMessage')

    setTimeout(() => {
      isVisible.value = false

      if (props.onComplete) {
        props.onComplete()
      }
    }, 1000)
  })
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-0 opacity-0 translate-y-4"
    enter-to-class="transform scale-100 opacity-100 translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform scale-100 opacity-100 translate-y-0"
    leave-to-class="transform scale-0 opacity-0 translate-y-4"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 flex items-center justify-center pointer-events-none z-40"
    >
      <svg
        width="100%"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="animate-bounce w-full"
      >
        <text
          :class="props.showVisualEffects ? 'fill-transparent' : 'fill-blue-600 stroke-blue-600'"
          :style="props.showVisualEffects ? 'stroke: url(#rainbowGradient)' : ''"
          class="font-sans text-[40px]"
          x="50"
          y="57.208"
          text-anchor="middle"
          stroke-width="12"
          stroke-linejoin="round"
          stroke-linecap="round"
        >
          {{ $t(randomMessage) }}
        </text>

        <text
          class="fill-white font-sans text-[40px]"
          x="50"
          y="57.208"
          text-anchor="middle"
        >
          {{ $t(randomMessage) }}
        </text>

        <defs v-if="props.showVisualEffects">
          <linearGradient
            id="rainbowGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="16.66%"
              style="stop-color: #ff8000; stop-opacity: 1"
            />
            <stop
              offset="66.66%"
              style="stop-color: #0080ff; stop-opacity: 1"
            />
            <stop
              offset="83.33%"
              style="stop-color: #8000ff; stop-opacity: 1"
            />
            <stop
              offset="100%"
              style="stop-color: #ff0080; stop-opacity: 1"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </Transition>
</template>

<style scoped>
  .animate-bounce {
    animation: bounce 600ms ease-in-out;
  }

  @keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
      transform: translate3d(0, -30px, 0);
    }
    70% {
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
  }
</style>
