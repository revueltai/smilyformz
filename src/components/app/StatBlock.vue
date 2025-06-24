<script setup lang="ts">
  import StatBlockItem from './StatBlockItem.vue'

  withDefaults(
    defineProps<{
      label: string
      value: string | number
      variant?: 'score' | 'ranking'
      hasShareButton?: boolean
    }>(),
    {
      variant: 'ranking',
      hasShareButton: true,
    },
  )
</script>

<template>
  <div class="rounded-xl px-3 py-4 bg-slate-100 text-slate-900">
    <StatBlockItem
      :label="label"
      :value="value"
      :has-share-button="hasShareButton"
      @click="$emit('click')"
    />
  </div>
</template>
