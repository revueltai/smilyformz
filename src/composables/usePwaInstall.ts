import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Handles PWA installation functionality.
 * Provides a button to trigger the browser's native install prompt
 * when the app can be installed.
 */
export function usePwaInstall() {
  const deferredInstallPrompt = ref<any>(null)
  const canInstall = ref(false)

  /**
   * Handles the beforeinstallprompt event to store the deferred prompt.
   * @param event - The event object.
   */
  function handleBeforeInstallPrompt(event: Event) {
    event.preventDefault()
    deferredInstallPrompt.value = event
    canInstall.value = true
  }

  /**
   * Clears the deferred install prompt when the app is installed.
   */
  function handleClearInstallPrompt() {
    deferredInstallPrompt.value = null
    canInstall.value = false
  }

  /**
   * Triggers the install prompt.
   * @returns True if the install prompt was shown, false otherwise.
   */
  async function installApp() {
    if (!deferredInstallPrompt.value) {
      return false
    }

    try {
      deferredInstallPrompt.value.prompt()

      const { outcome } = await deferredInstallPrompt.value.userChoice

      handleClearInstallPrompt()

      return outcome === 'accepted'
    } catch (error) {
      console.error('Error during app installation:', error)
      return false
    }
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleClearInstallPrompt)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleClearInstallPrompt)
  })

  return {
    canInstall,
    installApp,
  }
}
