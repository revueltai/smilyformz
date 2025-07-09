<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { isMobile, enterFullscreen, isFullscreen, isStandalone } from '@/utils'
  import { useUserStore } from '@/stores/user.store'
  import { useOfflineDetection } from '@/composables/useOfflineDetection'
  import { useLocalStorage } from '@/composables/useLocalStorage'
  import ModalContainer from '@/components/shared/Modal/Container.vue'
  import ModalOffline from '@/components/app/ModalOffline.vue'
  import Toast from '@/components/shared/Toast/index.vue'
  import { MODALS } from '@/configs/constants'

  const events = ['click', 'touchstart', 'keydown']
  const hasInteracted = ref(false)
  const userStore = useUserStore()
  const { handleRetry } = useOfflineDetection()
  const localStorage = useLocalStorage()

  function handleFirstInteraction() {
    if (isMobile() && !hasInteracted.value && !isFullscreen()) {
      hasInteracted.value = true
      enterFullscreen()
    }
  }

  function handleFullscreenChange() {
    // TODO: Keep track of fullscreen state changes
  }

  function initializeFirstTimeTutorial() {
    if (!localStorage.has('firstTimeTutorialDone')) {
      localStorage.setBoolean('firstTimeTutorialDone', false)
    }
  }

  onMounted(async () => {
    await userStore.initialize()
    userStore.setupAuthListener()

    initializeFirstTimeTutorial()

    if (isMobile() && isStandalone() && !isFullscreen()) {
      enterFullscreen()
    }

    if (isMobile() && !isStandalone()) {
      events.forEach((event) => {
        document.addEventListener(event, handleFirstInteraction, { once: true })
      })
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  })

  onUnmounted(() => {
    events.forEach((event) => {
      document.removeEventListener(event, handleFirstInteraction)
    })

    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  })
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      name="fade"
      mode="out-in"
    >
      <Component :is="Component" />
    </Transition>
  </RouterView>

  <ModalContainer />
  <Toast />

  <Modal
    :name="MODALS.OFFLINE"
    :heading="$t('noConnection')"
    :has-close-button="false"
  >
    <ModalOffline @retry="handleRetry" />
  </Modal>
</template>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
