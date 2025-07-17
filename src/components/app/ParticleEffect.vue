<script setup lang="ts">
  import { computed, watch } from 'vue'
  import {
    useParticleSystem,
    type SparkleParticle,
    type ConfettiParticle,
  } from '@/composables/useParticleSystem'
  import { useSoundStore } from '@/stores/sounds.store'
  import { getRandomBoolean, getRandomNumber } from '@/utils'

  const props = withDefaults(
    defineProps<{
      type: 'sparkle' | 'confetti'
      isActive: boolean
      maxParticles?: number
      duration?: number
      spawnRate?: number
      spawnArea?: { width: number; height: number }
      velocity?: { minX: number; maxX: number; minY: number; maxY: number }
      gravity?: number
      fadeRate?: number
      colors?: string[]
      sound?: string
      onComplete?: () => void
    }>(),
    {
      maxParticles: 50,
      duration: 3000,
      spawnRate: 0.3,
      gravity: 0.05,
      fadeRate: 0.02,
      sound: '',
    },
  )

  const emit = defineEmits<{
    animationComplete: []
  }>()

  const soundStore = useSoundStore()

  const defaultSpawnArea = { width: 60, height: 60 }
  const defaultVelocity = { minX: -1, maxX: 1, minY: -2, maxY: 0 }
  const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']

  const particleSystem = useParticleSystem({
    type: props.type,
    spawnRate: props.spawnRate,
    maxParticles: props.maxParticles,
    duration: props.duration,
    colors: props.colors || defaultColors,
    spawnArea: props.spawnArea || defaultSpawnArea,
    velocity: props.velocity || defaultVelocity,
    gravity: props.gravity,
    fadeRate: props.fadeRate,
  })

  const sparkleParticles = computed(() =>
    particleSystem.particles.value.filter((p): p is SparkleParticle => p.type === 'sparkle'),
  )

  const confettiParticles = computed(() =>
    particleSystem.particles.value.filter((p): p is ConfettiParticle => p.type === 'confetti'),
  )

  const isActive = computed(() => particleSystem.isActive.value)

  function startEffect() {
    if (props.sound) {
      soundStore.playSound(props.sound as any)
    }

    particleSystem.start()

    // If confetti > do an initial burst
    if (props.type === 'confetti') {
      particleSystem.burst(props.maxParticles, window.innerWidth / 2, -20)

      setTimeout(() => {
        particleSystem.stop()
        emit('animationComplete')

        if (props.onComplete) {
          props.onComplete()
        }
      }, props.duration)
    }
  }

  function stopEffect() {
    particleSystem.stop()
  }

  function getSparkleSize() {
    const size = getRandomNumber(1, 3)
    if (size === 1) {
      return 'xs'
    } else if (size === 2) {
      return 'sm'
    } else {
      return 'md'
    }
  }

  function getSparkleColor() {
    const color = getRandomNumber(1, 3)

    if (color === 1) {
      return 'blue-400'
    } else if (color === 2) {
      return 'blue-300'
    } else {
      return 'blue-600'
    }
  }

  function getSparkleType() {
    return getRandomBoolean() ? 'stroke' : 'fill'
  }

  watch(
    () => props.isActive,
    (isActive) => {
      if (isActive) {
        startEffect()
      } else {
        stopEffect()
      }
    },
  )
</script>

<template>
  <div
    v-if="isActive"
    class="absolute inset-0 pointer-events-none"
    :class="type === 'confetti' ? 'absolute z-[51]' : ''"
  >
    <template v-if="type === 'sparkle'">
      <div
        v-for="particle in sparkleParticles"
        :key="particle.id"
        class="absolute"
        :style="{
          left: `calc(50% + ${particle.x}px)`,
          top: `calc(50% + ${particle.y}px)`,
          opacity: particle.opacity,
          transform: `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
          transition: 'none',
        }"
      >
        <Icon
          name="sparkle"
          :size="getSparkleSize()"
          :color="getSparkleColor()"
          :type="getSparkleType()"
        />
      </div>
    </template>

    <template v-if="type === 'confetti'">
      <div
        v-for="particle in confettiParticles"
        :key="particle.id"
        class="absolute w-2 h-2 rounded-sm"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          transform: `rotate(${particle.rotation}deg)`,
          backgroundColor: particle.color,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          opacity: particle.opacity,
        }"
      />
    </template>
  </div>
</template>
