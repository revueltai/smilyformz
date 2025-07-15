import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Handles PWA detection.
 * Will return a boolean value if the app is running in a PWA environment.
 *
 * @returns {boolean} True if the app is running in a PWA environment, false otherwise.
 */
export function usePWA(): boolean {
  let isPWA = false

  if (window) {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true

    isPWA = isStandalone || isFullscreen || isMinimalUI || isIOSStandalone
  }

  return isPWA
}

/**
 * Handles PWA installation functionality.
 * Provides a button to trigger the browser's native install prompt
 * when the app can be installed.
 */
export function usePwaInstall() {
  const isDevelopment = import.meta.env.DEV

  const deferredInstallPrompt = ref<any>(null)
  const canInstall = ref(false)

  /**
   * Handles the beforeinstallprompt event to store the deferred prompt.
   * @param event - The event object.
   */
  function handleBeforeInstallPrompt(event: Event) {
    event.preventDefault()
    deferredInstallPrompt.value = event
    canInstall.value = !usePWA() // Only allow install if not already in PWA mode
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

  /**
   * Simulates the browser's native install prompt (for development testing).
   */
  function simulateInstallPrompt() {
    if (isDevelopment) {
      alert('🔧 Development mode: Mock of the browser\'s "Add to Home Screen" prompt')
      return true
    }

    return false
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleClearInstallPrompt)

    // Enable install button in dev mode for testing (but still respect if already installed)
    if (isDevelopment && !usePWA()) {
      canInstall.value = true
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleClearInstallPrompt)
  })

  return {
    canInstall,
    installApp,
    simulateInstallPrompt,
  }
}
