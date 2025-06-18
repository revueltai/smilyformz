import type { TilePowerUpType, TileRowItem, TileShape } from '@/components/app/tile/types'
import { useGameStore } from '@/stores/gameStore'
import { useCollisionDetection } from './useCollisionDetection'
import { useTileGeneration } from './useTileGeneration'
import { getTileRowId, isNoneToken } from '@/utils'

interface CharacterUpdateProps {
  shape: TileShape
  shapeColor: string
  backgroundColor: string
}

interface PowerUpEffects {
  doublePoints: boolean
  acceptAnyShape: boolean
  acceptAnyColor: boolean
}

/**
 * Handles tile collision detection and scoring
 */
export function useTileCollision() {
  const gameStore = useGameStore()
  const { disableCollidedRow } = useCollisionDetection()
  const { updateRowTilesToMatchCharacter } = useTileGeneration()

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
   * Applies power up effects to the tile
   *
   * @param tilePowerUpType - The power up type to apply
   * @returns Object containing power up effects
   */
  function doPowerUp(tilePowerUpType: TilePowerUpType) {
    const powerUpEffects = {
      doublePoints: false,
      acceptAnyShape: false,
      acceptAnyColor: false,
    }

    switch (tilePowerUpType) {
      case 'anyShape':
        powerUpEffects.acceptAnyShape = true
        break

      case 'anyColor':
        powerUpEffects.acceptAnyColor = true
        break

      case 'doublePoints':
        powerUpEffects.doublePoints = true
        break
    }

    return powerUpEffects
  }

  /**
   * Evaluates if a tile matches the character's shape or color
   *
   * @param tile - The tile to evaluate
   * @param powerUpEffects - The power up effects to apply
   * @returns Object containing match information
   */
  function evaluateMatch(tile: TileRowItem, powerUpEffects: PowerUpEffects | null) {
    let shapeMatch = tile.shape === gameStore.character.shape
    let colorMatch = tile.shapeColor === gameStore.character.shapeColor

    if (powerUpEffects) {
      if (powerUpEffects.acceptAnyShape) {
        shapeMatch = true
        colorMatch = true
      }

      if (powerUpEffects.acceptAnyColor) {
        colorMatch = true
      }
    }

    return {
      isMatch: shapeMatch || colorMatch,
      shapeMatch,
      colorMatch,
    }
  }

  /**
   * Evaluates if a tile matches the character's shape or color
   * If there's no match, the game is over
   *
   * @param tile - The tile to evaluate
   * @returns Object containing match information
   */
  function evaluateCollision(tile: TileRowItem) {
    let powerUpEffects = null

    if (tile.powerUpType && !isNoneToken(tile.powerUpType)) {
      powerUpEffects = doPowerUp(tile.powerUpType)
    }

    const { isMatch, shapeMatch, colorMatch } = evaluateMatch(tile, powerUpEffects)

    if (isMatch) {
      gameStore.incrementScore(shapeMatch, colorMatch, powerUpEffects?.doublePoints)

      updateCharacterOnMatch({
        shape: colorMatch ? tile.shape : gameStore.character.shape,
        shapeColor: shapeMatch ? tile.shapeColor : gameStore.character.shapeColor,
        backgroundColor: shapeMatch ? tile.backgroundColor : gameStore.character.backgroundColor,
      })

      disableCollidedRow(tile.id)
      updateRowTilesToMatchCharacter(getTileRowId(tile.id))

      return
    }

    gameStore.pause()
    gameStore.setGameOver(true)
  }

  return {
    evaluateCollision,
  }
}
