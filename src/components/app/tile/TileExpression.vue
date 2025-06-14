<script setup lang="ts">
  import { TILE_DEFAULTS } from '@/configs/constants'
  import type { TileExpression, TileSize } from '@/components/app/tile/types'

  const props = withDefaults(
    defineProps<{
      expression: TileExpression
      size?: TileSize
    }>(),
    {
      expression: TILE_DEFAULTS.expression as TileExpression,
      size: 'xs',
    },
  )

  const SIZES = {
    xs: 56,
    sm: 72,
    md: 88,
    lg: 104,
    xl: 120,
    '2xl': 136,
  }
</script>

<template>
  <div>
    <img
      :src="`/images/character/expressions/${props.expression}.svg`"
      :alt="props.expression"
      :width="SIZES[props.size]"
      :height="SIZES[props.size]"
      class="object-contain"
    />
  </div>
</template>
