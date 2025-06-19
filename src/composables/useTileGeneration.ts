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
   *  Creates a tile that can optionally match the character color, shape, both or none
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
    let powerUpType = TILE_POWER_UP_TYPES.NONE
    let shouldMatchShape = false
    let shouldMatchColor = false

    if (matchCharacter) {
      shouldMatchShape = getRandomBoolean()
      shouldMatchColor = !shouldMatchShape
    } else {
      const powerChance = getRandomNumber(100)

      if (powerChance < 25) {
        const powerUpTypes = Object.values(TILE_POWER_UP_TYPES).filter(
          (type) => type !== TILE_POWER_UP_TYPES.NONE,
        )

        powerUpType = getRandomItem(powerUpTypes)
      }
    }

    // Get color pair - either from character or random
    const colorPair = shouldMatchColor
      ? {
          shapeColor: gameStore.character.shapeColor,
          backgroundColor: gameStore.character.backgroundColor,
        }
      : color

    return {
      id: `${rowId}-tile${tileIndex}-${resetKey}`,
      type: 'Tile',
      shape: shouldMatchShape ? gameStore.character.shape : getRandomItem(SHAPES),
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
   * Updates a row of tiles to match the character if it doesn't already
   *
   * @param rowId - The id of the row
   */
  function updateRowTilesToMatchCharacter(rowId: string) {
    const rowIndex = getRowIndex(rowId)
    const nextRow = rows.value[rowIndex + 1]

    if (nextRow) {
      let rowTilesMatchCharacter = false

      for (const tile of nextRow.tiles) {
        if (
          tile.shape === gameStore.character.shape ||
          tile.shapeColor === gameStore.character.shapeColor
        ) {
          rowTilesMatchCharacter = true
          break
        }
      }

      if (!rowTilesMatchCharacter) {
        const randomTile = getRandomItem(nextRow.tiles)
        const randomMatch = getRandomItem(['shape', 'color', 'both'])

        if (randomMatch === 'shape') {
          randomTile.shape = gameStore.character.shape
          return
        }

        if (randomMatch === 'color') {
          randomTile.shapeColor = gameStore.character.shapeColor
          randomTile.backgroundColor = gameStore.character.backgroundColor
          return
        }

        randomTile.shape = gameStore.character.shape
        randomTile.shapeColor = gameStore.character.shapeColor
        randomTile.backgroundColor = gameStore.character.backgroundColor
      }
    }
  }

  /**
   * Initializes the position of the tile rows outside of the viewport
   */
  function initializeRowsPosition() {
    for (const row of rows.value) {
      const rowEl = document.getElementById(row.id)

      if (rowEl) {
        rowEl.style.transform = `translateY(-${rowEl.offsetHeight}px)`
      }
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
    initializeRowsPosition,
    resetTileGeneration,
  }
}
