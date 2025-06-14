import { Bus } from '@/services/Bus.service'
import { ref } from 'vue'

/**
 * Handles the animation of the tile rows in the board
 *
 * @returns An object containing the animation state and functions to start and stop the animation
 */
export function useRowAnimation() {
  const isAnimating = ref(false)
  let animationFrame: number

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
    if (!container) return
    const containerHeight = container.offsetHeight

    let newY = currentY + speed

    if (newY > containerHeight) {
      newY = -row.offsetHeight
      Bus.emit('tileRowReset', { rowId: row.id })
    }

    row.style.transform = `translateY(${newY}px)`

    animationFrame = requestAnimationFrame(() => updatePosition(row, speed))
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

    animationFrame = requestAnimationFrame(() => updatePosition(row, speed))
  }

  /**
   * Starts animating all rows with a delay between each row
   *
   * @param rowIds - Array of row IDs to animate
   * @param speed - The speed of the animation in pixels per frame
   * @param delay - The delay between each row animation in milliseconds (default: 6000)
   */
  function startAnimation(rowIds: string[], speed: number = 2, delay: number = 6000) {
    if (isAnimating.value) {
      return
    }

    isAnimating.value = true

    rowIds.forEach((rowId, index) => {
      setTimeout(() => animateRow(rowId, speed), index * delay)
    })
  }

  /**
   * Stops the animation
   */
  function stopAnimation() {
    if (!isAnimating.value) {
      return
    }

    isAnimating.value = false
    cancelAnimationFrame(animationFrame)
  }

  return {
    isAnimating,
    startAnimation,
    stopAnimation,
  }
}
