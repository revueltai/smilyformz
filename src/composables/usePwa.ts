/**
 * Handles detection of PWA.
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
