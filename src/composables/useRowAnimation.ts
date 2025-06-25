import { ref, watch } from 'vue'
import { Bus } from '@/services/Bus.service'
import { useGameStore } from '@/stores/game.store'
import { useTileGeneration } from './useTileGeneration'
import { useCollisionDetection } from './useCollisionDetection'

/**
 * Handles the animation of rows on the game board.
 * It also handles the collision detection and the tile generation.
 * It also handles the row reset and the row spacing.
 * It also handles the row animation and the row spacing.
 * It also handles the row animation and the row spacing.
 */
export function useRowAnimation() {
  const gameStore = useGameStore()
  const { updateTilesOnRowReset } = useTileGeneration()
  const { removeFromCollidedRows } = useCollisionDetection()

  const isAnimating = ref(false)
  const rowSpacing = ref(gameStore.initialRowSpacing)

  let animationFrame: number
  let activeRows = new Map<string, number>()

  /**
   * Gets a row element by ID with validation
   */
  function getRowElement(rowId: string): HTMLElement | null {
    const row = document.getElementById(rowId)
    return row || null
  }

  /**
   * Calculates the offset position for a row based on its index
   */
  function calculateRowOffset(rowIndex: number): number {
    return -(rowIndex + 1) * rowSpacing.value
  }

  /**
   * Sets the position and dataset properties for a row
   */
  function setRowPosition(row: HTMLElement, rowIndex: number, offset: number): void {
    row.dataset.rowIndex = String(rowIndex)
    row.dataset.rowOffset = String(offset)
    row.style.transform = `translateY(${offset}px)`
  }

  /**
   * Positions a single row at its calculated offset
   */
  function positionRow(rowId: string, rowIndex: number): void {
    const row = getRowElement(rowId)
    if (!row) return

    const offset = calculateRowOffset(rowIndex)
    setRowPosition(row, rowIndex, offset)
  }

  /**
   * Gets the current Y position of a row from its transform
   */
  function getCurrentRowYPosition(row: HTMLElement): number {
    const currentTransform = window.getComputedStyle(row).transform
    const matrix = new DOMMatrix(currentTransform)
    return matrix.m42
  }

  /**
   * Calculates the new Y position for a row based on current position and game speed
   */
  function calculateNewRowPosition(currentY: number): number {
    return currentY + gameStore.gameSpeed
  }

  /**
   * Checks if a row has reached the bottom of its container
   */
  function hasRowReachedBottom(row: HTMLElement, newY: number): boolean {
    const container = row.parentElement
    if (!container) return false

    const containerHeight = container.offsetHeight
    return newY > containerHeight
  }

  /**
   * Gets the position of the row that's highest in the sequence (lowest Y position)
   */
  function getHighestRowInSequence(): number {
    let highestInSequence = Infinity

    activeRows.forEach((_, rowId) => {
      const row = getRowElement(rowId)
      if (row) {
        const currentY = getCurrentRowYPosition(row)
        if (currentY < highestInSequence) {
          highestInSequence = currentY
        }
      }
    })

    return highestInSequence
  }

  /**
   * Resets a row to maintain proper spacing with other rows
   */
  function resetRowToTop(row: HTMLElement): number {
    // Emit events and update game state
    Bus.emit('tileRowReset', { rowId: row.id })
    updateTilesOnRowReset(row.id)
    removeFromCollidedRows(row.id)

    // Get the position of the row that's highest in the sequence
    const highestInSequence = getHighestRowInSequence()

    // If no other rows are active, use the original offset
    if (highestInSequence === Infinity) {
      const rowOffset = Number(row.dataset.rowOffset || 0)
      return rowOffset
    }

    // Position the reset row above the highest row in sequence with proper spacing
    const newPosition = highestInSequence - rowSpacing.value

    // Update the row's stored offset
    row.dataset.rowOffset = String(newPosition)

    return newPosition
  }

  /**
   * Applies the new Y position to a row's transform
   */
  function applyRowTransform(row: HTMLElement, newY: number): void {
    const existingStyles = row.style.cssText
    row.style.cssText = `${existingStyles}; transform: translateY(${newY}px);`
  }

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

    const currentY = getCurrentRowYPosition(row)
    let newY = calculateNewRowPosition(currentY)

    if (hasRowReachedBottom(row, newY)) {
      newY = resetRowToTop(row)
    }

    applyRowTransform(row, newY)
    requestNextFrame(row)
  }

  /**
   * Animates a row from its offset position to bottom
   *
   * @param rowId - The ID of the row to animate
   */
  function animateRow(rowId: string) {
    const row = getRowElement(rowId)
    if (!row) return

    if (!row.dataset.rowOffset) {
      const rowIndex = Number(row.dataset.rowIndex || 0)
      positionRow(rowId, rowIndex)
    }

    activeRows.set(rowId, gameStore.gameSpeed)
    requestNextFrame(row)
  }

  /**
   * Positions all rows at their offset positions without starting animation
   * This is used to hide rows before the game starts
   *
   * @param rowIds - Array of row IDs to position
   */
  function positionRows(rowIds: string[]) {
    rowIds.forEach((rowId, index) => {
      positionRow(rowId, index)
    })
  }

  /**
   * Starts animating all rows with position-based spacing
   *
   * @param rowIds - Array of row IDs to animate
   */
  function startAnimation(rowIds: string[]) {
    activeRows.clear()

    rowIds.forEach((rowId, index) => {
      positionRow(rowId, index)
      animateRow(rowId)
    })
  }

  /**
   * Updates the row spacing and repositions all active rows
   *
   * @param newSpacing - The new spacing value in pixels
   */
  function updateRowSpacing(newSpacing: number) {
    rowSpacing.value = newSpacing

    // Reposition all active rows with the new spacing
    activeRows.forEach((_, rowId) => {
      const row = getRowElement(rowId)
      if (row) {
        const rowIndex = Number(row.dataset.rowIndex || 0)
        const newOffset = calculateRowOffset(rowIndex)
        setRowPosition(row, rowIndex, newOffset)
      }
    })
  }

  /**
   * Stops the animation
   */
  function stopAnimation() {
    cancelAnimationFrame(animationFrame)
  }

  /**
   * Resets the row animation system for a new game
   */
  function resetRowAnimation() {
    stopAnimation()
    activeRows.clear()
    isAnimating.value = false
  }

  /**
   * Resumes the animation of all rows with their current timing
   */
  function resumeRows() {
    activeRows.forEach((_, rowId) => {
      const row = getRowElement(rowId)
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
    rowSpacing,
    startAnimation,
    stopAnimation,
    resetRowAnimation,
    updateRowSpacing,
    positionRows,
  }
}
