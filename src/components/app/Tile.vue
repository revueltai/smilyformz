<script setup lang="ts">
  import { AVATAR_DEFAULTS } from '@/configs/constants'
  import Shape from '@/components/app/TileShape.vue'
  import Expression from '@/components/app/TileExpression.vue'
  import type { TileShape } from '@/components/app/TileShape.vue'
  import type { TileExpression } from '@/components/app/TileExpression.vue'

  const props = withDefaults(
    defineProps<{
      shape: TileShape
      expression: TileExpression
      shapeColor: string
    }>(),
    {
      shapeColor: AVATAR_DEFAULTS.shapeColor,
    },
  )
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
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
