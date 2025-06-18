import { ref, watch } from 'vue'
import { Bus } from '@/services/Bus.service'
import { useGameStore } from '@/stores/gameStore'
import { useTileGeneration } from './useTileGeneration'
import { useCollisionDetection } from './useCollisionDetection'

/**
 * Handles the animation of rows
 */
export function useRowAnimation() {
  const gameStore = useGameStore()
  const { updateTilesOnRowReset } = useTileGeneration()
  const { removeFromCollidedRows } = useCollisionDetection()

  const isAnimating = ref(false)
  let animationFrame: number
  let activeRows = new Map<string, number>() // Store active rows and their speeds

  /**
   * Requests the next animation frame for a row
   *
   * @param row - The row element to animate
   */
  function requestNextFrame(row: HTMLElement) {
    if (gameStore.isPaused) {
      stopAnimation()
      return
    }

    animationFrame = requestAnimationFrame(() => updatePosition(row))
  }

  /**
   * Updates the position of a row
   *
   * @param row - The row element to update
   */
  function updatePosition(row: HTMLElement) {
    if (!row) return

    const startTime = Number(row.dataset.startTime || 0)
    const currentTime = getCurrentTime()

    if (currentTime < startTime) {
      requestNextFrame(row)
      return
    }

    const currentTransform = window.getComputedStyle(row).transform
    const matrix = new DOMMatrix(currentTransform)
    const currentY = matrix.m42

    const container = row.parentElement
    if (!container) return

    const containerHeight = container.offsetHeight
    let newY = currentY + gameStore.gameSpeed

    if (newY > containerHeight) {
      const rowIndex = Number(row.dataset.index || 0)
      const baseDelay = Number(row.dataset.baseDelay || 4000)
      const totalRows = activeRows.size

      const cycleDuration = totalRows * baseDelay
      const firstRowStartTime = Number(row.dataset.firstRowStartTime || startTime)
      const timeSinceFirstRow = currentTime - firstRowStartTime
      const currentCycle = Math.floor(timeSinceFirstRow / cycleDuration)
      const nextCycleStartTime = firstRowStartTime + (currentCycle + 1) * cycleDuration
      const newStartTime = nextCycleStartTime + rowIndex * baseDelay

      newY = -row.offsetHeight
      row.dataset.startTime = String(newStartTime)

      Bus.emit('tileRowReset', { rowId: row.id })
      updateTilesOnRowReset(row.id)
      removeFromCollidedRows(row.id)
    }

    const existingStyles = row.style.cssText
    row.style.cssText = `${existingStyles}; transform: translateY(${newY}px);`

    requestNextFrame(row)
  }

  /**
   * Animates a row from top to bottom
   *
   * @param rowId - The ID of the row to animate
   * @param delay - The delay before starting the animation in milliseconds (default: null)
   */
  function animateRow(rowId: string, delay: number = 0) {
    const row = document.getElementById(rowId)

    if (!row) {
      return
    }

    if (!row.dataset.startTime) {
      row.dataset.startTime = String(getCurrentTime() + delay)
    }

    activeRows.set(rowId, gameStore.gameSpeed)
    requestNextFrame(row)
  }

  /**
   * Starts animating all rows with a delay between each row
   *
   * @param rowIds - Array of row IDs to animate
   * @param delay - The delay between each row animation in milliseconds (default: 4000)
   */
  function startAnimation(rowIds: string[], delay: number = 4000) {
    activeRows.clear()
    const firstRowStartTime = getCurrentTime()

    rowIds.forEach((rowId, index) => {
      const row = document.getElementById(rowId)
      if (!row) return

      // Store index and base delay for future resets
      row.dataset.index = String(index)
      row.dataset.baseDelay = String(delay)
      row.dataset.firstRowStartTime = String(firstRowStartTime)

      animateRow(rowId, index * delay)
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

  /**
   * Resumes the animation of all rows with their current timing
   */
  function resumeRows() {
    activeRows.forEach((_, rowId) => {
      const row = document.getElementById(rowId)
      if (row) {
        requestNextFrame(row)
      }
    })
  }

  watch(
    () => gameStore.isPaused,
    (isPaused) => {
      if (!isPaused && activeRows.size > 0) {
        resumeRows()
      }
    },
  )

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
  }
}
