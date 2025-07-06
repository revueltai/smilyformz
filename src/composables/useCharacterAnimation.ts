import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useGameStore } from '@/stores/game.store'
import type { RefElement } from '@/components/shared/types'
import { useSoundStore } from '@/stores/sounds.store'

/**
 * Handles the movement of the character on the board
 *
 * @param boardEl - The board element
 * @param characterRef - The reference to the character element
 */
export function useMovementCharacter(boardEl?: RefElement, characterRef?: Ref<RefElement>) {
  const gameStore = useGameStore()
  const soundStore = useSoundStore()

  let boardObserver: ResizeObserver | null = null
  let charObserver: ResizeObserver | null = null

  const posX = ref(0)
  const boardWidth = ref(0)
  const characterWidth = ref(0)
  const positionOnBoard = ref(Math.floor(gameStore.totalRowsLength / 2))

  const characterPositionPercent = computed(() =>
    !boardWidth.value ? 0 : (posX.value / boardWidth.value) * 100,
  )

  /**
   * Updates the board and character width
   */
  function updateSizes() {
    boardWidth.value = boardEl?.offsetWidth || 0
    characterWidth.value = characterRef?.value?.offsetWidth || 0
    posX.value = clampX(posX.value)
  }

  /**
   * Centers the character horizontally on the board
   */
  function centerCharacter() {
    if (boardWidth.value && characterWidth.value) {
      positionOnBoard.value = Math.floor(gameStore.totalRowsLength / 2)
      posX.value = clampX((boardWidth.value - characterWidth.value) / 2)
    }
  }

  /**
   * Resets the character animation system for a new game
   * Initial character position is center
   */
  function resetCharacterAnimation() {
    posX.value = 0
    positionOnBoard.value = Math.floor(gameStore.totalRowsLength / 2)
    updateSizes()
    centerCharacter()
  }

  /**
   * Clamps character to stay fully visible on the board
   *
   * @param val - The current position of the character
   * @returns The clamped position
   */
  function clampX(val: number) {
    return !boardWidth.value || !characterWidth.value
      ? val
      : Math.min(Math.max(val, 0), boardWidth.value - characterWidth.value)
  }

  /**
   * Positions the character at a specific column position
   */
  function positionCharacter(position: number) {
    if (!boardWidth.value || !characterWidth.value) return

    const maxPosition = gameStore.totalRowsLength - 1
    const clampedPosition = Math.max(0, Math.min(position, maxPosition))

    // Calculate the width of each column
    const columnWidth = boardWidth.value / gameStore.totalRowsLength
    const characterCenter = characterWidth.value / 2

    // Position the character at the center of the specified column
    posX.value = clampX(clampedPosition * columnWidth + columnWidth / 2 - characterCenter)
  }

  /**
   * Observes the board and character sizes
   */
  function observeSizes() {
    if (boardEl) {
      boardObserver = new ResizeObserver(() => updateSizes())
      boardObserver.observe(boardEl)
    }

    if (characterRef?.value) {
      charObserver = new ResizeObserver(() => updateSizes())
      charObserver.observe(characterRef.value)
    }
  }

  /**
   * Unobserves the board and character sizes
   */
  function unobserveSizes() {
    if (boardObserver && boardEl) {
      boardObserver.disconnect()
    }

    if (charObserver && characterRef?.value) {
      charObserver.disconnect()
    }
  }

  /**
   * Moves the character to the left
   */
  function moveLeft() {
    if (!gameStore.isGameStarted || gameStore.isPaused) {
      return
    }

    if (positionOnBoard.value > 0) {
      positionOnBoard.value--
      positionCharacter(positionOnBoard.value)
      soundStore.playSound('gameCharacterMove')
    }
  }

  /**
   * Moves the character to the right
   */
  function moveRight() {
    if (!gameStore.isGameStarted || gameStore.isPaused) {
      return
    }

    const maxPosition = gameStore.totalRowsLength - 1
    if (positionOnBoard.value < maxPosition) {
      positionOnBoard.value++
      positionCharacter(positionOnBoard.value)
      soundStore.playSound('gameCharacterMove')
    }
  }

  /**
   * Handles keyboard input for character movement
   *
   * @param event - The keyboard event
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (!gameStore.isGameStarted || gameStore.isPaused || event.repeat) {
      return
    }

    if (['ArrowLeft', 'a', 'A'].includes(event.key)) {
      moveLeft()
    } else if (['ArrowRight', 'd', 'D'].includes(event.key)) {
      moveRight()
    }
  }

  onMounted(async () => {
    await nextTick()
    updateSizes()
    observeSizes()
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    unobserveSizes()
  })

  return {
    posX,
    characterPositionPercent,
    moveLeft,
    moveRight,
    updateSizes,
    centerCharacter,
    resetCharacterAnimation,
  }
}
