<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { MODALS } from '@/configs/constants'
  import { useGameStore } from '@/stores/gameStore'

  const router = useRouter()
  const modalStore = useModalStore()
  const gameStore = useGameStore()

  function handleConfirm() {
    gameStore.resetGame()
    modalStore.closeModal()
    router.push('/home')
  }

  function handleCancel() {
    modalStore.closeModal()
    modalStore.openModal(MODALS.PAUSE)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-slate-600">{{ $t('quitGameConfirmation') }}</p>

    <div class="flex gap-3">
      <Button
        class="flex-1"
        @click="handleCancel"
      >
        {{ $t('cancel') }}
      </Button>

      <Button
        class="flex-1"
        background-color="rose-50"
        background-color-hover="rose-100"
        border-color="rose-600"
        border-color-hover="rose-800"
        text-color="rose-800"
        @click="handleConfirm"
      >
        {{ $t('quit') }}
      </Button>
    </div>
  </div>
</template>
