<script setup lang="ts">
  import ColorPicker from '@/components/shared/ColorPicker/index.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import { TILE_DEFAULTS } from '@/configs/constants'

  withDefaults(
    defineProps<{
      shapeColor: string
      backgroundColor: string
      shape: TileShape
      expression: TileExpression
    }>(),
    {
      shapeColor: TILE_DEFAULTS.shapeColor,
      backgroundColor: TILE_DEFAULTS.backgroundColor,
      shape: TILE_DEFAULTS.shape as TileShape,
      expression: TILE_DEFAULTS.expression as TileExpression,
    },
  )
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center gap-2 rounded-lg px-4 pt-16 pb-8"
    :style="{ backgroundColor }"
  >
    <div class="absolute top-0 left-0 pt-3 pl-3 flex gap-2">
      <ColorPicker
        :color="shapeColor"
        label="Shape"
        @update="$emit('update:shapeColor', $event)"
      />

      <ColorPicker
        :color="backgroundColor"
        label="Background"
        @update="$emit('update:backgroundColor', $event)"
      />
    </div>

    <Tile
      id="avatar-preview-tile"
      :shape="shape"
      :shape-color="shapeColor"
      :expression="expression"
    />
  </div>
</template>
