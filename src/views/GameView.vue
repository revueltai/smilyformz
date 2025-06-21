<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/game.store'
  import { useUserStore } from '@/stores/user.store'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { MODALS } from '@/configs/constants'
  import ModalPause from '@/components/app/ModalPause.vue'
  import ModalGameOver from '@/components/app/ModalGameOver.vue'
  import ModalGameOverGuest from '@/components/app/ModalGameOverGuest.vue'
  import ModalQuitConfirm from '@/components/app/ModalQuitConfirm.vue'
  import ModalTutorial from '@/components/app/ModalTutorial.vue'
  import GameHeader from '@/components/app/GameHeader.vue'
  import GameBoard from '@/components/app/GameBoard.vue'
  import GameStartCountdown from '@/components/app/GameStartCountdown.vue'
  import GameEndCountdown from '@/components/app/GameEndCountdown.vue'
  import SpeedIncreaseNotification from '@/components/app/SpeedIncreaseNotification.vue'
  import CharacterMessageContainer from '@/components/app/CharacterMessage/Container.vue'
  import ModalCreateAccount from '@/components/app/ModalCreateAccount.vue'

  const gameStore = useGameStore()
  const modalStore = useModalStore()
  const userStore = useUserStore()
  const { resetCollisionDetection } = useCollisionDetection()
  const showGameEndCountdown = ref(false)
  const router = useRouter()

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
    if (userStore.isAuthenticated) {
      modalStore.openModal(MODALS.GAME_OVER)
    } else {
      modalStore.openModal(MODALS.GAME_OVER_GUEST)
    }
  }

  function handleGoHome() {
    modalStore.closeModal()
    router.push('/home')
  }

  function handleTutorial() {
    gameStore.pause()
    modalStore.openModal('tutorial')
  }

  function handleCreateAccount() {
    modalStore.closeModal()
    modalStore.openModal(MODALS.CREATE_ACCOUNT)
  }

  async function handleGameSessionSave() {
    if (userStore.isAuthenticated && gameStore.score > 0) {
      try {
        const totalSeconds = gameStore.time.minutes * 60 + gameStore.time.seconds
        await gameStore.saveGameSession(gameStore.score, totalSeconds)
      } catch (error) {
        console.error('Failed to save game session:', error)
      }
    }
  }

  watch(
    () => gameStore.isGameOver,
    async (isGameOver) => {
      if (isGameOver) {
        showGameEndCountdown.value = true
        await handleGameSessionSave()
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

  watch(
    () => userStore.isAuthenticated,
    (isAuthenticated) => {
      if (isAuthenticated) {
        // Close any modals when user becomes authenticated
        modalStore.closeModal()
      }
    },
  )

  onMounted(() => {
    gameStore.resetGame()
    resetCollisionDetection()

    // Close any modals if user is already authenticated
    if (userStore.isAuthenticated) {
      modalStore.closeModal()
    }
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
      :name="MODALS.GAME_OVER_GUEST"
      :heading="$t('gameOverGuest')"
      @close="handleGoHome"
    >
      <ModalGameOverGuest @create-account="handleCreateAccount" />
    </Modal>

    <Modal
      name="tutorial"
      :heading="$t('howToPlay')"
      @close="handleResume"
    >
      <ModalTutorial />
    </Modal>

    <Modal
      :name="MODALS.CREATE_ACCOUNT"
      :heading="$t('createAnAccount')"
      @close="handleGoHome"
    >
      <ModalCreateAccount />
    </Modal>
  </div>
</template>
