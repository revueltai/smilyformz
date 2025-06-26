<script setup lang="ts">
  import { TILE_DEFAULTS } from '@/configs/constants'
  import type {
    TileExpression,
    TileSize,
    TileExpressionPowerDown,
  } from '@/components/app/tile/types'

  const props = withDefaults(
    defineProps<{
      expression: TileExpression | TileExpressionPowerDown
      size?: TileSize
    }>(),
    {
      expression: TILE_DEFAULTS.expression as TileExpression,
      size: 'xl',
    },
  )

  const SIZES = {
    xs: 12,
    sm: 16,
    md: 28,
    lg: 40,
    xl: 56,
    '2xl': 88,
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
