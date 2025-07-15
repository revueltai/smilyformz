import type { TilePowerUpType, TileRowItem, TileShape } from '@/components/app/tile/types'
import { useGameStore } from '@/stores/game.store'
import { useCollisionDetection } from './useCollisionDetection'
import { useTileGeneration } from './useTileGeneration'
import { getTileRowId, isNoneToken } from '@/utils'
import { Bus } from '@/services/Bus.service'
import { useSoundStore } from '@/stores/sounds.store'

interface CharacterUpdateProps {
  shape: TileShape
  shapeColor: string
  backgroundColor: string
}

interface PowerUpEffects {
  doublePoints: boolean
  acceptAnyShape: boolean
  acceptAnyColor: boolean
  indestructible: boolean
}

/**
 * Handles tile collision detection and scoring for the game.
 * It also handles the character update on match.
 * It also handles the power up effects.
 * It also handles the match evaluation.
 * It also handles the collision evaluation.
 */
export function useTileCollision() {
  const gameStore = useGameStore()
  const soundStore = useSoundStore()
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
   * Creates power up effects object without activating them
   *
   * @param tilePowerUpType - The power up type to create effects for
   * @returns Object containing power up effects
   */
  function createPowerUpEffects(tilePowerUpType: TilePowerUpType) {
    const powerUpEffects = {
      doublePoints: false,
      acceptAnyShape: false,
      acceptAnyColor: false,
      indestructible: false,
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

      case 'indestructible':
        powerUpEffects.indestructible = true
        break
    }

    return powerUpEffects
  }

  /**
   * Applies power up effects to the game
   *
   * @param powerUpEffects - The power up effects to apply
   */
  function applyPowerUpEffects(powerUpEffects: PowerUpEffects) {
    if (powerUpEffects.indestructible) {
      gameStore.activateIndestructible()
    }
  }

  /**
   * Evaluates if a tile matches the character's shape or color
   *
   * @param tile - The tile to evaluate
   * @param powerUpEffects - The power up effects to apply
   * @returns Object containing match information
   */
  function evaluateMatch(tile: TileRowItem, powerUpEffects: PowerUpEffects | null) {
    if (gameStore.isIndestructibleActive) {
      return {
        isMatch: true,
        shapeMatch: true,
        colorMatch: true,
      }
    }

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
    let matchPowerUpEffects = null

    if (tile.powerUpType && !isNoneToken(tile.powerUpType)) {
      const tempPowerUpEffects = createPowerUpEffects(tile.powerUpType)

      matchPowerUpEffects = {
        doublePoints: false,
        indestructible: false,
        acceptAnyShape: tempPowerUpEffects.acceptAnyShape,
        acceptAnyColor: tempPowerUpEffects.acceptAnyColor,
      }
    }

    const { isMatch, shapeMatch, colorMatch } = evaluateMatch(tile, matchPowerUpEffects)

    if (isMatch) {
      let powerUpEffects = null

      if (tile.powerUpType && !isNoneToken(tile.powerUpType)) {
        powerUpEffects = createPowerUpEffects(tile.powerUpType)
        applyPowerUpEffects(powerUpEffects)
      }

      soundStore.playSound(powerUpEffects ? 'gameTilePowerup' : 'gameTilePop')
      gameStore.incrementScore(shapeMatch, colorMatch, powerUpEffects?.doublePoints)

      updateCharacterOnMatch({
        shape: colorMatch ? tile.shape : gameStore.character.shape,
        shapeColor: shapeMatch ? tile.shapeColor : gameStore.character.shapeColor,
        backgroundColor: shapeMatch ? tile.backgroundColor : gameStore.character.backgroundColor,
      })

      disableCollidedRow(tile.id)
      updateRowTilesToMatchCharacter(getTileRowId(tile.id))

      Bus.emit('characterMessage', {})

      return
    }

    gameStore.pause()
    gameStore.setGameOver(true)
  }

  return {
    evaluateCollision,
  }
}
