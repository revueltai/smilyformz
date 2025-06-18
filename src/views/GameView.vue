<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/gameStore'
  import { MODALS } from '@/configs/constants'
  import ModalPause from '@/components/app/ModalPause.vue'
  import ModalGameOver from '@/components/app/ModalGameOver.vue'
  import ModalQuitConfirm from '@/components/app/ModalQuitConfirm.vue'
  import ModalTutorial from '@/components/app/ModalTutorial.vue'
  import GameHeader from '@/components/app/GameHeader.vue'
  import GameBoard from '@/components/app/GameBoard.vue'
  import GameStartCountdown from '@/components/app/GameStartCountdown.vue'
  import GameOverCountdown from '@/components/app/GameOverCountdown.vue'

  const gameStore = useGameStore()
  const modalStore = useModalStore()
  const showGameOverCountdown = ref(false)

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

  function handleGameOverCountdownComplete() {
    modalStore.openModal(MODALS.GAME_OVER)
  }

  function handleTutorial() {
    gameStore.pause()
    modalStore.openModal('tutorial')
  }

  watch(
    () => gameStore.isGameOver,
    (isGameOver) => {
      if (isGameOver) {
        showGameOverCountdown.value = true
      }
    },
  )

  onMounted(() => {
    // reset game to start fresh
    // gameStore.resetGame()
  })
</script>

<template>
  <div class="relative h-full py-0 px-3">
    <GameHeader
      :time="gameStore.formattedTime"
      :score="gameStore.score"
      :is-paused="gameStore.isPaused"
      @pause="handlePause"
      @tutorial="handleTutorial"
    />

    <GameBoard
      :active-tile-color="gameStore.character.shapeColor"
      :is-paused="gameStore.isPaused"
    />

    <GameStartCountdown
      v-if="!gameStore.isGameStarted"
      :on-complete="handleCountdownComplete"
    />

    <GameOverCountdown
      v-if="showGameOverCountdown"
      :on-complete="handleGameOverCountdownComplete"
    />

    <Modal
      :name="MODALS.PAUSE"
      :heading="$t('gamePaused')"
      @close="handleResume"
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

    <Modal
      :name="MODALS.GAME_OVER"
      :heading="$t('gameOver')"
      :has-close-button="false"
    >
      <ModalGameOver />
    </Modal>

    <Modal
      name="tutorial"
      :heading="$t('howToPlay')"
      @close="handleResume"
    >
      <ModalTutorial />
    </Modal>
  </div>
</template>
