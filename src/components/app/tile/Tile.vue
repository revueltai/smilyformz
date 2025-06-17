<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { getTileRowId } from '@/utils'
  import { TILE_DEFAULTS } from '@/configs/constants'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import { useTileCollision } from '@/composables/useTileCollision'
  import Shape from '@/components/app/tile/TileShape.vue'
  import Expression from '@/components/app/tile/TileExpression.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import type { RefElement } from '@/components/shared/types'

  const props = withDefaults(
    defineProps<{
      id: string
      shape: TileShape
      expression: TileExpression
      shapeColor: string
      backgroundColor?: string
      checkForCollision?: boolean
      checkCollisionInterval?: number
    }>(),
    {
      shapeColor: TILE_DEFAULTS.shapeColor,
      backgroundColor: '',
      checkForCollision: false,
      checkCollisionInterval: 100,
    },
  )

  const { onCheckCollisionStart, onCheckCollisionEnd, collidedRows } = useCollisionDetection()
  const { evaluateCollision } = useTileCollision()

  const tileRef = ref<RefElement>(null)
  const isCollided = ref(false)
  const isDisabled = ref(false)

  function handleCollision() {
    isCollided.value = true

    evaluateCollision({
      id: props.id,
      type: 'Tile',
      shape: props.shape,
      expression: props.expression,
      shapeColor: props.shapeColor,
      backgroundColor: props.backgroundColor,
    })
  }

  function handleCollidedRow(collidedRows: string[]) {
    const tileRowId = getTileRowId(props.id)

    if (collidedRows.includes(tileRowId)) {
      isDisabled.value = true
      onCheckCollisionEnd()
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
    :class="{ 'animate-collision': isCollided, 'opacity-30 grayscale-100': isDisabled }"
    :style="{ backgroundColor }"
  >
    <Shape
      :shape="shape"
      :color="shapeColor"
    />

    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <Expression :expression="expression" />
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
