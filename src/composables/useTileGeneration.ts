import { ref } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type { TileShape, TileExpression, TileRowItem, TileRow } from '@/components/app/tile/types'
import { useGameStore } from '@/stores/gameStore'

const SHAPES = Object.values(TILE_SHAPES) as TileShape[]
const EXPRESSIONS = Object.values(TILE_EXPRESSIONS) as TileExpression[]
const COLORS = Object.values(TILE_COLORS)

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Handles the generation of tiles on the board
 */
export function useTileGeneration() {
  const gameStore = useGameStore()
  const rows = ref<TileRow[]>([])

  /**
   * Creates a tile that matches the character color, shape or both
   *
   * @param tile - The tile to match the character
   * @returns The matching tile
   */
  function createMatchingTile(tile: TileRowItem): TileRowItem {
    // First, ensure we match at least one property
    const shouldMatchShape = Math.random() < 0.5
    const shouldMatchColor = !shouldMatchShape || Math.random() < 0.5

    return {
      ...tile,
      shape: shouldMatchShape ? gameStore.character.shape : tile.shape,
      shapeColor: shouldMatchColor ? gameStore.character.shapeColor : tile.shapeColor,
      backgroundColor: shouldMatchColor
        ? gameStore.character.backgroundColor
        : tile.backgroundColor,
    }
  }

  /**
   * Generates an array of tiles for a given row
   *
   * @param rowId - The id of the row
   * @returns An array of tiles
   */
  function generateTiles(rowId: string): TileRowItem[] {
    return Array.from({ length: 3 }, (_, tileIndex) => {
      const color = getRandomItem(COLORS)

      return {
        id: `${rowId}-tile${tileIndex}`,
        type: 'Tile',
        shape: getRandomItem(SHAPES),
        expression: getRandomItem(EXPRESSIONS),
        shapeColor: color.shapeColor,
        backgroundColor: color.backgroundColor,
      }
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

    const matchIndex = Math.floor(Math.random() * 3)
    tiles[matchIndex] = createMatchingTile(tiles[matchIndex])

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
