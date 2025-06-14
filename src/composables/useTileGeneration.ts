import { ref, computed } from 'vue'
import { TILE_EXPRESSIONS, TILE_COLORS, TILE_SHAPES } from '@/configs/constants'
import type { TileShape, TileExpression, TileRowItem } from '@/components/app/tile/types'
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

  const rows = ref<TileRowItem[][]>([])

  const currentRows = computed(() => rows.value)

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

  function generateNewRow(): TileRowItem[] {
    const tiles = Array.from({ length: 3 }, () => {
      const color = getRandomItem(COLORS)
      return {
        type: 'tile',
        shape: getRandomItem(SHAPES),
        expression: getRandomItem(EXPRESSIONS),
        shapeColor: color.shapeColor,
        backgroundColor: color.backgroundColor,
      }
    })

    const matchIndex = Math.floor(Math.random() * 3)
    tiles[matchIndex] = createMatchingTile(tiles[matchIndex])

    return tiles
  }

  function addRow() {
    rows.value.push(generateNewRow())
  }

  function removeRow() {
    rows.value.shift()
  }

  function clearRows() {
    rows.value = []
  }

  function initializeRows(count: number) {
    rows.value = Array.from({ length: count }, () => generateNewRow())
  }

  return {
    rows: currentRows,
    generateNewRow,
    addRow,
    removeRow,
    clearRows,
    initializeRows,
  }
}
