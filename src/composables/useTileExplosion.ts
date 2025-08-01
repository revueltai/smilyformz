import { ref } from 'vue'
import { useGameStore } from '@/stores/game.store'
import { useSoundStore } from '@/stores/sounds.store'
import { Bus } from '@/services/Bus.service'
import type { TileRowItem } from '@/components/app/tile/types'

export const EXPLOSION_ANIMATION_DURATION = 400

interface ExplosionEvent {
  collidedTileId: string
  allTileIds: string[]
  collidedTileIndex: number
  totalTilesInRow: number
}

const explosionEvents = ref<ExplosionEvent[]>([])

/**
 * Handles the explosion effect for adjacent tiles when in indestructible mode (SmilyTime)
 * It's triggered when a tile is collided with while indestructible is active.
 */
export function useTileExplosion() {
  const gameStore = useGameStore()
  const soundStore = useSoundStore()

  /**
   * Extracts the tile index from a tile ID
   *
   * @param tileId - The tile ID (e.g., "row0-tile2-0")
   * @returns The tile index number
   */
  function getTileIndexFromId(tileId: string): number {
    const match = tileId.match(/tile(\d+)/)
    return match ? parseInt(match[1], 10) : -1
  }

  /**
   * Gets all tiles in the same row as the collided tile
   *
   * @param tileId - The collided tile ID
   * @param totalTilesInRow - Total number of tiles in the row
   * @returns Array of all tile IDs in the row
   */
  function getAllTilesInRow(tileId: string, totalTilesInRow: number): string[] {
    const tileIndex = getTileIndexFromId(tileId)

    if (tileIndex === -1) {
      return []
    }

    const rowId = tileId.split('-')[0]
    const resetKey = tileId.split('-')[2] || '0'

    const tileIndices: number[] = []
    for (let i = 0; i < totalTilesInRow; i++) {
      tileIndices.push(i)
    }

    return tileIndices.map((index) => `${rowId}-tile${index}-${resetKey}`)
  }

  /**
   * Triggers explosion effect for all adjacent tiles in the row when in indestructible mode
   * The tile that was collided with is not included in the explosion.
   *
   * @param collidedTile - The tile that was collided with
   */
  function triggerAdjacentExplosion(collidedTile: TileRowItem) {
    if (!gameStore.isIndestructibleActive) {
      return
    }

    const collidedTileIndex = getTileIndexFromId(collidedTile.id)
    const allTileIds = getAllTilesInRow(collidedTile.id, gameStore.totalRowsLength)

    if (allTileIds.length === 0) {
      return
    }

    const explosionEvent: ExplosionEvent = {
      collidedTileId: collidedTile.id,
      allTileIds,
      collidedTileIndex,
      totalTilesInRow: gameStore.totalRowsLength,
    }

    explosionEvents.value.push(explosionEvent)

    soundStore.playSound('gameTileRowExplosion')

    Bus.emit('tileExplosion', explosionEvent)

    setTimeout(() => {
      const index = explosionEvents.value.findIndex(
        (event) => event.collidedTileId === collidedTile.id,
      )
      if (index > -1) {
        explosionEvents.value.splice(index, 1)
      }
    }, EXPLOSION_ANIMATION_DURATION)
  }

  /**
   * Gets the explosion direction for a tile based on its position relative to the collided tile
   *
   * @param tileId - The tile ID to check
   * @returns Explosion direction object or null if tile shouldn't explode
   */
  function getExplosionDirection(tileId: string): { x: number; y: number; rotate: number } | null {
    const event = explosionEvents.value.find((event) => event.allTileIds.includes(tileId))
    if (!event) return null

    const tileIndex = getTileIndexFromId(tileId)
    if (tileIndex === -1) return null

    // Calculate the relative position from the collided tile
    const relativePosition = tileIndex - event.collidedTileIndex

    // Calculate distance from collision point (inverse relationship - closer tiles go further)
    const maxDistance = 200
    const minDistance = 80
    const distanceFromCollision = Math.abs(relativePosition)
    const distance =
      maxDistance -
      (distanceFromCollision * (maxDistance - minDistance)) / (event.totalTilesInRow / 2)

    // Calculate angle based on relative position
    // Tiles to the left get negative angles, tiles to the right get positive angles
    const maxAngle = Math.PI / 2 // 90 degrees for wider spread
    const angleStep = maxAngle / (event.totalTilesInRow / 2)
    const angle = relativePosition * angleStep

    // Calculate x and y components
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance - 30 // Slight upward bias

    // Calculate rotation (more dramatic for tiles closer to collision point)
    const rotate = (maxDistance - distance) * 2 + (Math.random() - 0.5) * 180

    return { x, y, rotate }
  }

  /**
   * Clears all explosion events.
   * Useful for game reset.
   */
  function clearExplosionEvents() {
    explosionEvents.value = []
  }

  return {
    explosionEvents,
    triggerAdjacentExplosion,
    getExplosionDirection,
    clearExplosionEvents,
  }
}
