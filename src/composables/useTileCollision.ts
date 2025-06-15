import type { TileRowItem, TileShape } from '@/components/app/tile/types'
import { useGameStore } from '@/stores/gameStore'

interface CharacterUpdateProps {
  shape: TileShape
  shapeColor: string
  backgroundColor: string
}

/**
 * Handles tile collision detection and scoring
 */
export function useTileCollision() {
  const gameStore = useGameStore()

  /**
   * Updates the character properties on match
   *
   * @param shapeMatch - Whether the shape matches
   * @param colorMatch - Whether the color matches
   * @param characterUpdateProps - The properties to update the character with
   */
  function updateCharacterOnMatch(characterUpdateProps: CharacterUpdateProps) {
    gameStore.updateCharacterOnMatch(characterUpdateProps)
  }

  /**
   * Evaluates if a tile matches the character's shape or color
   * If there's no match, the game is over
   *
   * @param tile - The tile to evaluate
   * @returns Object containing match information
   */
  function evaluateCollision(tile: TileRowItem) {
    const shapeMatch = tile.shape === gameStore.character.shape
    const colorMatch = tile.shapeColor === gameStore.character.shapeColor
    const isMatch = shapeMatch || colorMatch

    if (isMatch) {
      gameStore.incrementScore(shapeMatch, colorMatch)

      updateCharacterOnMatch({
        shape: tile.shape,
        shapeColor: tile.shapeColor,
        backgroundColor: tile.backgroundColor,
      })

      return
    }

    gameStore.pause()
    gameStore.setGameOver(true)
  }

  return {
    evaluateCollision,
  }
}
