<script setup lang="ts">
  import { watch, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/game.store'
  import { useUserStore } from '@/stores/user.store'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { MODALS } from '@/configs/constants'
  import { CONFETTI_SCORE } from '@/configs/constants'
  import { ToastService } from '@/components/shared/Toast/service'
  import ModalPause from '@/components/app/ModalPause.vue'
  import ModalGameOver from '@/components/app/ModalGameOver.vue'
  import ModalGameOverGuest from '@/components/app/ModalGameOverGuest.vue'
  import ModalQuitConfirm from '@/components/app/ModalQuitConfirm.vue'
  import ModalTutorial from '@/components/app/ModalTutorial.vue'
  import ModalCreateAccount from '@/components/app/ModalCreateAccount.vue'
  import ModalShare from '@/components/app/ModalShare.vue'
  import GameHeader from '@/components/app/GameHeader.vue'
  import GameBoard from '@/components/app/GameBoard.vue'
  import GameStartCountdown from '@/components/app/GameStartCountdown.vue'
  import GameEndCountdown from '@/components/app/GameEndCountdown.vue'
  import SpeedIncreaseNotification from '@/components/app/SpeedIncreaseNotification.vue'
  import CharacterMessageContainer from '@/components/app/CharacterMessage/Container.vue'
  import Confetti from '@/components/shared/Confetti/index.vue'

  const { t } = useI18n()
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
    if (gameStore.score >= CONFETTI_SCORE) {
      gameStore.showConfetti = true
    }

    handleShowGameOverModal()
  }

  function handleShowGameOverModal() {
    modalStore.closeModal()

    if (userStore.isAuthenticated) {
      modalStore.openModal(MODALS.GAME_OVER)
    } else {
      modalStore.openModal(MODALS.GAME_OVER_GUEST)
    }
  }

  function handleConfettiComplete() {
    gameStore.showConfetti = false
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

        const leagueUpdate = await gameStore.checkAndUpdateLeagueLevel(gameStore.score)

        if (leagueUpdate.updated && leagueUpdate.newLeague) {
          ToastService.emitToast(
            t('leagueUpgrade', { league: leagueUpdate.newLeague }),
            'success',
            false,
          )
        }
      } catch (error) {
        console.error('Failed to save game session or update league level:', error)
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
        modalStore.closeModal()
      }
    },
  )

  onMounted(() => {
    gameStore.resetGame()
    resetCollisionDetection()

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
      :prevent-backdrop-close="true"
      :has-close-button="false"
    >
      <ModalGameOver />
    </Modal>

    <Modal
      :name="MODALS.GAME_OVER_GUEST"
      :heading="$t('gameOverGuest')"
      :prevent-backdrop-close="true"
      :has-close-button="true"
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
      :name="MODALS.SHARE"
      :heading="$t('shareScore')"
      :prevent-backdrop-close="true"
      @close="handleShowGameOverModal"
    >
      <ModalShare
        mode="gameOverScore"
        :score="gameStore.score"
      />
    </Modal>

    <Modal
      :name="MODALS.CREATE_ACCOUNT"
      :heading="$t('createAnAccount')"
      @close="handleGoHome"
    >
      <ModalCreateAccount />
    </Modal>

    <Confetti
      :is-active="gameStore.showConfetti"
      @animation-complete="handleConfettiComplete"
    />
  </div>
</template>
