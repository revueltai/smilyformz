import { ref, onMounted, onUnmounted } from 'vue'
import type { TileShape, TileExpression, TileSize } from '@/components/app/tile/types'
import { TILE_COLORS, TILE_EXPRESSIONS, TILE_SHAPES, TILE_SIZES } from '@/configs/constants'
import { getRandomNumber, getRandomItem } from '@/utils'

interface FloatingTile {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  shape: TileShape
  expression: TileExpression
  tileSize: TileSize
}

const colors = Object.values(TILE_COLORS).map((color) => color.shapeColor)
const shapes = Object.values(TILE_SHAPES)
const expressions = Object.values(TILE_EXPRESSIONS)
const tileSizes: TileSize[] = ['sm', 'md', 'lg', 'xl']

const TILE_CONFIG = {
  VELOCITY_RANGE: 0.5,
  WALL_DAMPING: 0.8,
  FRICTION: 0.9995,
  RESTITUTION: 0.3,
  MAX_TILES: 12,
  TILE_DENSITY: 50000,
} as const

/**
 * Handles the creation and animation of the floating tiles shown as background of the <Page> component.
 *
 * @param containerRef - The container element
 * @param enabled - Whether the tiles are enabled
 * @returns The tiles and the functions to start and stop the animation
 */
export function useFloatingTiles(containerRef: any, enabled: boolean = true) {
  const tiles = ref<FloatingTile[]>([])
  const animationId = ref<number | null>(null)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  /**
   * Gets the pixel size for a given tile size.
   */
  function getTilePixelSize(tileSize: TileSize): number {
    return TILE_SIZES[tileSize].viewbox
  }

  /**
   * Creates a new tile with random properties.
   *
   * @returns The new tile
   */
  function createTile(): FloatingTile {
    const tileSize = getRandomItem(tileSizes)
    const pixelSize = getTilePixelSize(tileSize)

    return {
      id: Math.random(),
      x: getRandomNumber(containerWidth.value - pixelSize),
      y: getRandomNumber(containerHeight.value - pixelSize),
      vx: (Math.random() - 0.5) * TILE_CONFIG.VELOCITY_RANGE,
      vy: (Math.random() - 0.5) * TILE_CONFIG.VELOCITY_RANGE,
      color: getRandomItem(colors),
      shape: getRandomItem(shapes),
      expression: getRandomItem(expressions),
      tileSize,
    }
  }

  /**
   * Checks if two tiles are colliding.
   *
   * @param tile1 - The first tile
   * @param tile2 - The second tile
   * @returns True if the tiles are colliding, false otherwise
   */
  function checkCollision(tile1: FloatingTile, tile2: FloatingTile): boolean {
    const dx = tile1.x - tile2.x
    const dy = tile1.y - tile2.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const size1 = getTilePixelSize(tile1.tileSize)
    const size2 = getTilePixelSize(tile2.tileSize)
    return distance < (size1 + size2) / 2
  }

  /**
   * Resolves a collision between two tiles.
   *
   * @param tile1 - The first tile
   * @param tile2 - The second tile
   */
  function resolveCollision(tile1: FloatingTile, tile2: FloatingTile) {
    const dx = tile2.x - tile1.x
    const dy = tile2.y - tile1.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) return

    const nx = dx / distance
    const ny = dy / distance

    // Relative velocity
    const relativeVelocityX = tile2.vx - tile1.vx
    const relativeVelocityY = tile2.vy - tile1.vy

    // Velocity in the normal direction
    const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny

    // Don't resolve if objects are moving apart
    if (velocityAlongNormal > 0) return

    // Elastic collision with restitution
    const j = -(1 + TILE_CONFIG.RESTITUTION) * velocityAlongNormal

    // Apply impulse
    tile1.vx -= j * nx
    tile1.vy -= j * ny
    tile2.vx += j * nx
    tile2.vy += j * ny

    // Separate the tiles to prevent sticking
    const size1 = getTilePixelSize(tile1.tileSize)
    const size2 = getTilePixelSize(tile2.tileSize)
    const overlap = (size1 + size2) / 2 - distance
    const separationX = nx * overlap * 0.5
    const separationY = ny * overlap * 0.5

    tile1.x -= separationX
    tile1.y -= separationY
    tile2.x += separationX
    tile2.y += separationY
  }

  /**
   * Updates the position and velocity of a single tile.
   */
  function updateTile(tile: FloatingTile) {
    const pixelSize = getTilePixelSize(tile.tileSize)

    // Update position
    tile.x += tile.vx
    tile.y += tile.vy

    // Bounce off walls with damping
    if (tile.x <= 0 || tile.x >= containerWidth.value - pixelSize) {
      tile.vx = -tile.vx * TILE_CONFIG.WALL_DAMPING
      tile.x = Math.max(0, Math.min(containerWidth.value - pixelSize, tile.x))
    }

    if (tile.y <= 0 || tile.y >= containerHeight.value - pixelSize) {
      tile.vy = -tile.vy * TILE_CONFIG.WALL_DAMPING
      tile.y = Math.max(0, Math.min(containerHeight.value - pixelSize, tile.y))
    }

    // Apply friction
    tile.vx *= TILE_CONFIG.FRICTION
    tile.vy *= TILE_CONFIG.FRICTION
  }

  /**
   * Updates the position and velocity of all tiles.
   */
  function updateTiles() {
    if (!enabled) return

    // Update all tiles
    tiles.value.forEach(updateTile)

    // Check collisions between tiles (optimized to avoid duplicate checks)
    const tileCount = tiles.value.length
    for (let i = 0; i < tileCount; i++) {
      for (let j = i + 1; j < tileCount; j++) {
        if (checkCollision(tiles.value[i], tiles.value[j])) {
          resolveCollision(tiles.value[i], tiles.value[j])
        }
      }
    }

    animationId.value = requestAnimationFrame(updateTiles)
  }

  /**
   * Initializes the tiles.
   */
  function initTiles() {
    if (!enabled || !containerRef.value) return

    const rect = containerRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    containerHeight.value = rect.height

    // Calculate optimal tile count based on container size
    const tileCount = Math.min(
      TILE_CONFIG.MAX_TILES,
      Math.floor((containerWidth.value * containerHeight.value) / TILE_CONFIG.TILE_DENSITY),
    )

    tiles.value = Array.from({ length: tileCount }, createTile)
  }

  /**
   * Starts the animation.
   */
  function startAnimation() {
    if (!enabled) return
    updateTiles()
  }

  /**
   * Stops the animation.
   */
  function stopAnimation() {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  }

  onMounted(() => {
    if (enabled) {
      initTiles()
      startAnimation()
    }
  })

  onUnmounted(() => stopAnimation())

  return {
    tiles,
    initTiles,
    startAnimation,
    stopAnimation,
  }
}
