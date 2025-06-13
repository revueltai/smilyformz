<script setup lang="ts">
  import { ref } from 'vue'
  import { TILE_DEFAULTS } from '@/configs/constants'
  import Shape from '@/components/app/tile/TileShape.vue'
  import Expression from '@/components/app/tile/TileExpression.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import type { RefElement } from '@/components/shared/types'

  withDefaults(
    defineProps<{
      shape: TileShape
      expression: TileExpression
      shapeColor: string
      backgroundColor?: string
    }>(),
    {
      shapeColor: TILE_DEFAULTS.shapeColor,
      backgroundColor: '',
    },
  )

  const hitAreaRef = ref<RefElement>()
</script>

<template>
  <div
    class="relative inline-flex items-center justify-center rounded-lg p-4"
    :style="{ backgroundColor: backgroundColor }"
  >
    <Shape
      :shape="shape"
      :color="shapeColor"
      class="relative z-0"
    />

    <div class="absolute inset-0 z-10 flex items-center justify-center">
      <Expression
        ref="hitAreaRef"
        :expression="expression"
      />
    </div>
  </div>
</template>
