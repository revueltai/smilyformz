<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
  import { TILE_DEFAULTS, TILE_POWER_UP_TYPES, TILE_SHAPES, TILE_SIZES } from '@/configs/constants'
  import type { TileShape, TileSize, TilePowerUpType } from '@/components/app/tile/types'
  import { getRandomNumber } from '@/utils'
  import { useGameStore } from '@/stores/game.store'

  const props = withDefaults(
    defineProps<{
      id: string
      shape: TileShape
      size?: TileSize
      color?: string
      powerUpType?: TilePowerUpType
      isDisabled?: boolean
    }>(),
    {
      size: 'xl',
      color: TILE_DEFAULTS.shapeColor,
      powerUpType: 'none',
      isDisabled: false,
    },
  )

  const emit = defineEmits<{
    (e: 'updateShapeStatus', newShapeName: TileShape): void
  }>()

  const gameStore = useGameStore()

  const PATHS = {
    circle:
      'M0 8C0 3.58172 3.58172 0 8 0V0C12.4183 0 16 3.58172 16 8V8C16 12.4183 12.4183 16 8 16V16C3.58172 16 0 12.4183 0 8V8Z',
    square:
      'M0 3.2C0 1.43269 1.43269 0 3.2 0H12.8C14.5673 0 16 1.43269 16 3.2V12.8C16 14.5673 14.5673 16 12.8 16H3.2C1.43269 16 0 14.5673 0 12.8V3.2Z',
    triangle:
      'M6.3047 1.08936C7.05816 -0.363119 8.94183 -0.363122 9.6953 1.08936L15.7348 12.7319C16.4883 14.1844 15.5464 16 14.0395 16H1.96049C0.453555 16 -0.488284 14.1844 0.265184 12.7319L6.3047 1.08936Z',
    rhomb:
      'M5.73823 0.936855C6.98737 -0.312284 9.01263 -0.312286 10.2618 0.936854L15.0631 5.73823C16.3123 6.98737 16.3123 9.01263 15.0631 10.2618L10.2618 15.0631C9.01263 16.3123 6.98737 16.3123 5.73823 15.0631L0.936855 10.2618C-0.312284 9.01263 -0.312286 6.98737 0.936854 5.73823L5.73823 0.936855Z',
    star: 'M6.76777 0.737985C7.31783 -0.245995 8.68217 -0.245995 9.23223 0.737985L10.8339 3.60316C11.0354 3.96361 11.3731 4.21921 11.7643 4.30749L14.8746 5.00924C15.9428 5.25024 16.3644 6.60218 15.6362 7.45132L13.5158 9.92384C13.2491 10.2349 13.1201 10.6485 13.1604 11.0635L13.481 14.3623C13.5911 15.4953 12.4873 16.3308 11.4872 15.8716L8.57504 14.5346C8.20868 14.3664 7.79132 14.3664 7.42496 14.5346L4.51281 15.8716C3.51269 16.3308 2.40892 15.4953 2.51901 14.3623L2.83959 11.0635C2.87992 10.6485 2.75095 10.2349 2.48419 9.92384L0.363806 7.45132C-0.364392 6.60218 0.0572117 5.25024 1.12537 5.00924L4.23565 4.30749C4.62694 4.21921 4.96458 3.96361 5.16608 3.60316L6.76777 0.737985Z',
  }

  const currentShapeIndex = ref(0)
  const animationTimer = ref<number | null>(null)
  const availableShapes = Object.values(TILE_SHAPES) as TileShape[]

  const currentSize = computed(() => TILE_SIZES[props.size].viewbox)

  const clipPathId = computed(() => `tile-grad-${Math.random().toString(36).substring(2, 11)}`)

  const scaledPaths = computed(() => {
    const scale = currentSize.value / 16
    const scaled: Record<string, string> = {}

    Object.entries(PATHS).forEach(([shape, path]) => {
      scaled[shape] = path.replace(/(-?\d+(?:\.\d+)?)/g, (match: string) => {
        const num = parseFloat(match)
        return (num * scale).toString()
      })
    })

    return scaled
  })

  const currentPath = computed(() => {
    if (props.powerUpType === TILE_POWER_UP_TYPES.ANY_SHAPE) {
      const animatedShape = availableShapes[currentShapeIndex.value]
      return scaledPaths.value[animatedShape]
    }

    return scaledPaths.value[props.shape]
  })

  function cycleThroughShapes() {
    currentShapeIndex.value = (currentShapeIndex.value + 1) % availableShapes.length
  }

  function startShapeAnimation() {
    if (props.powerUpType === TILE_POWER_UP_TYPES.ANY_SHAPE) {
      currentShapeIndex.value = availableShapes.indexOf(props.shape)
      animationTimer.value = window.setInterval(
        () => {
          cycleThroughShapes()
          emit(
            'updateShapeStatus',
            Object.keys(TILE_SHAPES)[currentShapeIndex.value].toLocaleLowerCase() as TileShape,
          )
        },
        getRandomNumber(3000, 500),
      )
    }
  }

  function stopShapeAnimation() {
    if (animationTimer.value) {
      clearInterval(animationTimer.value)
      animationTimer.value = null
    }
  }

  watch(
    () => props.isDisabled,
    (isDisabled) => {
      if (isDisabled) {
        stopShapeAnimation()
      }
    },
  )

  onMounted(() => {
    if (props.powerUpType === TILE_POWER_UP_TYPES.ANY_SHAPE) {
      startShapeAnimation()
    }
  })

  onUnmounted(() => stopShapeAnimation())
</script>

<template>
  <div class="relative">
    <svg
      :width="currentSize"
      :height="currentSize"
      :viewBox="`0 0 ${currentSize} ${currentSize}`"
      :class="`object-contain ${TILE_SIZES[size].css}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        v-if="
          powerUpType === TILE_POWER_UP_TYPES.ANY_COLOR ||
          (gameStore.isIndestructibleActive && id === 'character')
        "
      >
        <g
          :clip-path="`url(#${clipPathId})`"
          data-figma-skip-parse="true"
        >
          <g :transform="`matrix(0.04 0 0 0.0388889 ${currentSize / 2} ${currentSize / 2})`">
            <foreignObject
              x="-1054.29"
              y="-1054.29"
              width="2108.57"
              height="2108.57"
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                class="tile-gradient w-full h-full opacity-100"
              />
            </foreignObject>
          </g>
        </g>

        <defs>
          <clipPath :id="clipPathId">
            <path
              :d="currentPath"
              :fill="color"
              class="shape-morph"
            />
          </clipPath>
        </defs>
      </g>

      <path
        v-else
        :d="currentPath"
        :fill="color"
        class="shape-morph"
      />
    </svg>
  </div>
</template>

<style>
  .shape-morph {
    transition: d 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
