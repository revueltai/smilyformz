<script setup lang="ts">
  import { AVATAR_DEFAULTS } from '@/configs/constants'

  export type TileExpression = 'exp1' | 'exp2' | 'exp3' | 'exp4' | 'exp5'

  export type TileSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  const props = withDefaults(
    defineProps<{
      expression: TileExpression
      size?: TileSize
    }>(),
    {
      expression: AVATAR_DEFAULTS.expression as TileExpression,
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
  <img
    :src="`/images/character/expressions/${props.expression}.svg`"
    :alt="props.expression"
    :width="SIZES[props.size]"
    :height="SIZES[props.size]"
    class="object-contain"
  />
</template>
