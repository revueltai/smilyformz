import { ref, onMounted, onUnmounted, computed, type Ref, nextTick } from 'vue'

const STEP_PX = 96

export function useMovement(
  boardRef?: Ref<HTMLElement | null>,
  characterRef?: Ref<HTMLElement | null>,
) {
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
      boardObserver = new ResizeObserver(() => {
        updateSizes()
        posX.value = clampX(posX.value)
      })

      boardObserver.observe(boardRef.value)
    }

    if (characterRef?.value) {
      charObserver = new ResizeObserver(() => {
        updateSizes()
        posX.value = clampX(posX.value)
      })

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
    posX.value = clampX(posX.value - STEP_PX)
  }

  function moveRight() {
    posX.value = clampX(posX.value + STEP_PX)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.repeat) {
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
    posX.value = clampX(posX.value)
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
  }
}
