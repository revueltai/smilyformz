import { ref } from 'vue'
import {
  TILE_EXPRESSIONS,
  TILE_COLORS,
  TILE_SHAPES,
  TILE_POWER_UP_TYPES,
} from '@/configs/constants'
import type {
  TileShape,
  TileExpression,
  TileRowItem,
  TileRow,
  TileColor,
} from '@/components/app/tile/types'
import { useGameStore } from '@/stores/gameStore'
import { getRandomNumber, getRandomItem, getRandomBoolean, getRowIndex } from '@/utils'

const SHAPES = Object.values(TILE_SHAPES) as TileShape[]
const EXPRESSIONS = Object.values(TILE_EXPRESSIONS) as TileExpression[]
const COLORS = Object.values(TILE_COLORS)

const rows = ref<TileRow[]>([])
const rowResetKeys = ref<Record<string, number>>({})

/**
 * Handles the generation of tiles on the board
 */
export function useTileGeneration() {
  const gameStore = useGameStore()

  /**
   * Determines whether a tile should match the character's shape or color
   *
   * @param matchCharacter - Whether the tile should match the character
   * @returns Object with shouldMatchShape and shouldMatchColor flags
   */
  function determineMatchStrategy(matchCharacter: boolean): {
    shouldMatchShape: boolean
    shouldMatchColor: boolean
  } {
    if (matchCharacter) {
      const shouldMatchShape = getRandomBoolean()

      return {
        shouldMatchShape,
        shouldMatchColor: !shouldMatchShape,
      }
    }

    return {
      shouldMatchShape: false,
      shouldMatchColor: false,
    }
  }

  /**
   * Determines the power-up type for a tile and its spawn chance.
   * Spawn chance is 25% for each tile.
   *
   * @param matchCharacter - Whether the tile should match the character
   * @returns The power-up type
   */
  function determinePowerUpType(matchCharacter: boolean) {
    if (matchCharacter) {
      return TILE_POWER_UP_TYPES.NONE
    }

    const spawnChance = getRandomNumber(100)
    if (spawnChance < 25) {
      const powerUpTypes = Object.values(TILE_POWER_UP_TYPES).filter(
        (type) => type !== TILE_POWER_UP_TYPES.NONE,
      )

      return getRandomItem(powerUpTypes)
    }

    return TILE_POWER_UP_TYPES.NONE
  }

  /**
   * Determines the color pair for a tile
   *
   * @param shouldMatchColor - Whether the tile should match character color
   * @param color - The random color to use if not matching character
   * @returns The color pair object
   */
  function determineColorPair(shouldMatchColor: boolean, color: TileColor) {
    if (shouldMatchColor) {
      return {
        shapeColor: gameStore.character.shapeColor,
        backgroundColor: gameStore.character.backgroundColor,
      }
    }
    return color
  }

  /**
   * Determines the shape for a tile
   *
   * @param shouldMatchShape - Whether the tile should match character shape
   * @returns The shape to use
   */
  function determineShape(shouldMatchShape: boolean): TileShape {
    return shouldMatchShape ? gameStore.character.shape : getRandomItem(SHAPES)
  }

  /**
   * Creates a tile that can optionally match the character color, shape, both or none
   *
   * @param matchCharacter - Whether the tile should match the character
   * @param rowId - The id of the row
   * @param tileIndex - The index of the tile
   * @param color - The color of the tile
   * @param resetKey - The reset key to force component recreation
   * @returns The tile
   */
  function createTile(
    matchCharacter: boolean,
    rowId: string,
    tileIndex: number,
    color: TileColor,
    resetKey: number = 0,
  ): TileRowItem {
    const { shouldMatchShape, shouldMatchColor } = determineMatchStrategy(matchCharacter)
    const powerUpType = determinePowerUpType(matchCharacter)
    const colorPair = determineColorPair(shouldMatchColor, color)
    const shape = determineShape(shouldMatchShape)

    return {
      id: `${rowId}-tile${tileIndex}-${resetKey}`,
      type: 'Tile',
      shape,
      expression: getRandomItem(EXPRESSIONS),
      shapeColor: colorPair.shapeColor,
      backgroundColor: colorPair.backgroundColor,
      powerUpType,
    }
  }

  /**
   * Generates an array of tiles for a given row
   *
   * @param rowId - The id of the row
   * @returns An array of tiles
   */
  function generateTiles(rowId: string): TileRowItem[] {
    const totalRowsLength = 3
    const matchIndex = getRandomNumber(totalRowsLength)
    const resetKey = rowResetKeys.value[rowId] || 0

    return Array.from({ length: totalRowsLength }, (_, tileIndex) => {
      const matchCharacter = tileIndex === matchIndex
      const color = getRandomItem(COLORS)
      return createTile(matchCharacter, rowId, tileIndex, color, resetKey)
    })
  }

  /**
   * Generates a new row of tiles
   *
   * @param index - The index of the row
   * @returns The new row of tiles
   */
  function generateNewRow(index: number): TileRow {
    const rowId = `row${index}`
    const tiles: TileRowItem[] = generateTiles(rowId)

    return {
      id: rowId,
      type: 'TileRow',
      tiles,
    }
  }

  /**
   * Updates/Refreshes the tiles on a row that has been reset
   *
   * @param rowId - The id of the row
   */
  function updateTilesOnRowReset(rowId: string) {
    const rowIndex = getRowIndex(rowId)

    if (rowIndex >= 0 && rowIndex < rows.value.length) {
      rowResetKeys.value[rowId] = (rowResetKeys.value[rowId] || 0) + 1
      rows.value[rowIndex].tiles = generateTiles(rowId)
    }
  }

  /**
   * Checks if any tile in a row matches the character's shape or color
   *
   * @param row - The row to check
   * @returns True if any tile matches the character
   */
  function doesRowMatchCharacter(row: TileRow): boolean {
    for (const tile of row.tiles) {
      if (
        tile.shape === gameStore.character.shape ||
        tile.shapeColor === gameStore.character.shapeColor
      ) {
        return true
      }
    }

    return false
  }

  /**
   * Updates a random tile to match the character's shape
   *
   * @param tiles - Array of tiles to update
   */
  function updateRandomTileShape(tiles: TileRowItem[]) {
    const randomTile = getRandomItem(tiles)
    randomTile.shape = gameStore.character.shape
  }

  /**
   * Updates a random tile to match the character's color
   *
   * @param tiles - Array of tiles to update
   */
  function updateRandomTileColor(tiles: TileRowItem[]) {
    const randomTile = getRandomItem(tiles)
    randomTile.shapeColor = gameStore.character.shapeColor
    randomTile.backgroundColor = gameStore.character.backgroundColor
  }

  /**
   * Updates a random tile to match both character's shape and color
   *
   * @param tiles - Array of tiles to update
   */
  function updateRandomTileShapeAndColor(tiles: TileRowItem[]) {
    const randomTile = getRandomItem(tiles)
    randomTile.shape = gameStore.character.shape
    randomTile.shapeColor = gameStore.character.shapeColor
    randomTile.backgroundColor = gameStore.character.backgroundColor
  }

  /**
   * Updates a row of tiles to match the character if it doesn't already
   *
   * @param rowId - The id of the row
   */
  function updateRowTilesToMatchCharacter(rowId: string) {
    const rowIndex = getRowIndex(rowId)
    const totalRows = rows.value.length

    // Calculate the next row index with wraparound
    const nextRowIndex = (rowIndex + 1) % totalRows
    const nextRow = rows.value[nextRowIndex]

    if (!nextRow) {
      return
    }

    if (doesRowMatchCharacter(nextRow)) {
      return
    }

    const randomMatch = getRandomItem(['shape', 'color', 'both'])

    switch (randomMatch) {
      case 'shape':
        updateRandomTileShape(nextRow.tiles)
        break

      case 'color':
        updateRandomTileColor(nextRow.tiles)
        break

      case 'both':
        updateRandomTileShapeAndColor(nextRow.tiles)
        break
    }
  }

  /**
   * Initializes the rows of tiles
   *
   * @param count - The number of rows to initialize
   */
  function initializeRows(count: number) {
    rows.value = Array.from({ length: count }, (_, index) => generateNewRow(index))
  }

  /**
   * Resets the tile generation system for a new game
   */
  function resetTileGeneration() {
    rows.value = []
    rowResetKeys.value = {}
  }

  return {
    rows,
    updateRowTilesToMatchCharacter,
    updateTilesOnRowReset,
    initializeRows,
    resetTileGeneration,
  }
}
