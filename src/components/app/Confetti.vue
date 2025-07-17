<script setup lang="ts">
  import { computed } from 'vue'
  import ParticleEffect from '@/components/app/ParticleEffect.vue'

  withDefaults(
    defineProps<{
      maxPieces?: number
      isActive: boolean
      duration?: number
    }>(),
    {
      duration: 3000,
      maxPieces: 60,
    },
  )

  const emit = defineEmits<{
    animationComplete: []
  }>()

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ]

  function handleAnimationComplete() {
    emit('animationComplete')
  }

  const spawnArea = computed(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: 20,
  }))
</script>

<template>
  <ParticleEffect
    type="confetti"
    :is-active="isActive"
    :max-particles="maxPieces"
    :duration="duration"
    :colors="colors"
    :spawn-area="spawnArea"
    :velocity="{ minX: -4, maxX: 4, minY: 2, maxY: 5 }"
    :gravity="0.1"
    :fade-rate="0.005"
    sound="gameConfetti"
    @animation-complete="handleAnimationComplete"
  />
</template>
