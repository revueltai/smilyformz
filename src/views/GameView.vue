<script setup lang="ts">
  import { watch, ref, onMounted, onUnmounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useModalStore } from '@/stores/modal.store'
  import { useGameStore } from '@/stores/game.store'
  import { useUserStore } from '@/stores/user.store'
  import { useSoundStore } from '@/stores/sounds.store'
  import { useLocalStorage } from '@/composables/useLocalStorage'
  import { MODALS, GAME_LEAGUE_LEVELS } from '@/configs/constants'
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
  import GameTimer from '@/components/app/GameTimer.vue'

  const { t } = useI18n()
  const gameStore = useGameStore()
  const modalStore = useModalStore()
  const userStore = useUserStore()
  const soundStore = useSoundStore()

  const localStorage = useLocalStorage()

  const router = useRouter()

  const showGameStartCountdown = ref(false)
  const showGameEndCountdown = ref(false)
  const wasGameRunningBeforeUnfocus = ref(false)

  const showFirstTimeTutorial = computed(() => {
    return !userStore.isAuthenticated && !localStorage.getBoolean('firstTimeTutorialDone')
  })

  function handlePause() {
    gameStore.pause()
    modalStore.openModal(MODALS.PAUSE)
  }

  function handleResume() {
    gameStore.resume()
    modalStore.closeModal()
  }

  function handleCountdownComplete() {
    showGameStartCountdown.value = false
    gameStore.startGame()
  }

  function handleGameEndCountdownComplete() {
    const currentLeagueSettings = GAME_LEAGUE_LEVELS[gameStore.leagueLevel]
    if (gameStore.score >= currentLeagueSettings.showConfettiScore) {
      gameStore.showConfetti = true
    }

    soundStore.playSound('gameOver')
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

  function handleTutorialOpen() {
    gameStore.pause()
    modalStore.openModal('tutorial')
  }

  function handleTutorialClose() {
    if (showFirstTimeTutorial.value) {
      if (!localStorage.getBoolean('firstTimeTutorialDone')) {
        showGameStartCountdown.value = true
        localStorage.setBoolean('firstTimeTutorialDone', true)
      }
    }

    modalStore.closeModal()
    gameStore.resume()
  }

  function handleShowFirstTimeTutorial() {
    if (showFirstTimeTutorial.value) {
      handleTutorialOpen()
      return
    }

    showGameStartCountdown.value = true
  }

  function handleCreateAccount() {
    modalStore.closeModal()
    modalStore.openModal(MODALS.CREATE_ACCOUNT)
  }

  function handlePlayAgain() {
    gameStore.restartGame()
    showGameStartCountdown.value = true
  }

  async function handleGameSessionSave() {
    if (userStore.isAuthenticated && gameStore.score > 0) {
      try {
        const totalSeconds = gameStore.time.minutes * 60 + gameStore.time.seconds
        await gameStore.saveGameSession(gameStore.score, totalSeconds)

        const leagueUpdate = await gameStore.checkAndUpdateLeagueLevel(gameStore.score)

        if (leagueUpdate.updated && leagueUpdate.newLeague) {
          ToastService.emitToast(
            t('leagueUpgrade', {
              league: t(GAME_LEAGUE_LEVELS[leagueUpdate.newLeague].name),
            }),
            'success',
            false,
          )
        }
      } catch (error) {
        console.error('Failed to save game session or update league level:', error)
      }
    }
  }

  function handleTabVisibilityChange() {
    if (document.hidden) {
      if (gameStore.isGameStarted && !gameStore.isPaused && !gameStore.isGameOver) {
        wasGameRunningBeforeUnfocus.value = true
        gameStore.pause()
        modalStore.openModal(MODALS.PAUSE)
      }
    } else {
      if (wasGameRunningBeforeUnfocus.value && gameStore.isPaused) {
        wasGameRunningBeforeUnfocus.value = false
      }
    }
  }

  function handleWindowFocus() {
    if (wasGameRunningBeforeUnfocus.value && gameStore.isPaused) {
      wasGameRunningBeforeUnfocus.value = false
    }
  }

  function handleWindowBlur() {
    if (gameStore.isGameStarted && !gameStore.isPaused && !gameStore.isGameOver) {
      wasGameRunningBeforeUnfocus.value = true
      gameStore.pause()
      modalStore.openModal(MODALS.PAUSE)
    }
  }

  watch(
    () => gameStore.isGameOver,
    async (isGameOver) => {
      if (isGameOver) {
        showGameEndCountdown.value = true
        soundStore.playSound('gameCountdownEnd')

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
    handleShowFirstTimeTutorial()

    document.addEventListener('visibilitychange', handleTabVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('blur', handleWindowBlur)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleTabVisibilityChange)
    window.removeEventListener('focus', handleWindowFocus)
    window.removeEventListener('blur', handleWindowBlur)
  })
</script>

<template>
  <div class="relative h-full py-0 px-3">
    <GameHeader
      :time="gameStore.formattedTime"
      :score="gameStore.score"
      :is-paused="gameStore.isPaused"
      @pause="handlePause"
      @tutorial="handleTutorialOpen"
    />

    <GameBoard
      :active-tile-color="gameStore.character.shapeColor"
      :is-paused="gameStore.isPaused"
    />

    <GameStartCountdown
      v-if="showGameStartCountdown"
      @complete="handleCountdownComplete"
    />

    <GameEndCountdown
      v-if="showGameEndCountdown"
      :on-complete="handleGameEndCountdownComplete"
    />

    <SpeedIncreaseNotification v-if="gameStore.showSpeedIncreaseNotification" />

    <CharacterMessageContainer />

    <GameTimer />

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
      <ModalGameOver @play-again="handlePlayAgain" />
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
      :name="MODALS.TUTORIAL"
      :heading="$t('howToPlay')"
      :prevent-backdrop-close="true"
      :has-close-button="showFirstTimeTutorial"
      @close="handleTutorialClose"
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
