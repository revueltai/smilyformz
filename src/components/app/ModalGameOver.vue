<script setup lang="ts">
  import StatBlock from '@/components/app/StatBlock.vue'
  import ModalControls from '@/components/app/ModalControls.vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/game.store'

  const router = useRouter()
  const modalStore = useModalStore()
  const gameStore = useGameStore()

  function handleShareScore() {
    console.log('share')
  }

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
  <div class="flex flex-col gap-4 h-[60vh]">
    <StatBlock
      :label="$t('youScored')"
      :value="gameStore.score"
      variant="score"
      class="shrink-0"
      @click="handleShareScore"
    />

    <ModalControls
      class="shrink-0"
      :cta-text="$t('playAgain')"
      @home="handleHome"
      @click="handlePlayAgain"
    />
  </div>
</template>
