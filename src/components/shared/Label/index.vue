<script setup lang="ts">
  import type { LabelProps } from './type'

  withDefaults(defineProps<LabelProps>(), {
    label: '',
    name: '',
    color: 'slate-400',
  })
</script>

<template>
  <label
    :for="name"
    class="text-start text-xs uppercase"
    :class="`text-${color} ${name ? 'cursor-pointer' : ''}`"
  >
    {{ label }}
  </label>
</template>
