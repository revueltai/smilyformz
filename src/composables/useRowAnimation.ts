import { watch } from 'vue'
import { Bus } from '@/services/Bus.service'
import { useGameStore } from '@/stores/gameStore'

/**
 * Handles the animation of the tile rows in the board
 *
 * @returns An object containing the animation state and functions to start and stop the animation
 */
export function useRowAnimation() {
  const gameStore = useGameStore()
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
    if (!row) {
      return
    }

    const currentTransform = window.getComputedStyle(row).transform
    const matrix = new DOMMatrix(currentTransform)
    const currentY = matrix.m42

    const container = row.parentElement
    if (!container) {
      return
    }

    const containerHeight = container.offsetHeight

    let newY = currentY + speed

    if (newY > containerHeight) {
      newY = -row.offsetHeight
      Bus.emit('tileRowReset', { rowId: row.id })
    }

    row.style.transform = `translateY(${newY}px)`

    requestNextFrame(row, speed)
  }

  /**
   * Animates a row from top to bottom
   *
   * @param rowId - The ID of the row to animate
   * @param speed - The speed of the animation in pixels per frame
   */
  function animateRow(rowId: string, speed: number = 2) {
    const row = document.getElementById(rowId)

    if (!row) {
      return
    }

    activeRows.set(rowId, speed)
    requestNextFrame(row, speed)
  }

  /**
   * Starts animating all rows with a delay between each row
   *
   * @param rowIds - Array of row IDs to animate
   * @param speed - The speed of the animation in pixels per frame
   * @param delay - The delay between each row animation in milliseconds (default: 6000)
   */
  function startAnimation(rowIds: string[], speed: number = 2, delay: number = 6000) {
    activeRows.clear()
    rowIds.forEach((rowId) => animateRow(rowId, speed))
  }

  /**
   * Stops the animation
   */
  function stopAnimation() {
    cancelAnimationFrame(animationFrame)
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
    startAnimation,
  }
}
