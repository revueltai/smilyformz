<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { isMobile, enterFullscreen, isFullscreen, isStandalone } from '@/utils'
  import ModalContainer from '@/components/shared/Modal/Container.vue'
  import Toast from '@/components/shared/Toast/index.vue'

  const events = ['click', 'touchstart', 'keydown']
  const hasInteracted = ref(false)

  function handleFirstInteraction() {
    if (isMobile() && !hasInteracted.value && !isFullscreen()) {
      hasInteracted.value = true
      enterFullscreen()
    }
  }

  function handleFullscreenChange() {
    // TODO: Keep track of fullscreen state changes
  }

  onMounted(() => {
    // If running from home screen, enter fullscreen immediately
    if (isMobile() && isStandalone() && !isFullscreen()) {
      enterFullscreen()
    }

    // For browser mode, wait for first user interaction
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
</template>

<style>
  #app {
    @apply w-screen h-screen;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
