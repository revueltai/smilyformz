import { ref, type Ref } from 'vue'
import type { RefElement } from '@/components/shared/types'

const characterHitAreaRef = ref<RefElement>(null)
const collidedRows = ref<string[]>([])

export function useCollisionDetection() {
  let collisionCheckInterval: number | null = null
  let isCollided = false

  /**
   * Disables collision for a specific row
   *
   * @param tileId - The id of the tile that has collided (which includes the row id)
   */
  function disableCollidedRow(tileId: string) {
    const rowId = tileId.split('-')[0]

    if (!collidedRows.value.includes(rowId)) {
      collidedRows.value.push(rowId)
    }
  }

  /**
   * Sets the character's hit area reference.
   *
   * @param hitArea - The reference to the character's hit area element.
   */
  function setCharacterHitArea(hitArea: RefElement) {
    characterHitAreaRef.value = hitArea
  }

  /**
   * Checks for collision between the character's hit area and a tile's hit area.
   *
   * @param tileRef - The reference to the tile element.
   */
  function checkCollision(tileRef: Ref<RefElement>) {
    if (!tileRef.value || !characterHitAreaRef.value || isCollided) {
      return false
    }

    const characterHitArea = characterHitAreaRef.value.getBoundingClientRect()
    const tileHitArea = tileRef.value.getBoundingClientRect()

    if (
      characterHitArea.left < tileHitArea.right &&
      characterHitArea.right > tileHitArea.left &&
      characterHitArea.top < tileHitArea.bottom &&
      characterHitArea.bottom > tileHitArea.top
    ) {
      isCollided = true
      onCheckCollisionEnd()
      return true
    }

    return false
  }

  /**
   * Starts continuous collision checking
   *
   * @param tileRef - The reference to the tile element
   * @param onCollision - Callback function to execute when a collision is detected
   * @param interval - Check interval in milliseconds (default: 100)
   */
  function onCheckCollisionStart(
    tileRef: Ref<RefElement>,
    onCollision: () => void,
    interval: number = 100,
  ) {
    onCheckCollisionEnd()

    collisionCheckInterval = window.setInterval(() => {
      if (checkCollision(tileRef)) {
        onCollision()
      }
    }, interval)
  }

  /**
   * Stops continuous collision checking
   */
  function onCheckCollisionEnd() {
    if (collisionCheckInterval) {
      clearInterval(collisionCheckInterval)
      collisionCheckInterval = null
    }
  }

  return {
    collidedRows,
    disableCollidedRow,
    setCharacterHitArea,
    onCheckCollisionStart,
    onCheckCollisionEnd,
  }
}
