<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { RouterView } from 'vue-router'
  import { isMobile, enterFullscreen, isFullscreen, isStandalone } from '@/utils'
  import { useUserStore } from '@/stores/user.store'
  import ModalContainer from '@/components/shared/Modal/Container.vue'
  import Toast from '@/components/shared/Toast/index.vue'

  const events = ['click', 'touchstart', 'keydown']
  const hasInteracted = ref(false)
  const userStore = useUserStore()

  function handleFirstInteraction() {
    if (isMobile() && !hasInteracted.value && !isFullscreen()) {
      hasInteracted.value = true
      enterFullscreen()
    }
  }

  function handleFullscreenChange() {
    // TODO: Keep track of fullscreen state changes
  }

  onMounted(async () => {
    await userStore.initialize()
    userStore.setupAuthListener()

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
