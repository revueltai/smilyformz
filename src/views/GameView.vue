<script setup lang="ts">
  import { useModalStore } from '@/stores/modal.store'
  import { MODALS } from '@/configs/constants'
  import GameHeader from '@/components/app/GameHeader.vue'
  import ModalPause from '@/components/app/ModalPause.vue'
  import ModalQuitConfirm from '@/components/app/ModalQuitConfirm.vue'
  import GameBoard from '@/components/app/GameBoard.vue'
  import GameCountdown from '@/components/app/GameCountdown.vue'
  import { useGameStore } from '@/stores/gameStore'

  const gameStore = useGameStore()
  const modalStore = useModalStore()

  function handlePause() {
    gameStore.pause()
    modalStore.openModal(MODALS.PAUSE)
  }

  function handleResume() {
    gameStore.resume()
    modalStore.closeModal()
  }

  function handleCountdownComplete() {
    gameStore.startGame()
  }
</script>

<template>
  <div class="relative h-full py-0 px-3">
    <GameHeader
      :time="gameStore.formattedTime"
      :score="gameStore.score"
      :is-paused="gameStore.isPaused"
      @pause="handlePause"
    />

    <GameBoard
      :active-tile-color="gameStore.character.shapeColor"
      :is-paused="gameStore.isPaused"
    />

    <GameCountdown
      v-if="!gameStore.isGameStarted"
      :on-complete="handleCountdownComplete"
    />

    <Modal
      :name="MODALS.PAUSE"
      :heading="$t('gamePaused')"
    >
      <ModalPause @resume="handleResume" />
    </Modal>

    <Modal
      :name="MODALS.QUIT_CONFIRM"
      :heading="$t('quitGame')"
      :has-close-button="false"
    >
      <ModalQuitConfirm />
    </Modal>
  </div>
</template>
