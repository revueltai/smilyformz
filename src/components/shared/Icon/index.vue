<script setup lang="ts">
  import { computed } from 'vue'
  import type { IconSizeName, IconProps } from './types'
  import { isNoneToken } from '@/utils'

  const props = withDefaults(defineProps<IconProps>(), {
    iconset: `/iconset.svg?v=${Date.now()}`,
    type: 'stroke',
    size: 'sm',
    color: 'slate-400',
    strokeWidth: 2,
  })

  const sizes: Record<IconSizeName, { w: string; h: string }> = {
    xs: { w: 'w-2', h: 'h-2' },
    sm: { w: 'w-4', h: 'h-4' },
    md: { w: 'w-6', h: 'h-6' },
    lg: { w: 'w-8', h: 'h-8' },
    xl: { w: 'w-10', h: 'h-10' },
    '2xl': { w: 'w-12', h: 'h-12' },
  }

  const cssClasses = computed(() => {
    const { w, h } = sizes[props.size]

    const payload = [`inline-flex text-${props.color} ${w} ${h}`]

    if (props.type === 'fill' || props.type === 'both') {
      payload.push('fill-current')
    }

    if (props.type === 'stroke' || props.type === 'both') {
      payload.push(`icon-stroke stroke-current stroke-${props.strokeWidth}`)
    }

    return payload
  })
</script>

<template>
  <svg
    v-if="!isNoneToken(name)"
    aria-hidden="true"
    focusable="false"
    class="icon"
    :class="cssClasses"
  >
    <use
      :xlink:href="`${iconset}#${name}`"
      :href="`${iconset}#${name}`"
    />
  </svg>
</template>

<style lang="css" scoped>
  .icon-stroke {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
  }
</style>
