<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/gameStore'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { MODALS } from '@/configs/constants'
  import ModalPause from '@/components/app/ModalPause.vue'
  import ModalGameOver from '@/components/app/ModalGameOver.vue'
  import ModalQuitConfirm from '@/components/app/ModalQuitConfirm.vue'
  import ModalTutorial from '@/components/app/ModalTutorial.vue'
  import GameHeader from '@/components/app/GameHeader.vue'
  import GameBoard from '@/components/app/GameBoard.vue'
  import GameStartCountdown from '@/components/app/GameStartCountdown.vue'
  import GameEndCountdown from '@/components/app/GameEndCountdown.vue'
  import SpeedIncreaseNotification from '@/components/app/SpeedIncreaseNotification.vue'
  import CharacterMessageContainer from '@/components/app/CharacterMessage/Container.vue'

  const gameStore = useGameStore()
  const modalStore = useModalStore()
  const { resetCollisionDetection } = useCollisionDetection()
  const showGameEndCountdown = ref(false)

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

  function handleGameEndCountdownComplete() {
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
        showGameEndCountdown.value = true
      }
    },
  )

  watch(
    () => gameStore.isGameStarted,
    (isGameStarted) => {
      if (!isGameStarted) {
        showGameEndCountdown.value = false
      }
    },
  )

  onMounted(() => {
    gameStore.resetGame()
    resetCollisionDetection()
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

    <GameEndCountdown
      v-if="showGameEndCountdown"
      :on-complete="handleGameEndCountdownComplete"
    />

    <SpeedIncreaseNotification v-if="gameStore.showSpeedIncreaseNotification" />

    <CharacterMessageContainer />

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
