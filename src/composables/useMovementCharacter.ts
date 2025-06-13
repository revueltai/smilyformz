import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

/**
 * Handles the movement of the character on the board
 *
 * @param boardRef - The reference to the board element
 * @param characterRef - The reference to the character element
 * @param stepPx - The step size in pixels
 */
export function useMovementCharacter(
  boardRef?: Ref<HTMLElement | null>,
  characterRef?: Ref<HTMLElement | null>,
  stepPx: number = 104,
) {
  const gameStore = useGameStore()
  let boardObserver: ResizeObserver | null = null
  let charObserver: ResizeObserver | null = null

  const posX = ref(0)
  const boardWidth = ref(0)
  const characterWidth = ref(0)

  const percent = computed(() => (!boardWidth.value ? 0 : (posX.value / boardWidth.value) * 100))

  /**
   * Updates the board and character width
   */
  function updateSizes() {
    boardWidth.value = boardRef?.value?.offsetWidth || 0
    characterWidth.value = characterRef?.value?.offsetWidth || 0
    posX.value = clampX(posX.value)
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
   * Observes the board and character sizes
   */
  function observeSizes() {
    if (boardRef?.value) {
      boardObserver = new ResizeObserver(() => updateSizes())
      boardObserver.observe(boardRef.value)
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
    if (boardObserver && boardRef?.value) {
      boardObserver.disconnect()
    }

    if (charObserver && characterRef?.value) {
      charObserver.disconnect()
    }
  }

  function moveLeft() {
    if (!gameStore.isGameStarted) return
    posX.value = clampX(posX.value - stepPx)
  }

  function moveRight() {
    if (!gameStore.isGameStarted) return
    posX.value = clampX(posX.value + stepPx)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!gameStore.isGameStarted || e.repeat) {
      return
    }
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) {
      moveLeft()
    } else if (['ArrowRight', 'd', 'D'].includes(e.key)) {
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
    x: posX,
    percent,
    moveLeft,
    moveRight,
    updateSizes,
  }
}
