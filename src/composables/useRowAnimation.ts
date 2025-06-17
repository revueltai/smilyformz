import { ref, watch } from 'vue'
import { Bus } from '@/services/Bus.service'
import { useGameStore } from '@/stores/gameStore'

/**
 * Composable for animating rows
 */
export function useRowAnimation() {
  const gameStore = useGameStore()
  const isAnimating = ref(false)
  let animationFrame: number
  let activeRows = new Map<string, number>() // Store active rows and their speeds

  /**
   * Requests the next animation frame for a row
   *
   * @param row - The row element to animate
   * @param speed - The speed of the animation in pixels per frame
   */
  function requestNextFrame(row: HTMLElement, speed: number) {
    if (gameStore.isPaused) {
      stopAnimation()
      return
    }

    animationFrame = requestAnimationFrame(() => updatePosition(row, speed))
  }

  /**
   * Updates the position of a row
   *
   * @param row - The row element to update
   * @param speed - The speed of the animation in pixels per frame
   */
  function updatePosition(row: HTMLElement, speed: number) {
    if (!row) return

    const startTime = Number(row.dataset.startTime || 0)
    const currentTime = getCurrentTime()

    if (currentTime < startTime) {
      requestNextFrame(row, speed)
      return
    }

    const currentTransform = window.getComputedStyle(row).transform
    const matrix = new DOMMatrix(currentTransform)
    const currentY = matrix.m42

    const container = row.parentElement
    if (!container) return

    const containerHeight = container.offsetHeight
    let newY = currentY + speed

    if (newY > containerHeight) {
      const rowIndex = Number(row.dataset.index || 0)
      const baseDelay = Number(row.dataset.baseDelay || 4000)

      newY = -row.offsetHeight
      row.dataset.startTime = String(getCurrentTime() + rowIndex * baseDelay)

      Bus.emit('tileRowReset', { rowId: row.id })
    }

    const existingStyles = row.style.cssText
    row.style.cssText = `${existingStyles}; transform: translateY(${newY}px);`

    requestNextFrame(row, speed)
  }

  /**
   * Animates a row from top to bottom
   *
   * @param rowId - The ID of the row to animate
   * @param speed - The speed of the animation in pixels per frame
   * @param delay - The delay before starting the animation in milliseconds (default: null)
   */
  function animateRow(rowId: string, speed: number = 2, delay: number = 0) {
    const row = document.getElementById(rowId)

    if (!row) {
      return
    }

    row.dataset.startTime = String(getCurrentTime() + delay)
    activeRows.set(rowId, speed)
    requestNextFrame(row, speed)
  }

  /**
   * Starts animating all rows with a delay between each row
   *
   * @param rowIds - Array of row IDs to animate
   * @param speed - The speed of the animation in pixels per frame
   * @param delay - The delay between each row animation in milliseconds (default: 4000)
   */
  function startAnimation(rowIds: string[], speed: number = 2, delay: number = 4000) {
    activeRows.clear()
    rowIds.forEach((rowId, index) => {
      const row = document.getElementById(rowId)
      if (!row) return

      // Store index and base delay for future resets
      row.dataset.index = String(index)
      row.dataset.baseDelay = String(delay)

      animateRow(rowId, speed, index * delay)
    })
  }

  /**
   * Stops the animation
   */
  function stopAnimation() {
    cancelAnimationFrame(animationFrame)
  }

  /**
   * Gets the current time in milliseconds to use when starting animations.
   */
  function getCurrentTime(): number {
    return Math.round(performance.now())
  }

  watch(
    () => gameStore.isPaused,
    (isPaused) => {
      if (!isPaused && activeRows.size > 0) {
        activeRows.forEach((speed, rowId) => animateRow(rowId, speed))
      }
    },
  )

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
  }
}
