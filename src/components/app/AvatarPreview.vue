<script setup lang="ts">
  import ColorPicker from '@/components/shared/ColorPicker/index.vue'
  import Tile from '@/components/app/tile/Tile.vue'
  import type { TileShape } from '@/components/app/tile/types'
  import type { TileExpression } from '@/components/app/tile/types'
  import { TILE_DEFAULTS } from '@/configs/constants'

  const props = withDefaults(
    defineProps<{
      colorShape: string
      colorBackground: string
      shape: TileShape
      expression: TileExpression
    }>(),
    {
      colorShape: TILE_DEFAULTS.shapeColor,
      colorBackground: TILE_DEFAULTS.backgroundColor,
      shape: TILE_DEFAULTS.shape as TileShape,
      expression: TILE_DEFAULTS.expression as TileExpression,
    },
  )
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center gap-2 rounded-lg px-4 pt-16 pb-8"
    :style="{ backgroundColor: colorBackground }"
  >
    <div class="absolute top-0 left-0 pt-3 pl-3 flex gap-2">
      <ColorPicker
        :color="colorShape"
        label="Shape"
        @update="$emit('update:colorShape', $event)"
      />

      <ColorPicker
        :color="colorBackground"
        label="Background"
        @update="$emit('update:colorBackground', $event)"
      />
    </div>

    <Tile
      id="avatar-preview-tile"
      :shape="shape"
      :shape-color="colorShape"
      :expression="expression"
    />
  </div>
</template>
