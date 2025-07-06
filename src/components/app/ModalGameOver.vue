<script setup lang="ts">
  import ModalControls from '@/components/app/ModalControls.vue'
  import GameOverScoreSign from '@/components/app/GameOverScoreSign.vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'

  const emit = defineEmits<{
    (e: 'playAgain'): void
  }>()

  const router = useRouter()
  const modalStore = useModalStore()

  function handleHome() {
    modalStore.closeModal()
    router.push('/home')
  }

  function handlePlayAgain() {
    modalStore.closeModal()
    emit('playAgain')
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
