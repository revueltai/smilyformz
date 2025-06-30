<script setup lang="ts">
  import ModalControls from '@/components/app/ModalControls.vue'
  import GameOverScoreSign from '@/components/app/GameOverScoreSign.vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/game.store'

  const router = useRouter()
  const modalStore = useModalStore()
  const gameStore = useGameStore()

  function handleHome() {
    modalStore.closeModal()
    router.push('/home')
  }

  function handlePlayAgain() {
    modalStore.closeModal()
    gameStore.resetGame()
  }
</script>

<template>
  <div class="flex flex-col items-center gap-8 w-full">
    <GameOverScoreSign />

    <ModalControls
      class="w-full"
      :cta-text="$t('playAgain')"
      @home="handleHome"
      @click="handlePlayAgain"
    />
  </div>
</template>
