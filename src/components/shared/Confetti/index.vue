<script setup lang="ts">
  import { ref, onUnmounted, watch } from 'vue'
  import type { ConfettiPiece } from './types'
  import { useSoundStore } from '@/stores/sounds.store'

  const props = withDefaults(
    defineProps<{
      isActive: boolean
      duration?: number
    }>(),
    {
      duration: 3000,
    },
  )

  const soundStore = useSoundStore()

  const emit = defineEmits<{
    animationComplete: []
  }>()

  const confettiPieces = ref<ConfettiPiece[]>([])
  const animationId = ref<number | null>(null)
  const isAnimating = ref(false)

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

  function createConfettiPiece(): ConfettiPiece {
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      opacity: 1,
    }
  }

  function removeOffScreenPieces(piece: ConfettiPiece, index: number) {
    if (piece.y > window.innerHeight + 50 || piece.opacity <= 0) {
      confettiPieces.value.splice(index, 1)
    }
  }

  function animate() {
    if (!isAnimating.value) {
      return
    }

    confettiPieces.value.forEach((piece, index) => {
      piece.x += piece.vx
      piece.y += piece.vy
      piece.rotation += piece.rotationSpeed
      piece.vy += 0.1 // Gravity
      piece.opacity -= 0.005 // Fade out

      removeOffScreenPieces(piece, index)
    })

    animationId.value = requestAnimationFrame(animate)
  }

  function startConfetti() {
    if (isAnimating.value) {
      return
    }

    soundStore.playSound('gameConfetti')
    isAnimating.value = true
    confettiPieces.value = []

    for (let i = 0; i < 50; i++) {
      confettiPieces.value.push(createConfettiPiece())
    }

    const addConfettiInterval = setInterval(() => {
      if (confettiPieces.value.length < 100) {
        confettiPieces.value.push(createConfettiPiece())
      }
    }, 50)

    setTimeout(() => {
      clearInterval(addConfettiInterval)
    }, props.duration * 0.3)

    setTimeout(() => {
      isAnimating.value = false
      if (animationId.value) {
        cancelAnimationFrame(animationId.value)
      }
      emit('animationComplete')
    }, props.duration)

    animate()
  }

  function stopConfetti() {
    isAnimating.value = false
    confettiPieces.value = []

    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }
  }

  watch(
    () => props.isActive,
    (isActive) => {
      if (isActive) {
        startConfetti()
      } else {
        stopConfetti()
      }
    },
  )

  onUnmounted(() => stopConfetti())
</script>

<template>
  <div
    v-if="isActive || isAnimating"
    class="fixed inset-0 pointer-events-none z-[51]"
  >
    <div
      v-for="piece in confettiPieces"
      :key="piece.id"
      class="absolute w-2 h-2 rounded-sm"
      :style="{
        left: `${piece.x}px`,
        top: `${piece.y}px`,
        transform: `rotate(${piece.rotation}deg)`,
        backgroundColor: piece.color,
        width: `${piece.size}px`,
        height: `${piece.size}px`,
        opacity: piece.opacity,
      }"
    />
  </div>
</template>
