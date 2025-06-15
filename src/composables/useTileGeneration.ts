import { ref } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type {
  TileShape,
  TileExpression,
  TileRowItem,
  TileRow,
  TileColor,
} from '@/components/app/tile/types'
import { useGameStore } from '@/stores/gameStore'

const SHAPES = Object.values(TILE_SHAPES) as TileShape[]
const EXPRESSIONS = Object.values(TILE_EXPRESSIONS) as TileExpression[]
const COLORS = Object.values(TILE_COLORS)

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5
}

/**
 * Handles the generation of tiles on the board
 */
export function useTileGeneration() {
  const gameStore = useGameStore()
  const rows = ref<TileRow[]>([])

  /**
   *  Creates a tile that can optionally match the character color, shape, both or none
   *
   * @param matchCharacter - Whether the tile should match the character
   * @param rowId - The id of the row
   * @param tileIndex - The index of the tile
   * @param color - The color of the tile
   * @returns The tile
   */
  function createTile(
    matchCharacter: boolean,
    rowId: string,
    tileIndex: number,
    color: TileColor,
  ): TileRowItem {
    let shouldMatchShape = false
    let shouldMatchColor = false

    if (matchCharacter) {
      shouldMatchShape = getRandomBoolean()
      shouldMatchColor = !shouldMatchShape
    }

    // Get color pair - either from character or random
    const colorPair = shouldMatchColor
      ? {
          shapeColor: gameStore.character.shapeColor,
          backgroundColor: gameStore.character.backgroundColor,
        }
      : color

    return {
      id: `${rowId}-tile${tileIndex}`,
      type: 'Tile',
      shape: shouldMatchShape ? gameStore.character.shape : getRandomItem(SHAPES),
      expression: getRandomItem(EXPRESSIONS),
      shapeColor: colorPair.shapeColor,
      backgroundColor: colorPair.backgroundColor,
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
    const matchIndex = Math.floor(Math.random() * totalRowsLength)

    return Array.from({ length: totalRowsLength }, (_, tileIndex) => {
      const matchCharacter = tileIndex === matchIndex
      const color = getRandomItem(COLORS)
      return createTile(matchCharacter, rowId, tileIndex, color)
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

  return {
    rows,
    initializeRows,
    initializeRowsPosition,
  }
}
