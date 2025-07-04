<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import { getTileRowId, isNoneToken } from '@/utils'
  import { TILE_DEFAULTS, TILE_POWER_UP_TYPES } from '@/configs/constants'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { useTileCollision } from '@/composables/useTileCollision'
  import Shape from '@/components/app/tile/TileShape.vue'
  import Expression from '@/components/app/tile/TileExpression.vue'
  import type {
    TileShape,
    TileExpression,
    TilePowerUpType,
    TileExpressionPowerDown,
    TileSize,
  } from '@/components/app/tile/types'
  import type { RefElement } from '@/components/shared/types'

  const props = withDefaults(
    defineProps<{
      id: string
      shape: TileShape
      size: TileSize
      expression: TileExpression | TileExpressionPowerDown
      shapeColor: string
      backgroundColor?: string
      checkForCollision?: boolean
      checkCollisionInterval?: number
      powerUpType?: TilePowerUpType
    }>(),
    {
      shapeColor: TILE_DEFAULTS.shapeColor,
      backgroundColor: '',
      checkForCollision: false,
      checkCollisionInterval: 100,
      powerUpType: TILE_POWER_UP_TYPES.NONE,
    },
  )

  const { onCheckCollisionStart, onCheckCollisionEnd, collidedRows } = useCollisionDetection()
  const { evaluateCollision } = useTileCollision()

  const tileRef = ref<RefElement>(null)
  const isCollided = ref(false)
  const isDisabled = ref(false)
  const rotatingShape = ref<TileShape>(props.shape)

  const cssClasses = computed(() => {
    return {
      'animate-collision': isCollided.value,
      'opacity-30 grayscale-100': isDisabled.value,
      'bg-slate-200 border-4 border-white border-dashed': !isNoneToken(props.powerUpType),
    }
  })

  const cssStyles = computed(() => {
    return {
      backgroundColor: isNoneToken(props.powerUpType) ? props.backgroundColor : undefined,
    }
  })

  const sanitizedShape = computed(() => {
    if (props.powerUpType === 'anyShape') {
      return rotatingShape.value
    }

    return props.shape
  })

  const sanitizedShapeColor = computed(() => {
    return props.shapeColor
  })

  function handleShapeStatusUpdate(newShapeName: TileShape) {
    if (props.powerUpType === TILE_POWER_UP_TYPES.ANY_SHAPE) {
      rotatingShape.value = newShapeName
    }
  }

  function handleCollision() {
    isCollided.value = true

    evaluateCollision({
      id: props.id,
      type: 'Tile',
      size: props.size,
      expression: props.expression,
      shape: sanitizedShape.value,
      shapeColor: sanitizedShapeColor.value,
      backgroundColor: props.backgroundColor,
      powerUpType: props.powerUpType,
    })
  }

  function handleCollidedRow(collidedRows: string[]) {
    const tileRowId = getTileRowId(props.id)

    if (collidedRows.includes(tileRowId)) {
      isDisabled.value = true
      onCheckCollisionEnd()
    } else {
      isDisabled.value = false
      isCollided.value = false
    }
  }

  watch(() => collidedRows.value, handleCollidedRow, { deep: true })

  onMounted(() => {
    if (props.checkForCollision) {
      onCheckCollisionStart(tileRef, handleCollision, props.checkCollisionInterval)
    }
  })

  onUnmounted(() => {
    if (props.checkForCollision) {
      onCheckCollisionEnd()
    }
  })
</script>

<template>
  <div
    ref="tileRef"
    class="relative transform-gpu inline-flex items-center justify-center rounded-lg p-4 transition-all duration-300 ease-in-out"
    :class="cssClasses"
    :style="cssStyles"
  >
    <Shape
      :size="size"
      :shape="sanitizedShape"
      :color="sanitizedShapeColor"
      :power-up-type="powerUpType"
      :is-disabled="isDisabled"
      @updateShapeStatus="handleShapeStatusUpdate"
    />

    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <Expression
        :size="size"
        :expression="expression"
      />
    </div>

    <div
      v-if="powerUpType === 'doublePoints'"
      class="absolute -top-2 -left-2 text-lg text-shadow-sm text-shadow-blue-600 w-12 h-12 flex items-center justify-center border-2 border-blue-950 shadow-sm rounded-full bg-blue-500 text-white z-20 animate-bounce"
    >
      <span class="font-extrabold">+4</span>
      <span class="text-xs lowercase font-normal">{{ $t('points') }}</span>
    </div>
  </div>
</template>

<style scoped>
  @keyframes collision {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    20% {
      transform: scale(1.4);
      opacity: 0.9;
    }
    40% {
      transform: scale(0.6);
      opacity: 0.8;
    }
    60% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    80% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    100% {
      transform: scale(0);
      opacity: 0.5;
    }
  }

  .animate-collision {
    animation: collision 400ms cubic-bezier(0.17, 0.67, 0.83, 0.67) forwards;
  }
</style>
