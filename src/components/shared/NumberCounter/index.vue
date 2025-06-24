<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'

  type Easing = 'linear' | 'ease-out' | 'ease-in' | 'ease-in-out'

  interface Props {
    value: number
    duration?: number
    delay?: number
    easing?: Easing
  }

  const props = withDefaults(defineProps<Props>(), {
    duration: 1000,
    delay: 0,
    easing: 'ease-out',
  })

  let animationId: number | null = null

  const EASINGS = {
    linear: (t: number) => t,
    'ease-out': (t: number) => 1 - Math.pow(1 - t, 3),
    'ease-in': (t: number) => t * t * t,
    'ease-in-out': (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  }

  const displayValue = ref(0)

  function updateValue(
    currentTime: number,
    startTime: number,
    startValue: number,
    endValue: number,
    duration: number,
    easing: Easing,
  ) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const easedProgress = EASINGS[easing](progress)
    const currentValue = startValue + (endValue - startValue) * easedProgress

    if (isNaN(currentValue) || !isFinite(currentValue)) {
      displayValue.value = endValue
      return false
    }

    displayValue.value = Math.round(currentValue)

    return progress < 1
  }

  function animateValue(startValue: number, endValue: number) {
    if (isNaN(startValue) || isNaN(endValue) || !isFinite(startValue) || !isFinite(endValue)) {
      displayValue.value = endValue || 0
      return
    }

    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    const startTime = performance.now()

    function animationStep(currentTime: number) {
      const shouldContinue = updateValue(
        currentTime,
        startTime,
        startValue,
        endValue,
        props.duration,
        props.easing,
      )

      if (shouldContinue) {
        animationId = requestAnimationFrame(animationStep)
      }
    }

    setTimeout(() => (animationId = requestAnimationFrame(animationStep)), props.delay)
  }

  function startAnimation() {
    animateValue(0, props.value)
  }

  watch(
    () => props.value,
    (newValue, oldValue) => {
      const validNewValue = typeof newValue === 'number' && isFinite(newValue) ? newValue : 0
      const validOldValue = typeof oldValue === 'number' && isFinite(oldValue) ? oldValue : 0

      if (validNewValue !== validOldValue) {
        animateValue(validOldValue, validNewValue)
      }
    },
  )

  onMounted(() => startAnimation())
</script>

<template>
  <span class="number-counter">{{ displayValue }}</span>
</template>

<style scoped>
  .number-counter {
    display: inline-block;
    font-variant-numeric: tabular-nums;
  }
</style>
