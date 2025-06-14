<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { TILE_DEFAULTS } from '@/configs/constants'
  import { useCollisionDetection } from '@/composables/useCollisionDetection'
  import Shape from '@/components/app/tile/TileShape.vue'
  import Expression from '@/components/app/tile/TileExpression.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import type { RefElement } from '@/components/shared/types'

  const props = withDefaults(
    defineProps<{
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

  const { onCheckCollisionStart, onCheckCollisionEnd } = useCollisionDetection()

  const tileRef = ref<RefElement>(null)
  const hasCollided = ref(false)

  function handleCollision() {
    hasCollided.value = true
    console.log('Collision detected!', {
      shape: props.shape,
      expression: props.expression,
      shapeColor: props.shapeColor,
      backgroundColor: props.backgroundColor,
    })
  }

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
    class="relative inline-flex items-center justify-center rounded-lg p-4 transition-all duration-300 ease-in-out"
    :class="hasCollided ? 'opacity-50' : ''"
    :style="{ backgroundColor: backgroundColor }"
  >
    <Shape
      :shape="shape"
      :color="shapeColor"
      class="relative z-0"
    />

    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <Expression :expression="expression" />
    </div>
  </div>
</template>
