import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import type { RefElement } from '@/components/shared/types'

/**
 * Handles the movement of the character on the board
 *
 * @param boardEl - The board element
 * @param characterRef - The reference to the character element
 * @param stepPx - The step size in pixels
 */
export function useMovementCharacter(
  boardEl?: RefElement,
  characterRef?: Ref<RefElement>,
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
    boardWidth.value = boardEl?.offsetWidth || 0
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

  function moveLeft() {
    if (!gameStore.isGameStarted) {
      return
    }

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
